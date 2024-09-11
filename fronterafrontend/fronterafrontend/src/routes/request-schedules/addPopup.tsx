import { Label } from "./../../../components/ui/label";
import { Button } from "./../../../components/ui/button";
import Modal from "./../../../components/modal";
import Dropdown from "./../../../components/dropdown";
import React, { useState, SetStateAction } from "react";
import {  MdAddCircle} from "react-icons/md";
// import ValidationError from "../../../components/validation-error";

export default function AddPopup({
  currentShiftType,
  shifts,
  date,
  updateCustomAvailabilities,
  availabilities,
  id,
}: {
  currentShiftType: string;
  shifts: any[] | any;
  date: string;
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

  return (
    <Modal
      customClose={isOpen}
      customOpen={setIsOpen}
      onlyIcon={
        <MdAddCircle className="text-2xl   hover:text-hms-green-light" />
      }
      actionTitle="Add"
      triggerTitle="Add"
      description=""
      title="Add Availability"
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
          onClick={() => setIsOpen(!isOpen)}
          className="text-hms-blue-dark hover:bg-transparent underline underline-offset-8 bg-white w-[50%]"
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
          Save
        </Button>
      </div>
    </Modal>
  );
}
