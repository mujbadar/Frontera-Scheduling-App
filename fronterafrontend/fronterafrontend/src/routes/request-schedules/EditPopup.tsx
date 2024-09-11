import { Label } from "./../../../components/ui/label";
import { Button } from "./../../../components/ui/button";
import Modal from "./../../../components/modal";
import Dropdown from "./../../../components/dropdown";
import { MdEdit } from "react-icons/md";

export default function EditPopup({ shifts }: { shifts: any[] | any }) {
  return (
    <Modal
      onlyIcon={<MdEdit className="text-2xl" />}
      actionTitle="Edit"
      triggerTitle="Edit"
      description=""
      title="Edit Availability"
    >
      <form className="flex flex-col gap-4">
        <Label className="flex flex-col items-start gap-2">
          <span className={"text-lg"}>Select Shifts</span>
          <Dropdown
            options={
              Array.isArray(shifts)
                ? shifts.map(
                    (s: any) =>
                      `${s.shiftType} (${s.shiftFrom} To ${s.shiftTo})`
                  )
                : [
                    `${shifts.shiftType} (${shifts.shiftFrom} To ${shifts.shiftTo})`,
                  ]
            }
            triggerTitle="Select Shifts"
          />
        </Label>
        <Button className="w-full px-2 py-2 text-lg bg-gray-100 hover:text-white text-gray-800">
          Not Available
        </Button>
        <Button className="w-full px-2 py-2 text-lg bg-hms-green-dark text-white hover:bg-hms-green-light">
          Save
        </Button>
      </form>
    </Modal>
  );
}
