import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query";
import { authToken } from '../lib/utils'
import httpCommon from "../src/helper/httpCommon";

export default function UpdateScheduleLink({ location }: { location: string }) {
  const { data, isFetched } = useQuery({
    queryKey: ['update-requests'],
    queryFn: async () => await httpCommon.get('requests/listing', {
      headers: {
        Authorization: `Bearer ${authToken()}`
      }
    })
  })

  let requests;
  if (isFetched) {
    if (data?.data.success) requests = data?.data.data
  }

  return <Link
    className={`${location === "update-schedule"
      ? "font-semibold"
      : ""
      } p-2   flex gap-2 items-center`}
    to={"/request-schedules/update-schedule"}
  >
    Update Schedule
    <div className="bg-hms-green-dark text-white px-2 rounded-full">{requests ? requests.length : "0"}</div>
  </Link>
}
