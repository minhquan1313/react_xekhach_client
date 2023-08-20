import MyButton from "@/Components/MyButton";
import { IRoute } from "@/Services/IRoute";
import { ITripSearch } from "@/Services/ITrip";
import fetcher from "@/Services/fetcher";
import { autoCompleteFilter } from "@/Utils/autoCompleteFilter";
import { dateParse, pattern_no_second, toDayJs } from "@/Utils/customDate";
import { myCreateSearchParams } from "@/Utils/serializeFormQuery";
import { CloseSquareFilled } from "@ant-design/icons";
import { AutoComplete, Col, DatePicker, Form, Row } from "antd";
import locale from "antd/es/date-picker/locale/vi_VN";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import useSWR from "swr";

type TFieldType = {
  startLocation?: string;
  endLocation?: string;
  rangeTime?: [dayjs.Dayjs, dayjs.Dayjs];
};
interface IProps {
  onSearchParamChange?: (query: URLSearchParams) => void;
}
function TripSearch({ onSearchParamChange }: IProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [q] = useSearchParams();

  const [startLocation, setStartLocation] = useState(
    q.get("startLocation") || undefined
  );
  const [endLocation, setEndLocation] = useState(
    q.get("endLocation") || undefined
  );
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

  const onFinish = (values: TFieldType) => {
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

  const urlStart = `/routes/start-location/`;
  const urlEnd = `/routes/end-location/`;
  const urlRoutes = `/routes/`;
  const { data: dataRoute } = useSWR<IRoute[]>(urlRoutes, fetcher);

  const [optionStarts, setOptionStarts] = useState<{ value: string }[]>([]);
  const [optionEnds, setOptionEnds] = useState<{ value: string }[]>([]);

  useEffect(() => {
    if (!dataRoute) return;
    console.log({ dataRoute });

    const starts = [
      ...new Set(dataRoute.map(({ startLocation }) => startLocation)),
    ].map((r) => ({ value: r }));
    setOptionStarts(starts);

    const ends = [
      ...new Set(dataRoute.map(({ endLocation }) => endLocation)),
    ].map((r) => ({ value: r }));
    setOptionEnds(ends);
  }, [dataRoute]);

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
          <Form.Item<TFieldType>
            label="startLocation"
            name="startLocation">
            <AutoComplete
              options={optionStarts}
              allowClear={{ clearIcon: <CloseSquareFilled /> }}
              // onChange={() => {
              //   if (!dataRoute) return;
              //   const ends = [
              //     ...new Set(dataRoute.map(({ endLocation }) => endLocation)),
              //   ].map((r) => ({ value: r }));
              //   setOptionEnds(ends);
              // }}
              // onSelect={(startLocation) => {
              //   if (!dataRoute) return;
              //   const ends = [
              //     ...new Set(
              //       dataRoute
              //         .filter((r) => r.startLocation === startLocation)
              //         .map(({ endLocation }) => endLocation)
              //     ),
              //   ].map((r) => ({ value: r }));

              //   setOptionEnds(ends);
              // }}
              filterOption={autoCompleteFilter}
            />
          </Form.Item>

          <Form.Item<TFieldType>
            label="endLocation"
            name="endLocation">
            <AutoComplete
              options={optionEnds}
              allowClear={{ clearIcon: <CloseSquareFilled /> }}
              // onChange={() => {
              //   if (!dataRoute) return;
              //   const starts = [
              //     ...new Set(
              //       dataRoute.map(({ startLocation }) => startLocation)
              //     ),
              //   ].map((r) => ({ value: r }));
              //   setOptionStarts(starts);
              // }}
              // onSelect={(endLocation) => {
              //   if (!dataRoute) return;
              //   const starts = [
              //     ...new Set(
              //       dataRoute
              //         .filter((r) => r.endLocation === endLocation)
              //         .map(({ startLocation }) => startLocation)
              //     ),
              //   ].map((r) => ({ value: r }));

              //   setOptionStarts(starts);
              // }}
              filterOption={autoCompleteFilter}
            />
          </Form.Item>

          <Form.Item<TFieldType>
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

          <Form.Item<TFieldType>
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
