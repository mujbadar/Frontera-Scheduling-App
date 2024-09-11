import React, { SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";

type Props = {
  title: string;
  description: string;
  triggerTitle: string;
  actionTitle: string;
  children: React.ReactNode;
  onlyIcon?: React.ReactNode;
  customClose?: boolean | undefined;
  customOpen?: React.Dispatch<SetStateAction<boolean | undefined>>;
};

export default function Modal({
  title,
  description,
  triggerTitle,
  children,
  customClose,
  customOpen,
  onlyIcon,
}: Props) {
  return (
    <Dialog open={customClose}>
      <DialogTrigger asChild>
        {onlyIcon ? (
          <button
            onClick={() => {
              if (customOpen) customOpen(undefined);
            }}
          >
            {onlyIcon}
          </button>
        ) : (
          <Button
            onClick={() => {
              if (customOpen) customOpen(undefined);
            }}
            variant="default"
            className="text-white bg-hms-green-light hover:bg-hms-green-dark"
          >
            {triggerTitle}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        className="rounded-lg overflow-hidden"
        style={{ width: "100vw" }}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription> {description} </DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
