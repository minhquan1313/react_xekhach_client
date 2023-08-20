import { ITrip } from "@/Services/ITrip";
import { IUser } from "@/Services/IUser";

export interface ITicket {
  id: number;
  paidWith: string;
  paidPrice: number;
  isPaid: boolean;
  createdAt: number;
  staffId: IUser | null;
  totalSeat: number | null;
  tripId: ITrip;
  userId: IUser;
}
