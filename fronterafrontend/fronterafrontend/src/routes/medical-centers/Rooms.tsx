import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "./../../../components/ui/table";
import z, { ZodFormattedError } from "zod";
import { centerSchema, roomSchema } from "@/zod/schema";
import { useEffect, useState } from "react";
import { UseFormSetValue } from "react-hook-form";
import Room from "./Room";

type Props = {
  form_rooms: z.infer<typeof roomSchema>[];
  deleteRoom: (roomName: string,specializationID:number) => z.infer<typeof roomSchema>[];
  roomErrors:
    | ZodFormattedError<z.infer<typeof roomSchema>, string>
    | null
    | undefined;
  setValues: UseFormSetValue<z.infer<typeof centerSchema>>;
};

function Rooms({ roomErrors, setValues, form_rooms, deleteRoom }: Props) {
  const [rooms, setRooms] = useState<z.infer<typeof roomSchema>[]>(form_rooms);
  useEffect(() => {
    setRooms(form_rooms);
  }, [form_rooms]);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={"text-left"}>S No.</TableHead>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead className="text-center">Room Type</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rooms
            ? rooms.map((room, index) => (
                <Room
                  room={room}
                  index={index}
                  setRooms={setRooms}
                  setValues={setValues}
                  deleteRoom={deleteRoom}
                  roomErrors={roomErrors}
                  rooms={rooms}
                  key={index}
                />
              ))
            : null}
        </TableBody>
      </Table>
    </>
  );
}

export default Rooms;
