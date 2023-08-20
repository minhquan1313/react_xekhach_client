import { removeAccents } from "@/Utils/removeAccents";

export const autoCompleteFilter = (
  inputValue: string,
  option?: { value: string }
) => {
  if (!option) return false;

  const v = option.value + removeAccents(option.value);
  const input = removeAccents(inputValue);

  const check = v.toLowerCase().indexOf(input.toLowerCase()) !== -1;
  //   console.log({ check, v, input });

  return check;
};
