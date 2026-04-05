export type RegisterInput = {
  name?: string;
  email: string;
  password: string;
};

export type RegisterResult =
  | {
      ok: true;
      email: string;
      userConfirmed?: boolean;
    }
  | {
      ok: false;
      code: string;
      message: string;
    };