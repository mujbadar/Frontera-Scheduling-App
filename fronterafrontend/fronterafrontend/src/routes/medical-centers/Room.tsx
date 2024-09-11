import Modal from "./../../../components/modal";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import ValidationError from "../../../components/validation-error";
import Dropdown from "../../../components/dropdown";
import Loading from "../../../components/loading";
import { MdEdit } from "react-icons/md";
import ConfirmDelete from "./../../../components/ConfirmDelete";
import { TableCell, TableRow } from "./../../../components/ui/table";
import { centerSchema, roomSchema } from "@/zod/schema";
import { ZodFormattedError, z } from "zod";
import { UseFormSetValue } from "react-hook-form";
import { SetStateAction } from "react";
import { useQuery } from "@tanstack/react-query";
import { TSpecializations } from "types";
import { useState } from "react";
import httpCommon from "../../helper/httpCommon";
import { DialogClose } from "../../../components/ui/dialog";
import { useToast } from "../../../components/ui/use-toast";
import Message from "../../../components/toasts";

type Props = {
  index: number;
  room: z.infer<typeof roomSchema>;
  deleteRoom: (
    roomName: string,
    specializationID: number
  ) => z.infer<typeof roomSchema>[];
  roomErrors:
    | ZodFormattedError<z.infer<typeof roomSchema>, string>
    | null
    | undefined;
  setValues: UseFormSetValue<z.infer<typeof centerSchema>>;
  setRooms: React.Dispatch<SetStateAction<z.infer<typeof roomSchema>[]>>;
  rooms: z.infer<typeof roomSchema>[];
};

function Room({
  index,
  room,
  deleteRoom,
  setRooms,
  setValues,
  rooms,
  roomErrors,
}: Props) {
  const [isOpen, setIsOpen] = useState<boolean | undefined>();
  const { toast } = useToast();
  const [updatedRooms, setUpdatedRooms] = useState<
    z.infer<typeof roomSchema>[]
  >([]);

  const [localRoom, setLocalRoom] = useState<z.infer<typeof roomSchema>>(room);

  function editRoom(
    roomName: string,
    data?: { field: string; value: string | number },
    confirm?: boolean
  ) {
    let editedRooms: z.infer<typeof roomSchema>[] = [];
    if (confirm && updatedRooms.length > 0) {
      setRooms(updatedRooms);
      setValues("rooms", updatedRooms);
      toast({
        description: (
          <Message message="Room updated successfully" type="success" />
        ),
      });
      setUpdatedRooms([]);
    } else if (data) {
      const { field, value } = data;
      editedRooms = rooms.map((room: z.infer<typeof roomSchema>) => {
        if (room.name === roomName) {
          room = { ...room, [field]: value };
        }
        return room;
      });
      setLocalRoom({ ...localRoom, [field]: value });
      setUpdatedRooms(editedRooms);
    }
  }

  const { data: specializations, isFetching: fetching_specializations } =
    useQuery({
      queryKey: ["specializations-get"],
      queryFn: async function () {
        return await httpCommon.get("providers/specializations");
      },
    });

  return (
    <>
      {fetching_specializations ? (
        <TableRow>
          <TableCell>
            <Loading />
          </TableCell>
        </TableRow>
      ) : (
        <TableRow
          className={`${
            room.isDeleted && "bg-gray-300 pointer-events-none text-gray-400"
          }`}
          key={index}
        >
          <TableCell className="font-medium">{index + 1}</TableCell>
          <TableCell className="font-medium">{room.name}</TableCell>
          <TableCell className="text-center">
            {
              specializations?.data.data.find((s: TSpecializations) => {
                return s.id === room.specializationID;
              }).name
            }
          </TableCell>
          <TableCell className="text-center flex gap-2 justify-center items-center">
            <ConfirmDelete
              itemName={room.name}
              onConfirm={(closeModal) => {
                setRooms(deleteRoom(room.name, room.specializationID));
                if (closeModal) {
                  closeModal(false);
                }
              }}
            />
            <Modal
              customOpen={setIsOpen}
              customClose={isOpen}
              onlyIcon={
                <MdEdit className="text-2xl text-gray-500 hover:text-gray-600 cursor-pointer" />
              }
              title="Update Room"
              actionTitle="Update Room"
              description="Update new room"
              triggerTitle="Update Room"
            >
              <Label className="flex flex-col gap-2">
                Name
                <Input
                  required={true}
                  placeholder="Name"
                  value={localRoom.name}
                  onChange={(e) =>
                    editRoom(room.name, {
                      field: "name",
                      value: e.target.value,
                    })
                  }
                />
              </Label>
              {roomErrors?.name ? (
                <ValidationError message={roomErrors.name._errors[0]} />
              ) : null}
              <Label className="flex flex-col items-start gap-2 w-full">
                <span className="text-lg">Room Type</span>
                <Dropdown
                  defaultOption={
                    specializations?.data.data.find(
                      (s: TSpecializations) =>
                        s.id === localRoom.specializationID
                    ).name
                  }
                  onSelect={(option: string) =>
                    editRoom(room.name, {
                      field: "specializationID",
                      value: specializations?.data.data.find(
                        (s: TSpecializations) => s.name === option
                      ).id,
                    })
                  }
                  options={specializations?.data.data.map(
                    (s: TSpecializations) => s.name
                  )}
                  triggerTitle="Room Type"
                />
              </Label>
              {roomErrors?.specializationID ? (
                <ValidationError message={"Please choose room type"} />
              ) : null}
              <DialogClose asChild>
                <Button
                  disabled={updatedRooms.length === 0}
                  onClick={() => {
                    editRoom(room.name, undefined, true);
                  }}
                  className="bg-hms-green-light disabled:bg-gray-200 disabled:text-white hover:bg-hms-green-dark"
                >
                  Confirm
                </Button>
              </DialogClose>
            </Modal>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export default Room;
