export function checkIfTime2HoursOkToBooking(time: number) {
  const now = new Date();
  const earlier2HoursDate = new Date(time);
  earlier2HoursDate.setHours(earlier2HoursDate.getHours() - 2);

  const condition: boolean = now.getTime() < earlier2HoursDate.getTime();

  return condition;
}
export function checkIfTime60MOkToUpdateTicket(time: number) {
  const now = new Date();
  const earlier2HoursDate = new Date(time);
  earlier2HoursDate.setHours(earlier2HoursDate.getHours() - 1);

  const condition: boolean = now.getTime() < earlier2HoursDate.getTime();

  console.log(
    "check 60",
    { now, earlier2HoursDate },
    now.getTime(),
    earlier2HoursDate.getTime()
  );

  return condition;
}
export function checkIfTimePassed(time: number) {
  const now = new Date();

  const condition: boolean = now.getTime() > time;

  return condition;
}
