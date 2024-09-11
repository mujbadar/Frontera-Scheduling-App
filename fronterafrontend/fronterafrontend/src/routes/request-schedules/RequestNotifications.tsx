import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import Loading from "../../../components/loading";
import React, { useEffect, useState } from "react";
import ValidationError from "../../../components/validation-error";
import dayjs from "dayjs";
import httpCommon from "../../helper/httpCommon";
import { useToast } from "../../../components/ui/use-toast";
import Message from "../../../components/toasts";
let fullShiftId: null = null; // Define fullShiftId globally within the file
type AddAvailabilityRequest = {
  requestID: string;
  startDate: any;
  endDate: any;
  shiftID: string;
};
export default function RequestNotifications() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // State to hold provider availability data
  const [setProviderAvailability] = useState<any>(null);


  // Fetch provider availability when the component mounts
  useEffect(() => {
    const fetchProviderAvailability = async () => {
      try {
        const response = await httpCommon.get("requests/provider-availability");
        if (response?.data.success) {
          // Find the object with shiftType "FULL"
const fullShift = response.data.data.find((shift: { shiftType: string; }) => shift.shiftType === "FULL");

// Get the id of the found object
fullShiftId = fullShift ? fullShift.id : null;

          setProviderAvailability(response.data.data); // Save the response in state
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

  const { mutate: addAvailability } = useMutation({
    mutationKey: ["add-availability"],
    mutationFn: async (request:AddAvailabilityRequest) =>
      await httpCommon.post("requests/availability/add", {
        requestID: `${request.requestID}`,
        availability: [
          { startDate: request.startDate, endDate: request.endDate, shiftID: fullShiftId },
        ], // Pass any additional required data here
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
                    <p className={"text-red-600 text-lg font-semibold"}>
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

        // Navigate to the desired page after the API call is successful
        navigate(
          `/request-schedules/quick-update?requestID=${variables.requestID}&alreadyAdded=true&startDateData=${variables.startDate}`
        );
      }
    },
  });

  const handleAddAvailability = (
    requestID: any,
    startDate: any,
    endDate: any,
    shiftID: any
  ) => {
    addAvailability({ requestID, startDate, endDate, shiftID });
  };

  return (
    <main className="w-full mx-auto flex flex-col items-center">
      <h2 className="text-4xl w-full text-start text-hms-green-dark font-semibold my-6">
        Requests for schedule update
      </h2>
      {isFetching ? (
        <Loading message={"Fetching request data"} />
      ) : isFetched && data?.data.success ? (
        requests.map((request:any) => {
          return (
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
                </div>
                {request.holidays || request.weekendsOff ? (
                  <h3 className="mb-2 font-semibold text-lg px-4">Holidays</h3>
                ) : null}
                <div className="w-full flex px-4 gap-2 flex-wrap">
                  {request.holidays ? (
                    JSON.parse(request.holidays).map((holiday:any) => {
                      return (
                        <p
                          key={holiday}
                          className="px-4 py-2 bg-green-50 rounded-full font-semibold text-green-900"
                        >
                          {dayjs(holiday).format("YYYY-MM-DD")}
                        </p>
                      );
                    })
                  ) : request.weekendsOff ? (
                    <p className="px-4 py-2 bg-green-50 rounded-full font-semibold text-green-900">
                      Weekends
                    </p>
                  ) : null}
                </div>
              </div>
              {dayjs(request.deadline + 2).isBefore(dayjs()) ? null : request.allowUpdate === "1" && request.alreadyAdded !== "1" ? (
                <button
                  className="px-4 py-2 rounded-lg bg-hms-green-dark hover:bg-hms-green-light text-lg text-white self-end my-4"
                  onClick={() =>
                    handleAddAvailability(
                      request.id,
                      request.startDate,
                      request.endDate,
                      request.shiftID
                    )
                  }
                >
                  Add availability
                </button>
              ) : null}
            </React.Fragment>
          );
        })
      ) : (
        <ValidationError message={data?.data.message} />
      )}
    </main>
  );
}
