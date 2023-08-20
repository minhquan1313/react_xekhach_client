import { IBusSeatPos } from "@/Services/IBus";
import { ITicket } from "@/Services/ITicket";
import { TPaymentMethod } from "@/Services/ITrip";
import { fetcherPatch, fetcherPost } from "@/Services/fetcher";

interface ITicketDTO {
  id?: number;
  selectedSeats: IBusSeatPos[];
  tripId: number;
  userId: number;
  paidWith: TPaymentMethod;
  isPaid: boolean;
}
// type IPayload<T> = {
//   [k in keyof T]: string;
// };

export const TicketService = {
  newTicket: async (d: ITicketDTO): Promise<ITicket | boolean> => {
    const obj = {
      selectedSeats: parseSelectedSeat(d.selectedSeats),
      tripId: d.tripId.toString(),
      userId: d.userId.toString(),
      paidWith: d.paidWith,
      isPaid: d.isPaid ? "true" : "false",
    };

    console.log(obj);

    let result: ITicket[] | undefined;
    try {
      result = await fetcherPost(obj)("/booking/");
    } catch (error) {
      return false;
    }
    console.log(result);

    if (result) {
      const [ticket] = result;

      if (ticket) return ticket;
    }

    return false;
  },
  editSeat: async ({
    selectedSeats,
    id,
  }: Pick<ITicketDTO, "selectedSeats" | "id">): Promise<boolean> => {
    const obj = {
      selectedSeats: parseSelectedSeat(selectedSeats),
      id,
    };
    const api = "/booking/edit/";

    console.log({ obj });

    let result;
    try {
      result = await fetcherPatch(obj)(api);
    } catch (error) {
      console.log({ error });
      console.trace();
      return false;
    }

    console.log({ result });

    return true;
  },
  editTripAndSeat: async ({
    selectedSeats,
    id,
    tripId,
  }: Pick<ITicketDTO, "selectedSeats" | "id" | "tripId">): Promise<boolean> => {
    const obj = {
      selectedSeats: parseSelectedSeat(selectedSeats),
      id,
      tripId,
    };
    const api = "/booking/edit/";

    console.log({ obj });

    let result;
    try {
      result = await fetcherPatch(obj)(api);
    } catch (error) {
      console.log({ error });
      console.trace();
      return false;
    }

    console.log({ result });

    return true;
  },
};

const parseSelectedSeat = (selectedSeats: IBusSeatPos[]) => {
  return selectedSeats
    .map(
      ({ id, available, userChosen, x, y }) =>
        `${id}_${x}_${y}_${userChosen}_${available}`
    )
    .join(",");
};
