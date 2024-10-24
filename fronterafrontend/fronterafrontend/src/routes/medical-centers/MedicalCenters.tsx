import Dropdown from "./../../../components/dropdown";
import { Link, useSearchParams } from "react-router-dom";
import CentersTable from "@/routes/medical-centers/CentersTable.tsx";
import { useQuery } from "@tanstack/react-query";
import { TRegion } from "types";
import Loading from "../../../components/loading";
import dayjs from "dayjs";
import httpCommon from "../../helper/httpCommon";
import { useState } from "react";

function MedicalCenters() {
  const [_, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");

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
    if (regions && !regions.find((region: TRegion) => region.id === 0))
      regions.unshift({
        id: 0,
        stateID: 0,
        name: "All Locations",
        createdAt: dayjs().toString(),
      });
  }

  const filterCenters = (regionName: string) => {
    const regionID = regions.find(
      (region: TRegion) => region.name === regionName
    )?.id;
    setSearchParams(`region=${regionID}`);
  };

  return (
    <>
      <div className="w-full flex my-4 justify-between">
        <h1 className="py-2 text-2xl font-bold max-w-max text-hms-green-dark">
          Medical Centers
        </h1>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Search by Center Name"
            className="border px-4 py-2 rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex gap-2 items-center">
            {fetching_regions ? (
              <Loading />
            ) : (
              <Dropdown
                triggerTitle="All Locations"
                options={regions.map((region: TRegion) => region.name)}
                onSelect={filterCenters}
                triggerCustomStyles="bg-hms-green-bright border border-hms-green-light py-2 px-4 gap-4 rounded-lg hover:bg-hms-green-dark hover:text-white font-semibold text-hms-green-dark text-green-light"
              />
            )}
          </div>
          <Link
            className="px-4 py-2 rounded-lg bg-hms-green-dark text-white"
            to={"/medical-centers/add-centers"}
          >
            Add Centers
          </Link>
        </div>
      </div>
      <CentersTable searchTerm={searchTerm} />
    </>
  );
}

export default MedicalCenters;
