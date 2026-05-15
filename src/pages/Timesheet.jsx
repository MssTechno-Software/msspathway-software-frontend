import { useState } from "react";
import Calender from "../container/Calender";
import DailyWorkLog from "../container/DailyWorkLog";
import Guideline from "../container/Guideline";
import Leave from "../container/Leave";

function Timesheet() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateStatus, setDateStatus] = useState(null);

  const handleDateSelect = ({ date, status }) => {
    setSelectedDate(date);
    setDateStatus(status);
  };

  return (
    <div className="w-full min-h-screen bg-[#f7f8fa]">
      {/* MAIN CONTAINER */}
      <div
        className="
          w-full
          px-3
          sm:px-4
          md:px-5
          lg:px-6
          xl:px-8
          2xl:px-10
          py-4
        "
      >
        {/* LAYOUT */}
        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-1
            xl:grid-cols-[420px_minmax(0,1fr)]
            2xl:grid-cols-[460px_minmax(0,1fr)]
            gap-5
            xl:gap-6
            2xl:gap-8
            items-start
          "
        >
          {/* LEFT PANEL */}
          <div
            className="
              w-full
              flex
              flex-col
              gap-5
            "
          >
            <div className="w-full min-w-0">
              <Calender
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
              />
            </div>

            <div className="w-full">
              <Leave />
            </div>

            <div className="w-full">
              <Guideline />
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="w-full min-w-0">
            <DailyWorkLog
              selectedDate={selectedDate}
              isLeave={dateStatus === "leave"}
              isPublicHoliday={
                dateStatus === "publicholiday"
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Timesheet;