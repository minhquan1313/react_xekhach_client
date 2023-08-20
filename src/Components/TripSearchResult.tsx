import MyButton from "@/Components/MyButton";
import { ITrip } from "@/Services/ITrip";
import fetcher from "@/Services/fetcher";
import { checkIfTime2HoursOkToBooking } from "@/Utils/checkIfTimeOk";
import { dateFormat } from "@/Utils/customDate";
import { Spin } from "antd";
import { memo } from "react";
import useSWR from "swr";

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
  url: string;
}
function TripSearchResult({ url }: IProps) {
  const { data: tripDTO } = useSWR<ITrip[]>(url, fetcher);

  return (
    <div>
      <p>Result</p>
      {!tripDTO ? (
        <Spin tip="Đang tải">
          <div className="content" />
        </Spin>
      ) : (
        <div>
          <div>Sum: {tripDTO.length}</div>
          {tripDTO.map((trip) => {
            // let isTimeOk = true;
            let isTimeOk = checkIfTime2HoursOkToBooking(trip.startAt);

            return (
              isTimeOk && (
                <div key={trip.id}>
                  <div>ID: {trip.id}</div>
                  <div>Giá: {trip.price.toLocaleString()}</div>
                  <div>Khởi hành: {dateFormat(trip.startAt)}</div>
                  <div>
                    {trip.routeId.startLocation} {"->"}{" "}
                    {trip.routeId.endLocation}
                  </div>
                  <div>{trip.busId.licensePlate}</div>
                  {/* <div>{trip.busId.image}</div> */}
                  <div>
                    {trip.driverId.lastName} {trip.driverId.firstName}
                  </div>
                  {/* <div>{trip.driverId.avatar}</div> */}
                  <MyButton to={`/booking/${trip.id}`}>Đặt vé</MyButton>
                  <div className="">-=-=-=-=-=-=-=-=-=-=-=-=-=-=</div>
                </div>
              )
            );
          })}
        </div>
      )}
    </div>
  );
}
export function Trip({ ...rest }) {
  return <div {...rest}></div>;
}

export default memo(TripSearchResult);
