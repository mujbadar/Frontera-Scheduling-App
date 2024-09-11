import { CiCircleChevDown } from "react-icons/ci";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "./ui/dropdown-menu.tsx";
import React, { SetStateAction, useEffect, useRef, useState } from "react";
import { getDates } from "./../lib/utils";

type Props = {
  triggerCustomStyles?: string;
  startDate: string;
  endDate: string;
  triggerTitle: string;
  eachWeekEnd: boolean;
  holidays: Date[];
  setHolidays: React.Dispatch<SetStateAction<Date[]>>;
};

function HolidaysPickerDropdown({
  triggerCustomStyles,
  startDate,
  endDate,
  triggerTitle,
  eachWeekEnd,
  holidays,
  setHolidays,
}: Props) {
  const [currentOption] = useState<string | null>(null);
  const [menuWidth, setMenuWidth] = useState<number | undefined>(0);
  const [datesArray, setDatesArray] = useState<Date[] | null>(null);
  const menuRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMenuWidth(menuRef.current?.clientWidth);
    const newDatesArray = getDates(startDate, endDate);
    setDatesArray(newDatesArray);

    if (eachWeekEnd) {
      // Add weekends to holidays
      const weekendDates = newDatesArray.filter(
        (date) => date.getDay() === 0 || date.getDay() === 6 // Sunday or Saturday
      );
      setHolidays((prevHolidays) => {
        const holidaySet = new Set(prevHolidays.map((d) => d.toISOString()));
        weekendDates.forEach((date) => holidaySet.add(date.toISOString()));
        return Array.from(holidaySet).map((dateStr) => new Date(dateStr));
      });
    } else {
      // Remove weekends from holidays
      setHolidays((prevHolidays) =>
        prevHolidays.filter(
          (date) => date.getDay() !== 0 && date.getDay() !== 6 // Not Sunday or Saturday
        )
      );
    }
  }, [startDate, endDate, eachWeekEnd]);

  function addHoliday(date: Date) {
    const dateString = date.toISOString();
    setHolidays((prevHolidays) => {
      const holidaySet = new Set(prevHolidays.map((d) => d.toISOString()));
      if (holidaySet.has(dateString)) {
        holidaySet.delete(dateString);
      } else {
        holidaySet.add(dateString);
      }
      return Array.from(holidaySet).map((dateStr) => new Date(dateStr));
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        ref={menuRef}
        className={`flex justify-between items-center ${
          triggerCustomStyles
            ? triggerCustomStyles
            : "w-full border border-gray-200 rounded-lg py-3 px-2"
        }`}
      >
        {currentOption ? currentOption : triggerTitle}{" "}
        <CiCircleChevDown className="text-2xl" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={"flex gap-2 items-center flex-wrap"}
        style={{
          width: menuWidth + "px",
        }}
      >
        {datesArray &&
          datesArray.map((date: Date) => {
            const dateString = date.toISOString();
            return (
              <div
                key={dateString}
                onClick={() => addHoliday(date)}
                className={`${
                  holidays.some((holiday) => holiday.toISOString() === dateString)
                    ? "bg-hms-blue-dark text-white"
                    : "bg-hms-green-bright text-hms-blue-dark hover:bg-hms-green-dark hover:text-white "
                }
                  p-2 rounded-lg my-2  cursor-pointer text-lg`}
              >
                {date.toDateString()}
              </div>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default HolidaysPickerDropdown;
