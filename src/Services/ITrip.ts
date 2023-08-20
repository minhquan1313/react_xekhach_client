import { IBus } from "@/Services/IBus";
import { IRoute } from "@/Services/IRoute";
import { IUser } from "@/Services/IUser";

export interface ITripSearch {
  startLocation?: string;
  endLocation?: string;
  busId?: number;
  fromPrice?: number;
  toPrice?: number;
  driverId?: number;
  timeFrom?: number;
  timeTo?: number;
  id?: number;
}

export interface ITrip {
  id: number;
  startAt: number;
  price: number;
  extraPrice?: number;
  busId: IBus;
  routeId: IRoute;
  driverId: IUser;
}
export type TPaymentMethod = "Tiền mặt" | "Momo" | "Chuyển khoản";
