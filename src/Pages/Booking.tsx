import MyButton from "@/Components/MyButton";
import MyContainer from "@/Components/MyContainer";
import { UserContext } from "@/Contexts/UserContext";
import { IBus, IBusSeat, IBusSeatPos } from "@/Services/IBus";
import { ITicket } from "@/Services/ITicket";
import { ITrip, TPaymentMethod } from "@/Services/ITrip";
import { TicketService } from "@/Services/TicketService";
import fetcher from "@/Services/fetcher";
import { checkIfTime2HoursOkToBooking } from "@/Utils/checkIfTimeOk";
import { dateFormat } from "@/Utils/customDate";
import bank from "@Pub/qr_bank.jpg";
import momo from "@Pub/qr_momo.jpg";
import { BarsOutlined, LikeOutlined, PoweroffOutlined } from "@ant-design/icons";
import { Card, Col, Descriptions, Image, Result, Row, Segmented, Skeleton, Spin, Statistic, Steps, Typography } from "antd";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";

interface IBookingContext {
  isLoading: boolean;
  bus?: IBus;
  trip?: ITrip;
  selectedId: IBusSeatPos[];
  updateBusSelectedSeat(x: IBusSeatPos[]): void;
  onNext(): void;
  onBack(): void;
  isPaid: boolean;
  setIsPaid(paid: boolean): void;
  payment: TPaymentMethod;
  setPayment(s: TPaymentMethod): void;
  totalPaid: number;
  step: number;
  setNewTicket(x: ITicket): void;
  newTicket?: ITicket;
}
const BookingContext = createContext<IBookingContext>({
  isLoading: false,
  selectedId: [],
  totalPaid: 0,
  payment: "Tiền mặt",
  updateBusSelectedSeat: function (): void {},
  onNext: function (): void {},
  onBack: function (): void {},
  setPayment: function (): void {},
  setIsPaid: function (): void {},
  isPaid: false,
  step: 0,
  setNewTicket: function (): void {},
  newTicket: undefined,
});
const stepsItems = [
  {
    title: "Chọn chỗ ngồi",
  },
  {
    title: "Thanh toán",
  },
  {
    title: "Xác nhận đặt vé",
  },
  {
    title: "Đặt vé hoàn tất",
  },
];
function Booking() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { tripId: tripIdParam } = useParams();

  const [step, setStep] = useState(0);
  const [trip, setTrip] = useState<ITrip>();
  const [bus, setBus] = useState<IBus>();
  const [payment, setPayment] = useState<TPaymentMethod>("Tiền mặt");
  const [totalPaid, setTotalPaid] = useState(0);
  const [selectedId, setSelectedId] = useState<IBusSeatPos[]>([]);
  const [isPaid, setIsPaid] = useState(false);
  const [newTicket, setNewTicket] = useState<ITicket>();
  const [allowBooking, setAllowBooking] = useState(true);

  const url = `/trips/?id=${tripIdParam}&getSeats&extraPrice`;
  const { data: tripDTO, isLoading } = useSWR<ITrip[]>(url, fetcher);

  useEffect(() => {
    if (!user) {
      navigate({
        pathname: "/login",
      });
    }
  }, [user]);

  // useEffect(() => {
  //   if (!tripIdParam) {
  //     navigate({
  //       pathname: "/trips",
  //     });
  //   }
  // }, [tripIdParam]);

  const submitHandle = async () => {
    const newTicket = TicketService.newTicket({
      selectedSeats: selectedId,
      tripId: trip!.id,
      userId: user!.id,
      paidWith: payment,
      isPaid: isPaid,
    });
    return newTicket;
  };

  useEffect(() => {
    if (!tripDTO) return;

    const [_trip] = tripDTO;
    if (!_trip) return;
    setTrip(_trip);
    console.log(_trip);

    const inv = setInterval(() => {
      setAllowBooking(checkIfTime2HoursOkToBooking(_trip.startAt));
    }, 500);

    setAllowBooking(checkIfTime2HoursOkToBooking(_trip.startAt));

    return () => {
      clearInterval(inv);
    };
  }, [tripDTO]);

  useEffect(() => {
    console.log({ bus });
  }, [bus]);

  useEffect(() => {
    // reset when bus seat change on server (mean when someone booked a seat)
    if (!trip) return;
    console.log({ trip });

    setStep(0);

    setTotalPaid(0);
    setSelectedId([]);
    setIsPaid(false);
    setPayment("Tiền mặt");
    setBus(trip.busId);
  }, [trip]);

  const updateBusSelectedSeat = (x: IBusSeatPos[]) => {
    console.log({ e: "calling", x });

    setSelectedId(x);
  };

  useEffect(() => {
    setTotalPaid(trip ? (trip.price + (trip.extraPrice || 0)) * selectedId.length : 0);
  }, [selectedId]);

  const value: IBookingContext = {
    isLoading,
    bus,
    trip,
    selectedId,
    updateBusSelectedSeat,
    onNext: () => setStep((r) => (r < stepsItems.length - 1 ? ++r : r)),
    onBack: () => setStep((r) => (r > 0 ? --r : r)),
    setPayment,
    payment,
    totalPaid,
    isPaid,
    setIsPaid,
    step,
    setNewTicket,
    newTicket,
  };

  return (
    <BookingContext.Provider value={value}>
      <div>
        <Typography.Title style={{ padding: "20px" }}>{!allowBooking ? <>Chọn chuyến khác nhé</> : stepsItems[step].title}</Typography.Title>
        <MyContainer>
          {allowBooking && (
            <MyContainer.Row justify={"center"}>
              <Col xs={{ span: 24 }}>
                <Steps
                  size="small"
                  current={step}
                  items={stepsItems}
                />
              </Col>
              <Col xs={{ span: 24 }}>
                <Card>
                  {trip ? (
                    <Descriptions
                      title="Thông tin chuyến xe"
                      column={{ xs: 1, xl: 2 }}>
                      <Descriptions.Item
                        label="Khởi hành"
                        span={2}>
                        {dateFormat(trip.startAt)}
                      </Descriptions.Item>

                      <Descriptions.Item
                        label="Điểm đi"
                        span={1}>
                        {trip.routeId.startLocation}
                      </Descriptions.Item>

                      <Descriptions.Item
                        label="Điểm đến"
                        span={1}>
                        {trip.routeId.endLocation}
                      </Descriptions.Item>
                    </Descriptions>
                  ) : (
                    <Skeleton active />
                  )}
                </Card>
              </Col>

              <ContentWrapper>{step == 0 ? <Step1 /> : step == 1 ? <Step2 /> : step == 2 ? <Step3 onSubmit={submitHandle} /> : step == 3 ? <Step4 /> : <></>}</ContentWrapper>

              <BusSeatMapWrapped />
            </MyContainer.Row>
          )}
        </MyContainer>
      </div>
    </BookingContext.Provider>
  );
}

function Step1() {
  const { bus, trip, selectedId, totalPaid } = useContext(BookingContext);

  return (
    <Row gutter={[12, 12]}>
      <NextBackBtn />

      <Col span={12}>
        <Statistic
          title="Ghế còn trống"
          value={bus?.busSeats?.array.filter((r) => r.available).length}
          prefix={<LikeOutlined />}
          suffix={bus && bus.busSeats ? `/${bus.busSeats.array.length}` : undefined}
          loading={!bus}
        />
      </Col>
      <Col span={12}>
        <Statistic
          title="Số ghế chọn"
          value={selectedId.length}
          loading={!bus}
        />
      </Col>
      <Col span={12}>
        <Statistic
          title="Giá tiền"
          value={trip ? trip.price : undefined}
          suffix="VNĐ"
          loading={trip == null}
        />
      </Col>
      <Col span={12}>
        <Statistic
          title="Phụ phí/ghế"
          value={trip ? trip.extraPrice : undefined}
          suffix="VNĐ"
          loading={trip == null}
        />
      </Col>
      <Col span={24}>
        <Statistic
          title="Tính tiền"
          value={totalPaid}
          loading={trip == null}
          suffix="VNĐ"
        />
      </Col>
    </Row>
  );
}
function Step2() {
  const { setPayment, payment, isPaid, setIsPaid } = useContext(BookingContext);

  const options: {
    label: TPaymentMethod;
    value: TPaymentMethod;
    icon: JSX.Element;
  }[] = [
    { label: "Tiền mặt", value: "Tiền mặt", icon: <BarsOutlined /> },
    { label: "Momo", value: "Momo", icon: <BarsOutlined /> },
    { label: "Chuyển khoản", value: "Chuyển khoản", icon: <BarsOutlined /> },
  ];

  const delay = 1000;
  const [paying, setPaying] = useState(false);

  return (
    <Row gutter={[12, 12]}>
      <NextBackBtn
        disableBack={isPaid}
        disableNext={(payment === "Momo" && !isPaid) || (payment === "Chuyển khoản" && !isPaid)}
      />

      <Col span={24}>
        <Segmented
          block
          options={options}
          disabled={isPaid}
          defaultValue={payment}
          onChange={(e) => {
            console.log(e);
            setPayment(e as TPaymentMethod);
          }}
        />
      </Col>
      <Col span={24}>
        <Card title={payment}>
          <MyContainer.Row justify={"center"}>
            {payment === "Tiền mặt" ? (
              <Col span={24}>
                <p>Đặt vé xong bạn có thể đến trạm và thanh toán tiền vé cho nhân viên.</p>
              </Col>
            ) : payment === "Momo" ? (
              <>
                <Col>
                  <p style={{ textAlign: "center" }}>Hãy quét mã để thanh toán</p>
                  <Image
                    width={"100%"}
                    src={momo}
                    style={{ maxWidth: 300 }}
                  />
                </Col>

                <Col span={24}>
                  <MyButton
                    block
                    loading={paying}
                    type={isPaid ? "dashed" : "primary"}
                    icon={isPaid ? <PoweroffOutlined /> : <PoweroffOutlined />}
                    onClick={() => {
                      if (isPaid) return;

                      setPaying(true);
                      new Promise<void>((rs) => {
                        setTimeout(() => {
                          setPaying(false);
                          setIsPaid(true);
                          rs();
                        }, delay);
                      });
                    }}>
                    {isPaid ? "Thanh toán thành công" : "Xác nhận thanh toán (Giả)"}
                  </MyButton>
                </Col>
              </>
            ) : payment === "Chuyển khoản" ? (
              <>
                <Col>
                  <p style={{ textAlign: "center" }}>Hãy quét mã để thanh toán</p>
                  <Image
                    width={"100%"}
                    style={{ maxWidth: 300 }}
                    src={bank}
                  />
                </Col>

                <Col span={24}>
                  <MyButton
                    block
                    loading={paying}
                    type={isPaid ? "dashed" : "primary"}
                    icon={isPaid ? <PoweroffOutlined /> : <PoweroffOutlined />}
                    onClick={() => {
                      if (isPaid) return;

                      setPaying(true);
                      new Promise<void>((rs) => {
                        setTimeout(() => {
                          setPaying(false);
                          setIsPaid(true);
                          rs();
                        }, delay);
                      });
                    }}>
                    {isPaid ? "Thanh toán thành công" : "Xác nhận thanh toán (Giả)"}
                  </MyButton>
                </Col>
              </>
            ) : (
              <></>
            )}
          </MyContainer.Row>
        </Card>
      </Col>
    </Row>
  );
}
function Step3({ onSubmit }: { onSubmit?: () => Promise<ITicket | boolean> }) {
  const { onNext, setNewTicket } = useContext(BookingContext);

  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // setTimeout(() => {
    //   setBooking(false);
    //   setBooked(true);
    //   setSuccess(false);
    // }, 500);
  });
  useEffect(() => {
    if (success) onNext();
  }, [success]);

  useEffect(() => {}, [booking]);

  return (
    <Row gutter={[12, 12]}>
      <NextBackBtn
        disableNext={!success}
        disabled={booking}
      />

      <Col span={24}>
        <Spin
          spinning={booking}
          tip="Đang đặt vé">
          <Result
            status={booked ? (success ? "success" : "error") : "info"}
            title={booked ? (success ? "Đặt vé thành công" : "Đặt vé thất bại") : "Xác nhận đặt vé"}
            subTitle={
              booked ? (
                success ? (
                  "Đặt vé thành công"
                ) : (
                  "Đặt vé thất bại"
                )
              ) : (
                <p>
                  Chỉ còn 1 bước nữa là bạn có thể đặt được vé rồi, bấm nút <Typography.Text strong>Xác Nhận</Typography.Text> ở bên dưới để xác nhận đặt vé nhé.
                </p>
              )
            }
            style={{ opacity: !booking ? 1 : 0, transition: ".3s opacity" }}
            extra={
              success
                ? [
                    <MyButton key={"ViewTicket"}>Xem vé</MyButton>,
                    <MyButton
                      type="primary"
                      key={"backHome"}>
                      Quay về trang chủ
                    </MyButton>,
                  ]
                : []
            }
          />
        </Spin>
      </Col>

      <Col span={24}>
        <MyButton
          type={booked ? (success ? "dashed" : "default") : "primary"}
          block
          danger={booked ? (success ? false : true) : false}
          loading={booking}
          // disabled={success}
          onClick={() => {
            if (success) return;
            setBooking(true);

            if (!onSubmit) return;
            (async () => {
              const result = await onSubmit();
              setBooking(false);

              setBooked(true);
              setSuccess(!!result);

              if (result && typeof result !== "boolean") {
                setNewTicket(result);
              }
            })();
            // setTimeout(() => {
            //   setBooking(false);

            //   setBooked(true);
            //   setSuccess(true);
            // }, 3000);
          }}>
          {booked ? (success ? "OK" : "Đặt lại") : "Xác nhận"}
        </MyButton>
      </Col>
    </Row>
  );
}
function Step4() {
  const { newTicket } = useContext(BookingContext);
  return (
    <Row gutter={[12, 12]}>
      <NextBackBtn disabled />

      <Col span={24}>
        <Result
          status="success"
          title={"Đặt vé thành công"}
          subTitle={"Đặt vé thành công"}
          extra={[
            <MyButton
              type="primary"
              key={"viewTicket"}
              to={`/tickets/${newTicket?.id}`}>
              Xem vé
            </MyButton>,
            <MyButton
              key={"goHome"}
              to="/">
              Quay về trang chủ
            </MyButton>,
          ]}
        />
      </Col>
    </Row>
  );
}

export interface IBusSeatMap {
  busSeat: IBusSeat;
  selected: IBusSeatPos[];
  preSelected?: IBusSeatPos[];
  disabled?: boolean;
  direction?: "horizontal" | "vertical";
  onChange?: (x: IBusSeatPos[]) => void;
}
export function BusSeatMap({ busSeat, preSelected: _preSelected, selected, disabled, direction, onChange }: IBusSeatMap) {
  const [d, setD] = useState<IBusSeatMap["direction"]>(direction);

  useEffect(() => {
    const resize = (): void => {
      if (window.innerWidth < 900) setD("vertical");
      else setD("horizontal");
    };
    window.addEventListener("resize", resize);
    resize();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    console.log({ busSeat, selected });
  }, [busSeat]);

  function onSelect(x: IBusSeatPos) {
    console.log(x);

    // const idWithout = (selected || selectedId).filter((r) => r.id !== x.id);
    const idWithout = selected.filter((r) => r.id !== x.id);
    console.log({ idWithout, selected });

    // if (idWithout.length === (selected || selectedId).length) {
    //   const newLocal = [...(selected || selectedId), x];
    if (idWithout.length === selected.length) {
      const newLocal = [...selected, x];

      onChange && onChange(newLocal);
      //  : setSelectedId(newLocal);
    } else {
      const newLocal_1 = [...idWithout];
      // setSelectedId(newLocal_1);

      onChange && onChange(newLocal_1);
      // onChange ? onChange(newLocal_1) : setSelectedId(newLocal_1);
    }
  }

  useEffect(() => {});

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${d == "horizontal" ? busSeat.row : busSeat.col},1fr)`,
        gridTemplateRows: `repeat(${d == "horizontal" ? busSeat.col : busSeat.row},1fr)`,
        gap: 4,
        width: "100%",
      }}>
      {/* {Array.from({ length: busSeat.col }, (i, x) => (
            <MyButton
              key={x}
              type="text"
              style={{
                height: "100%",
                gridColumn: x + 2,
                gridRow: 1,
              }}>
              {String.fromCharCode(x + 65)}
            </MyButton>
          ))}
          {Array.from({ length: busSeat.row }, (i, x) => (
            <MyButton
              key={x}
              type="text"
              style={{
                height: "100%",
                gridColumn: 1,
                gridRow: x + 2,
              }}>
              {x + 1}
            </MyButton>
          ))} */}
      {busSeat.array.map((pos) => (
        <div
          style={{
            display: "flex",
            aspectRatio: "1/1",
            gridColumn: d == "horizontal" ? busSeat.row + 1 - pos.y : pos.x,
            gridRow: d == "horizontal" ? pos.x : pos.y,
          }}
          key={pos.id}>
          <MyButton
            size="small"
            type={selected.find((r) => r.id === pos.id) ? "primary" : !pos.available ? "dashed" : "default"}
            danger={!!(_preSelected || []).find((r) => r.id === pos.id)}
            disabled={
              // disabled ? true:
              pos.userChosen ? false : !pos.available
            }
            style={{
              display: "block",
              height: "100%",
              flex: 1,
            }}
            onClick={() => {
              !disabled && onSelect(pos);
            }}>
            {parseSeatName(pos)}
          </MyButton>
        </div>
      ))}
    </div>
  );
}

function NextBackBtn({ disabled, disableNext, disableBack }: { disabled?: boolean; disableNext?: boolean; disableBack?: boolean }) {
  const { selectedId, onNext, onBack, step } = useContext(BookingContext);

  return (
    <>
      <Col span={12}>
        <MyButton
          type="default"
          disabled={disabled || disableBack || selectedId.length == 0 || step == 0}
          block
          onClick={onBack}>
          Quay về
        </MyButton>
      </Col>
      <Col span={12}>
        <MyButton
          type="primary"
          disabled={disabled || disableNext || selectedId.length == 0 || stepsItems.length - 1 == step}
          block
          onClick={onNext}>
          Tiếp theo
        </MyButton>
      </Col>
    </>
  );
}

function BusSeatMapWrapped() {
  const { isLoading, bus, selectedId, updateBusSelectedSeat, step } = useContext(BookingContext);

  return (
    <Col xs={{ span: 24 }}>
      <Spin
        spinning={isLoading}
        tip="Đang tải">
        <div style={{ minHeight: "10rem" }}>
          {bus && bus.busSeats && (
            <BusSeatMap
              disabled={step !== 0}
              selected={selectedId}
              busSeat={bus.busSeats}
              onChange={updateBusSelectedSeat}
            />
          )}
        </div>
      </Spin>
    </Col>
  );
}
function ContentWrapper({ children }: { children: ReactNode }) {
  return <Col xs={{ span: 24 }}>{children}</Col>;
}
function parseSeatName(pos: IBusSeatPos) {
  const s = String.fromCharCode(pos.x + 65 - 1) + pos.y;

  return s;
}

export default Booking;
