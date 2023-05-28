import { format } from "date-fns";

const formatDate = (dateString: Date | string | null) => {
  if (!dateString) return "Never";

  return format(new Date(dateString), "PPPppp");
};

const formatTimeValue = (seconds: number) => {
  if (seconds < 10) return "0" + seconds;

  return String(seconds);
};
export { formatDate, formatTimeValue };
