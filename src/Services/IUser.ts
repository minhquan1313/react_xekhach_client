import { IRole } from "@/Services/IRole";

export interface IUser {
  id: number;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar: string;
  roleId: IRole;
}
