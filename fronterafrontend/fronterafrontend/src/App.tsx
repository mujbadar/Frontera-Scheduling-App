import "./App.css";
import { Calendar } from "rsuite";
import dayjs from "dayjs";

import "rsuite/Calendar/styles/index.css";
import 'rsuite/Modal/styles/index.css';

import { Link } from "react-router-dom";
import { useAuth } from "./providers/authProvider";
import { useQuery } from "@tanstack/react-query";
import Loading from "../components/loading";
import httpCommon from "./helper/httpCommon";
import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { getDayNamedDate } from "../lib/utils";
import { Dot } from "lucide-react"; // Import the correct icon
import { Modal, Button } from 'rsuite';


function App() {
  const [user] = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [currentMonth, setCurrentMonth] = useState(
    dayjs().format("YYYY-MM-DD")
  );

  const {
    isFetched,
    isFetching,
    data,
    refetch: fetch_new_month,
  } = useQuery({
    queryKey: ["landing-page-data"],
    queryFn: async () =>
      await httpCommon.get(`dashboard/calender?month=${currentMonth}`),
  });

  const { data: exportData, isFetching: fetchingExportData } = useQuery({
    queryKey: ["export-data"],
    queryFn: async () =>
      await httpCommon.get(`dashboard/export-calender?month=${currentMonth}`),
  });

  let calenderData: any[] = [];
  if (isFetched) calenderData = data?.data.data;
  useEffect(() => {
    fetch_new_month();
  }, [currentMonth]);
  const [showModal, setShowModal] = useState(false);
  const [selectedShift, setSelectedShift] = useState<any>(null);
  const handleDotClick = (cd: any) => {
    setSelectedShift(cd); // Set the clicked shift details
    setShowModal(true);   // Show the modal
  };
  function renderCell(date: Date) {
    return isFetching ? (
      <Loading />
    ) : (
      <ul
      className="calendar-cell"
      onClick={() => {
        const matchingData = calenderData.find(
          (cd: any) =>
            dayjs(cd.currentDate).format("YYYY-MM-DD") ===
            dayjs(date).format("YYYY-MM-DD")
        );
        if (matchingData) {
          handleDotClick(matchingData); // Open modal with matched data
        }
      }}
    >
        {calenderData.map((cd: any) => {
          if (
            dayjs(cd.currentDate).format("YYYY-MM-DD") ===
            dayjs(date).format("YYYY-MM-DD")
          ) {
            return isAdmin ? (
              <div key={date.toString()} 
                 onClick={() => {
                    handleDotClick(cd);  // Open the modal when clicked
                  }}>
                {/* Wrap only the content that should trigger navigation in a Link */}
                <Link to={`date-details/${cd.currentDate}`}>
                  <div>
                    {cd.centersCount} &nbsp;
                    {cd.centersCount === "1" ? "Center" : "Centers"} <br />
                    {cd.providerCount} &nbsp;
                    {cd.providerCount === "1" ? "Provider" : "Providers"} <br />
                    {cd.totalShiftOnCurrentDate} &nbsp;
                    {cd.totalShiftCount === "1" ? "Shift" : "Shifts"} <br />
                  </div>
                </Link>
                
                {/* Dot icon triggers modal, no navigation */}
                <div 
                className="w-6 h-6 text-hms-green-dark hover:text-hms-green-light cursor-pointer "
             
                >
                  <Dot className="w-6 h-6 text-hms-green-dark hover:text-hms-green-light" />
                </div>
              </div>
            ) : (
              <div key={date.toString()}
              
              onClick={() => {
                handleDotClick(cd);  // Open the modal
              }}>
                {/* Navigation link for non-admin */}
                {/* <Link
                  to={`provider-details?providerID=${user?.id}&date=${dayjs(
                    date
                  ).format("YYYY-MM-DD")}`}
                >
                  <p className="w-full font-semibold h-full flex flex-col items-center gap-2 bg-hms-green-bright text-hms-green-dark my-4 p-1 rounded-lg text-center">
                    <span>
                      <Dot className="w-6 h-6 text-hms-green-dark hover:text-hms-green-light" />
                    </span>
                  </p>
                </Link> */}
  
                {/* Separate Dot icon triggers modal */}
                <div
                  className="cursor-pointer"
               
                >
                  <Dot className="w-6 h-6 text-hms-green-dark hover:text-hms-green-light" />
                </div>
              </div>
            );
          } else return null;
        })}
      </ul>
    );
  }
  
  
  
  

  return (
    <section className="flex flex-col w-[96%] mx-auto h-full">
      <div className="w-full flex justify-end items-center">
        {fetchingExportData ? (
          <Loading contained={true} />
        ) : (
          <CSVLink
            filename={`details_${dayjs()}`}
            className="px-4 font-semibold py-2 rounded-lg text-white bg-hms-green-dark hover:bg-hms-green-light"
            data={exportData?.data.data
              .map((detail: any) =>
                JSON.parse(detail.shiftInfo)
                  .map((sd: any) => {
                    return {
                      date: getDayNamedDate(sd.date),
                      medicalcenter: detail.centerName,
                      roomName: sd.room,
                      providerName: sd.provider,
                      shiftFrom: sd.shiftFrom,
                      shiftTo: sd.shiftTo,
                      shiftType: sd.shiftType
                    };
                  })
                  .filter(
                    (d: any) =>
                      dayjs(d.date).get("month") ===
                      dayjs(currentMonth).get("month")
                  )
              )
              .flat()
              .sort((a:any, b:any) => dayjs(a.date).diff(dayjs(b.date)))
            }
          >
            Export CSV
          </CSVLink>
        )}
      </div>
      <div className="w-full my-4 border-2 border-hms-green-light rounded-lg p-2">
        <Calendar
          onMonthChange={(date) =>
            setCurrentMonth(dayjs(date).format("YYYY-MM-DD"))
          }
          renderCell={renderCell}
        />
        <Modal open={showModal} onClose={() => setShowModal(false)} size="xs" backdrop="static">
  <Modal.Header>
    <Modal.Title>Shift Details</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {selectedShift ? (
      <div>
        {/* Render shift details */}
        {selectedShift.totalShiftOnCurrentDate ? (
          <p>{selectedShift.totalShiftOnCurrentDate} &nbsp;
            {selectedShift.totalShiftOnCurrentDate === "1" ? "shift" : "shifts"}</p>
        ) : (
          <p>No shift data available</p>
        )}
      </div>
    ) : (
      <p>No shift selected</p>
    )}
  </Modal.Body>
  <Modal.Footer>
    {selectedShift && (
      <Button  className="modal-btn bg-hms-green-dark" >
        <Link
          to={`provider-details?providerID=${user?.id}&date=${dayjs(
            selectedShift?.currentDate
          ).format("YYYY-MM-DD")}`}
        >
          View Details
        </Link>
      </Button>
    )}
    <Button onClick={() => setShowModal(false)} appearance="subtle">
      Close
    </Button>
  </Modal.Footer>
</Modal>


      </div>
    </section>
  );
}
export default App;
