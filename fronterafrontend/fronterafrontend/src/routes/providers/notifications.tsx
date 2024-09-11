import { FaRegBell } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import httpCommon from "../../helper/httpCommon";

export default function Notifications() {
  const { data, isFetched, isFetching } = useQuery({
    queryKey: ["request-notifications-nots"],
    queryFn: async () => await httpCommon.get("requests/notifications"),
  });

  return (
    <Link to="/notifications" className="relative">
      {isFetching ? (
        <AiOutlineLoading3Quarters className="absolute text-sm text-red-700 -top-2 -right-2 animate-spin" />
      ) : isFetched && data?.data.data.length > 0 ? (
        <GoDotFill className="absolute text-sm text-red-700 -top-2 -right-2" />
      ) : null}
      <FaRegBell className="text-xl text-white" />
    </Link>
  );
}
