import { RolePermission } from "./";

export class User {
  id: number;
  email: string;
  authGuid: string;
  displayName: string;
  registrationDate: Date;
  lastLogin: Date;
  password: string;
  permissions: RolePermission[];
}
