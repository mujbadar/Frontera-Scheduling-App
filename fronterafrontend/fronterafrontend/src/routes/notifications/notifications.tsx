import { useQuery } from "@tanstack/react-query";
import { TNotification } from "types";
import dayjs from "dayjs";
import "dayjs/locale/en";
import Loading from "../../../components/loading";
import httpCommon from "../../helper/httpCommon";

export default function NotificationsPage() {
  const { data, isFetched, isFetching } = useQuery({
    queryKey: ["nots-page-nots"],
    queryFn: async () =>
      await httpCommon.get("requests/notifications"),
  });

  return (
    <section className="w-full">
      {isFetching ? (
        <Loading message="Fetching notifications" />
      ) : (
        <div className="w-full">
          <h2 className="w-full my-4 text-hms-blue-dark text-2xl font-bold">
            Notifications
          </h2>
          {isFetched
            ? data?.data.data.map((n: TNotification) => {
                return (
                    <div
                      key={n.id}
                      className="w-full border-l-2 border-gray-700 my-4 shadow-sm p-4 rounded-lg"
                    >
                      <p className="w-full font-semibold text-gray-800">
                        {n.activity}
                      </p>
                      <div className="mt-3 w-full flex gap-2 items-center">
                        <p className="px-4 font-semibold py-1 bg-blue-50 text-blue-900 rounded-lg">
                          {n.name}
                        </p>
                        <p className="text-hms-green-dark max-w-max bg-hms-green-bright px-2 py-1 rounded-lg font-semibold">
                          {dayjs(n.createdAt).format("dddd")} |{" "}
                          {dayjs(n.createdAt).format('D MMMM YYYY')}
                        </p>
                      </div>
                    </div>
                );
              })
            : null}
        </div>
      )}
    </section>
  );
}
