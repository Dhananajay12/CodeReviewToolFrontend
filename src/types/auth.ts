export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
}

export interface CurrentUser extends AuthUser {
  hasPassword: boolean;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface UpdateProfileInput {
  name: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}
