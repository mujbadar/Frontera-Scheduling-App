import Dropdown from "./../../../components/dropdown";
import { useParams, useSearchParams } from "react-router-dom";
import DetailsTable from "./detailsTable";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../components/loading";
import { TRegion } from "../../../types";
import BackButton from "../../../components/BackButton";
import httpCommon from "../../helper/httpCommon";
import { CSVLink } from "react-csv";
import { getDayNamedDate } from "../../../lib/utils";

function DateDetails() {
  const [searchParams, setSearchparams] = useSearchParams();
  const params = useParams();

  const { isFetched, isFetching, data, refetch } = useQuery({
    queryFn: async () =>
      await httpCommon.get(
        `dashboard/calender/details?month=${dayjs(params.date).format(
          "YYYY-MM-DD"
        )}&region=${
          searchParams.get("region") ? searchParams.get("region") : 0
        }`
      ),
    queryKey: ["dashboard-calender-details"],
  });

  let details: any[] = [];
  if (isFetched) {
    details = data?.data.data;
  }

  const {
    data: regions_data,
    isFetching: fetching_regions,
    isFetched: regions_fetched,
  } = useQuery({
    queryKey: ["regions"],
    queryFn: async () => await httpCommon.get("medical-centers/region"),
  });
  let regions: TRegion[] = [];
  if (regions_fetched) {
    regions = regions_data?.data.data;
  }

  async function filterByRegions(regionName: string) {
    const regionID = regions.find(
      (region: TRegion) => region.name === regionName
    )?.id;
    setSearchparams(`region=${regionID}`);
    await refetch();
  }

  return (
    <section className="mx-auto flex flex-col items-center flex flex-col w-[96%] mx-auto h-full">
      <div className="w-full flex items-center justify-between">
        <BackButton to="/" title="Back to Home" />
        <div className="flex gap-2 items-center">
          {fetching_regions ? (
            <Loading />
          ) : (
            <Dropdown
              triggerTitle="All Locations"
              options={regions.map((region: TRegion) => region.name)}
              onSelect={(option: string) => filterByRegions(option)}
              triggerCustomStyles="bg-hms-green-bright border border-hms-green-light py-2 px-4 gap-4 rounded-lg hover:bg-hms-green-dark hover:text-white font-semibold text-hms-green-dark text-green-light"
            />
          )}
          <CSVLink
            filename={`details_${dayjs()}`}
            className="px-4 font-semibold py-2 rounded-lg text-white bg-hms-green-dark hover:bg-hms-green-light"
            data={details
              .map((detail: any) =>
                JSON.parse(detail.shiftInfo).map((sd: any) => {
                  return {
                    date: getDayNamedDate(sd.date),
                    medicalcenter: detail.centerName,
                    roomName: sd.room,
                    providerName: sd.provider,
                    shiftFrom: sd.shiftFrom,
                    shiftTo: sd.shiftTo,
                    shiftType: sd.shiftType,
                  };
                })
              )
              .flat()
              .sort((a:any, b:any) => dayjs(a.date).diff(dayjs(b.date)))
            }
          >
            Export CSV
          </CSVLink>
        </div>
      </div>

      <div className="w-full my-4">
        {isFetching ? <Loading /> : <DetailsTable details={details} />}
      </div>
    </section>
  );
}

export default DateDetails;
