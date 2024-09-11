import httpCommon from "@/helper/httpCommon";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import AdvancedView from "../request-schedules/advancedView";
import Loading from "../../../components/loading";

type Props = {};

function UpdateRequest({}: Props) {
  const [searchParams] = useSearchParams();

  const {
    data: providerAvailabilitiesData,
    isFetching: fetchingProviderAvailabilities,
  } = useQuery({
    queryKey: ["update-request-provider-details"],
    queryFn: async () =>
      await httpCommon.get(
        `requests/provider-schedule/${searchParams.get("providerID")}`
      ),
  });

  const { data: requestDetailsData, isFetching: fetchingRequestDetails } =
    useQuery({
      queryKey: ["update-request"],
      queryFn: async () =>
        await httpCommon.get(
          `requests/listing/${searchParams.get("requestID")}`
        ),
    });

  return (
    <div className="w-full">
      <h2 className="text-2xl text-hms-blue-dark font-semibold my-2">
        Update Provider's Availability
      </h2>
      {fetchingRequestDetails || fetchingProviderAvailabilities ? (
        <Loading />
      ) : (
        <AdvancedView
          forAdmin={true}
          updateRequest={requestDetailsData?.data.data[0]}
          provider_availabilities={providerAvailabilitiesData?.data.data}
          startDate={new Date()}
        />
      )}
    </div>
  );
}

export default UpdateRequest;
