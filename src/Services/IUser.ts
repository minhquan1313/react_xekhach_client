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

let x = {
  id: 15,
  username: "a3",
  password: "$2a$10$CDoIeOjk23vTxJh5eF4/xuAqhJzFP7gjqhBQk4Yw12XfJy.RzRgJi",
  firstName: "Ba",
  lastName: "Mai Thanh",
  avatar: null,
  roleId: null,
};
