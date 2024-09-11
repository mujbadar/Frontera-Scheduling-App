import dayjs from "dayjs";
import { Calendar } from "rsuite";
import UpdatePopup from "./updatePopup";
import ConfirmDelete from "../../../components/ConfirmDelete";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import Loading from "../../../components/loading";
import httpCommon from "../../helper/httpCommon";
import { useToast } from "../../../components/ui/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import Message from "../../../components/toasts";
// import { Plus } from "lucide-react"; // Add this import
// import { MoreHorizontal } from "lucide-react"; // Import the correct icon

import AddPopup from "./addPopup";

type Props = {
  updateRequest: any;
  provider_availabilities: any[];
  forAdmin?: boolean;
  startDate: Date | undefined; // Update to accept Date | null

};

function AdvancedView({
  updateRequest,
  provider_availabilities,
  forAdmin,
  startDate
}: Props) {
  // console.log('Received startDate in AdvancedView:', startDate);

  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [availabilities, setUpdatedCustomAvailabilities] = useState<any[]>();
  // const [selectedDate, setSelectedDate] = useState({
  //   startDate: "2024-07-15", // Example start date
  //   endDate: null,
  //   shiftID: null,
  // });
  const {
    isFetched,
    refetch: invalidate_calender_data,
    data,
  } = useQuery({
    queryKey: ["providers_advanced_view_data"],
    queryFn: async () =>
      await httpCommon.get(
        `requests/${
          forAdmin
            ? `provider-details/${searchParams.get(
                "requestID"
              )}/${searchParams.get("providerID")}`
            : `fetch-request-details/${updateRequest.id}`
        }`
      ),
  });

  const {
    status,
    mutate,
    reset: reset_update_mutation,
  } = useMutation({
    mutationFn: async () =>
      await httpCommon.post(
        `requests/${
          forAdmin
            ? `update-provider-availability/${searchParams.get(
                "requestID"
              )}/${searchParams.get("providerID")}`
            : `availability/update/${updateRequest.id}`
        }`,
        {
          customAvailability: availabilities?.filter((a) =>
            Object.keys(a).includes("isDeleted")
          ),
        }
      ),
    mutationKey: ["update-availability"],
    onSuccess(data) {
      if (data?.data.success) {
        setTimeout(() => {
          toast({
            description: (
              <Message
                message={"Availability update successfully"}
                type="success"
              />
            ),
          });

          reset_update_mutation();
          invalidate_calender_data();
          if (!forAdmin) {
            navigate("/");
          } else {
            navigate("/request/find");
          }
        }, 1000);
      }
    },
  });

  useEffect(() => {
    if (isFetched) {
      setUpdatedCustomAvailabilities(data?.data.data);
    }
  }, [isFetched]);

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
        a = {
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
  
    // Content for larger screens
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
                shiftID={isScheduleDate.id}
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
  
    // Content for mobile screens (showing only a dot or icon)
    const mobileContent = (
      <div className="flex items-center justify-center h-full">
        {isScheduleDate.isDeleted? (
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
        <div className="hidden sm:block">{mobileContent}</div> {/* Hidden on mobile */}
        <div className="block sm:hidden">{fullContent}</div> {/* Visible on mobile */}
      </>
    );
  }

  return (
    <section className="w-full">
      <Calendar  renderCell={renderCell}
      defaultValue={startDate}
/>
      <div className="w-full flex justify-end">
        <Button
          onClick={() => {
            mutate();
            window.location.href = '/';
          }}
          // disabled={
          //   !availabilities?.find((a) =>
          //     Object.keys(a).includes("isDeleted")
          //   ) || status === "success"
          // }
          className={`px-4 py-2 rounded-lg  ${
            status === "success"
              ? "bg-hms-green-bright text-hms-green-dark"
              : "bg-hms-green-dark hover:bg-hms-green-light"
          }`}
        >
          {status === "pending" ? (
            <Loading />
          ) : status === "success" ? (
            "Availability updated successfully"
          ) : (
            "confirm"
          )}
        </Button>
      </div>
    </section>
  );
}

export default AdvancedView;