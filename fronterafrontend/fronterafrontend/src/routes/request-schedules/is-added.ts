import dayjs from "dayjs";
import { getDates } from "../../../lib/utils";

export function isAdded(
  shiftsArray: {
    startDate: string | null;
    endDate: string | null;
    shiftID: number | null;
  }[],
  date: string,
) {
  let isPresent = false;
  for (let shift of shiftsArray) {
    isPresent = getDates(
      dayjs(shift.startDate as string).format("YYYY-MM-DD"),
      dayjs(shift.endDate as string).format("YYYY-MM-DD"),
    )
      .map((rd) => dayjs(rd).format("YYYY-MM-DD"))
      .includes(dayjs(date).format("YYYY-MM-DD"));
    if (isPresent) break;
  }
  return isPresent;
}
