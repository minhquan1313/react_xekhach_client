import { createSearchParams } from "react-router-dom";

// type TObject = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TObject = { [key: string]: any };
export type TSerializeResult = { [key: string]: string };
export default function serializeFormQuery(object: TObject): TSerializeResult {
  const result: TSerializeResult = {};

  for (const key in object) {
    const v = object[key];
    if (typeof v === "string") {
      if (v) result[key] = v.trim();
    } else if (v instanceof Date) {
      result[key] = v.getTime().toString();
    } else if (typeof v === "number") {
      result[key] = v.toString();
    } else if (typeof v === "boolean") {
      result[key] = v.toString();
    }
  }
  // console.log({ object, result });

  return result;
}

export function myCreateSearchParams(object: TObject) {
  return createSearchParams(serializeFormQuery(object));
}
