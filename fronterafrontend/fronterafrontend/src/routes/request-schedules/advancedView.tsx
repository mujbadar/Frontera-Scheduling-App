import dayjs from "dayjs";
import { Calendar } from "rsuite";
import UpdatePopup from "./updatePopup";
import ConfirmDelete from "../../../components/ConfirmDelete";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import Loading from "../../../components/loading";
import { useToast } from "../../../components/ui/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import Message from "../../../components/toasts";
import AddPopup from "./addPopup";
import httpCommon from "../../helper/httpCommon";


type Props = {
  updateRequest: any;
  provider_availabilities: any[];
  forAdmin?: boolean;
  startDate: Date | undefined;
};

function AdvancedView({
  provider_availabilities,
  startDate
}: Props) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [availabilities, setUpdatedCustomAvailabilities] = useState<any[] | undefined>([]);
  const [providerAvailability, setProviderAvailability] = useState<any[]>([]);
  const [loading, setLoading] = useState(false); // New loading state

  // Extract parameters from the URL
  const requestID = searchParams.get("requestID");
  // const alreadyAdded = searchParams.get("alreadyAdded") === "true";
  const startDateData = searchParams.get("startDateData");
  const endDateData = searchParams.get("endDateData");

  useEffect(() => {
    const fetchProviderAvailability = async () => {
      try {
        const response = await httpCommon.get("requests/provider-availability");
        if (response?.data.success) {
          const fullShift = response.data.data.find(
            (shift: { shiftType: string }) => shift.shiftType === "FULL"
          );
  
          // If fullShift is found, set the shiftFrom and shiftTo values
          if (fullShift) {
            const { shiftFrom, shiftTo, id: shiftID } = fullShift;
            setProviderAvailability(response.data.data); // Save the response in state
  
            const start = dayjs(startDateData || dayjs().format("YYYY-MM-DD"));
            const end = dayjs(endDateData || dayjs().format("YYYY-MM-DD"));
            const holidays = JSON.parse(decodeURIComponent(searchParams.get("holidays") || "[]"));
            
            const newAvailabilities = [];
  
            for (let date = start; date.isBefore(end) || date.isSame(end); date = date.add(1, "day")) {
              // Skip if the date is a holiday
              const isHoliday = holidays.some((holiday: string) =>
                dayjs(holiday).isSame(date, "day")
              );
  
              if (isHoliday) {
                continue; // Skip this date, it's a holiday
              }
  
              newAvailabilities.push({
                dateOfMonth: date.format("YYYY-MM-DD"),
                date: date.format("YYYY-MM-DD"),
                shiftType: fullShift.shiftType,
                shiftFrom: shiftFrom,
                shiftTo: shiftTo,
                isDeleted: false,
                shiftID: shiftID,
                id: `${date.format("YYYYMMDD")}-${Math.random().toString(36).substr(2, 9)}`, // Unique ID
              });
            }
  
            console.log(newAvailabilities); // Log for checking the result
            setUpdatedCustomAvailabilities(newAvailabilities);
          }
        }
      } catch (error) {
        console.error("Failed to fetch provider availability", error);
      }
    };
  
    fetchProviderAvailability();
  }, [startDateData, endDateData, searchParams]);


  const {
    status,
    reset: reset_update_mutation,
  } = useMutation({
    mutationFn: async () => {
      // Replace with your API call logic if needed
      // For now, just a placeholder
      console.log("Updating availability", availabilities);
    },
    mutationKey: ["update-availability"],
    onSuccess(data) {
      const responseData:any = data;

      if (responseData?.data?.success) {
        setTimeout(() => {
          toast({
            description: (
              <Message
                message={"Availability updated successfully"}
                type="success"
              />
            ),
          });

          reset_update_mutation();
          navigate("/"); // Adjust as needed
        }, 100);
      }
    },
  });

  function deleteAvailability({
    date,
    shiftID,
    shiftType,
    id,
  }: {
    date: string;
    shiftID: number;
    id: number;
    shiftType: string;
  }) {
    const updatedAvailabilities = availabilities?.map((a) => {
      if (
        dayjs(a.dateOfMonth).format("YYYY-MM-DD") ===
        dayjs(date).format("YYYY-MM-DD")
      ) {
        return {
          ...a,
          date,
          shiftID,
          id,
          shiftType,
          isDeleted: true,
        };
      }
      return a;
    });

    setUpdatedCustomAvailabilities(updatedAvailabilities);
  }

  function renderCell(date: Date) {
    const isScheduleDate = availabilities?.find(
      (a: { shiftType: string; dateOfMonth: string; isDeleted?: boolean }) => {
        return (
          dayjs(a.dateOfMonth).format("YYYY-MM-DD") ===
          dayjs(date).format("YYYY-MM-DD")
        );
      }
    );

    if (!isScheduleDate) return null;

    const fullContent = (
      <p
        className={`${!isScheduleDate.isDeleted ? "bg-hms-green-bright" : ""} h-full`}
      >
        {!isScheduleDate.isDeleted ? (
          <div className={`flex flex-col gap-2 items-center`}>
            <p className="w-full text-center">{isScheduleDate.shiftType}</p>
            <div className="flex items-center justify-center font-semibold">
              <UpdatePopup
                currentShiftType={isScheduleDate.shiftType}
                id={isScheduleDate.id}
                shiftID={isScheduleDate.shiftID}
                availabilities={availabilities}
                date={dayjs(date).format("YYYY-MM-DD")}
                updateCustomAvailabilities={setUpdatedCustomAvailabilities}
                shifts={
                  provider_availabilities ? provider_availabilities : []
                }
              />
              <ConfirmDelete
                itemName={
                  "Your availability for " +
                  dayjs(date).format("DD/MM/YYYY")
                }
                onConfirm={(closeModal) => {
                  deleteAvailability({
                    date: dayjs(date).format("YYYY-MM-DD"),
                    shiftID: isScheduleDate.id,
                    id: isScheduleDate.id,
                    shiftType: isScheduleDate.shiftType,
                  });
                  if (closeModal) {
                    closeModal(false);
                  }
                }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <AddPopup
              currentShiftType=""
              id={isScheduleDate.id}
              availabilities={availabilities}
              date={dayjs(date).format("YYYY-MM-DD")}
              updateCustomAvailabilities={setUpdatedCustomAvailabilities}
              shifts={
                provider_availabilities ? provider_availabilities : []
              }
            />
          </div>
        )}
      </p>
    );

    const mobileContent = (
      <div className="flex items-center justify-center h-full">
        {isScheduleDate.isDeleted ? (
          <AddPopup
            currentShiftType=""
            id={isScheduleDate.id}
            availabilities={availabilities}
            date={dayjs(date).format("YYYY-MM-DD")}
            updateCustomAvailabilities={setUpdatedCustomAvailabilities}
            shifts={provider_availabilities ? provider_availabilities : []}
          />
        ) : (
          <UpdatePopup
            currentShiftType={isScheduleDate.shiftType}
            id={isScheduleDate.id}
            shiftID={isScheduleDate.id}
            availabilities={availabilities}
            date={dayjs(date).format("YYYY-MM-DD")}
            updateCustomAvailabilities={setUpdatedCustomAvailabilities}
            shifts={provider_availabilities ? provider_availabilities : []}
          />
        )}
      </div>
    );

    return (
      <>
        <div className="hidden sm:block">{mobileContent}</div>
        <div className="block sm:hidden">{fullContent}</div>
      </>
    );
  }

   // Function to handle Confirm button click
   const handleConfirm = async () => {
    setLoading(true); // Set loading to true when starting the update process
    try {
      // Call the first API: availability/add
      const addAvailabilityResponse = await httpCommon.post(
        "requests/availability/confirmAdd",
        {
          requestID: `${requestID}`,
          availability: [
            {
              startDate: startDateData || dayjs().format("YYYY-MM-DD"),
              endDate: endDateData || dayjs().format("YYYY-MM-DD"),
              shiftID: providerAvailability.find(shift => shift.shiftType === 'FULL')?.id, // Assuming shiftID is fetched from providerAvailability
            },
          ],
          extraAvailability: [],
        }
      );
  
      console.log('Add Availability Response:', addAvailabilityResponse.data);
  
      if (addAvailabilityResponse.data.success) {
        // Call the second API: availability/update
        const availabilityInfo = {
          customAvailability: availabilities,
        };
  
        const updateAvailabilityResponse = await httpCommon.post(
          `requests/availability/update/${requestID}`,
          availabilityInfo
        );
  
        console.log('Update Availability Response:', updateAvailabilityResponse.data);
  
        if (updateAvailabilityResponse.data.success) {
          // Show success message and navigate
          setTimeout(() => {
            toast({
              description: (
                <Message
                  message={"All entries have been added except overlapping ones."}
                  type="success"
                />
              ),
            });
  
            navigate("/"); // Adjust as needed
          }, 100);
        }
      }
    } catch (error) {
      console.error('Error in availability flow:', error);
      // Handle error (e.g., show an error message)
      toast({
        description: (
          <Message
            message={"Failed to update availability. Please try again."}
            type="error"
          />
        ),
      });
    }finally {
      setLoading(false); // Set loading to false after the process completes
    }
  };
  

  return (
    <section className="w-full">
      <Calendar renderCell={renderCell} defaultValue={startDate} />
      <div className="w-full flex justify-end">
        <Button
          onClick={handleConfirm}
          className={`px-4 py-2 rounded-lg ${
            loading // Change this condition to reflect loading state
              ? "bg-gray-400 cursor-not-allowed"
              : status === "success"
              ? "bg-hms-green-bright text-hms-green-dark"
              : "bg-hms-green-dark hover:bg-hms-green-light"
          }`}
          disabled={loading} // Disable the button when loading
        >
          {loading ? (
            <Loading />
          ) : status === "success" ? (
            "Availability updated successfully"
          ) : (
            "Confirm"
          )}
        </Button>
      </div>
    </section>
  );
}

export default AdvancedView;
