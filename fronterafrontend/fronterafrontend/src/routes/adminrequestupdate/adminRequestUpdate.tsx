import { Link } from "react-router-dom";
import Dropdown from "../../../components/dropdown";
import httpCommon from "@/helper/httpCommon";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../components/loading";
import { useEffect, useState } from "react";

export default function UpdateScheduleAdmin() {
  const [selectedProvider, setSelectedProvider] = useState();
  const [currentRequest, setCurrentRequest] = useState<
    { [key: string]: any } | undefined
  >();

  const { data: providersData, isFetching: fetchingProviders } = useQuery({
    queryKey: ["get-all-providers"],
    queryFn: async () => await httpCommon.get("requests/providers"),
  });

  const {
    data: requestsData,
    isFetching: fetchingRequests,
    refetch: fetchRequests,
  } = useQuery({
    queryKey: ["get-request-for-provider"],
    queryFn: async () =>
      await httpCommon.get(`requests/provider/${selectedProvider}`),
    enabled: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (selectedProvider) fetchRequests();
  }, [selectedProvider]);

  return (
    <section className=" py-4  flex flex-col  flex flex-col w-[90%] mx-auto h-full">
      <h2 className="text-2xl font-bold text-hms-blue-dark">Update Schedule</h2>
      <div className="w-full flex flex-col gap-2 py-4">
        <div className="flex flex-col gap-2">
          <span className="text-hms-blue-dark font-semibold">
            Choose Provider
          </span>
          {fetchingProviders ? (
            <Loading />
          ) : (
            <Dropdown
              triggerTitle="Choose provider"
              options={providersData?.data.data.map(
                (provider: any) => provider.name
              )}
              onSelect={(option: string) => {
                setSelectedProvider(
                  providersData?.data.data.find(
                    (provider: any) => provider.name === option
                  ).id
                );
              }}
            />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-hms-blue-dark font-semibold">
            Choose Request
          </span>
          {fetchingRequests ? (
            <Loading />
          ) : (
            <Dropdown
              childWidth={true}
              triggerTitle="Choose request to update schedule for"
              options={requestsData?.data.data.map((request: any) => (
                <p
                  onClick={() => setCurrentRequest(request)}
                  className="w-full px-2 py-2 flex justify-between items-center pr-4"
                >
                  <span>
                    <span className="bg-hms-green-bright text-hms-green-dark py-1 px-2 font-semibold rounded-lg">
                      {request.startDate}
                    </span>{" "}
                    &nbsp;To&nbsp;{" "}
                    <span className="bg-hms-green-bright text-hms-green-dark py-1 px-2 font-semibold rounded-lg">
                      {request.endDate}
                    </span>
                  </span>
                  <span className="font-semibold text-red-800">
                    {request.deadline}
                  </span>
                </p>
              ))}
            />
          )}
        </div>
        <div className="border border-gray-100 mt-2 px-4"></div>
        {currentRequest ? (
          <>
            <h3 className="text-2xl font-bold text-hms-blue-dark my-2">
              Request Found
            </h3>
            <div className="w-full">
              <h2 className="w-full px-4 font-semibold text-white bg-hms-green-light py-2 rounded-lg">
                Schedule Request
              </h2>
              <div className="w-full flex flex-col gap-2 mt-1 p-2 bg-gray-100 rounded-lg">
                <div className="flex w-full justify-between items-center px-2">
                  <p className="text-hms-blue-dark text-xl">
                    Schedule starting date
                  </p>
                  <p className="text-xl px-2 py-1 rounded-lg bg-hms-green-bright text-hms-green-dark font-semibold">
                    {currentRequest.startDate}
                  </p>
                </div>
                <div className="flex w-full justify-between items-center px-2">
                  <p className="text-hms-blue-dark text-xl">
                    Schedule end date
                  </p>
                  <p className="text-xl px-2 py-1 rounded-lg bg-hms-green-bright text-hms-green-dark font-semibold">
                    {currentRequest.endDate}
                  </p>
                </div>
                <div className="flex w-full justify-between items-center px-2">
                  <p className="text-hms-blue-dark text-xl">Deadline</p>
                  <p className="text-xl px-2 py-1 rounded-lg bg-hms-green-bright text-hms-green-dark font-semibold">
                    {currentRequest.deadline}
                  </p>
                </div>
                <div className="w-full pt-2 px-2 flex justify-end items-center border-t border-white">
                  <Link
                    to={`/request/update?requestID=${currentRequest.id}&providerID=${selectedProvider}`}
                    className="p-2 rounded-lg bg-hms-green-dark hover:bg-hms-green-light text-white"
                  >
                    Update Availability
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
