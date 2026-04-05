export type ForgotPasswordInput = {
  email: string;
};

export type ForgotPasswordResult =
  | {
      ok: true;
      message: string;
    }
  | {
      ok: false;
      code: string;
      message: string;
    };

export type ResetPasswordInput = {
  email: string;
  code: string;
  newPassword: string;
};

export type ResetPasswordResult =
  | {
      ok: true;
      message: string;
    }
  | {
      ok: false;
      code: string;
      message: string;
    };