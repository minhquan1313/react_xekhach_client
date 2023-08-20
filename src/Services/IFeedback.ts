import { ITicket } from "@/Services/ITicket";

export interface IFeedback {
  id: number;
  comment: string;
  ticketId: ITicket;
}
