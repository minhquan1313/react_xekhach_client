import MyButton from "@/Components/MyButton";
import MyContainer from "@/Components/MyContainer";
import { UserContext } from "@/Contexts/UserContext";
import { BusSeatMap } from "@/Pages/Booking";
import { FeedbackService } from "@/Services/FeedbackService";
import { IBusSeat, IBusSeatPos } from "@/Services/IBus";
import { IFeedback } from "@/Services/IFeedback";
import { ITicket } from "@/Services/ITicket";
import { ITrip } from "@/Services/ITrip";
import { TicketService } from "@/Services/TicketService";
import fetcher from "@/Services/fetcher";
import { checkIfTime60MOkToUpdateTicket, checkIfTimePassed } from "@/Utils/checkIfTimeOk";
import { dateFormat } from "@/Utils/customDate";
import { myCreateSearchParams } from "@/Utils/serializeFormQuery";
import { QuestionCircleOutlined, SwapOutlined } from "@ant-design/icons";
import { Card, Col, Descriptions, Dropdown, Form, Input, Popconfirm, Progress, Skeleton, Space, Spin, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";

type FeedbackFieldType = {
  comment: string;
};

function Ticket() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const { ticketId: ticketIdParam } = useParams();
  const url = !user
    ? undefined
    : `/tickets/?` +
      myCreateSearchParams({
        userId: user.id,
        id: ticketIdParam,
        totalSeat: true,
        busSeat: true,
      });

  // const [feedbackUrl, setFeedbackUrl] = useState<string>();
  const [sameTripUrl, setSameTripUrl] = useState<string>();

  const [ticket, setTicket] = useState<ITicket>();
  const [tripToUpdate, setTripToUpdate] = useState<ITrip>();
  const [tripHasSameRoute, setTripHasSameRoute] = useState<ITrip[]>([]);
  const [selected, setSelected] = useState<IBusSeatPos[]>([]);
  const [preSelected, setPreSelected] = useState<IBusSeatPos[]>([]);
  const [busSeat, setBusSeat] = useState<IBusSeat>();

  const [isCreatingFeedbackToServer, setIsCreatingFeedbackToServer] = useState(false);

  const [isChangingToServer, setIsChangingToServer] = useState(false);
  const [seatLoading, setSeatLoading] = useState(false);
  const [readyToUpdateSeat, setReadyToUpdateSeat] = useState(false);
  const [isSeatUpdateSuccess, setIsSeatUpdateSuccess] = useState<boolean>();
  const [allowUpdate, setAllowUpdate] = useState(true);

  const [cantUpdateMsg, setCantUpdateMsg] = useState("");

  const { data: ticketDTO, mutate: mutateTicket, isLoading: isLoadingTicket, isValidating: isValidatingTicket } = useSWR<ITicket[]>(url, fetcher);

  const { data: sameTripDTO, mutate: mutateSameTrip, isValidating: isSameTripLoading } = useSWR<ITrip[]>(sameTripUrl, fetcher);

  const { data: feedbackDTO, mutate: mutateFeedback } = useSWR<IFeedback[]>(
    `/feedbacks/?` +
      myCreateSearchParams({
        ticketId: ticketIdParam,
      }),
    fetcher
  );
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  useEffect(() => {
    if (!user) {
      navigate({
        pathname: "/login",
      });
    }
    if (!ticketIdParam || (!isLoadingTicket && !ticketDTO)) {
      navigate({
        pathname: "/tickets",
      });
    }
  }, [user, ticketIdParam]);

  // useEffect(() => {
  //   console.log({ feedbackUrl });
  //   console.log({ feedBackDTO: feedbackDTO });
  // }, [feedbackDTO]);

  useEffect(() => {
    console.log({ ticketDTO, url });

    // if(!ticketDTO)
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

    const isTripNotDepartingClose: boolean = checkIfTime60MOkToUpdateTicket(t.tripId.startAt);
    const isTripPassedCurrentTime: boolean = checkIfTimePassed(t.tripId.startAt);

    setAllowUpdate(isTripNotDepartingClose && !isTripPassedCurrentTime && !t.isPaid);
    if (t.isPaid) {
      setCantUpdateMsg("Không thể cập nhật vì đã thanh toán");
      return;
    }
    if (!isTripNotDepartingClose) {
      setCantUpdateMsg("Không thể cập nhật vì chuyến sắp chạy");
    }
    if (isTripPassedCurrentTime) {
      setCantUpdateMsg("Chuyến trong quá khứ");
    }
    if (isTripPassedCurrentTime && !t.isPaid) {
      setCantUpdateMsg("Bạn đã lỡ chuyến và  không trả tiền");
    }
    if (isTripPassedCurrentTime && t.isPaid) {
      setCantUpdateMsg("Bạn đã đi chuyến này rồi!");
    }
  }, [ticketDTO]);

  useEffect(() => {
    console.log({ sameTripDTO, sameTripUrl });
    if (!sameTripDTO) return;

    setTripHasSameRoute(
      sameTripDTO.filter(() => {
        // let isOk = checkIfTime60MOkToUpdateTicket(r.startAt);
        // let isOk = true;

        //   const condition = r.id !== ticket?.tripId.id && isOk;

        return true;
      })
    );
  }, [sameTripDTO]);

  useEffect(() => {
    //
    // Array.in

    const selectedIds = selected.map((r) => r.id);

    const isChanged = !!preSelected.find((r) => !selectedIds.includes(r.id));
    const isLengthMatch = preSelected.length === selected.length;

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

    // setFeedbackUrl(
    //   `/feedbacks/?` +
    //     myCreateSearchParams({
    //       ticketId: ticket.id,
    //     })
    // );
  }, [ticket]);

  useEffect(() => {
    // console.log({ sameTripDTO });
  });

  function getPreSelected(t: ITicket) {
    return t.tripId.busId.busSeats!.array.filter((r) => r.userChosen);
  }

  async function tripChange(trip: ITrip) {
    if (trip.id === ticket?.tripId.id) {
      setTripToUpdate(undefined);

      setBusSeat(ticket.tripId.busId.busSeats);
      setSelected(preSelected);

      return;
    }

    console.log({ trip });

    const url =
      `/trips/?` +
      myCreateSearchParams({
        id: trip.id,
        getSeats: true,
      });
    setSeatLoading(true);

    if (trip.id !== tripToUpdate?.id) {
      const data: ITrip[] = await fetcher(url);

      const [t] = data;
      if (t) {
        setTripToUpdate(t);
        setBusSeat(t.busId.busSeats);
        setSelected([]);
      }

      console.log({ data });
    }

    setSeatLoading(false);
  }

  async function changeTripSubmit() {
    if (!tripToUpdate) return;

    setIsChangingToServer(true);

    const isOk = await TicketService.editTripAndSeat({
      selectedSeats: selected,
      id: ticket!.id,
      tripId: tripToUpdate.id,
    });

    setIsChangingToServer(false);
    setIsSeatUpdateSuccess(isOk);

    if (isOk) {
      mutateTicket();
      mutateSameTrip();
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
      mutateTicket();
      //   reset
    }

    console.log({ isOk });
  }

  async function addFeedbackSubmit({ comment }: FeedbackFieldType) {
    if (!ticket) return;

    setIsCreatingFeedbackToServer(true);

    const isOk = await FeedbackService.new({
      comment,
      ticketId: ticket?.id,
    });
    setIsCreatingFeedbackToServer(false);

    if (isOk) {
      mutateFeedback();
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
        {/* Ticket info */}
        <Col xs={{ span: 24 }}>
          <Card>
            {isLoadingTicket ? (
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

        {/* busSeatMap */}
        <Col
          style={{ display: "flex" }}
          xs={{ span: 24 }}
          xxl={{ span: 16 }}>
          <Card style={{ width: "100%" }}>
            {ticket && (
              <Spin spinning={isValidatingTicket || seatLoading}>
                {busSeat && (
                  <BusSeatMap
                    disabled={!allowUpdate ? true : isSeatUpdateSuccess || isChangingToServer || seatLoading}
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

        <Col
          style={{ display: "flex" }}
          xs={{ span: 24 }}
          xxl={{ span: 24 - 16 }}>
          <Card
            style={{ width: "100%" }}
            loading={isLoadingTicket}>
            <MyContainer.Row>
              <Col span={24}>
                <Popconfirm
                  title={!tripToUpdate ? "Đổi chỗ ngồi" : "Đổi chuyến"}
                  description="Bạn chắc chắn muốn đổi?"
                  onConfirm={() => {
                    if (!tripToUpdate) changeSeatSubmit();
                    else changeTripSubmit();
                  }}
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
                      : //   : isValidating
                        //   ? "~~~"
                        "Có thể cập nhật"}
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

              <Col span={24}>
                <Card
                  loading={!feedbackDTO}
                  title="Đánh giá của bạn">
                  {feedbackDTO && feedbackDTO.length ? (
                    <Typography.Text>{feedbackDTO[0].comment}</Typography.Text>
                  ) : !ticket?.isPaid ? (
                    <Typography.Text>
                      Bạn cần{" "}
                      <Typography.Text
                        strong
                        underline>
                        thanh toán
                      </Typography.Text>{" "}
                      chuyến đi để có thể viết nhận xét
                    </Typography.Text>
                  ) : (
                    <Form
                      layout="vertical"
                      onFinish={addFeedbackSubmit}
                      autoComplete="off">
                      <Form.Item<FeedbackFieldType>
                        name="comment"
                        label="Nội dung đánh giá"
                        rules={[{ required: true, message: "Hãy điền gì đó nhé" }]}>
                        <Input.TextArea
                          rows={4}
                          placeholder="Điền đánh giá"
                        />
                      </Form.Item>
                      <Form.Item>
                        <MyButton
                          loading={isCreatingFeedbackToServer}
                          type="primary"
                          htmlType="submit">
                          Đánh giá
                        </MyButton>
                      </Form.Item>
                    </Form>
                  )}
                </Card>
              </Col>
            </MyContainer.Row>
          </Card>
        </Col>

        {/* <Col
          xs={{ span: 24 }}
          lg={{ span: 12 }}>
          <Card
            loading={!feedbackDTO}
            title="Đánh giá của bạn">
            {feedbackDTO && feedbackDTO.length ? (
              <>{feedbackDTO[0].comment}</>
            ) : (
              <Form
                layout="vertical"
                onFinish={addFeedbackSubmit}
                autoComplete="off">
                <Form.Item<FeedbackFieldType>
                  name="comment"
                  label="Nội dung đánh giá"
                  rules={[{ required: true, message: "Hãy điền gì đó nhé" }]}>
                  <Input.TextArea
                    rows={4}
                    placeholder="Điền đánh giá"
                  />
                </Form.Item>
                <Form.Item>
                  <MyButton
                    loading={isCreatingFeedbackToServer}
                    type="primary"
                    htmlType="submit">
                    Đánh giá
                  </MyButton>
                </Form.Item>
              </Form>
            )}
          </Card>
        </Col> */}
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
                items:
                  tripHasSameRoute.length > 1
                    ? [
                        {
                          type: "group",
                          key: "justALabel",
                          label: <Typography.Text>Các chuyến khác cùng tuyến</Typography.Text>,
                          children: tripHasSameRoute.map((r) => ({
                            key: r.id,
                            disabled: !checkIfTime60MOkToUpdateTicket(r.startAt),
                            label: (
                              <Typography.Text
                                strong={r.id === ticket.tripId.id}
                                italic={r.id === ticket.tripId.id}
                                disabled={!checkIfTime60MOkToUpdateTicket(r.startAt)}>
                                {dateFormat(r.startAt)}
                              </Typography.Text>
                            ),
                            onClick: () => {
                              onTripChange(r);
                            },
                          })),
                        },
                      ]
                    : [
                        {
                          key: "no other trip",
                          label: <Typography.Text key={"Không có chuyến khác"}>Không có chuyến khác</Typography.Text>,
                        },
                      ],
              }}>
              {/* Change trip btn */}
              <MyButton
                size="small"
                shape="circle"
                loading={isSameTripLoading}
                type={tripToUpdate ? (tripToUpdate.id !== ticket.tripId.id ? "primary" : "default") : "default"}
                icon={<SwapOutlined />}
              />

              {/* <MyButton icon={<DownOutlined />}></MyButton> */}
            </Dropdown>
          )}

          {tripToUpdate && <>{dateFormat(tripToUpdate.startAt)}</>}
        </Space>
      </Descriptions.Item>
      <Descriptions.Item label="Điểm đi">{ticket.tripId.routeId.startLocation}</Descriptions.Item>
      <Descriptions.Item label="Điểm đến">{ticket.tripId.routeId.endLocation}</Descriptions.Item>
      <Descriptions.Item label="">{ticket.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}</Descriptions.Item>
      <Descriptions.Item
        span={2}
        label="Thanh toán với">
        {ticket.paidWith}
      </Descriptions.Item>
      <Descriptions.Item label="Tổng tiền">{ticket.paidPrice.toLocaleString()} vnd</Descriptions.Item>
      <Descriptions.Item
        span={2}
        label="Nhân viên in vé">
        {ticket.staffId ? (
          <>
            [{ticket.staffId.id}] - {ticket.staffId.lastName} {ticket.staffId.firstName}
          </>
        ) : (
          <>Chưa có</>
        )}
      </Descriptions.Item>
      <Descriptions.Item label="Số chỗ ngồi">{ticket.totalSeat}</Descriptions.Item>
      <Descriptions.Item
        span={2}
        label="Tên tài xế">
        [{ticket.tripId.driverId.id}] - {ticket.tripId.driverId.lastName} {ticket.tripId.driverId.firstName}
      </Descriptions.Item>
      <Descriptions.Item label="Biển số xe">{ticket.tripId.busId.licensePlate}</Descriptions.Item>{" "}
      <Descriptions.Item
        label="Tạo vé lúc"
        span={3}>
        {dateFormat(ticket.createdAt)}
      </Descriptions.Item>
    </Descriptions>
  );
}
