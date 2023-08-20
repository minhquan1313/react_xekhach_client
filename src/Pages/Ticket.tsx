import MyButton from "@/Components/MyButton";
import MyContainer from "@/Components/MyContainer";
import { UserContext } from "@/Contexts/UserContext";
import { BusSeatMap } from "@/Pages/Booking";
import { IBusSeat, IBusSeatPos } from "@/Services/IBus";
import { ITicket } from "@/Services/ITicket";
import { ITrip } from "@/Services/ITrip";
import { TicketService } from "@/Services/TicketService";
import fetcher from "@/Services/fetcher";
import {
  checkIfTime60MOkToUpdateTicket,
  checkIfTimePassed,
} from "@/Utils/checkIfTimeOk";
import { dateFormat } from "@/Utils/customDate";
import { myCreateSearchParams } from "@/Utils/serializeFormQuery";
import { DownloadOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import {
  Card,
  Col,
  Descriptions,
  Dropdown,
  Popconfirm,
  Progress,
  Skeleton,
  Space,
  Spin,
  Typography,
} from "antd";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";

function Ticket() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const { ticketId: ticketIdParam } = useParams();
  const url =
    `/tickets/?` +
    myCreateSearchParams({
      userId: user?.id,
      id: ticketIdParam,
      totalSeat: true,
      busSeat: true,
    });
  const [sameTripUrl, setSameTripUrl] = useState<string>();

  const [ticket, setTicket] = useState<ITicket>();
  const [tripToUpdate, setTripToUpdate] = useState<ITrip>();
  const [tripHasSameRoute, setTripHasSameRoute] = useState<ITrip[]>([]);
  const [selected, setSelected] = useState<IBusSeatPos[]>([]);
  const [preSelected, setPreSelected] = useState<IBusSeatPos[]>([]);
  //   const [seatCountAvailableToSelect, setSeatCountAvailableToSelect] =
  //     useState(0);
  const [isChangingToServer, setIsChangingToServer] = useState(false);
  //   const [isChanged, setIsChanged] = useState(false);
  const [readyToUpdateSeat, setReadyToUpdateSeat] = useState(false);
  const [isSeatUpdateSuccess, setIsSeatUpdateSuccess] = useState<boolean>();
  const [busSeat, setBusSeat] = useState<IBusSeat>();
  //   const [isSeatUpdated, setIsSeatUpdated] = useState(false);
  //   const [isChangeTrip, setIsChangeTrip] = useState(false);
  const [allowUpdate, setAllowUpdate] = useState(true);
  const [cantUpdateMsg, setCantUpdateMsg] = useState("");

  const {
    data: ticketDTO,
    mutate,
    isLoading,
    isValidating,
  } = useSWR<ITicket[]>(user ? url : null, fetcher);
  const {
    data: sameTripDTO,
    // mutate,
    // isLoading,
    // isValidating,
    isValidating: isSameTripLoading,
  } = useSWR<ITrip[]>(sameTripUrl, fetcher);

  useEffect(() => {
    if (!user) {
      navigate({
        pathname: "/login",
      });
    }
  }, [user]);

  useEffect(() => {
    console.log({ ticketDTO, url });
    if (!ticketDTO) return;
    const [t] = ticketDTO;

    setTicket(t);

    const preSel = getPreSelected(t);
    setPreSelected(preSel);
    setSelected(preSel);
    setIsChangingToServer(false);
    setReadyToUpdateSeat(false);
    setIsSeatUpdateSuccess(false);
    setBusSeat(t.tripId.busId.busSeats);
    setTripToUpdate(undefined);

    const condition: boolean = checkIfTime60MOkToUpdateTicket(t.tripId.startAt);
    const condition1: boolean = checkIfTimePassed(t.tripId.startAt);

    setAllowUpdate(condition && !condition1 && !t.isPaid);
    if (t.isPaid) {
      setCantUpdateMsg("Không thể cập nhật vì đã thanh toán");
    }
    if (condition) {
      setCantUpdateMsg("Không thể cập nhật vì chuyến sắp chạy");
    }
    if (condition1) {
      setCantUpdateMsg("Chuyến trong quá khứ");
    }
  }, [ticketDTO]);
  useEffect(() => {
    console.log({ sameTripDTO, sameTripUrl });
    if (!sameTripDTO) return;

    setTripHasSameRoute(
      sameTripDTO.filter((r) => {
        // let isOk = checkIfTime60MOkToUpdateTicket(r.startAt);
        let isOk = true;

        return r.id !== ticket?.tripId.id && isOk;
      })
    );
  }, [sameTripDTO]);

  useEffect(() => {
    //
    // Array.in

    const selectedIds = selected.map((r) => r.id);

    let isChanged = !!preSelected.find((r) => !selectedIds.includes(r.id));
    let isLengthMatch = preSelected.length === selected.length;

    // console.log({ isChanged }, isLengthMatch, isChanged && isLengthMatch);
    setReadyToUpdateSeat(isChanged && isLengthMatch);

    setIsSeatUpdateSuccess(undefined);
  }, [selected]);

  useEffect(() => {
    console.log({ ticket });

    if (!ticket) return;

    setSameTripUrl(
      `/trips/?` +
        myCreateSearchParams({
          startLocation: ticket.tripId.routeId.startLocation,
          endLocation: ticket.tripId.routeId.endLocation,
          getSeats: true,
        })
    );
  }, [ticket]);

  useEffect(() => {
    // console.log({ sameTripDTO });
  });

  function getPreSelected(t: ITicket) {
    return t.tripId.busId.busSeats!.array.filter((r) => r.userChosen);
  }

  async function tripChange(trip: ITrip) {
    console.log({ trip });
    const url =
      `/trips/?` +
      myCreateSearchParams({
        id: trip.id,
        getSeats: true,
      });
    setIsChangingToServer(true);
    const data = (await fetcher(url)) as ITrip[];
    setIsChangingToServer(false);
    const [t] = data;
    if (t) {
      setTripToUpdate(t);
      setBusSeat(t.busId.busSeats);
      setSelected([]);
    }

    console.log({ t: data });

    //   setTripToUpdate
  }

  async function changeTripSubmit() {
    setIsChangingToServer(true);

    const isOk = await TicketService.editSeat({
      selectedSeats: selected,
      id: ticket!.id,
    });

    setIsChangingToServer(false);
    setIsSeatUpdateSuccess(isOk);

    if (isOk) {
      mutate();
    }

    console.log({ isOk });
  }

  async function changeSeatSubmit() {
    setIsChangingToServer(true);

    const isOk = await TicketService.editSeat({
      selectedSeats: selected,
      id: ticket!.id,
    });
    setIsChangingToServer(false);
    setIsSeatUpdateSuccess(isOk);

    if (isOk) {
      mutate();
      //   reset
    }

    console.log({ isOk });
  }

  const onSeatChangeHandle = (e: IBusSeatPos[]): void => {
    if (e.length > selected.length) {
      // Them
      if (preSelected.length >= e.length) {
        setSelected(e);
      }
    } else {
      // Xoa
      setSelected(e);
    }
  };
  return (
    <MyContainer>
      <MyContainer.Row justify={"center"}>
        <Col xs={{ span: 24 }}>
          <Card>
            {isLoading ? (
              <Skeleton active />
            ) : ticket ? (
              <TicketInformation
                isSameTripLoading={isSameTripLoading}
                onTripChange={tripChange}
                ticket={ticket}
                allowUpdate={allowUpdate}
                tripHasSameRoute={tripHasSameRoute}
                tripToUpdate={tripToUpdate}
              />
            ) : (
              "Không có dữ liệu"
            )}
          </Card>
        </Col>
        <Col xs={{ span: 24 }}>
          <Card>
            <MyContainer.Row>
              <Col span={24}>
                <Popconfirm
                  title={!tripToUpdate ? "Đổi chỗ ngồi" : "Đổi chuyến"}
                  description="Bạn chắc chắn muốn đổi?"
                  onConfirm={() => {
                    if (!tripToUpdate) changeSeatSubmit();
                    else changeTripSubmit();
                  }}
                  //   open={!readyToUpdateSeat ? false : true}
                  icon={<QuestionCircleOutlined />}
                  okText="Xác nhận"
                  cancelText="Huỷ">
                  <MyButton
                    type="primary"
                    disabled={!readyToUpdateSeat}
                    loading={isChangingToServer}
                    block>
                    {!allowUpdate
                      ? cantUpdateMsg
                      : isSeatUpdateSuccess == true
                      ? "Thành công"
                      : isSeatUpdateSuccess == false
                      ? "Thất bại"
                      : "Có thể cập nhật"}
                  </MyButton>
                </Popconfirm>
              </Col>

              <Col span={24}>
                <Card>
                  <Progress
                    type="line"
                    status={readyToUpdateSeat ? "success" : "normal"}
                    percent={(selected.length / preSelected.length) * 100}
                    format={() => `${selected.length}/${preSelected.length}`}
                  />
                </Card>
              </Col>
            </MyContainer.Row>
          </Card>
        </Col>
        <Col xs={{ span: 24 }}>
          <Card>
            {ticket && (
              <Spin spinning={isValidating}>
                {busSeat && (
                  <BusSeatMap
                    disabled={
                      !allowUpdate
                        ? true
                        : isSeatUpdateSuccess || isChangingToServer
                    }
                    busSeat={busSeat}
                    onChange={onSeatChangeHandle}
                    preSelected={preSelected}
                    selected={selected}
                  />
                )}
              </Spin>
            )}
          </Card>
        </Col>
      </MyContainer.Row>
    </MyContainer>
  );
}

export default Ticket;

function TicketInformation({
  allowUpdate,
  tripToUpdate,
  ticket,
  tripHasSameRoute,
  isSameTripLoading,
  onTripChange,
}: {
  ticket: ITicket;
  isSameTripLoading: boolean;
  allowUpdate: boolean;
  tripHasSameRoute: ITrip[];
  tripToUpdate?: ITrip;
  onTripChange(r: ITrip): void;
}) {
  return (
    <Descriptions
      title={`Thông tin vé xe [${ticket.id}]`}
      column={{ xs: 1, sm: 2, md: 3 }}>
      <Descriptions.Item
        label="Chuyến lúc"
        span={3}>
        <Space>
          {dateFormat(ticket.tripId.startAt)}
          {allowUpdate && (
            <Dropdown
              menu={{
                items: tripHasSameRoute.length
                  ? tripHasSameRoute.map((r) => ({
                      key: r.id,
                      disabled: !checkIfTime60MOkToUpdateTicket(r.startAt),
                      label: (
                        <Typography.Text
                          disabled={!checkIfTime60MOkToUpdateTicket(r.startAt)}>
                          {dateFormat(r.startAt)}
                        </Typography.Text>
                      ),
                      onClick: () => {
                        onTripChange(r);
                      },
                    }))
                  : [
                      {
                        key: "no other trip",
                        label: (
                          <Typography.Text key={"Không có chuyến khác"}>
                            Không có chuyến khác
                          </Typography.Text>
                        ),
                      },
                    ],
              }}>
              <MyButton
                size="small"
                shape="circle"
                loading={isSameTripLoading}
                type={
                  tripToUpdate
                    ? tripToUpdate.id !== ticket.tripId.id
                      ? "primary"
                      : "default"
                    : "default"
                }
                icon={
                  tripToUpdate ? <DownloadOutlined /> : <DownloadOutlined />
                }
              />

              {/* <MyButton icon={<DownOutlined />}></MyButton> */}
            </Dropdown>
          )}

          {tripToUpdate && <>{dateFormat(tripToUpdate.startAt)}</>}
        </Space>
      </Descriptions.Item>
      <Descriptions.Item label="Điểm đi">
        {ticket.tripId.routeId.startLocation}
      </Descriptions.Item>
      <Descriptions.Item label="Điểm đến">
        {ticket.tripId.routeId.endLocation}
      </Descriptions.Item>
      <Descriptions.Item label="">
        {ticket.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
      </Descriptions.Item>
      <Descriptions.Item
        span={2}
        label="Thanh toán với">
        {ticket.paidWith}
      </Descriptions.Item>
      <Descriptions.Item label="Tổng tiền">
        {ticket.paidPrice.toLocaleString()} vnd
      </Descriptions.Item>
      <Descriptions.Item
        span={2}
        label="Nhân viên in vé">
        {ticket.staffId ? (
          <>
            [{ticket.staffId.id}] - {ticket.staffId.lastName}{" "}
            {ticket.staffId.firstName}
          </>
        ) : (
          <>Chưa có</>
        )}
      </Descriptions.Item>
      <Descriptions.Item label="Số chỗ ngồi">
        {ticket.totalSeat}
      </Descriptions.Item>
      <Descriptions.Item
        span={2}
        label="Tên tài xế">
        [{ticket.tripId.driverId.id}] - {ticket.tripId.driverId.lastName}{" "}
        {ticket.tripId.driverId.firstName}
      </Descriptions.Item>
      <Descriptions.Item label="Biển số xe">
        {ticket.tripId.busId.licensePlate}
      </Descriptions.Item>{" "}
      <Descriptions.Item
        label="Tạo vé lúc"
        span={3}>
        {dateFormat(ticket.createdAt)}
      </Descriptions.Item>
    </Descriptions>
  );
}
