export default function UpdateHeader() {
  return (
    <div className="w-full flex-wrap flex items-center justify-between my-4">
      <p className="text-lg font-semibold text-hms-blue-dark">
        Please select dates to update the availability for from the given dates
      </p>
      <div className="flex gap-2 items-center">
        <div className="flex gap-2 items-center">
          <span className="h-5 w-5 rounded-lg bg-gray-700 flex items-center justify-center">
            <span className="p-1 rounded-lg bg-white"></span>
          </span>{" "}
          Holidays
        </div>
        <div className="flex gap-2 items-center">
          <span className="h-5 w-5 rounded-lg bg-hms-green-bright flex items-center justify-center">
            <span className="p-1 rounded-lg bg-hms-green-dark"></span>
          </span>{" "}
          Working days
        </div>
        <div className="flex gap-2 items-center">
          <span className="h-5 w-5 rounded-lg bg-red-700 flex items-center justify-center">
            <span className="p-1 rounded-lg bg-white"></span>
          </span>
          Deadline
        </div>
      </div>
    </div>
  );
}
