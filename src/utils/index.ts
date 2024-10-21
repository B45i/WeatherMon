import dayjs from "dayjs";
import { TimePeriod } from "../types";

export const getStartTime = (period: TimePeriod): Date => {
  switch (period) {
    case "today":
      return dayjs().startOf("day").toDate();
    case "lastWeek":
      return dayjs().subtract(7, "day").startOf("day").toDate();
    case "lastMonth":
      return dayjs().subtract(1, "month").startOf("day").toDate();
    case "lastYear":
      return dayjs().subtract(1, "year").startOf("day").toDate();
    default:
      return dayjs().toDate();
  }
};
