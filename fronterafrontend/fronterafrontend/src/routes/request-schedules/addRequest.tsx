import { Label } from "../../../components/ui/label.tsx";
import Dropdown from "../../../components/dropdown.tsx";
import { useState, useEffect } from "react";
import { Input } from "../../../components/ui/input.tsx";
import HolidaysPickerDropdown from "../../../components/HolidaysPickerDropdown.tsx";
import { Button } from "../../../components/ui/button.tsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import Loading from "../../../components/loading.tsx";
import { TCenter, TProvider, TRequest, requestSchema } from "@/zod/schema.ts";
import ValidationError from "../../../components/validation-error.tsx";
import { ZodFormattedError } from "zod";
import { useToast } from "./../../../components/ui/use-toast.ts";
import httpCommon from "../../helper/httpCommon.ts";
import Message from "../../../components/toasts.tsx";
import Chip from "../../../components/ui/chip.tsx"; // Import the Chip component

export default function AddRequest() {
  const { toast } = useToast();
  const [errors, setErrors] = useState<ZodFormattedError<TRequest>>();
  const [holidays, setHolidays] = useState<Date[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [deadline, setDeadLine] = useState<string>("");
  const [weekendsOff, setWeekendsOff] = useState<boolean>(false);
  const [providerID, setProviderID] = useState<number | null>(null);
  const [medicalCenterID, setmedicalCenterID] = useState<number | null>(null);

  const options = [
    "All Providers",
    "Providers associated with a particular Medical Center",
    "A specific Provider",
  ];
  const removeHoliday = (date: Date) => {
    setHolidays(holidays.filter((holiday) => holiday !== date));
  };

  const [currentParticipant, setCurrentParticipant] = useState<null | number>(
    null
  );

  const {
    data: medical_centers_data,
    isFetching: fetching_medical_centers,
    isFetched: medical_center_fetched,
    refetch: fetch_medical_centers,
  } = useQuery({
    queryKey: ["medical-centers-for-request"],
    queryFn: async function () {
      return await httpCommon.get(
        "medical-centers/get?region=0&page=0&limit=100"
      );
    },
    enabled: false,
    refetchOnWindowFocus: false,
    retry: false,
  });
  let centers: TCenter[] = [];

  if (medical_center_fetched && medical_centers_data) {
    const centersData = medical_centers_data?.data.data.listing;
    centers = [].concat(...centersData);
  }
  const {
    data: providers_data,
    isFetched: providers_fetched,
    isFetching: fetching_providers,
    refetch: fetch_providers,
  } = useQuery({
    queryKey: ["providers"],
    queryFn: async function () {
      return await httpCommon.get("providers/get?region=0&page=0&limit=100");
    },
    enabled: false,
    refetchOnWindowFocus: false,
    retry: false,
  });

  let providers: TProvider[] = [];

  if (providers_fetched && providers_data) {
    providers = [].concat(...providers_data?.data.data.listing);
  }

  const [customErrors, setCustomErrors] = useState<{
    [key: string]: string | null;
  }>({});

  const setParticipants = (option: string) => {
    if (option === options[1]) {
      setCurrentParticipant(1);
    } else if (option === options[2]) {
      setCurrentParticipant(2);
    } else if (option === options[0]) {
      setCurrentParticipant(0);
    } else {
      setCurrentParticipant(null);
    }
  };

  useEffect(() => {
    if (currentParticipant === 1) {
      fetch_medical_centers();
    } else if (currentParticipant === 2) {
      fetch_providers();
    }
  }, [currentParticipant]);

  const {
    status,
    mutate: create_request,
    data,
    reset,
  } = useMutation({
    mutationKey: ["create-request"],
    mutationFn: async () =>
      await httpCommon.post("requests/add", {
        medicalCenterID,
        providerID,
        startDate,
        endDate,
        deadline,
        weekendsOff,
        holidayDates: holidays,
      }),
    onSuccess(data) {
      if (data?.data.success) {
        toast({
          description: (
            <Message message="Request added successfully" type="success" />
          ),
        });
        setHolidays([]);
        setWeekendsOff(false);
        setCurrentParticipant(null);
        setCustomErrors({});
        setDeadLine("");
        setEndDate("");
        setStartDate("");
        setProviderID(null);
        setmedicalCenterID(null);
        setErrors(undefined);
        reset();
      }
    },
  });

  async function addRequest() {
    const res = requestSchema.safeParse({
      weekendsOff,
      holidays,
      startDate,
      endDate,
      participants: currentParticipant,
      deadline,
    });

    if (!res.success) {
      setErrors(res.error.format());
    } else if (currentParticipant === 1 && medicalCenterID === null) {
      setCustomErrors({
        ...customErrors,
        medicalCenterID: "Please choose medical center",
      });
    } else if (currentParticipant === 2 && !providerID === null) {
      setCustomErrors({
        ...customErrors,
        providerID: "Please choose provider",
      });
    } else {
      create_request();
    }
  }

  return (
    <section className="pb-6 w-full">
      <h2 className={"text-3xl my-6 font-semibold text-hms-green-light"}>
        Create Schedule Request
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addRequest();
        }}
        className={"flex flex-col gap-4"}
      >
        <Label className={"w-full flex flex-col items-start gap-2"}>
          <span className={"text-lg"}>Choose Participants</span>
          <Dropdown
            triggerTitle={"Choose Participants"}
            options={options}
            resetCondition={data?.data.success}
            onSelect={(option) => {
              setParticipants(option);
              /* @ts-ignore*/
              setErrors({ ...errors, participants: undefined });
            }}
          />
          {errors?.participants ? (
            <ValidationError message={"Please chose participants"} />
          ) : null}
        </Label>
        {currentParticipant && currentParticipant === 1 ? (
          <Label className={"w-full flex flex-col items-start gap-2"}>
            <span className={"text-lg"}>Choose Medical Center</span>
            {fetching_medical_centers ? (
              <Loading />
            ) : (
              <Dropdown
                triggerTitle={"Choose Medical Center"}
                options={centers.map((center: any) => center.medicalCenterName)}
                onSelect={(option: string) => {
                  const mci: any = centers.find(
                    (center: any) => center.medicalCenterName === option
                  );
                  setmedicalCenterID(mci.id);
                  setCustomErrors({ ...customErrors, medicalCenterID: null });
                }}
              />
            )}
            {customErrors?.medicalCenterID && customErrors.medicalCenterID ? (
              <ValidationError message={customErrors.medicalCenterID} />
            ) : null}
          </Label>
        ) : null}
        {currentParticipant && currentParticipant === 2 ? (
          <Label className={"w-full flex flex-col items-start gap-2"}>
            <span className={"text-lg"}>Choose Provider</span>
            {fetching_providers ? (
              <Loading />
            ) : (
              <Dropdown
                triggerTitle={"Choose Provider"}
                options={providers.map((provider: any) => provider.name)}
                onSelect={(option: string) => {
                  const pi: any = providers.find(
                    (provider: any) => provider.name === option
                  );
                  setProviderID(pi.id);
                  setCustomErrors({ ...customErrors, providerID: null });
                }}
              />
            )}
            {customErrors?.providerID && customErrors.providerID ? (
              <ValidationError message={customErrors.providerID} />
            ) : null}
          </Label>
        ) : null}
        <p className={"text-xl font-bold my-2"}>Schedule Requirement</p>
        <div className={"w-full grid grid-cols-2 gap-2"}>
          <Label>
            <span className={"text-lg"}>Start Date</span>
            <Input
              type={"date"}
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setHolidays([]);

                // @ts-ignore
                setErrors({ ...errors, startDate: undefined });
              }}
            />
            {errors?.startDate && errors.startDate._errors ? (
              <ValidationError message={errors.startDate._errors[0]} />
            ) : null}
          </Label>
          <Label>
            <span className={"text-lg"}>End Date</span>
            <Input
              min={startDate}
              type={"date"}
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setHolidays([]);

                // @ts-ignore
                setErrors({ ...errors, endDate: undefined });
              }}
            />
            {errors?.endDate ? (
              <ValidationError message={errors.endDate._errors[0]} />
            ) : null}
          </Label>
        </div>
        {startDate.length > 0 && endDate.length > 0  ? (
         <Label className={"w-full flex flex-col items-start gap-2"}>
         <span className={"text-lg"}>Pick Holidays</span>
         <HolidaysPickerDropdown
           triggerTitle={"Pick holidays"}
           holidays={holidays}
           setHolidays={setHolidays}
           startDate={startDate}
           endDate={endDate}
           eachWeekEnd={weekendsOff}
         />
         {/* Render chips for selected holidays */}
         <div className="mt-2 flex flex-wrap">
           {holidays.map((holiday) => (
             <Chip
               key={holiday.toISOString()}
               label={holiday.toDateString()}
               onRemove={() => removeHoliday(holiday)}
             />
           ))}
         </div>
       </Label>
        ) : null}
        <Label
          htmlFor={"each-week-end"}
          className={
            "border border-gray-200 flex rounded-lg bg-gray-50 px-4 py-2 items-center cursor-pointer gap-2"
          }
        >
          <input
            id={"each-week-end"}
            type={"checkbox"}
            checked={weekendsOff}
            onChange={(e) => {
              setWeekendsOff(e.target.checked);
              setCustomErrors({ ...customErrors, holidayDates: null });
            }}
          />

          <span className={"text-lg"}>Each weekend (As Holiday)</span>
        </Label>
        <Label className={"w-full flex flex-col items-start gap-2"}>
          <span className={"text-lg"}>Deadline</span>
          <Input
            type={"date"}
            value={deadline}
            onChange={(e) => {
              setDeadLine(e.target.value);
              // @ts-ignore
              setErrors({ ...errors, deadline: undefined });
            }}
          />
          {errors?.deadline ? (
            <ValidationError message={errors.deadline._errors[0]} />
          ) : null}
        </Label>
        <Button
          type="submit"
          disabled={status === "pending"}
          className={`${
            status === "pending"
              ? "bg-gray-300 pointer-events-none text-white"
              : "bg-hms-green-dark text-white"
          } text-center  rounded-lg py-2 text-lg hover:bg-hms-green-light`}
        >
          {status === "pending" ? <Loading /> : "Create Request"}
        </Button>
      </form>
    </section>
  );
}
