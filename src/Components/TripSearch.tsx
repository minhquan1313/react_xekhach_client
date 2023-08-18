import MyButton from "@/Components/MyButton";
import { ITripSearch } from "@/Services/ITrip";
import { dateParse, pattern_no_second, toDayJs } from "@/Utils/customDate";
import { myCreateSearchParams } from "@/Utils/serializeFormQuery";
import { Col, DatePicker, Form, Input, Row } from "antd";
import locale from "antd/es/date-picker/locale/vi_VN";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

interface IProps {
  onSearchParamChange?: (query: URLSearchParams) => void;
}
function TripSearch({ onSearchParamChange }: IProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [q] = useSearchParams();

  const [startLocation, setStartLocation] = useState(
    q.get("startLocation") || ""
  );
  const [endLocation, setEndLocation] = useState(q.get("endLocation") || "");
  const sTime = q.get("timeFrom");
  const [startTime, setStartTime] = useState(
    sTime ? parseInt(sTime) : undefined
  );
  const eTime = q.get("timeTo");
  const [endTime, setEndTime] = useState(eTime ? parseInt(eTime) : undefined);

  const goToTrips = (query: URLSearchParams) => {
    if (location.pathname != "/trips")
      navigate({
        pathname: "/trips",
        search: `?${query}`,
      });
    else {
      onSearchParamChange && onSearchParamChange(query);
    }
  };

  const onFinish = (values: {
    startLocation: string;
    endLocation: string;
    rangeTime: [dayjs.Dayjs, dayjs.Dayjs] | undefined;
  }) => {
    const { startLocation, endLocation, rangeTime } = values;

    setStartLocation(startLocation);
    setEndLocation(endLocation);
    let startTime: number | undefined = undefined;
    let endTime: number | undefined = undefined;
    if (rangeTime) {
      startTime = dateParse(rangeTime[0]);
      endTime = dateParse(rangeTime[1]);
      setStartTime(startTime);
      setEndTime(endTime);
    }
    const obj: ITripSearch = {
      startLocation: startLocation,
      endLocation: endLocation,
      timeFrom: startTime,
      timeTo: endTime,
    };

    let query = myCreateSearchParams(obj);

    goToTrips(query);
  };

  useEffect(() => {
    console.log({ endTime, startTime });
  });

  return (
    <Row>
      <Col
        xs={{ span: 24 }}
        lg={{ span: 12 }}>
        <Form
          name="basic"
          labelCol={{
            xs: {
              span: 7,
            },

            lg: {
              span: 8,
            },
            xl: {
              span: 6,
            },
            xxl: {
              span: 4,
            },
          }}
          wrapperCol={
            {
              // span: 0,
            }
          }
          style={
            {
              // maxWidth: 600,
            }
          }
          initialValues={{
            remember: true,
            startLocation: startLocation,
            endLocation: endLocation,
            rangeTime:
              startTime && endTime
                ? [dayjs(startTime), dayjs(endTime)]
                : undefined,
          }}
          onFinish={onFinish}
          autoComplete="off">
          <Form.Item
            label="startLocation"
            name="startLocation">
            <Input />
          </Form.Item>

          <Form.Item
            label="endLocation"
            name="endLocation">
            <Input />
          </Form.Item>

          <Form.Item
            label="rangeTime"
            name="rangeTime">
            <DatePicker.RangePicker
              showTime
              value={
                endTime && startTime
                  ? [toDayJs(startTime), toDayJs(endTime)]
                  : undefined
              }
              locale={locale}
              format={pattern_no_second}
            />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}>
            <MyButton
              type="primary"
              htmlType="submit">
              Tìm
            </MyButton>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}

export default TripSearch;
