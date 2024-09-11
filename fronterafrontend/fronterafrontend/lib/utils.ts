import { type ClassValue, clsx } from "clsx";
import dayjs, { Dayjs } from "dayjs";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const centers = [
  {
    centerName: "Colorado Springs",
    region: "CO",
  },
  {
    centerName: "Denver",
    region: "CO",
  },
  {
    centerName: "Durango",
    region: "CO",
  },
  {
    centerName: "Peublo",
    region: "CO",
  },
  {
    centerName: "Ottumwa",
    region: "IA",
  },
  {
    centerName: "West Des Moines",
    region: "IA",
  },
  {
    centerName: "Hays",
    region: "KS",
  },
  {
    centerName: "Liberal",
    region: "KS",
  },
  {
    centerName: "Manhatten",
    region: "KS",
  },

  {
    centerName: "Topeka",
    region: "KS",
  },
  {
    centerName: "Wichita",
    region: "KS",
  },
  {
    centerName: "Dulut",
    region: "MN",
  },
  {
    centerName: "Eagen",
    region: "MN",
  },
  {
    centerName: "Bizmarck",
    region: "ND",
  },
  {
    centerName: "Lincoln",
    region: "NE",
  },
  {
    centerName: "Altus",
    region: "OK",
  },
  {
    centerName: "Elk City",
    region: "OK",
  },
  {
    centerName: "Enid",
    region: "OK",
  },
  {
    centerName: "Hartshorne",
    region: "OK",
  },
  {
    centerName: "Hugo",
    region: "OK",
  },
  {
    centerName: "Lawton",
    region: "OK",
  },
  {
    centerName: "Oklahoma City",
    region: "OK",
  },
  {
    centerName: "Tulsa",
    region: "OK",
  },
  {
    centerName: "Sioux Falls",
    region: "SD",
  },
  {
    centerName: "Amarillo",
    region: "TX",
  },
];

export const days = [
  "Monday",
  "Tuesday",
  "Weddnessday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const specializations = [
  "General Medicine",
  "Audio",
  "Dental",
  "Behavioral Health",
  "Ophthalmology",
  "Admin",
];

export function getDayNamedDate(date: any): string {
  return `${dayjs(date).format("dddd")} , ${dayjs(date).format("YYYY-MM-DD")}`;
}

export function getFormatedDate(date: Dayjs) {
  let postFix = "";
  const day = date.date();

  if (day.toString().endsWith("1")) postFix = "st";
  else if (day.toString().endsWith("2")) postFix = "nd";
  else if (day.toString().endsWith("3")) postFix = "rd";
  else postFix = "th";
  return day + postFix;
}

export function getDates(startDate: string, endDate: string) {
  const dates: Date[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}

export function authToken(): string | null {
  return localStorage.getItem("token");
}

export function validTime(start: string, end: string) {
  const hourStart = parseInt(start.split(":")[0]);
  const minStart = parseInt(start.split(":")[1]);

  const hourEnd = parseInt(end.split(":")[0]);
  const minEnd = parseInt(end.split(":")[1]);

  if (hourStart > hourEnd) return false;

  if (hourStart === hourEnd && minStart > minEnd) return false;

  return true;
}

export function to12HourTime(time: string) {
  let [hour, minut] = time.split(":");

  if (parseInt(hour) % 12 === 0) {
    hour = Number(hour).toString();
  } else {
    hour = Number(parseInt(hour) % 12).toString();
  }

  return `${hour}:${minut}`;
}
