import { ITrip } from "@/Services/ITrip";
import fetcher from "@/Services/fetcher";
import { dateFormat } from "@/Utils/customDate";
import { memo, useEffect } from "react";
import useSWR from "swr";

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
  url: string;
}
function TripSearchResult({ url }: IProps) {
  const { data, mutate } = useSWR<ITrip[]>(url, fetcher);

  useEffect(() => {
    console.log({ url });
  }, [url]);

  return (
    <div>
      <p>Result</p>
      {!data
        ? "Loading"
        : data.map((trip) => (
            <div key={trip.id}>
              <div>Giá: {trip.price.toLocaleString()}</div>
              <div>Khởi hành: {dateFormat(trip.startAt)}</div>
              <div>
                {trip.routeId.startLocation} {"->"} {trip.routeId.endLocation}
              </div>
              <div>{trip.busId.licensePlate}</div>
              <div>{trip.busId.image}</div>
              <div>
                {trip.driverId.lastName} {trip.driverId.firstName}
              </div>
              <div>{trip.driverId.avatar}</div>
              <div>Sum: {data.length}</div>
              <div className="">-=-=-=-=-=-=-=-=-=-=-=-=-=-=</div>
            </div>
          ))}
    </div>
  );
}
export function Trip({ ...rest }) {
  return <div {...rest}></div>;
}

export default memo(TripSearchResult);
