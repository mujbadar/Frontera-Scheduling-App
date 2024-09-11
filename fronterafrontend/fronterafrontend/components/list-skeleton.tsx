import { TableCell, TableRow } from "./ui/table";

export default function ListSkeleton({ items }: { items: number }) {
  return (
    <TableRow className="table w-full table-fixed">
      <TableCell
        role="status"
        className="w-full items-center space-y-8 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700"
      >
        {new Array(items).fill(0).map((_item: number, index: number) => {
          return (
            <div
              key={index}
              className="flex items-center justify-between w-full"
            >
              <div>
                <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                <div className="w-32 h-2 bg-gray-200 rounded-full  "></div>
              </div>
              <div className="h-2.5 bg-gray-300 rounded-full   w-12"></div>
            </div>
          );
        })}
      </TableCell>
    </TableRow>
  );
}
