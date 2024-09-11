import { Label } from "./../../../components/ui/label";
import { Input } from "./../../../components/ui/input";
import { Button } from "./../../../components/ui/button";
import Dropdown from "./../../../components/dropdown";
import Rooms from "./Rooms";
import Modal from "./../../../components/modal";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FaArrowCircleLeft } from "react-icons/fa";
import { useEffect, useState } from "react";
import { TRegion, STRoom, TSpecializations } from "types";
import { TRoom } from "@/zod/schema.ts";
import { centerSchema, roomSchema } from "@/zod/schema";
import z, { ZodFormattedError } from "zod";
import ValidationError from "../../../components/validation-error";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import Loading from "../../../components/loading";
import BulkImport from "./bulkimport";
import { useBulkImport } from "@/providers/bulkImportProvider";
import httpCommon from "../../helper/httpCommon";
import { useToast } from "../../../components/ui/use-toast";
import Message from "../../../components/toasts";

function AddCenter() {
  const { toast } = useToast();
  const { centers_bulk_import_status } = useBulkImport();
  // center and room states
  const navigate = useNavigate();
  // const [setStateSelected] = useState(false);
  const [searchParams] = useSearchParams();
  const [isDuplicateRoom, setIsDuplicateRoom] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState<boolean | undefined>();

  const is_edit_mode = searchParams.get("edit") === "true";

  // center logic
  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    formState: { errors: centerErrors },
  } = useForm<z.infer<typeof centerSchema>>({
    resolver: zodResolver(centerSchema),
  });

  const {
    status,
    mutate,
    reset: reset_mutation,
  } = useMutation({
    mutationFn: async function (center: z.infer<typeof centerSchema>) {
      return httpCommon.post(
        `medical-centers/${
          is_edit_mode ? `update/${searchParams.get("centerID")}` : "add"
        }`,
        center
      );
    },
    async onSuccess(data) {
      if (data.data.success) {
        if (is_edit_mode) {
          await set_to_edit();
        }
        setTimeout(() => {
          reset_mutation();
          navigate("/medical-centers");
        }, 1000);

        toast({
          description: (
            <Message
              message={`Center ${
                is_edit_mode ? "updated" : "added"
              } successfully`}
              type="success"
            />
          ),
        });
      }
    },
  });

  // rooms logic
  const [room, setRoom] = useState<STRoom>({
    name: "",
    specializationID: null,
  });

  const [roomErrors, setRoomErrors] = useState<ZodFormattedError<
    {
      name: string;
      dayFrom: string;
      dayTo: string;
      specializationID: number;
    },
    string
  > | null>();

  function parseRoom(): z.SafeParseReturnType<
    z.infer<typeof roomSchema>,
    z.infer<typeof roomSchema>
  > {
    const res = roomSchema.safeParse(room);

    if (!res.success) {
      setRoomErrors(res.error.format());
    }

    return res;
  }

  function addRoom() {
    const currentRooms = getValues("rooms");

    const isDuplicate = currentRooms?.find(
      (cr) =>
        cr.name === room.name && cr.specializationID === room.specializationID
    );

    if (isDuplicate) {
      setIsDuplicateRoom(true);
      setIsRoomModalOpen(true);
    } else {
      setIsDuplicateRoom(false);
      if (parseRoom().success) {
        if (currentRooms) {
          setValue("rooms", [...currentRooms, (parseRoom() as any).data]);
        } else {
          setValue("rooms", [(parseRoom() as any).data]);
        }
        setRoom({
          name: "",
          specializationID: null,
        });
        setRoomErrors(null);
      }
      toast({
        description: (
          <Message type="success" message="Room added successfully" />
        ),
      });
      setIsRoomModalOpen(false);
    }
  }

  const deleteRoom = (roomName: string, specializationID: number) => {
    let newRooms: TRoom[] = [];
    if (is_edit_mode) {
      newRooms = getValues("rooms").filter(
        (room: z.infer<typeof roomSchema>) =>
          `${room.name}-${room.specializationID}` !==
          `${roomName}-${specializationID}`
      );
    } else {
      newRooms = getValues("rooms").filter(
        (room: z.infer<typeof roomSchema>) =>
          `${room.name}-${room.specializationID}` !==
          `${roomName}-${specializationID}`
      );
    }
    setValue("rooms", newRooms);
    return getValues("rooms");
  };

  const {
    data: regions,
    isFetched: regions_fetched,
    refetch: fetch_regions,
    isFetching: fetching_regions,
  } = useQuery({
    queryKey: ["regions-medical-center"],
    queryFn: async function () {
      return await httpCommon.get(`medical-centers/region`);
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  const {
    data: specializations,
    isFetching: fetching_specializations,
    isFetched: specializations_fetched,
    refetch: fetch_specializations,
  } = useQuery({
    queryKey: ["specializations-get"],
    queryFn: async function () {
      return await httpCommon.get("providers/specializations");
    },
  });

  const [mc_fetch_loading, set_mc_fetch_loading] = useState(false);
  const set_to_edit = async () => {
    set_mc_fetch_loading(true);
    const centerID = searchParams.get("centerID");

    if (centerID) {
      const res = await httpCommon.get(`medical-centers/get/${centerID}`);
      if (res.status === 200) {
        if (res.data.success) {
          const center_to_edit = res.data.data[0];
          setValue("address", center_to_edit.address);
          setValue("name", center_to_edit.centerName);
          setValue("email", center_to_edit.email);
          setValue("poc", center_to_edit.poc);
          setValue("contact", center_to_edit.contact);
          fetch_regions();
          setValue("regionID", JSON.parse(center_to_edit.regionInfo).regionID);
          let rooms = JSON.parse(center_to_edit.rooms);
          if (rooms) {
            fetch_specializations();
            rooms = rooms.map(
              (room: { name: string; roomTypeID: string; id: number }) => {
                return {
                  id: room.id,
                  name: room.name,
                  specializationID: parseInt(room.roomTypeID),
                  isDeleted: false,
                };
              }
            );
            setValue("rooms", rooms);
          }
        }
      }
      set_mc_fetch_loading(false);
    }
  };

  useEffect(() => {
    set_to_edit();
  }, []);

  return (
    <>
      <div className="w-full flex justify-between items-center mx-auto mt-4">
        <Link
          to="/medical-centers"
          className="min-w-max flex items-center gap-2 py-2 rounded-lg px-4 border border-hms-green-light "
        >
          <FaArrowCircleLeft /> Back To Medical Centers
        </Link>
        {centers_bulk_import_status === "pending" ? (
          <Loading
            contained={true}
            vertical={true}
            message="Bulk import in progress"
          />
        ) : (
          <BulkImport target="CENTER" />
        )}
      </div>
      <section className="flex rounded-lg w-full mx-auto py-4 mt-6 items-start gap-4 md:flex-col">
        {is_edit_mode && mc_fetch_loading ? (
          <Loading />
        ) : (
          <>
            <form
              onSubmit={handleSubmit((center: z.infer<typeof centerSchema>) => {
                mutate(center);
              })}
              className="md:w-full w-[50%] flex flex-col gap-2"
            >
              <Label>
                <span className="text-lg">Name</span>
                <Input
                  {...register("name")}
                  id="name"
                  className="my-2 border-gray-300"
                  placeholder="Center's name"
                />
              </Label>
              {centerErrors?.name && centerErrors.name.message ? (
                <ValidationError message={centerErrors.name.message} />
              ) : null}
              <Label className="flex mt-2 gap-2 flex-col">
                <span className="text-lg">Region</span>
                {fetching_regions ? (
                  <Loading />
                ) : (
                  <Dropdown
                    triggerTitle={"Chose Region"}
                    defaultOption={
                      regions_fetched && is_edit_mode
                        ? regions?.data.data.find((region: TRegion) => {
                            return region.id === getValues("regionID");
                          })?.name
                        : null
                    }
                    onSelect={(option: string) =>
                      setValue(
                        "regionID",
                        regions?.data.data.find(
                          (region: TRegion) => region.name === option
                        )?.id as number
                      )
                    }
                    options={
                      regions_fetched && regions?.data
                        ? regions?.data.data.map(
                            (region: TRegion) => region.name
                          )
                        : []
                    }
                  />
                )}
              </Label>
              {centerErrors?.regionID ? (
                <ValidationError message={"Please choose region"} />
              ) : null}
              <Label className="flex gap-2 flex-col">
                <span className="text-lg">Address</span>
                <Input
                  {...register("address")}
                  id="address"
                  type="text"
                  placeholder="Address"
                />
              </Label>
              {centerErrors?.address && centerErrors.address.message ? (
                <ValidationError message={centerErrors.address.message} />
              ) : null}
              <Label className="flex gap-2 flex-col">
                <span className="text-lg">POC</span>
                <Input
                  {...register("poc")}
                  id="poc"
                  type="text"
                  placeholder="POC"
                />
              </Label>
              {centerErrors?.poc && centerErrors.poc.message ? (
                <ValidationError message={centerErrors.poc.message} />
              ) : null}
              <Label className="flex gap-2 flex-col">
                <span className="text-lg">Contact</span>
                <Input
                  {...register("contact")}
                  id="contact"
                  type="text"
                  placeholder="Contact"
                />
              </Label>
              {centerErrors?.contact?.message ? (
                <ValidationError message={centerErrors.contact.message} />
              ) : null}
              <Label className="flex gap-2 flex-col">
                <span className="text-lg">Email</span>
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="Email"
                />
              </Label>
              {centerErrors?.email?.message ? (
                <ValidationError message={centerErrors.email.message} />
              ) : null}
              {centerErrors.rooms && centerErrors.rooms.message ? (
                <ValidationError message={centerErrors.rooms.message} />
              ) : null}
              {status === "pending" ? (
                <div className="px-4 w-full py-2 rounded-lg bg-gray-200">
                  <Loading />
                </div>
              ) : status === "success" ? (
                <div className="px-4 w-full py-2 rounded-lg bg-green-100 text-green-900">
                  Center {is_edit_mode ? "Updated" : "added"} successfully
                </div>
              ) : (
                <Button
                  type="submit"
                  className="mt-2 w-full bg-hms-green-light hover:bg-hms-green-dark text-white"
                >
                  {is_edit_mode ? "Save Changes" : "Add Center"}
                </Button>
              )}
            </form>
            <div className="w-[50%] md:w-full p-4 h-full rounded-lg">
              <h2 className="text-xl flex justify-between items-center font-semibold mb-2 border-b-2 pb-2 border-hms-green-light text-gray-700">
                Rooms{" "}
                <Modal
                  customClose={isRoomModalOpen}
                  customOpen={setIsRoomModalOpen}
                  title="Add Room"
                  actionTitle="Add Room"
                  description="Add new room"
                  triggerTitle="Add Room"
                >
                  <Label className="flex flex-col gap-2">
                    Name
                    <Input
                      required={true}
                      placeholder="Name"
                      value={room.name}
                      onChange={(e) => {
                        setRoom({ ...room, name: e.target.value });
                        setRoomErrors(null);
                        setIsDuplicateRoom(false);
                      }}
                    />
                  </Label>
                  {roomErrors?.name ? (
                    <ValidationError message={roomErrors.name._errors[0]} />
                  ) : null}
                  <Label className="flex flex-col items-start gap-2 w-full">
                    <span className="text-lg">Room Type</span>
                    {fetching_specializations ? (
                      <Loading />
                    ) : (
                      <Dropdown
                        onSelect={(option: string) => {
                          setRoom({
                            ...room,
                            specializationID: (
                              specializations?.data.data as TSpecializations[]
                            ).find(
                              (specializations: TSpecializations) =>
                                specializations.name === option
                            )?.id as number,
                          });
                          setIsDuplicateRoom(false);
                          setRoomErrors(null);
                        }}
                        options={
                          specializations_fetched
                            ? specializations?.data.data.map(
                                (specialization: TSpecializations) =>
                                  specialization.name
                              )
                            : []
                        }
                        triggerTitle="Chose Specialization"
                      />
                    )}
                  </Label>
                  {roomErrors?.specializationID ? (
                    <ValidationError message={"Please choose room type"} />
                  ) : null}
                  {isDuplicateRoom ? (
                    <ValidationError
                      message={`Room with name: ${
                        room.name
                      } and specialization: ${
                        specializations?.data.data.find(
                          (s: TSpecializations) =>
                            s.id === room.specializationID
                        ).name
                      } already exits`}
                    />
                  ) : null}
                  <Button
                    onClick={() => {
                      addRoom();
                    }}
                    className="bg-hms-green-dark text-center hover:bg-hms-green-light w-full py-2 font-semibold rounded-lg text-white"
                  >
                    Add Room
                  </Button>
                </Modal>
              </h2>
              <Rooms
                setValues={setValue}
                roomErrors={roomErrors}
                deleteRoom={deleteRoom}
                form_rooms={getValues("rooms")}
              />
            </div>
          </>
        )}
      </section>
    </>
  );
}

export default AddCenter;
