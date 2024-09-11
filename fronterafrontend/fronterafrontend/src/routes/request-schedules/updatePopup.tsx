import { Label } from "./../../../components/ui/label";
import { Button } from "./../../../components/ui/button";
import Modal from "./../../../components/modal";
import Dropdown from "./../../../components/dropdown";
import React, { useState, SetStateAction } from "react";
import { MdEdit } from "react-icons/md";
// import ValidationError from "../../../components/validation-error";
import { Dot } from "lucide-react"; // Import the correct icon
import dayjs from "dayjs";
import ConfirmDelete from "../../../components/ConfirmDelete";

export default function UpdatePopup({
  currentShiftType,
  shifts,
  date,
  updateCustomAvailabilities,
  availabilities,
  shiftID,
  id,
}: {
  currentShiftType: string;
  shifts: any[] | any;
  date: string;
  shiftID:any;
  updateCustomAvailabilities: React.Dispatch<SetStateAction<any[] | undefined>>;
  availabilities: any[] | undefined;
  id: number;
}) {
  const [isOpen, setIsOpen] = useState<boolean | undefined>();
  const [currentShift, setCurrentShift] = useState<number | null>(null);

  const shiftsArray = Array.isArray(shifts) ? shifts : [shifts];

  function updateShift() {
    const shiftType = shiftsArray.find((s) => s.id === currentShift)?.shiftType;

    if (currentShift) {
      const updatedAvalabilities = availabilities?.map((availability) => {
        if (availability.id === id)
          availability = {
            ...availability,
            shiftType,
            id,
            shiftID: currentShift,
            date,
            isDeleted: false,
          };
        return availability;
      });
      updateCustomAvailabilities(updatedAvalabilities);
    }
  }
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

    updateCustomAvailabilities(updatedAvailabilities);
  }
  return (
    <Modal
      customClose={isOpen}
      customOpen={setIsOpen}
      onlyIcon={
        <>
          <MdEdit className="block sm:hidden text-2xl text-hms-green-dark hover:text-hms-green-light" />
          <Dot className=" hidden sm:block  w-6 h-6 text-hms-green-dark hover:text-hms-green-light" />
        </>
      }
      actionTitle="Add"
      triggerTitle="Add"
      description=""
      title="Update Availability"
    >
      <Label className="flex flex-col items-start gap-2">
        <span className={"text-lg"}>Select Shifts</span>
        <Dropdown
          defaultOption={currentShiftType}
          options={shiftsArray.map(
            (s: any) => `${s.shiftType} (${s.shiftFrom} To ${s.shiftTo})`
          )}
          onSelect={(o: string) => {
            setCurrentShift(
              shiftsArray.find((s: any) => {
                return o === `${s.shiftType} (${s.shiftFrom} To ${s.shiftTo})`;
              })?.id
            );
          }}
          triggerTitle="Select Shifts"
        />
      </Label>
      <div className="flex gap-2 items-center">
     
        <Button
          onClick={() => {
             setIsOpen(false);
          }}
          className="bg-white text-black w-[50%] border border-green-500 hover:bg-gray-100 hover:border-green-700 px-2 py-2 text-lg"
          >
          Cancel
        </Button>
        <Button
          onClick={() => {
            updateShift();
            setIsOpen(false);
          }}
          className={`${"bg-hms-green-dark w-[50%] text-white hover:bg-hms-green-light"} px-2 py-2 text-lg `}
        >
          Update
        </Button>
      </div>
      <div className="flex items-center justify-center h-full">
  <Button
    
    className="text-hms-blue-dark hover:bg-transparent item-center justify-center underline underline-offset-8 bg-white w-[50%] hidden sm:flex"
     >
     <ConfirmDelete
                itemName={
                  "Your availability for " +
                  dayjs(date).format("DD/MM/YYYY")
                }
                onConfirm={(closeModal) => {
                  deleteAvailability({
                    date: dayjs(date).format("YYYY-MM-DD"),
                    shiftID: shiftID,
                    id: id,
                    shiftType: currentShiftType,
                  });
                  if (closeModal) {
                    closeModal(false);
                    // setIsOpen(false);
                    
                  }
                }}
                
              />
    {/* Delete */}
   
  </Button>
</div>

    </Modal>
  );
}
