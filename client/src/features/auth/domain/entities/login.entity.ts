export type LoginInput = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  email: string;
  name?: string;
};

export type AuthTokens = {
  accessToken: string;
  idToken: string;
  refreshToken?: string;
  expiresIn?: number;
};

export type LoginResult =
  | {
      ok: true;
      user: AuthUser;
      tokens: AuthTokens;
    }
  | {
      ok: false;
      code: string;
      message: string;
      session?: string;
    };