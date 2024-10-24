import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { RiErrorWarningFill } from "react-icons/ri";

export default function Message({
  message,
  type,
}: {
  message: string | React.ReactNode;
  type: "success" | "error";
}) {
  const icons = {
    success: (
      <IoCheckmarkDoneCircle className="text-hms-green-light text-2xl" />
    ),
    error: <RiErrorWarningFill className="text-red-700 text-2xl" />,
  };

  return (
    <div
      className="fixed top-5 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-white p-4 rounded-md shadow-lg"
      style={{ zIndex: 9999 }}
    >
      {icons[type]}
      <p className="text-lg mb-0">{message}</p>
    </div>
  );
}
