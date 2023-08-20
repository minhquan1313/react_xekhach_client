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

let x = {
  id: 13,
  paidWith: "Tiền mặt",
  paidPrice: 642000,
  isPaid: null,
  createdAt: 1692445652399,
  staffId: null,
  totalSeat: null,
  tripId: {
    id: 6,
    startAt: 1692873600000,
    price: 321000,
    busId: {
      id: 2,
      licensePlate: "51H-35864",
      image:
        "https://images.pexels.com/photos/5896476/pexels-photo-5896476.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      busSeatTemplateCount: null,
      busSeatTripCount: null,
      busSeats: null,
    },
    routeId: {
      id: 6,
      startLocation: "Tiền Giang",
      endLocation: "Hồ Chí Minh",
    },
    driverId: {
      id: 3,
      username: "driver",
      password: "$2a$10$l2Rr5ZxrvnO4u8kDJt9kzuz30cubwy5qBG4OrylZNOncgYnY5BaaK",
      firstName: "Tài Xế",
      lastName: "Chú",
      avatar:
        "https://res.cloudinary.com/dyc5pggxo/image/upload/v1692321055/mm6ocva4codsywl9g2vi.png",
      roleId: {
        displayName: "Tài xế",
        id: 3,
        title: "Driver",
      },
    },
    extraPrice: null,
  },
  userId: {
    id: 15,
    username: "a3",
    password: "$2a$10$CDoIeOjk23vTxJh5eF4/xuAqhJzFP7gjqhBQk4Yw12XfJy.RzRgJi",
    firstName: "Ba",
    lastName: "Mai Thanh",
    avatar: "",
    roleId: {
      displayName: "Người dùng",
      id: 4,
      title: "User",
    },
  },
};
