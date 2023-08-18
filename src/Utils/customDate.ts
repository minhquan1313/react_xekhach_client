import dayjs from "dayjs";
import "dayjs/locale/vi";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export const pattern = "DD/MM/YYYY h:mm:ss A";
export const pattern_no_second = "DD/MM/YYYY h:mm A";

export function dateFormat(date: Date | number): string {
  let d = toDayJs(date).format(pattern_no_second).toString();

  // console.log({ d, date, _date });
  return d;
}
export function dateParse(date: dayjs.Dayjs): number {
  let d = date.toDate();

  return d.getTime();
}
export function toDayJs(date: Date | number): dayjs.Dayjs {
  let _date = date;

  if (typeof date === "number") {
    _date = new Date(date);
  }

  let d = dayjs(_date);

  return d;
}
