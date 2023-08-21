import MyContainer from "@/Components/MyContainer";
import { UserContext } from "@/Contexts/UserContext";
import { ITicket } from "@/Services/ITicket";
import fetcher from "@/Services/fetcher";
import { dateFormat } from "@/Utils/customDate";
import { myCreateSearchParams } from "@/Utils/serializeFormQuery";
import { Card, Col, Typography } from "antd";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";

function Tickets() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const url =
    `/tickets/?` +
    myCreateSearchParams({
      userId: user?.id,
      totalSeat: true,
    });
  const { data: ticketDTO, isLoading, isValidating } = useSWR<ITicket[]>(url, fetcher);

  useEffect(() => {
    if (!user) {
      navigate({
        pathname: "/login",
      });
    }
  }, [user]);

  useEffect(() => {
    console.log({ isLoading, isValidating });
  });

  useEffect(() => {
    console.log({ url, ticketDTO, isLoading });
  });
  return (
    <MyContainer.Row style={{ padding: 20 }}>
      {isLoading ? (
        <Col span={24}>Loading</Col>
      ) : (
        ticketDTO &&
        (!ticketDTO.length ? (
          <Typography.Title>Chưa có vé</Typography.Title>
        ) : (
          ticketDTO.map((r) => (
            <Col
              xs={{ span: 24 }}
              md={{ span: 24 / 2 }}
              xl={{ span: 24 / 3 }}
              xxl={{ span: 24 / 4 }}
              key={r.id}>
              <TicketCard ticket={r} />
            </Col>
          ))
        ))
      )}

      {isValidating && !isLoading && (
        <Col
          span={24}
          style={{ textAlign: "center" }}>
          Đang tải thêm dữ liệu
        </Col>
      )}
    </MyContainer.Row>
  );
}

interface ITicketProp {
  ticket: ITicket;
}
function TicketCard({ ticket }: ITicketProp) {
  const navigate = useNavigate();

  return (
    <Card
      title={`Mã vé: ${ticket.id}`}
      hoverable
      onClick={() => {
        navigate({
          pathname: `/tickets/${ticket.id}`,
        });
      }}>
      <div>{ticket.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}</div>
      <div>{ticket.paidPrice}</div>
      <div>{ticket.paidWith}</div>
      <div>{ticket.totalSeat}</div>
      <div>
        {ticket.tripId.routeId.startLocation} - {ticket.tripId.routeId.endLocation}
      </div>
      <div>{dateFormat(ticket.tripId.startAt)}</div>
    </Card>
  );
}

export default Tickets;
