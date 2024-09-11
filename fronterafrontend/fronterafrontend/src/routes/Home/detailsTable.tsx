import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./../../../components/ui/table";
import React from "react";
import { getFormatedDate } from "../../../lib/utils";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";

type TShiftInfo = {
  room: string;
  provider: string;
  shiftType: "MORNING" | "AFTERNOON" | "FULL";
  appointmentID: number;
};

type TDetails = {
  centerID: number;
  centerName: string;
  region: string;
  state: string;
  shiftInfo: string;
};

function DetailsTable({ details }: { details: TDetails[] }) {
  const params = useParams();
  return details.length === 0 ? (
    <p className={"w-full text-center text-lg font-semibold"}>
      No details found
    </p>
  ) : (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="px-0">
            <p className="font-bold text-2xl bg-hms-green-bright text-hms-green-dark max-w-max px-4 py-2 rounded-lg">
              {getFormatedDate(dayjs(params.date))} &nbsp;
              {new Date(params.date as string)?.toLocaleString("default", {
                month: "long",
              })}
              , &nbsp; {new Date(params.date as string)?.getFullYear()}
            </p>
          </TableHead>
          <TableHead></TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {details.map((detail: TDetails, index: number) => {
          return (
            <React.Fragment key={index}>
              <TableRow className="bg-hms-blue-dark hover:bg-hms-blue-dark text-white font-semibold text-xl">
                <TableCell>
                  {detail.region},&nbsp;{detail.centerName}
                </TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow className="bg-hms-blue-dark hover:bg-hms-blue-dark text-white font-semibold text-xl">
                <TableCell>Room</TableCell>
                <TableCell>Shift (Time)</TableCell>
                <TableCell>Provider</TableCell>
              </TableRow>
              {JSON.parse(detail.shiftInfo).map(
                (si: TShiftInfo, index: number) => (
                  <TableRow key={index} className="text-xl">
                    <TableCell>{si.room}</TableCell>
                    <TableCell>{si.shiftType}</TableCell>
                    <TableCell>{si.provider}</TableCell>
                  </TableRow>
                )
              )}
            </React.Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
}

export default DetailsTable;
