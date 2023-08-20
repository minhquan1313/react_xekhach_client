export interface IBusSeatPos {
  id: number;
  x: number;
  y: number;
  available: boolean;
  userChosen: boolean;
}

export interface IBusSeat {
  col: number;
  row: number;
  array: IBusSeatPos[];
}

export interface IBus {
  id: number;
  licensePlate: string;
  image: string;
  busSeatTemplateCount: null;
  busSeatTripCount: number;
  busSeats?: IBusSeat;
}
