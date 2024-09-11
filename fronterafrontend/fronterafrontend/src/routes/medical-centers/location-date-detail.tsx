import { useParams, useSearchParams } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "./../../../components/ui/table";
import { TiChevronRightOutline } from "react-icons/ti";
import { getFormatedDate } from "./../../../lib/utils";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../components/loading";
import BackButton from "../../../components/BackButton.tsx";
import httpCommon from "../../helper/httpCommon.ts";
import { CSVLink } from "react-csv";

type TCalenderDetails = {
  id: number;
  providerName: string;
  roomName: string;
  shiftFrom: string;
  shiftTo: string;
  shiftType: string;
};

export default function LocationDateDetail() {
  const params = useParams();
  const [searchParams, _setSearchParams] = useSearchParams();

  const { data, isFetching, isFetched } = useQuery({
    queryKey: ["location-date-details-mc"],
    queryFn: async () =>
      await httpCommon.get(
        `medical-centers/calender/details/${searchParams.get(
          "centerID"
        )}?month=${params.date}`
      ),
  });

  let calenderDetails: TCalenderDetails[] = [];

  if (isFetched) {
    calenderDetails = data?.data.data;
  }

  return (
    <section className="w-full py-4">
      <div className="w-full flex justify-between items-center">
        <BackButton
          title={`Back to Medical Center's calendar`}
          to={`/medical-centers/${params.location}/${
            params.date
          }?centerID=${searchParams.get("centerID")}`}
        />
        <CSVLink
          filename={`details_${dayjs()}`}
          data={calenderDetails.map((cd: any) => {
            return {
              medicalCenter: cd.medicalCenterName,
              roomName: cd.roomName,
              providerName: cd.providerName,
              shiftFrom: cd.shiftFrom,
              shiftTo: cd.shiftTo,
              shiftType: cd.shiftType,
            };
          })}
          className="px-2 py-1 rounded-lg text-white bg-hms-green-dark hover:bg-hms-green-light"
        >
          Export CSV
        </CSVLink>
      </div>
      <Table className="my-6">
        <TableHeader>
          <TableRow className="text-xl text-hms-blue-dark bg-hms-blue-dark hover:bg-hms-blue-dark">
            <TableHead className="flex items-center gap-1 text-white">
              <p>{params?.location?.replace(" ", ", ")} </p>
              <TiChevronRightOutline fontSize={20} />
              <p>
                {params.date
                  ? new Date(params.date).toLocaleString("en-Us", {
                      month: "long",
                    })
                  : null}
              </p>{" "}
              <TiChevronRightOutline fontSize={20} />
              <p>
                {params.date
                  ? `${getFormatedDate(dayjs(params.date))} ${new Date(
                      params.date
                    ).toLocaleString("en-Us", {
                      month: "long",
                    })}`
                  : null}
              </p>
            </TableHead>
            <TableHead></TableHead>
            <TableHead></TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="text-xl text-gray-500">
              {params.location?.replace(" ", ", ")}
            </TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
          {isFetching ? (
            <Loading />
          ) : (
            calenderDetails?.map((cd: TCalenderDetails) => {
              return (
                <TableRow key={cd.id} className="text-lg">
                  <TableCell>{cd.roomName}</TableCell>
                  <TableCell className="min-w-max">
                    <p className="px-2 py-1 rounded-full font-semibold text-center bg-hms-green-bright text-hms-green-dark">
                      {cd.shiftFrom} To {cd.shiftTo}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="px-2 py-1 rounded-full font-semibold text-center bg-blue-100 text-blue-900">
                      {cd.shiftType}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="px-2 py-1 rounded-full font-semibold text-center bg-hms-green-dark text-green-100">
                      {cd.providerName}
                    </p>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </section>
  );
}
