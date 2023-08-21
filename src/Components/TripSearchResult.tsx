import MyContainer from "@/Components/MyContainer";
import { ITrip } from "@/Services/ITrip";
import fetcher from "@/Services/fetcher";
import { checkIfTime2HoursOkToBooking } from "@/Utils/checkIfTimeOk";
import { dateFormat } from "@/Utils/customDate";
import { Card, Col, Spin } from "antd";
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
  url: string;
}
function TripSearchResult({ url }: IProps) {
  const navigate = useNavigate();

  const { data: tripDTO, isLoading } = useSWR<ITrip[]>(url, fetcher);

  return (
    <MyContainer>
      <Spin spinning={isLoading}>
        <div className="content" />
        <MyContainer.Row>
          <Col span={24}>Kết quả tìm kiếm</Col>

          {tripDTO &&
            tripDTO.map((trip) => {
              // let isTimeOk = true;
              const isTimeOk = checkIfTime2HoursOkToBooking(trip.startAt);

              return (
                isTimeOk && (
                  <Col
                    key={trip.id}
                    xs={{ span: 24 }}
                    md={{ span: 24 / 2 }}
                    xl={{ span: 24 / 3 }}
                    xxl={{ span: 24 / 4 }}>
                    <Card
                      key={trip.id}
                      title={`Mã chuyến: ${trip.id}`}
                      hoverable
                      onClick={() => {
                        navigate({
                          pathname: `/booking/${trip.id}`,
                        });
                      }}>
                      <div>Khởi hành: {dateFormat(trip.startAt)}</div>
                      <div>
                        {trip.routeId.startLocation} {"->"} {trip.routeId.endLocation}
                      </div>
                      {/* <div>{trip.busId.licensePlate}</div>
                      <div>
                        {trip.driverId.lastName} {trip.driverId.firstName}
                      </div> */}
                      <div>Giá: {trip.price.toLocaleString()}d</div>
                      {/* <div>{trip.driverId.avatar}</div> */}
                      {/* <MyButton to={`/booking/${trip.id}`}>Đặt vé</MyButton> */}
                    </Card>
                  </Col>
                )
              );
            })}
        </MyContainer.Row>
      </Spin>
    </MyContainer>
  );
}
export function Trip({ ...rest }) {
  return <div {...rest}></div>;
}

export default memo(TripSearchResult);
