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
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { Link, useSearchParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import ListSkeleton from "../../../components/list-skeleton.tsx";
import { useEffect } from "react";
import httpCommon from "../../helper/httpCommon.ts";
import { useToast } from "../../../components/ui/use-toast.ts";
import Message from "../../../components/toasts.tsx";

interface ProvidersTableProps {
  searchQuery: string; // Add prop type for search query
}

export default function ProvidersTable({ searchQuery }: ProvidersTableProps) {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const {
    data,
    status,
    refetch,
    isRefetching,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["infinite-providers"],
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

  let providers:any = [];

  if (status === "success") {
    providers = [].concat(...data.pages.map((page) => page.data.data.listing));
  }

  async function fetchPage({ pageParam }: { pageParam: number }) {
    return await httpCommon.get(
      `providers/get?region=${searchParams.get(
        "region"
      )}&page=${pageParam}&limit=100`
    );
  }

  function handleScroll(e: any) {
    const is_fully_scrolled =
      e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight;

    if (is_fully_scrolled && hasNextPage) {
      fetchNextPage();
    }
  }

  useEffect(() => {
    refetch();
  }, [searchParams.get("region"), refetch]);

  // Delete provider logic
  const {
    status: delete_provider_status,
    mutate: delete_provider,
    reset: reset_delete_mutation,
  } = useMutation({
    mutationFn: async function (providerID: number) {
      return await httpCommon.post(`providers/delete/${providerID}`, {});
    },
    mutationKey: ["delete-provider"],
    onSuccess(data) {
      if (data.data.success) {
        toast({
          description: (
            <Message message="Provider deleted successfully" type="success" />
          ),
        });
        refetch();
      }
    },
  });

  // Filter providers based on search query
  const filteredProviders = providers?.filter((provider: { name: string; }) =>
    provider.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Table className={"relative w-full border-collapse rounded-lg"}>
      <TableHeader className={"sticky overflow-hidden bg-hms-green-light "}>
        <TableRow className="table w-full table-fixed">
          <TableHead
            className={"font-semibold rounded-tl-lg rounded-bl-lg text-white"}
          >
            S NO.
          </TableHead>
          <TableHead className={"font-semibold text-white"}>
            Provider Name
          </TableHead>
          <TableHead className={"font-semibold text-white"}>
            Specialization
          </TableHead>
          <TableHead className={"font-semibold text-white"}>
            Medical Center
          </TableHead>
          <TableHead className={"font-semibold text-white"}>Location</TableHead>
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
        {filteredProviders && filteredProviders.length > 0 ? (
          filteredProviders.map((provider: any, index: number) => {
            return (
              <TableRow
                className={"text-gray-800 border-none table w-full table-fixed"}
                key={index}
              >
                <TableCell className={"py-1 px-0"}>
                  <Link to={`provider/${provider.id}`}>
                    <div className={"w-full py-4 px-4 bg-hms-green-bright"}>
                      {index + 1}
                    </div>
                  </Link>
                </TableCell>
                <TableCell className={"py-1 px-0"}>
                  <Link to={`provider/${provider.id}`}>
                    <div className={"w-full py-4 px-4 bg-hms-green-bright"}>
                      {provider.name}
                    </div>
                  </Link>
                </TableCell>
                <TableCell className={"py-1 px-0"}>
                  <Link to={`provider/${provider.id}`}>
                    <div className={"w-full py-4 px-4 bg-hms-green-bright"}>
                      {provider.specializationName}
                    </div>
                  </Link>
                </TableCell>
                <TableCell className={"py-1 px-0"}>
                  <Link to={`provider/${provider.id}`}>
                    <div className={"w-full py-4 px-4 bg-hms-green-bright"}>
                      {provider.medicalCenterName}
                    </div>
                  </Link>
                </TableCell>
                <TableCell className={"py-1 px-0"}>
                  <Link to={`provider/${provider.id}`}>
                    <div className={"w-full py-4 px-4 bg-hms-green-bright"}>
                      {provider.regionName}
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
                      status={delete_provider_status}
                      itemName={provider.name}
                      onConfirm={() => {
                        delete_provider(provider.id);
                      }}
                    />
                    <Link
                      to={`/providers/add-provider?${new URLSearchParams(
                        `edit=true&providerID=${provider.id}`
                      )}`}
                    >
                      <MdEdit className="text-2xl text-gray-500 hover:text-gray-600 cursor-pointer" />
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            );
          })
        ) : !isRefetching && !isFetching ? (
          <p className="my-4 w-full text-center text-xl text-gray-700 font-semibold">
            No Provider found
          </p>
        ) : null}
        {status === "pending" || isFetchingNextPage || isRefetching ? (
          <ListSkeleton items={10} />
        ) : null}
      </TableBody>
    </Table>
  );
}
