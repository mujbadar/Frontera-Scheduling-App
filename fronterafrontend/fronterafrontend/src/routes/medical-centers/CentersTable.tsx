import ConfirmDelete from "./../../../components/ConfirmDelete.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table.tsx";
import { MdEdit } from "react-icons/md";
import { Link, useSearchParams } from "react-router-dom";
import { QueryKey, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import ListSkeleton from "../../../components/list-skeleton.tsx";
import { useEffect } from "react";
import dayjs from "dayjs";
import httpCommon from "../../helper/httpCommon.ts";
import { useToast } from "../../../components/ui/use-toast.ts";
import Message from "../../../components/toasts.tsx";

export default function CentersTable() {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const {
    data,
    status,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    isRefetching,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["infinite-centers"],
    queryFn: fetchPage,
    initialPageParam: 0,
    getNextPageParam: (
      lastPage: AxiosResponse<any | any>,
      _allPages: AxiosResponse<any | any>[],
      lastPageParam: number
    ) => {
      const total_listings = lastPage.data.data.listingCount[0].count;
      if (total_listings % (lastPageParam + 1) !== 0) return lastPageParam + 1;
      else return null;
    },
  });

  let centers;

  if (status === "success") {
    centers = [].concat(...data.pages.map((page) => page.data.data.listing));
  }

  async function fetchPage(params: { pageParam: number; queryKey: QueryKey }) {
    const { pageParam } = params;
    return await httpCommon.get(
      `medical-centers/get?region=${searchParams.get(
        "region"
      )}&page=${pageParam}&limit=100`
    );
  }

  useEffect(() => {
    refetch();
  }, [searchParams.get("region"), refetch]);

  // delete center logic
  const {
    status: delete_center_status,
    mutate: delete_center,
    reset: reset_delete_mutation,
  } = useMutation({
    mutationFn: async function (centerID: number) {
      return await httpCommon.post(`medical-centers/delete/${centerID}`, {});
    },
    mutationKey: ["delete-center"],
    onSuccess(data) {
      if (data.data.success) {
        toast({
          description: (
            <Message message="Center deleted successfully" type="success" />
          ),
        });
        refetch();
      }
    },
  });

  function handleScroll(e: any) {
    const is_fully_scrolled =
      e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight;
    if (is_fully_scrolled && hasNextPage) {
      fetchNextPage();
    }
  }

  return (
    <Table

      className={"relative w-full border-collapse overflow-hidden rounded-lg"}
    > 
  {/* <caption className="text-xl font-semibold mb-4">Table Caption</caption> */}


      <TableHeader
        className={
          "sticky top-0 z-50 overflow-hidden bg-hms-green-light table table-fixed"
        }
      >
        <TableRow className=" table w-full table-fixed">
          <TableHead
            className={"font-semibold rounded-tl-lg rounded-bl-lg text-white"}
          >
            S NO.
          </TableHead>
          <TableHead className={"font-semibold text-white"}>
            Center Name
          </TableHead>
          <TableHead className={"font-semibold text-white"}>Region</TableHead>
          <TableHead
            className={"font-semibold text-white rounded-tr-lg rounded-br-lg"}
          >
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody
  onScroll={handleScroll}
        className={
          "block overflow-y-auto max-h-[calc(100vh_-_200px)] scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-hms-green-dark scrollbar-track-hms-green-light"
        }
      >
        {centers && centers.length > 0 && !isRefetching ? (
          centers.map(
            (
              center: {
                id: number;
                medicalCenterName: string;
                regionName: string;
              },
              index: number
            ) => {
              return (
                <TableRow
                  className={
                    "text-gray-800 border-none table w-full table-fixed"
                  }
                  key={center.id}
                >
                   
                  <TableCell className={"py-1 px-0"}>
                  <Link
                        to={`${center.medicalCenterName} ${
                          center.regionName
                        }/${dayjs()}?centerID=${center.id}`}
                    >
                      <div className={"w-full py-4 px-4 bg-hms-green-bright"}>
                        {index + 1}
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className={"py-1 px-0"}>
                    <Link
                      to={`${center.medicalCenterName} ${
                        center.regionName
                      }/${dayjs()}?centerID=${center.id}`}
                    >
                      <div className={"w-full py-4 px-4 bg-hms-green-bright"}>
                        {center.medicalCenterName}
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className={"py-1 px-0"}>
                    <Link
                      to={`${center.medicalCenterName} ${
                        center.regionName
                      }/${dayjs()}?centerID=${center.id}`}
                    >
                      <div className={"w-full py-4 px-4 bg-hms-green-bright"}>
                        {center.regionName}
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className="py-1 px-0">
                    <div
                      className={
                        "w-full py-3 px-4 bg-hms-green-bright flex gap-2"
                      }
                    >
                      <ConfirmDelete
                        sideEffects={[reset_delete_mutation]}
                        status={delete_center_status}
                        itemName={center.medicalCenterName}
                        onConfirm={() => {
                          delete_center(center.id);
                        }}
                      />
                      <Link
                        to={`add-centers?${new URLSearchParams(
                          `edit=true&centerID=${encodeURIComponent(center.id)}`
                        )}`}
                      >
                        <MdEdit className="text-2xl text-gray-500 hover:text-gray-600 cursor-pointer" />
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              );
            }
          )
        ) : !isRefetching && !isFetching ? (
          <p className="my-4 w-full text-center text-xl text-gray-700 font-semibold">
            No Center found
          </p>
        ) : null}
        {status === "pending" || isFetchingNextPage || isRefetching ? (
          <ListSkeleton items={10} />
        ) : null}
      </TableBody>
    </Table>
  );
}
