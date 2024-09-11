import { Label } from "./../../../components/ui/label";
import { Input } from "./../../../components/ui/input";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Dropdown from "./../../../components/dropdown";
import { Button } from "../../../components/ui/button.tsx";
import { FaArrowCircleLeft } from "react-icons/fa";
import { useForm } from "react-hook-form";
import {
  TProvider,
  TShift,
  providerSchema,
  shiftsSchema,
} from "@/zod/schema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import ValidationError from "../../../components/validation-error.tsx";
import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import Loading from "../../../components/loading.tsx";
import { TSpecializations } from "types";
import BulkImport from "../medical-centers/bulkimport.tsx";
import { useBulkImport } from "@/providers/bulkImportProvider.tsx";
import httpCommon from "../../helper/httpCommon.ts";
import { useToast } from "../../../components/ui/use-toast.ts";
import Message from "../../../components/toasts.tsx";
import { to12HourTime, validTime } from "../../../lib/utils.ts";

export default function AddProvider() {
  const { providers_bulk_import_status } = useBulkImport();
  const { toast } = useToast();

  const [searchParams, _setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    status,
    reset: reset_mutation,
    mutate: create_provider,
  } = useMutation({
    mutationFn: async (provider: TProvider) => {
      return await httpCommon.post(
        `providers/${
          searchParams.get("edit") === "true"
            ? `update/${searchParams.get("providerID")}`
            : "add"
        }`,
        provider
      );
    },
    onSuccess(data) {
      if (data.data.success) {
        toast({
          description: (
            <Message
              message={`Provider ${
                searchParams.get("edit") === "true" ? "updated" : "added"
              } successfully`}
              type="success"
            />
          ),
        });
        reset();
        reset_mutation();
        navigate("/providers");
      } else {
        toast({
          description: (
            <Message message={data?.data.message as string} type="error" />
          ),
        });
      }
    },
  });

  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
    getValues,
    reset,
    watch,
  } = useForm<TProvider>({
    resolver: zodResolver(providerSchema),
  });

  const [fullShift, setFullShift] = useState<TShift>({
    shiftFromTime: "",
    shiftToTime: "",
    shiftType: "FULL",
  });

  const [morningShift, setMorningShift] = useState<TShift>({
    shiftFromTime: "",
    shiftToTime: "",
    shiftType: "MORNING",
  });

  const [afternoonShift, setAfternoonShift] = useState<TShift>({
    shiftFromTime: "",
    shiftToTime: "",
    shiftType: "AFTERNOON",
  });

  // edit the already added shift type in the values on change event
  function shiftReset(
    type: "MORNING" | "AFTERNOON" | "FULL",
    time: "shiftFromTime" | "shiftToTime",
    value: string
  ) {
    let shifts = getValues("availability");
    if (shifts && shifts.find((shift: TShift) => shift.shiftType === type)) {
      shifts = shifts.map((shift: TShift) => {
        if (shift.shiftType === type) {
          shift = {
            ...shift,
            [time]: value,
          };
        }
        return shift;
      });
      setValue("availability", shifts);
      // if shift was already in the values and was edited in the process then return true
      return true;
    }
    // else return false as the shift wasn't found in the values
    return false;
  }

  const {
    data: specializations,
    isFetching: fetching_specializations,
    isFetched: specializations_fetched,
  } = useQuery({
    queryKey: ["specializations-get"],
    queryFn: async function () {
      return await httpCommon.get("providers/specializations");
    },
  });

  const {
    data: medical_centers_data,
    isFetching: fetching_medical_centers,
    isFetched: medical_center_fetched,
  } = useQuery({
    queryKey: ["medical-centers"],
    queryFn: async function () {
      return await httpCommon.get(
        "medical-centers/get?region=0&page=0&limit=100"
      );
    },
  });

  const {
    data: rooms_data,
    isFetching: fetching_rooms,
    isFetched: rooms_fetched,
    refetch: fetch_rooms,
  } = useQuery({
    queryKey: ["rooms"],
    queryFn: async () =>
      await httpCommon.get(
        `providers/rooms/${watch("medicalCenterID")}/${watch(
          "specializationID"
        )}`
      ),
    enabled: false,
    refetchOnWindowFocus: false,
    retry: false,
  });

  // edit setup
  const {
    data: provider_to_edit,
    error: provider_to_edit_error,
    isFetching: fetching_provider_to_edit,
    isFetched: provider_to_edit_fetched,
    refetch: fetch_provider_to_edit,
  } = useQuery({
    queryKey: ["provider-single"],
    queryFn: async function () {
      return await httpCommon.get(
        `providers/get/${searchParams.get("providerID")}`
      );
    },
    enabled: false,
    refetchOnWindowFocus: false,
  });

  function resetShiftStates() {
    setMorningShift({
      shiftType: "MORNING",
      shiftFromTime: "",
      shiftToTime: "",
    });
    setAfternoonShift({
      shiftType: "AFTERNOON",
      shiftFromTime: "",
      shiftToTime: "",
    });
    setFullShift({
      shiftType: "FUll",
      shiftFromTime: "",
      shiftToTime: "",
    });
  }

  const set_to_edit = useCallback(() => {
    fetch_provider_to_edit();
    if (provider_to_edit_fetched && provider_to_edit) {
      const provider = provider_to_edit?.data.data[0];
      setValue("name", provider.name);
      setValue("contact", provider.contact);
      setValue("email", provider.email);
      setValue("medicalCenterID", provider.associatedMedicalID);
      setValue("specializationID", provider.specializationID);
      fetch_rooms();
      setValue("preferrRoomID", provider.preferredRoomID || 0);
      if (provider.availability) {
        resetShiftStates();
        const availability = JSON.parse(provider.availability).map((a: any) => {
          if (a.type === "FULL") {
            setFullShift({
              shiftType: a.type,
              shiftFromTime: a.startTime,
              shiftToTime: a.endTime,
            });
          } else if (a.type === "AFTERNOON") {
            setAfternoonShift({
              shiftType: a.type,
              shiftFromTime: a.startTime,
              shiftToTime: a.endTime,
            });
          } else if (a.type === "MORNING") {
            setMorningShift({
              shiftType: a.type,
              shiftFromTime: a.startTime,
              shiftToTime: a.endTime,
            });
          }

          return {
            shiftType: a.type,
            shiftFromTime: a.startTime,
            shiftToTime: a.endTime,
          };
        });
        setValue("availability", availability);
      }
    }
  }, [
    fetch_provider_to_edit,
    fetch_rooms,
    provider_to_edit?.data.data,
    provider_to_edit_fetched,
    setValue,
  ]);

  useEffect(() => {
    if (searchParams.get("edit") === "true") {
      set_to_edit();
    }
  }, [searchParams, set_to_edit]);

  const syncAvailabilities = useCallback(
    (
      shiftType: "FULL" | "MORNING" | "AFTERNOON",
      _time: "shiftToTime" | "shiftFromTime",
      value: string,
      changed: boolean
    ) => {
      let shifts = getValues("availability");
      if (shiftType === "FULL") {
        if (!changed) {
          if (shifts) {
            shifts.push({
              shiftFromTime: fullShift.shiftFromTime,
              shiftType: "FULL",
              shiftToTime: value,
            });
          } else {
            shifts = [
              {
                shiftFromTime: fullShift.shiftFromTime,
                shiftType: "FULL",
                shiftToTime: value,
              },
            ];
          }
          setValue("availability", shifts);
        }
      } else if (shiftType === "MORNING") {
        if (!changed) {
          if (shifts) {
            shifts.push({
              shiftFromTime: morningShift.shiftFromTime,
              shiftType: "MORNING",
              shiftToTime: value,
            });
          } else {
            shifts = [
              {
                shiftFromTime: morningShift.shiftFromTime,
                shiftType: "MORNING",
                shiftToTime: value,
              },
            ];
          }
          setValue("availability", shifts);
        }
      } else if (shiftType === "AFTERNOON") {
        if (!changed) {
          if (shifts) {
            shifts.push({
              shiftFromTime: afternoonShift.shiftFromTime,
              shiftType: "AFTERNOON",
              shiftToTime: value,
            });
          } else {
            shifts = [
              {
                shiftFromTime: afternoonShift.shiftFromTime,
                shiftType: "AFTERNOON",
                shiftToTime: value,
              },
            ];
          }
          setValue("availability", shifts);
        }
      }
    },
    [fullShift, morningShift, afternoonShift]
  );

  return provider_to_edit_error ? (
    <p>{provider_to_edit_error.message}</p>
  ) : (
    <>
      <div className="w-full flex justify-between items-center mt-4">
        <Link
          to="/providers"
          className="min-w-max flex gap-2 items-center py-2 rounded-lg px-4 border border-hms-green-light "
        >
          <FaArrowCircleLeft /> Back To Providers{" "}
        </Link>
        {providers_bulk_import_status === "pending" ? (
          <Loading
            message="Bulk import is in progress"
            vertical={true}
            contained={true}
          />
        ) : (
          <BulkImport target="PROVIDER" />
        )}
      </div>
      <div className="w-full flex rounded-lg mx-auto mt-6 gap-4">
        {fetching_provider_to_edit ? (
          <Loading message="Fetching provider's information please wait" />
        ) : (
          <form
            onSubmit={handleSubmit((provider: TProvider) => {
              const errors = shiftsSchema.safeParse(watch("availability"));
              if (!errors.success) {
                return;
              } else {
                create_provider(provider);
              }
            })}
            className={
              "flex md:flex-col gap-8 w-full border border-hms-green-dark rounded-lg p-4"
            }
          >
            <section className={"w-full flex flex-col items-center gap-2"}>
              <Label className={"w-full"}>
                <span className="text-lg">Name</span>
                <Input
                  {...register("name")}
                  className="my-2 border-gray-300"
                  placeholder="Provders's name"
                />
              </Label>
              {errors.name && errors.name.message ? (
                <ValidationError message={errors.name.message} />
              ) : null}
              <Label className="flex flex-col items-start gap-2 w-full">
                <span className="text-lg">Specialization</span>
                {fetching_specializations ? (
                  <Loading />
                ) : (
                  <Dropdown
                    defaultOption={
                      specializations_fetched
                        ? searchParams.get("edit") === "true"
                          ? specializations?.data?.data.find(
                              (specializations: TSpecializations) =>
                                specializations.id ===
                                getValues("specializationID")
                            )?.name
                          : getValues("specializationID") &&
                            specializations?.data?.data.find(
                              (specializations: TSpecializations) =>
                                specializations.id ===
                                getValues("specializationID")
                            )?.name
                        : null
                    }
                    onSelect={(option: string) => {
                      setValue(
                        "specializationID",
                        parseInt(
                          specializations?.data.data.find(
                            (specializations: TSpecializations) =>
                              specializations.name === option
                          ).id
                        )
                      );
                      if (getValues("medicalCenterID")) fetch_rooms();
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
              {errors.specializationID &&
              errors.specializationID.message &&
              !watch("specializationID") ? (
                <ValidationError message={errors.specializationID.message} />
              ) : null}
              <Label className="flex flex-col items-start gap-2 w-full">
                <span className="text-lg">Associated Medical Center</span>
                {fetching_medical_centers ? (
                  <Loading />
                ) : (
                  <Dropdown
                    defaultOption={
                      medical_center_fetched
                        ? searchParams.get("edit") === "true"
                          ? medical_centers_data?.data.data.listing.find(
                              (center: any) => {
                                return (
                                  center.id === getValues("medicalCenterID")
                                );
                              }
                            )?.medicalCenterName
                          : medical_centers_data?.data.data.listing.find(
                              (center: any) => {
                                return (
                                  center.id === getValues("medicalCenterID")
                                );
                              }
                            )?.medicalCenterName
                        : null
                    }
                    onSelect={(option: string) => {
                      setValue(
                        "medicalCenterID",
                        medical_centers_data?.data.data.listing.find(
                          (center: any) => center.medicalCenterName === option
                        ).id
                      );
                      if (getValues("specializationID")) fetch_rooms();
                    }}
                    options={
                      medical_center_fetched
                        ? medical_centers_data?.data.data.listing.map(
                            (center: any) => center.medicalCenterName
                          )
                        : []
                    }
                    triggerTitle="Chose Associated Medical Center"
                  />
                )}
              </Label>
              {errors.medicalCenterID &&
              errors.medicalCenterID.message &&
              !watch("medicalCenterID") ? (
                <ValidationError message={errors.medicalCenterID.message} />
              ) : null}

              <Label className={"w-full"}>
                <span className="text-lg">Email</span>
                <Input
                  {...register("email")}
                  className="my-2 border-gray-300"
                  placeholder="Provider's email address"
                />
              </Label>
              {errors.email && errors.email.message ? (
                <ValidationError message={errors.email.message} />
              ) : null}

              <Label className={"w-full flex flex-col gap-2 items-start"}>
                <span className="text-lg">Contact</span>
                <Input
                  {...register("contact")}
                  className="border-gray-300"
                  placeholder="Provider's contact number"
                />
              </Label>
              {errors.contact && errors.contact.message ? (
                <ValidationError message={errors.contact.message} />
              ) : null}
            </section>
            <section className={"w-full flex flex-col justify-between gap-2"}>
              <p
                className={
                  "text-xl font-semibold text-gray-800 text-start w-full"
                }
              >
                Availability
              </p>

              <Label className="flex flex-col items-start gap-2 w-full">
                <span className="text-lg">Full shift timings</span>
                <div className={"flex gap-4 items-center w-full"}>
                  <Input
                    type={"time"}
                    onChange={(e) => {
                      shiftReset("FULL", "shiftFromTime", e.target.value);
                      setFullShift({
                        ...fullShift,
                        shiftFromTime: e.target.value,
                      });
                    }}
                    value={fullShift.shiftFromTime}
                  />
                  <span className={"text-lg text-gray-800"}>To</span>
                  {fullShift.shiftFromTime.length === 0 ? (
                    <p>Select shift start time first</p>
                  ) : (
                    <Input
                      min={to12HourTime(fullShift.shiftToTime)}
                      type={"time"}
                      onChange={(e) => {
                        const changed = shiftReset(
                          "FULL",
                          "shiftToTime",
                          e.target.value
                        );

                        setFullShift({
                          ...fullShift,
                          shiftToTime: e.target.value,
                        });

                        syncAvailabilities(
                          "FULL",
                          "shiftToTime",
                          e.target.value,
                          changed
                        );
                        console.log(watch("availability"));
                      }}
                      value={fullShift.shiftToTime}
                    />
                  )}
                </div>
              </Label>

              {watch("availability") &&
              watch("availability").find((a) => a.shiftType === "FULL") &&
              !validTime(
                watch("availability").find((a) => {
                  return a.shiftType === "FULL";
                })?.shiftFromTime as string,
                watch("availability").find((a) => {
                  return a.shiftType === "FULL";
                })?.shiftToTime as string
              ) ? (
                <ValidationError
                  message={"Shift to time cannot be less than shift from time"}
                />
              ) : null}

              <Label className="flex flex-col items-start gap-2 w-full">
                <span className="text-lg">Morning shift timings</span>
                <div className={"flex gap-4 items-center w-full"}>
                  <Input
                    type={"time"}
                    value={morningShift.shiftFromTime}
                    onChange={(e) => {
                      shiftReset("MORNING", "shiftFromTime", e.target.value);
                      setMorningShift({
                        ...morningShift,
                        shiftFromTime: e.target.value,
                      });
                    }}
                  />
                  <span className={"text-lg text-gray-800"}>To</span>{" "}
                  {morningShift.shiftFromTime.length === 0 ? (
                    <p>Select shift start time first</p>
                  ) : (
                    <Input
                      value={morningShift.shiftToTime}
                      type={"time"}
                      min={morningShift.shiftToTime}
                      onChange={(e) => {
                        const changed = shiftReset(
                          "MORNING",
                          "shiftToTime",
                          e.target.value
                        );

                        setMorningShift({
                          shiftType: "MORNING",
                          shiftFromTime: morningShift.shiftFromTime,
                          shiftToTime: e.target.value,
                        });

                        syncAvailabilities(
                          "MORNING",
                          "shiftToTime",
                          e.target.value,
                          changed
                        );
                      }}
                    />
                  )}
                </div>
              </Label>
              {watch("availability") &&
              watch("availability").find((a) => a.shiftType === "MORNING") &&
              validTime(
                watch("availability").find((a) => {
                  return a.shiftType === "MORNING";
                })?.shiftFromTime as string,
                watch("availability").find((a) => {
                  return a.shiftType === "MORNING";
                })?.shiftToTime as string
              ) === false ? (
                <ValidationError
                  message={"Shift to time cannot be less than shift from time"}
                />
              ) : null}

              <Label className="flex flex-col items-start gap-2 w-full">
                <span className="text-lg">Afternoon shift timings</span>
                <div className={"flex gap-4 items-center w-full"}>
                  <Input
                    type={"time"}
                    value={afternoonShift.shiftFromTime}
                    onChange={(e) => {
                      shiftReset("AFTERNOON", "shiftFromTime", e.target.value);
                      setAfternoonShift({
                        ...afternoonShift,
                        shiftFromTime: e.target.value,
                      });
                    }}
                  />
                  <span className={"text-lg text-gray-800"}>To</span>
                  {afternoonShift.shiftFromTime.length === 0 ? (
                    <p>Select shift start time first</p>
                  ) : (
                    <Input
                      min={to12HourTime(afternoonShift.shiftToTime)}
                      value={afternoonShift.shiftToTime}
                      type={"time"}
                      onChange={(e) => {
                        const changed = shiftReset(
                          "AFTERNOON",
                          "shiftToTime",
                          e.target.value
                        );

                        setAfternoonShift({
                          ...afternoonShift,
                          shiftToTime: e.target.value,
                        });

                        syncAvailabilities(
                          "AFTERNOON",
                          "shiftToTime",
                          e.target.value,
                          changed
                        );
                      }}
                    />
                  )}
                </div>
              </Label>
              {watch("availability") &&
              watch("availability").find((a) => a.shiftType === "AFTERNOON") &&
              validTime(
                watch("availability").find((a) => {
                  return a.shiftType === "AFTERNOON";
                })?.shiftFromTime as string,
                watch("availability").find((a) => {
                  return a.shiftType === "AFTERNOON";
                })?.shiftToTime as string
              ) === false ? (
                <ValidationError
                  message={"Shift to time cannot be less than shift from time"}
                />
              ) : null}
              {errors.availability &&
              errors.availability.message &&
              !(watch("availability") && watch("availability").length > 0) ? (
                <ValidationError message={errors.availability.message} />
              ) : null}

              <Label className="flex flex-col items-start gap-2 w-full">
                {
                  <>
                    <span className="text-lg">Preferred Room</span>
                    {fetching_rooms ? (
                      <Loading />
                    ) : rooms_data?.data.data.length > 0 ? (
                      <Dropdown
                        defaultOption={
                          searchParams.get("edit") === "true" && rooms_fetched
                            ? rooms_data?.data.data.find((room: any) => {
                                return room.id === getValues("preferrRoomID");
                              })?.name
                            : null
                        }
                        onSelect={(option: string) => {
                          setValue(
                            "preferrRoomID",
                            rooms_data?.data.data.find((room: any) => {
                              return room.name === option;
                            }).id || 0
                          );
                        }}
                        options={
                          rooms_fetched && rooms_data?.data
                            ? rooms_data?.data.data.map(
                                (room: any) => room.name
                              )
                            : []
                        }
                        triggerTitle="Chose Preferred Room"
                      />
                    ) : (
                      <p className="w-full text-lg ">
                        No room available for selected specialization and
                        medical center
                      </p>
                    )}
                  </>
                }
              </Label>
              {errors.preferrRoomID &&
              errors.preferrRoomID.message &&
              !watch("preferrRoomID") ? (
                <ValidationError message={errors.preferrRoomID.message} />
              ) : null}
              {status === "pending" ? (
                <div className="px-4 w-full py-2 rounded-lg bg-gray-200">
                  <Loading />
                </div>
              ) : (
                <Button
                  onClick={() => {
                    console.log(errors);
                  }}
                  type="submit"
                  className="mt-2 w-full bg-hms-green-light hover:bg-hms-green-dark text-white"
                >
                  {searchParams.get("edit") === "true"
                    ? "Save changes"
                    : "Add Provider"}
                </Button>
              )}
            </section>
          </form>
        )}
      </div>
    </>
  );
}
