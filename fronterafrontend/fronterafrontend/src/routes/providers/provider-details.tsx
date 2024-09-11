import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import Loading from "../../../components/loading";
import BackButton from "../../../components/BackButton";
import httpCommon from "../../helper/httpCommon";
import { CSVLink } from "react-csv";
import dayjs from "dayjs";
import { getDayNamedDate } from "../../../lib/utils";

export default function ProviderDetails() {
  const [searchParams] = useSearchParams();

  const { isFetching, isFetched, data } = useQuery({
    queryKey: ["provider-calendar-details"],
    queryFn: async () =>
      await httpCommon.get(
        `providers/calender/details/${searchParams.get(
          "providerID"
        )}?month=${searchParams.get("date")}`
      ),
  });

  return (
    <section className="w-full">
      <div className="mb-4 mt-2 flex justify-between items-center w-full">
        <BackButton
          to={`/providers/provider/${searchParams.get("providerID")}`}
          title="Back to Provider's Calendar"
        />
        {isFetched ? (
          <CSVLink
            className="px-4 font-semibold py-2 rounded-lg text-white bg-hms-green-dark hover:bg-hms-green-light"
            filename={`${dayjs()}-provider-details`}
            data={data?.data.data.map((sd: any) => {
              return {
                date: getDayNamedDate(sd.date),
                medicalCenter: sd.medicalCenterName,
                roomName: sd.roomName,
                providerName: sd.providerName,
                shiftFrom: sd.shiftFrom,
                shiftTo: sd.shiftTo,
                shiftType: sd.shiftType,
              };
            })
            .sort((a:any, b:any) => dayjs(a.date).diff(dayjs(b.date)))

          }
          >
            Export CSV
          </CSVLink>
        ) : null}
      </div>
      {isFetching ? (
        <Loading />
      ) : data?.data?.data && data?.data.data.length === 0 ? (
        <p className="text-lg w-full text-center text-hms-blue-dark">
          No details found
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-hms-blue-dark bg-hms-blue-dark text-white">
              <TableCell>S No.</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Medical Center</TableCell>
              <TableCell>Room Name</TableCell>
              <TableCell>Shift Timmings</TableCell>
              <TableCell>Shift Type</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isFetched
              ? data?.data.data.map(
                  (
                    pd: {
                      id: number;
                      date: string;
                      shiftType: string;
                      roomName: string;
                      shiftFrom: string;
                      shiftTo: string;
                      medicalCenterName: string;
                    },
                    index: number
                  ) => (
                    <TableRow key={pd.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{pd.date}</TableCell>
                      <TableCell>{pd.medicalCenterName}</TableCell>
                      <TableCell>{pd.roomName}</TableCell>
                      <TableCell className="flex gap-2 items-center">
                        <p className="p-2 text-lg font-semibold rounded-lg bg-hms-green-bright text-hms-green-dark max-w-max">
                          {pd.shiftFrom}
                        </p>{" "}
                        To
                        <p className="p-2 text-lg font-semibold rounded-lg bg-hms-green-bright text-hms-green-dark max-w-max">
                          {pd.shiftTo}
                        </p>
                      </TableCell>
                      <TableCell>{pd.shiftType}</TableCell>
                    </TableRow>
                  )
                )
              : null}
          </TableBody>
        </Table>
      )}
    </section>
  );
}
