import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { RiErrorWarningFill } from "react-icons/ri";

export default function Message({
  message,
  type,
}: {
  message: string|React.ReactNode;
  type: "success" | "error";
}) {
  const icons = {
    success: (
      <IoCheckmarkDoneCircle className="text-hms-green-light text-2xl" />
    ),
    error: <RiErrorWarningFill className="text-red-700 text-2xl" />,
  };
  return (
    <p className="w-full gap-2 p-2 items-center flex">
      {icons[type]} <p className="text-lg">{message}</p>
    </p>
  );
}
