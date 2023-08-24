import MyButton from "@/Components/MyButton";
import MyContainer from "@/Components/MyContainer";
import { IRoute } from "@/Services/IRoute";
import { ITripSearch } from "@/Services/ITrip";
import fetcher from "@/Services/fetcher";
import { autoCompleteFilter } from "@/Utils/autoCompleteFilter";
import { dateParse, pattern_no_second, toDayJs } from "@/Utils/customDate";
import { myCreateSearchParams } from "@/Utils/serializeFormQuery";
import { CloseSquareFilled } from "@ant-design/icons";
import { AutoComplete, DatePicker, Form } from "antd";
import locale from "antd/es/date-picker/locale/vi_VN";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import useSWR from "swr";

type TFieldType = {
  startLocation?: string;
  endLocation?: string;
  // rangeTime?: [dayjs.Dayjs, dayjs.Dayjs];
  rangeTimeFrom?: dayjs.Dayjs;
  rangeTimeTo?: dayjs.Dayjs;
};
interface IProps {
  onSearchParamChange?: (query: URLSearchParams) => void;
}
function TripSearch({ onSearchParamChange }: IProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [q] = useSearchParams();

  const [startLocation, setStartLocation] = useState(q.get("startLocation") || undefined);
  const [endLocation, setEndLocation] = useState(q.get("endLocation") || undefined);
  const sTime = q.get("timeFrom");
  const [startTime, setStartTime] = useState(sTime ? parseInt(sTime) : undefined);
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
    // const { startLocation, endLocation, rangeTime } = values;
    const { startLocation, endLocation, rangeTimeFrom, rangeTimeTo } = values;

    setStartLocation(startLocation);
    setEndLocation(endLocation);
    let startTime: number | undefined = undefined;
    let endTime: number | undefined = undefined;
    if (rangeTimeFrom) {
      startTime = dateParse(rangeTimeFrom);
      setStartTime(startTime);
    }
    if (rangeTimeTo) {
      endTime = dateParse(rangeTimeTo);
      setEndTime(endTime);
    }
    const obj: ITripSearch = {
      startLocation: startLocation,
      endLocation: endLocation,
      timeFrom: startTime,
      timeTo: endTime,
    };

    const query = myCreateSearchParams(obj);

    goToTrips(query);
  };

  const urlRoutes = `/routes/`;
  const { data: dataRoute } = useSWR<IRoute[]>(urlRoutes, fetcher);

  const [optionStarts, setOptionStarts] = useState<{ value: string }[]>([]);
  const [optionEnds, setOptionEnds] = useState<{ value: string }[]>([]);

  useEffect(() => {
    if (!dataRoute) return;
    console.log({ dataRoute });

    const starts = [...new Set(dataRoute.map(({ startLocation }) => startLocation))].map((r) => ({ value: r }));
    setOptionStarts(starts);

    const ends = [...new Set(dataRoute.map(({ endLocation }) => endLocation))].map((r) => ({ value: r }));
    setOptionEnds(ends);
  }, [dataRoute]);

  return (
    <MyContainer>
      <Form
        name="basic"
        labelCol={{
          sm: {
            span: 7,
          },
          lg: {
            span: 5,
          },
          xl: {
            span: 4,
          },
          xxl: {
            span: 3,
          },
        }}
        wrapperCol={
          {
            // span: 0,
          }
        }
        style={{
          maxWidth: "100%",
          overflow: "hidden",
        }}
        initialValues={{
          remember: true,
          startLocation: startLocation,
          endLocation: endLocation,
          // rangeTime: startTime && endTime ? [dayjs(startTime), dayjs(endTime)] : undefined,
          rangeTimeFrom: startTime ? dayjs(startTime) : undefined,
          rangeTimeTo: endTime ? dayjs(startTime) : undefined,
        }}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off">
        <Form.Item<TFieldType>
          label="Điểm đi"
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
          label="Điểm đến"
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

        {/* <Form.Item<TFieldType>
          label="Khoảng thời gian"
          name="rangeTime">
          <DatePicker.RangePicker
            showTime
            value={endTime && startTime ? [toDayJs(startTime), toDayJs(endTime)] : undefined}
            locale={locale}
            format={pattern_no_second}
          />
        </Form.Item> */}
        <Form.Item<TFieldType>
          label="Từ"
          name="rangeTimeFrom">
          <DatePicker
            showTime
            // ={}
            // defaultValue={startTime ? toDayJs(startTime) : undefined}
            defaultValue={startTime ? toDayJs(startTime) : undefined}
            changeOnBlur={true}
            locale={locale}
            format={pattern_no_second}
          />
        </Form.Item>
        <Form.Item<TFieldType>
          label="Đến"
          name="rangeTimeTo">
          <DatePicker
            showTime
            defaultValue={endTime ? toDayJs(endTime) : undefined}
            changeOnBlur={true}
            locale={locale}
            format={pattern_no_second}
          />
        </Form.Item>

        <Form.Item<TFieldType>
          // style={{ display: "flex", justifyContent: "center" }}
          wrapperCol={{
            sm: {
              // offset: 7,
              span: 24,
            },
            // lg: {
            //   offset: 5,
            // },
            // xl: {
            //   offset: 4,
            // },
            // xxl: {
            //   offset: 3,
            // },
          }}>
          <MyButton
            type="primary"
            htmlType="submit"
            block>
            Tìm
          </MyButton>
        </Form.Item>
      </Form>
    </MyContainer>
  );
}

export default TripSearch;
