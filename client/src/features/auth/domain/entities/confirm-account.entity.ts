export type ConfirmAccountInput = {
  email: string;
  code: string;
};

export type ConfirmAccountResult =
  | {
      ok: true;
      message: string;
    }
  | {
      ok: false;
      code: string;
      message: string;
    };