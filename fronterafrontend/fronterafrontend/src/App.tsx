import "./App.css";
import { Calendar } from "rsuite";
import dayjs from "dayjs";

import "rsuite/Calendar/styles/index.css";
import { Link } from "react-router-dom";
import { useAuth } from "./providers/authProvider";
import { useQuery } from "@tanstack/react-query";
import Loading from "../components/loading";
import httpCommon from "./helper/httpCommon";
import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { getDayNamedDate } from "../lib/utils";

function App() {
  const [user] = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [currentMonth, setCurrentMonth] = useState(
    dayjs().format("YYYY-MM-DD")
  );

  const {
    isFetched,
    isFetching,
    data,
    refetch: fetch_new_month,
  } = useQuery({
    queryKey: ["landing-page-data"],
    queryFn: async () =>
      await httpCommon.get(`dashboard/calender?month=${currentMonth}`),
  });

  const { data: exportData, isFetching: fetchingExportData } = useQuery({
    queryKey: ["export-data"],
    queryFn: async () =>
      await httpCommon.get(`dashboard/export-calender?month=${currentMonth}`),
  });

  let calenderData: any[] = [];
  if (isFetched) calenderData = data?.data.data;
  useEffect(() => {
    fetch_new_month();
  }, [currentMonth]);

  function renderCell(date: Date) {
    return isFetching ? (
      <Loading />
    ) : (
      <ul>
        {calenderData.map((cd: any) => {
          if (
            dayjs(cd.currentDate).format("YYYY-MM-DD") ===
            dayjs(date).format("YYYY-MM-DD")
          ) {
            return isAdmin ? (
              <Link to={`date-details/${cd.currentDate}`} key={date.toString()}>
                <div>
                  {cd.centersCount} &nbsp;
                  {cd.centersCount === "1" ? "Center" : "Centers"} <br />
                  {cd.providerCount} &nbsp;
                  {cd.providerCount === "1" ? "Provider" : "Providers"} <br />
                  {cd.totalShiftOnCurrentDate} &nbsp;
                  {cd.totalShiftCount === "1" ? "Shift" : "Shifts"} <br />
                </div>
              </Link>
            ) : (
              <Link
                to={`provider-details?providerID=${user?.id}&date=${dayjs(
                  date
                ).format("YYYY-MM-DD")}`}
              >
                <p className="w-full font-semibold h-full flex flex-col items-center gap-2 bg-hms-green-bright text-hms-green-dark my-4 p-1 rounded-lg text-center">
                  <span>
                    {cd.totalShiftOnCurrentDate}
                    &nbsp;
                    {cd.totalShiftOnCurrentDate === "1" ? "shift" : "shifts"}
                  </span>
                </p>
              </Link>
            );
          } else return null;
        })}
      </ul>
    );
  }

  return (
    <section className="w-full">
      <div className="w-full flex justify-end items-center">
        {fetchingExportData ? (
          <Loading contained={true} />
        ) : (
          <CSVLink
            filename={`details_${dayjs()}`}
            className="px-4 font-semibold py-2 rounded-lg text-white bg-hms-green-dark hover:bg-hms-green-light"
            data={exportData?.data.data
              .map((detail: any) =>
                JSON.parse(detail.shiftInfo)
                  .map((sd: any) => {
                    return {
                      date: getDayNamedDate(sd.date),
                      medicalcenter: detail.centerName,
                      roomName: sd.room,
                      providerName: sd.provider,
                      shiftFrom: sd.shiftFrom,
                      shiftTo: sd.shiftTo,
                      shiftType: sd.shiftType
                    };
                  })
                  .filter(
                    (d: any) =>
                      dayjs(d.date).get("month") ===
                      dayjs(currentMonth).get("month")
                  )
              )
              .flat()
              .sort((a:any, b:any) => dayjs(a.date).diff(dayjs(b.date)))
            }
          >
            Export CSV
          </CSVLink>
        )}
      </div>
      <div className="w-full my-4 border-2 border-hms-green-light rounded-lg p-2">
        <Calendar
          onMonthChange={(date) =>
            setCurrentMonth(dayjs(date).format("YYYY-MM-DD"))
          }
          renderCell={renderCell}
        />
      </div>
    </section>
  );
}
export default App;
