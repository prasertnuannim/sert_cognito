import crypto from "crypto";
import {
  AdminAddUserToGroupCommand,
  AdminGetUserCommand,
  AdminListGroupsForUserCommand,
  AdminRemoveUserFromGroupCommand,
  CognitoIdentityProviderClient,
  ConfirmForgotPasswordCommand,
  ConfirmSignUpCommand,
  ForgotPasswordCommand,
  GetUserCommand,
  InitiateAuthCommand,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { getManagedRoleGroups } from "../cognito-role-groups";

const region = process.env.COGNITO_REGION!;
const clientId = process.env.COGNITO_CLIENT_ID!;
const clientSecret = process.env.COGNITO_CLIENT_SECRET;
const userPoolId = process.env.COGNITO_USER_POOL_ID;

const cognito = new CognitoIdentityProviderClient({ region });

type CognitoLoginResult =
  | {
      user: {
        id: string;
        email: string;
        name: string;
      };
      tokens: {
        accessToken: string;
        idToken: string;
        refreshToken?: string;
        expiresIn?: number;
      };
    }
  | {
      challengeName: string;
      session?: string;
      message: string;
    };

function createNamedError(name: string, message: string) {
  const error = new Error(message);
  error.name = name;
  return error;
}

function requireUserPoolId() {
  if (!userPoolId) {
    throw createNamedError(
      "CONFIGURATION_ERROR",
      "Missing COGNITO_USER_POOL_ID for admin role management."
    );
  }

  return userPoolId;
}

function getSecretHash(username: string) {
  if (!clientSecret) return undefined;

  return crypto
    .createHmac("sha256", clientSecret)
    .update(username + clientId)
    .digest("base64");
}

export async function cognitoLogin(
  email: string,
  password: string
): Promise<CognitoLoginResult> {
  const secretHash = getSecretHash(email);

  const result = await cognito.send(
    new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        ...(secretHash ? { SECRET_HASH: secretHash } : {}),
      },
    })
  );

  if (result.ChallengeName) {
    return {
      challengeName: result.ChallengeName,
      session: result.Session,
      message: "Additional challenge required",
    };
  }

  const auth = result.AuthenticationResult;
  if (!auth?.AccessToken || !auth?.IdToken) {
    throw new Error("AUTHENTICATION_FAILED");
  }

  const user = await cognito.send(
    new GetUserCommand({ AccessToken: auth.AccessToken })
  );

  const emailAttr = user.UserAttributes?.find((a) => a.Name === "email")?.Value;
  const subAttr = user.UserAttributes?.find((a) => a.Name === "sub")?.Value;
  const nameAttr = user.UserAttributes?.find((a) => a.Name === "name")?.Value;

  return {
    user: {
      id: subAttr ?? email,
      email: emailAttr ?? email,
      name: nameAttr ?? email,
    },
    tokens: {
      accessToken: auth.AccessToken,
      idToken: auth.IdToken,
      refreshToken: auth.RefreshToken,
      expiresIn: auth.ExpiresIn,
    },
  };
}

export async function cognitoRegister(email: string, password: string, name?: string) {
  const secretHash = getSecretHash(email);
  const normalizedName = name?.trim() || email.split("@")[0] || email;

  return cognito.send(
    new SignUpCommand({
      ClientId: clientId,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: "email", Value: email },
        { Name: "name", Value: normalizedName },
      ],
      ...(secretHash ? { SecretHash: secretHash } : {}),
    })
  );
}

export async function cognitoConfirmAccount(email: string, code: string) {
  const secretHash = getSecretHash(email);

  return cognito.send(
    new ConfirmSignUpCommand({
      ClientId: clientId,
      Username: email,
      ConfirmationCode: code,
      ...(secretHash ? { SecretHash: secretHash } : {}),
    })
  );
}

export async function cognitoForgotPassword(email: string) {
  const secretHash = getSecretHash(email);

  return cognito.send(
    new ForgotPasswordCommand({
      ClientId: clientId,
      Username: email,
      ...(secretHash ? { SecretHash: secretHash } : {}),
    })
  );
}

export async function cognitoResetPassword(
  email: string,
  code: string,
  newPassword: string
) {
  const secretHash = getSecretHash(email);

  return cognito.send(
    new ConfirmForgotPasswordCommand({
      ClientId: clientId,
      Username: email,
      ConfirmationCode: code,
      Password: newPassword,
      ...(secretHash ? { SecretHash: secretHash } : {}),
    })
  );
}

export async function cognitoGetUserAccessProfile(email: string) {
  const resolvedUserPoolId = requireUserPoolId();
  const managedRoleGroups = getManagedRoleGroups();

  const [user, groups] = await Promise.all([
    cognito.send(
      new AdminGetUserCommand({
        UserPoolId: resolvedUserPoolId,
        Username: email,
      })
    ),
    cognito.send(
      new AdminListGroupsForUserCommand({
        UserPoolId: resolvedUserPoolId,
        Username: email,
      })
    ),
  ]);

  const emailAttr =
    user.UserAttributes?.find((attribute) => attribute.Name === "email")?.Value;
  const nameAttr =
    user.UserAttributes?.find((attribute) => attribute.Name === "name")?.Value;
  const allGroups = (groups.Groups ?? [])
    .map((group) => group.GroupName?.trim().toLowerCase())
    .filter((groupName): groupName is string => Boolean(groupName));
  const managedRoles = allGroups.filter((groupName) =>
    managedRoleGroups.includes(groupName)
  );

  return {
    username: user.Username ?? email,
    email: emailAttr ?? email,
    name: nameAttr,
    status: user.UserStatus,
    roles: allGroups,
    managedRoles,
  };
}

export async function cognitoUpdateUserRoles(
  email: string,
  requestedRoles: string[]
) {
  const resolvedUserPoolId = requireUserPoolId();
  const managedRoleGroups = getManagedRoleGroups();
  const normalizedRequestedRoles = [...new Set(
    requestedRoles.map((role) => role.trim().toLowerCase()).filter(Boolean)
  )];

  const invalidRoles = normalizedRequestedRoles.filter(
    (role) => !managedRoleGroups.includes(role)
  );

  if (invalidRoles.length) {
    throw createNamedError(
      "INVALID_ROLE",
      `Unsupported role selection: ${invalidRoles.join(", ")}`
    );
  }

  const currentProfile = await cognitoGetUserAccessProfile(email);
  const currentManagedRoles = currentProfile.managedRoles;
  const rolesToAdd = normalizedRequestedRoles.filter(
    (role) => !currentManagedRoles.includes(role)
  );
  const rolesToRemove = currentManagedRoles.filter(
    (role) => !normalizedRequestedRoles.includes(role)
  );

  for (const role of rolesToAdd) {
    await cognito.send(
      new AdminAddUserToGroupCommand({
        UserPoolId: resolvedUserPoolId,
        Username: currentProfile.username,
        GroupName: role,
      })
    );
  }

  for (const role of rolesToRemove) {
    await cognito.send(
      new AdminRemoveUserFromGroupCommand({
        UserPoolId: resolvedUserPoolId,
        Username: currentProfile.username,
        GroupName: role,
      })
    );
  }

  return cognitoGetUserAccessProfile(email);
}
