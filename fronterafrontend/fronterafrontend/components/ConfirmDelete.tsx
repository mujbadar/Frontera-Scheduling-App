import { MdDelete } from "react-icons/md";
import { Button } from "./ui/button";
import React, { SetStateAction, useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";
import { MutationStatus } from "@tanstack/react-query";
import Loading from "./loading";
import { DialogClose } from "@radix-ui/react-dialog";

type Props = {
  itemName: string;
  onConfirm: (
    closeModal?: React.Dispatch<SetStateAction<boolean | undefined>>
  ) => void;
  status?: MutationStatus;
  sideEffects?: Function[];
};

export default function ConfirmDelete({
  itemName,
  status,
  onConfirm,
  sideEffects,
}: Props) {
  const [open, setOpen] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    if (status === "success") {
      setOpen(false);
      if (sideEffects) {
        for (let sideEffect of sideEffects) {
          sideEffect();
        }
      }
    }
  }, [status]);

  return (
    <Dialog open={open}>
      <DialogTrigger asChild>
        <button onClick={() => setOpen(undefined)} 
      className="sm:flex" >
          <MdDelete className="text-2xl text-red-700 hover:text-red-600" />
          <span  className="hidden sm:flex">Delete</span>
        </button>
      </DialogTrigger>
      <DialogContent
        className="rounded-lg overflow-hidden"
        style={{ width: "100vw" }}
      >
        <DialogHeader>
          <DialogTitle>Delete</DialogTitle>
          <DialogDescription> Delete {itemName} </DialogDescription>
        </DialogHeader>
        <div className="w-full flex flex-col gap-6">
          <p className="text-lg font-semibold text-red-700 text-center w-full">
            Do you really want to delete {itemName}
          </p>
          <div className="w-full flex gap-4 items-center justify-end">
            <DialogClose asChild>
              <span className="cursor-pointer">Cancel</span>
            </DialogClose>
            <Button
              onClick={() => {
                onConfirm(setOpen);
              }}
              className="text-white hover:bg-red-600 px-4 bg-red-700 rounded-lg"
            >
              {status && status === "pending" ? <Loading /> : "Confirm"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
