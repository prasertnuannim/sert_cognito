export type AuthRole = string;
export type AuthRoleHomePath = {
  role: AuthRole;
  path: string;
};

export type AuthRoleRouteRule = {
  path: string;
  allowedRoles: AuthRole[];
};

const DEFAULT_AUTHENTICATED_PATH = "/account";
export const ROLE_HOME_PATHS: AuthRoleHomePath[] = [];

export const ROLE_ROUTE_RULES: AuthRoleRouteRule[] = [
  {
    path: "/settings/access-control",
    allowedRoles: ["admin"],
  },
];

export function normalizeRoles(
  roles: Array<string | null | undefined> | undefined
): AuthRole[] {
  if (!roles?.length) {
    return [];
  }

  return [...new Set(
    roles
      .filter((role): role is string => typeof role === "string")
      .map((role) => role.trim().toLowerCase())
      .filter(Boolean)
  )];
}

export function getDefaultPathForRoles(roles: AuthRole[]): string {
  const normalizedRoles = normalizeRoles(roles);
  const matchedHomePath = ROLE_HOME_PATHS.find(({ role }) =>
    normalizedRoles.includes(role)
  );

  return matchedHomePath?.path ?? DEFAULT_AUTHENTICATED_PATH;
}

export function getRequiredRolesForPath(pathname: string): AuthRole[] {
  const matchedRule = [...ROLE_ROUTE_RULES]
    .sort((left, right) => right.path.length - left.path.length)
    .find(
      (rule) =>
        pathname === rule.path || pathname.startsWith(`${rule.path}/`)
    );

  return matchedRule ? [...matchedRule.allowedRoles] : [];
}

export function canAccessPath(
  pathname: string,
  roles: Array<string | null | undefined> | undefined
): boolean {
  const requiredRoles = getRequiredRolesForPath(pathname);
  if (!requiredRoles.length) {
    return true;
  }

  const normalizedRoles = normalizeRoles(roles);

  return requiredRoles.some((requiredRole) =>
    normalizedRoles.includes(requiredRole)
  );
}

export function getSafeAppPath(
  callbackUrl: string | null | undefined,
  baseUrl: string
): string | null {
  if (!callbackUrl) {
    return null;
  }

  try {
    const base = new URL(baseUrl);
    const resolvedUrl = new URL(callbackUrl, base);

    if (resolvedUrl.origin !== base.origin) {
      return null;
    }

    return `${resolvedUrl.pathname}${resolvedUrl.search}${resolvedUrl.hash}`;
  } catch {
    return null;
  }
}
