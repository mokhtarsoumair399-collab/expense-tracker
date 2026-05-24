import { format, parseISO } from "date-fns";

export const currency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value || 0);

export const shortDate = (date: string) => format(parseISO(date), "MMM d, yyyy");

export const monthLabel = (month: string) => format(parseISO(`${month}-01`), "MMM yy");
