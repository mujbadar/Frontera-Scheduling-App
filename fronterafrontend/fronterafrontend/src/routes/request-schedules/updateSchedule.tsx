import dayjs from "dayjs";
import { getDates } from "./../../../lib/utils";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import Loading from "../../../components/loading";
import Dropdown from "../../../components/dropdown";
import SelectedDate from "./selected-dates";
import { isAdded } from "./is-added";
import UpdateHeader from "./upate-header";
import AdvancedView from "./advancedView";
import httpCommon from "../../helper/httpCommon";
import { useToast } from "../../../components/ui/use-toast";
import Message from "../../../components/toasts";

export default function UpdateSchedule() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [selectedDates, setSelectedDates] = useState<
    {
      startDate: string | null;
      endDate: string | null;
      shiftID: number | null;
    }[]
  >([]);

  const alreadyAdded = searchParams.get("alreadyAdded") === "true";
  // const convertToDate = (dateStr: string | null): Date | null => {
  //   return dateStr ? dayjs(dateStr).toDate() : null;
  // };
  const [selectedDate, setSelectedDate] = useState<{
    startDate: string | null;
    endDate: string | null;
    shiftID: number | null;
  }>({
    startDate: null,
    endDate: null,
    shiftID: null,
  });

  const {
    data: request_data,
    isFetching: fetching_request,
    isFetched,
  } = useQuery({
    queryKey: ["single-request"],
    queryFn: async () =>
      await httpCommon.get(`requests/listing/${searchParams.get("requestID")}`),
  });
  // const convertStringToDateOrUndefined = (dateString: string | null): Date | undefined => {
  //   return dateString ? new Date(dateString) : undefined;
  // };

  let updateRequest: any;
  if (isFetched && request_data) {
    updateRequest = request_data?.data.data[0];
  }

  const {
    data: provider_availability_data,
    isFetching: fetching_provider_availability,
    isFetched: provider_availability_fetched,
  } = useQuery({
    queryKey: ["provider-availability"],
    queryFn: async () => await httpCommon.get(`requests/provider-availability`),
  });

  let provider_availabilities: any[] = [];
  const [isAdAvailibilityAdded, setIsAdAvailibilityAdded] = useState(false);
  if (provider_availability_fetched) {
    provider_availabilities = Array.isArray(
      provider_availability_data?.data.data
    )
      ? provider_availability_data?.data.data
      : [provider_availability_data?.data.data];
  }

  let scheduleDates: any[] = [];
  if (isFetched && updateRequest) {
    scheduleDates = getDates(updateRequest.startDate, updateRequest.endDate);
  }

  function fillAvailabilityDate(date: any) {
    const currentDate = dayjs(date).format("YYYY-MM-DD");
    // start date for availability
    if (selectedDate.startDate) {
      if (selectedDate.startDate === currentDate) {
        setSelectedDate({
          ...selectedDate,
          startDate: null,
        });

        return;
      }

      // end date for availability
      if (selectedDate.endDate && selectedDate.endDate === currentDate) {
        setSelectedDate({
          ...selectedDate,
          endDate: null,
        });
      } else {
        setSelectedDate({
          ...selectedDate,
          endDate: currentDate,
        });
      }
    } else {
      setSelectedDate({
        ...selectedDate,
        startDate: currentDate,
      });
    }
  }

  const {
    status,
    reset: reset_add_availability_mutation,
    mutate: add_availability,
  } = useMutation({
    mutationKey: ["add-availability"],
    mutationFn: async () =>
      await httpCommon.post("requests/availability/add", {
        requestID: `${updateRequest.id}`,
        availability: selectedDates,
        extraAvailability: [],
      }),
    onSuccess(data) {
      if (data?.data.success) {
        setTimeout(() => {
          toast({
            description: (
              <Message
                message={
                  <div className={"w-full flex flex-col gap-2"}>
                    <p>{data?.data.data.message}</p>
                    {Object.keys(data?.data.data.data).length > 0 ? (
                      <p className={"text-red-600 text-lg font-semibold mb-0"}>
                        Conflicting schedules found for{" "}
                        {Object.keys(data?.data.data.data)[0]} and{" "}
                        {Object.keys(data?.data.data.data).length - 1} more
                        dates.
                      </p>
                    ) : null}
                  </div>
                }
                type="success"
              />
            ),
          });
          reset_add_availability_mutation();
           navigate(`/request-schedules/quick-update?requestID=${
            updateRequest.id
          }&alreadyAdded=true`);
          setIsAdAvailibilityAdded(true); // Set the state to true upon success
        }, 1000);
      }
    },
  });
  // const startDate = convertStringToDateOrUndefined(selectedDate.startDate);
  const dateStr = searchParams.get("startDateData");
  const dateObj = dateStr ? new Date(dateStr) : new Date();
  const dateString = dateObj.toISOString().split('T')[0]; // Format as "YYYY-MM-DD"


  return fetching_request || fetching_provider_availability ? (
    <div className="w-full h-full flex items-center justify-center">
      <Loading message="Fetching request information" />
    </div>
  ) : (
    <section className="mx-auto flex flex-col items-center flex flex-col w-[96%] mx-auto h-full">
      <div className="w-full flex justify-between items-center">
        <h1 className="my-4 min-w-max text-3xl text-hms-green-dark font-bold">
          Update Your Availability 
        </h1>
      </div>
      {alreadyAdded ? (
        <AdvancedView
          provider_availabilities={provider_availabilities}
          updateRequest={updateRequest}
          startDate={new Date(dateString)} // Pass Date | undefined
          // startDate={new Date(searchParams.get("startDateData"))}

        />
      ) : (
        <section className="my-4 flex flex-col gap-4">
          <UpdateHeader />
          <div className="w-full flex gap-2 flex-wrap items-center">
            {scheduleDates?.map((sd: Date) => {
              const currentDateWithDayName = `${dayjs(sd).format(
                "dddd"
              )} ${dayjs(sd).format("DD-MM-YYYY")}`;

              const holidays = updateRequest.extraHolidays
                ? JSON.parse(updateRequest.extraHolidays).map((eh: any) =>
                    dayjs(eh).format("DD/MM/YYYY")
                  )
                : [];

              // if weekends are off
              if (
                (sd.toString().toLowerCase().includes("sun") || 
                sd.toString().toLowerCase().includes("sat")) 
                &&
                updateRequest.weekendsOff
              ) {
                return (
                  <div
                    key={sd.toString()}
                    className={`${
                      dayjs(sd).isBefore(dayjs(selectedDate.startDate))
                        ? "pointer-events-none cursor-not-allowed"
                        : ""
                    } px-4 py-2 pointer-events-none text-white cursor-not-allowed bg-gray-700 font-semibold rounded-lg`}
                  >
                    {currentDateWithDayName}
                  </div>
                );

                // if  there are extra holidays
              } else if (holidays.includes(dayjs(sd).format("DD/MM/YYYY"))) {
                return (
                  <div
                    key={sd.toString()}
                    className={`
                    ${
                      dayjs(sd).isBefore(dayjs(selectedDate.startDate))
                        ? "pointer-events-none cursor-not-allowed"
                        : ""
                    } px-4 py-2 text-white bg-gray-700 cursor-not-allowed font-semibold rounded-lg`}
                  >
                    {currentDateWithDayName}
                  </div>
                );

                // if current date is in list of dates selected for any previous shift
              } else if (isAdded(selectedDates, sd.toString())) {
                return (
                  <div
                    key={sd.toString()}
                    className="px-4 py-2 text-white bg-gray-300 cursor-not-allowed font-semibold rounded-lg"
                  >
                    {currentDateWithDayName}
                  </div>
                );
              }

              return (
                <div
                  key={sd.toString()}
                  onClick={() => {
                    fillAvailabilityDate(sd);
                  }}
                  className={`${
                    (selectedDate.startDate ===
                      dayjs(sd).format("YYYY-MM-DD") ||
                      selectedDate.endDate ===
                        dayjs(sd).format("YYYY-MM-DD")) &&
                    "border-2 border-hms-green-dark"
                  } 
                   ${
                     dayjs(sd).isBefore(dayjs(selectedDate.startDate))
                       ? "pointer-events-none cursor-not-allowed"
                       : ""
                   }
                  px-4 py-2 hover:bg-hms-green-dark hover:text-white cursor-pointer bg-hms-green-bright text-hms-green-dark font-semibold rounded-lg`}
                >
                  {currentDateWithDayName}
                </div>
              );
            })}
            <div className="px-4 py-2 text-white cursor-pointer bg-red-700 font-semibold rounded-lg">
              {updateRequest.deadline}
            </div>
          </div>
          <div className="w-full flex gap-2 items-center flex-wrap">
            {selectedDates.map(
              (sd: {
                startDate: string | null;
                endDate: string | null;
                shiftID: number | null;
              }) => {
                return (
                  <SelectedDate
                    selectedDate={sd}
                    provider_availabilities={provider_availabilities}
                  />
                );
              }
            )}
            {selectedDate.startDate ? (
              <SelectedDate
                selectedDate={selectedDate}
                provider_availabilities={provider_availabilities}
              />
            ) : null}
          </div>

          {selectedDate.endDate ? (
            <div className="w-full">
              <Dropdown
                triggerTitle={"Select Shifts"}
                options={
                  provider_availabilities
                    ? provider_availabilities.map(
                        (pa: any) =>
                          `${pa.shiftType} (${pa.shiftFrom} To ${pa.shiftTo})`
                      )
                    : []
                }
                onSelect={(option: string) =>
                  setSelectedDate({
                    ...selectedDate,
                    shiftID: provider_availabilities.find(
                      (pa) =>
                        `${pa.shiftType} (${pa.shiftFrom} To ${pa.shiftTo})` ===
                        option
                    ).id,
                  })
                }
              />
            </div>
          ) : null}
        </section>
      )}

      <div className="w-full flex justify-end items-center gap-4">
        {selectedDate.shiftID === null ? null : (
          <button
            onClick={() => {
              setSelectedDates([...selectedDates, selectedDate]);
              setSelectedDate({
                startDate: null,
                endDate: null,
                shiftID: null,
              });
            }}
            disabled={selectedDate.shiftID === null}
            className={`px-4 float-right my-4 block text-white rounded-lg py-2 ${
              selectedDate.shiftID
                ? "bg-hms-green-dark hover:bg-hms-green-light"
                : "bg-gray-700 pointer-events-none"
            }`}
          >
            Confirm
          </button>
        )}
        {isAdAvailibilityAdded === false &&
        selectedDate.startDate === null &&
        selectedDate.endDate === null &&
        selectedDate.shiftID === null &&
        selectedDates.length > 0 ? (
          <button
            onClick={() => { 
              add_availability();
            }}
            disabled={status === "pending" || status === "success"}
            className="px-4 py-2 rounded-lg bg-hms-green-dark text-white"
          >
            {status === "pending" ? <Loading /> : "Add Availbility"}
          </button>
        ) : null}
      </div>
    </section>
  );
}
