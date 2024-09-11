import { useQuery } from "@tanstack/react-query";
import Loading from "../../../components/loading";
import dayjs from "dayjs";
import { Calendar } from "rsuite";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import BackButton from "../../../components/BackButton";
import httpCommon from "../../helper/httpCommon";

type TProviderAppointment = { dateOfMonth: string; shiftsCount: string };

function Provider() {
  const params = useParams();

  const { data, isFetching, isFetched } = useQuery({
    queryKey: ["provider-calender"],
    queryFn: async () =>
      await httpCommon.get(
        `providers/get/calender/${params.providerID}?month=${dayjs().format(
          "YYYY-MM-DD"
        )}`
      ),
  });

  let appointments: TProviderAppointment[] = [];

  if (isFetched) {
    appointments = data?.data.data;
  }

  function renderCell(date: Date) {
    let appointmentForCurrentDate: TProviderAppointment | undefined;

    if (appointments) {
      appointmentForCurrentDate = appointments.find(
        (a) =>
          dayjs(a.dateOfMonth).format("YYYY-MM-DD") ===
          dayjs(date).format("YYYY-MM-DD")
      );
    }

    if (!date.toString().toLowerCase().includes("sun")) {
      return isFetching ? (
        <Loading />
      ) : appointments ? (
        appointmentForCurrentDate ? (
          <Link
            to={`/providers/provider/calendar/details?date=${dayjs(date).format(
              "YYYY-MM-DD"
            )}&providerID=${params.providerID}`}
          >
            {" "}
            <div className="w-full p-1 rounded-lg bg-white text-center h-full flex flex-col items-start justify-center">
              {appointmentForCurrentDate ? (
                <p className="w-full px-2 py-1 rounded-lg bg-hms-green-bright text-hms-green-dark font-semibold">
                  {appointmentForCurrentDate.shiftsCount} shifts
                </p>
              ) : null}
            </div>
          </Link>
        ) : null
      ) : (
        <p>failed to load appointment</p>
      );
    }
  }

  return (
    <section className="w-full pb-4 mx-auto">
      <div className="w-full flex items-center justify-between my-4">
        <BackButton to="/providers?region=0" title="Back to Providers" />
        {appointments ? (
          <>
          </>
          // <CSVLink
          //   data={appointments.map((a) => {
          //     return {
          //       ...a,
          //       dateOfMonth: dayjs(a.dateOfMonth).format("YYYY-MM-DD"),
          //     };
          //   })}
          //   filename={dayjs() + "provider_data"}
          //   className="px-2 py-1 rounded-lg text-white bg-hms-green-dark hover:bg-hms-green-light"
          // >
          //   Export CSV
          // </CSVLink>
        ) : (
          <Loading />
        )}
      </div>
      <div className="w-full border border-hms-green-light rounded-lg">
        <Calendar
          cellClassName={() => "hms-calender-cell"}
          renderCell={renderCell}
        />
      </div>
    </section>
  );
}

export default Provider;
