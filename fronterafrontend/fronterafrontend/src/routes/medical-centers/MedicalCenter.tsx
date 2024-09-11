import { useParams, useSearchParams } from "react-router-dom";
import { Calendar } from "rsuite";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import Loading from "../../../components/loading";
import BackButton from "../../../components/BackButton";
import httpCommon from "../../helper/httpCommon";
import { CSVLink } from "react-csv";
import { useState } from "react";
import { getDayNamedDate } from "../../../lib/utils";

export default function MedicalCenter() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const [currentMonth, setCurrentMonth] = useState<string | undefined>();

  const { data, isFetching, isFetched } = useQuery({
    queryKey: ["mc-calender"],
    queryFn: async () =>
      await httpCommon.get(
        `medical-centers/calender/${searchParams.get("centerID")}?month=${dayjs(
          params.date
        ).format("YYYY-MM-DD")}`
        // `medical-centers/calender/${searchParams.get("centerID")}?month=2024-03-10`,
      ),
  });

  let appointments: any[] = [];

  if (isFetched) {
    appointments = data?.data.data;
  }

  function renderCell(date: Date) {
    const appointmentForCurrentDate = appointments.find(
      (a: any) =>
        dayjs(a.dateOfMonth).format("YYYY-MM-DD") ===
        dayjs(date).format("YYYY-MM-DD")
    );

    if (!date.toString().toLowerCase().includes("sun")) {
      return isFetching ? (
        <Loading />
      ) : appointmentForCurrentDate ? (
        <Link
          to={`/medical-centers/details/${params.location}/${dayjs(date).format(
            "YYYY-MM-DD"
          )}?centerID=${searchParams.get("centerID")}`}
        >
          {" "}
          <p className="w-full p-1 rounded-lg bg-white h-full flex flex-col items-start justify-center">
            {appointmentForCurrentDate ? (
              <>
                <p>
                  {appointmentForCurrentDate.uniqueProvidersCount} Providers
                </p>
                <p>{appointmentForCurrentDate.shiftsCount} Shifts</p>
              </>
            ) : null}
          </p>
        </Link>
      ) : null;
    }
  }

  return (
    <section className="w-full pb-4 mx-auto">
      <div className="w-full flex items-center justify-between my-4">
        <BackButton
          to="/medical-centers?region=0"
          title="Back to Medical Centers"
        />
        <div className="flex gap-4 items-center">
          <p className="font-bold text-2xl bg-hms-green-bright text-hms-green-dark max-w-max px-4 py-2 rounded-lg">
            {params.location}
          </p>
          {appointments ? (
            <CSVLink
              filename={`details_${dayjs()}`}
              data={[]
                .concat(
                  ...appointments.map((a) => {
                    return JSON.parse(a.listInfo).map((li: any) => {
                      return {
                        date: getDayNamedDate(a.dateOfMonth),
                        medicalCenter: li.medicalCenterName,
                        roomName: li.roomName,
                        providerName: li.providerName,
                        shiftFrom: li.shiftFrom,
                        shiftTo: li.shiftTo,
                        shiftType: li.shiftType,
                      };
                    });
                  })
                )
                .filter(
                  (li: any) =>
                    dayjs(currentMonth).get("month") ===
                    dayjs(li.date).get("month")
                )
                .map((a: any) => {
                  return {
                    ...a,
                    date: getDayNamedDate(a.date),
                  };
                })
                .sort((a:any, b:any) => dayjs(a.date).diff(dayjs(b.date)))
              }
              className="px-2 py-1 rounded-lg text-white bg-hms-green-dark hover:bg-hms-green-light"
            >
              Export CSV
            </CSVLink>
          ) : (
            <Loading />
          )}
        </div>
      </div>
      <div className="w-full border border-hms-green-light rounded-lg">
        <Calendar
          cellClassName={() => "hms-calender-cell"}
          renderCell={renderCell}
          onMonthChange={(date) =>
            setCurrentMonth(dayjs(date).format("YYYY-MM-DD"))
          }
        />
      </div>
    </section>
  );
}
