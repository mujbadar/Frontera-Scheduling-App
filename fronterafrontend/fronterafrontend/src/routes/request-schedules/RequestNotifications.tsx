import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import Loading from "../../../components/loading";
import React, { useEffect, useState } from "react";
import ValidationError from "../../../components/validation-error";
import dayjs from "dayjs";
import httpCommon from "../../helper/httpCommon";
import { useToast } from "../../../components/ui/use-toast";
import Message from "../../../components/toasts";

let fullShiftId: null = null;

type AddAvailabilityRequest = {
  requestID: string;
  startDate: any;
  endDate: any;
  shiftID: string;
  holidays: any;
};

export default function RequestNotifications() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // State to hold provider availability data
  const [setProviderAvailability] = useState<any>(null);
  const [showAll, setShowAll] = useState(false); // State to track if all records are shown

  // Fetch provider availability when the component mounts
  useEffect(() => {
    const fetchProviderAvailability = async () => {
      try {
        const response = await httpCommon.get("requests/provider-availability");
        if (response?.data.success) {
          const fullShift = response.data.data.find(
            (shift: { shiftType: string }) => shift.shiftType === "FULL"
          );
          fullShiftId = fullShift ? fullShift.id : null;
          setProviderAvailability(response?.data?.data); // Save the response in state
        }
      } catch (error) {
        console.error("Failed to fetch provider availability", error);
      }
    };
    fetchProviderAvailability();
  }, []);

  const { data, isFetching, isFetched } = useQuery({
    queryKey: ["update-requests"],
    queryFn: async () => await httpCommon.get("requests/listing"),
  });

  let requests;
  if (isFetched) {
    if (data?.data.success) {
      requests = data?.data.data;
    }
  }

  const { } = useMutation({
    
    mutationKey: ["add-availability"],
    mutationFn: async (request: AddAvailabilityRequest) =>
      await httpCommon.post("requests/availability/add", {
        requestID: `${request.requestID}`,
        availability: [
          { startDate: request.startDate, endDate: request.endDate, shiftID: fullShiftId },
        ],
        extraAvailability: [],
      }),
    onSuccess(data, variables) {
      if (data?.data.success) {
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
                      {Object.keys(data?.data.data.data).length - 1} more dates.
                    </p>
                  ) : null}
                </div>
              }
              type="success"
            />
          ),
        });
        navigate(
          `/request-schedules/quick-update?requestID=${variables.requestID}&alreadyAdded=true&startDateData=${variables.startDate}&endDateData=${variables.endDate}&holidays=${variables.holidays}`
        );
      }
    },
  });

  const handleAddAvailability = (
    requestID: any,
    startDate: any,
    endDate: any,
    holidays: any
  ) => {
    navigate(
      `/request-schedules/quick-update?requestID=${requestID}&alreadyAdded=true&startDateData=${startDate}&endDateData=${endDate}&holidays=${holidays}`
    );
  };

  return (
    <main className="mx-auto flex flex-col items-center flex flex-col w-[96%] mx-auto h-full">
      <h2 className="text-4xl w-full text-start text-hms-green-dark font-semibold my-6">
        Requests for schedule update
      </h2>
      {isFetching ? (
        <Loading message={"Fetching request data"} />
      ) : isFetched && data?.data.success ? (
        <>
          {/* Display only one request initially or all if showAll is true */}
          {(showAll ? requests : requests.slice(0, 1)).map((request: any) => (
            <React.Fragment key={request.id}>
              <div className="w-full pb-4 mb-4 rounded-lg bg-gray-50 shadow-[rgba(40,40,40,0.1)_0px_2px_8px_0px]">
                <h3 className="font-semibold text-xl text-white px-4 py-2 rounded-tr-lg rounded-tl-lg bg-hms-green-dark">
                  Request Details
                </h3>
                <div className="flex flex-col gap-4 p-4">
                  <div className="flex w-full justify-between items-center">
                    <p>Schedule starting date</p>
                    <p className="bg-blue-100 text-blue-900 font-semibold px-4 py-2 rounded-full">
                      {request.startDate}
                    </p>
                  </div>
                  <div className="flex w-full justify-between items-center">
                    <p>Schedule end date</p>
                    <p className="bg-blue-100 text-blue-900 font-semibold px-4 py-2 rounded-full">
                      {request.endDate}
                    </p>
                  </div>
                  <div className="flex w-full justify-between items-center">
                    <p>Deadline</p>
                    <p className="bg-blue-100 text-blue-900 font-semibold px-4 py-2 rounded-full">
                      {request.deadline}
                    </p>
                  </div>

 {/* Show only one message based on conditions */}
 {request.alreadyAdded === "1" ? (
        <p className="text-green-600 font-semibold mt-2">
          You have confirmed your shifts for this request.
        </p>
      ) : dayjs(request.deadline + 2).isBefore(dayjs()) ? (
        <p className="text-red-600 font-semibold mt-2">
          The deadline for adding schedules for this request has passed.
        </p>
      ) : null}
                </div>
                {request.holidays || request.weekendsOff ? (
                  <h3 className="mb-2 font-semibold text-lg px-4">Time off</h3>
                ) : null}
                <div className="w-full flex px-4 gap-2 flex-wrap">
                  {request.holidays ? (
                    JSON.parse(request.holidays).map((holiday: any) => (
                      <p
                        key={holiday}
                        className="px-4 py-2 bg-green-50 rounded-full font-semibold text-green-900"
                      >
                        {dayjs(holiday).format("YYYY-MM-DD")}
                      </p>
                    ))
                  ) : request.weekendsOff ? (
                    <p className="px-4 py-2 bg-green-50 rounded-full font-semibold text-green-900">
                      Weekends
                    </p>
                  ) : null}
                </div>
              </div>
             {/* Show add availability button only if deadline has not passed and alreadyAdded is not "1" */}
  {dayjs(request.deadline + 2).isAfter(dayjs()) &&
    request.allowUpdate === "1" &&
    request.alreadyAdded !== "1" && (
      <button
        className="px-4 py-2 rounded-lg bg-hms-green-dark hover:bg-hms-green-light text-lg text-white self-end my-4"
        onClick={() =>
          handleAddAvailability(
            request.id,
            request.startDate,
            request.endDate,
            request.holidays
          )
        }
      >
        Add availability
      </button>
    )}
</React.Fragment>
          ))}
          {/* See more / See less button */}
          {requests.length > 1 && (
            <button
              className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-semibold"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "See less" : "See more"}
            </button>
          )}
        </>
      ) : (
        <ValidationError message={data?.data.message} />
      )}
    </main>
  );
}
