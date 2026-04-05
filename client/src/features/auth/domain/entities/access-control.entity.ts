export type AccessControlUser = {
  username: string;
  email: string;
  name?: string;
  status?: string;
  roles: string[];
  managedRoles: string[];
};

export type GetAccessControlUserResult =
  | {
      ok: true;
      user: AccessControlUser;
    }
  | {
      ok: false;
      code: string;
      message: string;
    };

export type UpdateAccessControlRolesResult =
  | {
      ok: true;
      user: AccessControlUser;
      message: string;
    }
  | {
      ok: false;
      code: string;
      message: string;
    };
