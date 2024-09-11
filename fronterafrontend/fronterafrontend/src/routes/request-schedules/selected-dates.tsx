type Props = {
  selectedDate: {
    startDate: string | null,
    endDate: string | null,
    shiftID: number | null
  },
  provider_availabilities: any[]
}

export default function SelectedDate({ selectedDate, provider_availabilities }: Props) {
  return <div className="bg-hms-green-bright px-2 py-1 items-centerflex gap-1 items-start rounded-lg">
    <span className="text-hms-green-bright bg-hms-green-dark px-2 py-1 rounded-lg">{selectedDate.startDate ? selectedDate.startDate : ""}</span>
    <span className="mx-2">To</span>
    <span className="text-hms-green-bright bg-hms-green-dark px-2 py-1 rounded-lg">{selectedDate.endDate ? selectedDate.endDate : ""}</span>
    {selectedDate.shiftID && provider_availabilities ?
      <div className="w-full text-center rounded-lg mt-2 text-hms-green-bright bg-hms-green-dark px-2 py-1">{provider_availabilities.find((pa: any) => pa.id === selectedDate.shiftID).shiftType}</div>
      : ""}
  </div>

}
