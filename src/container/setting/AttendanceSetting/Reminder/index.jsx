

import { Breadcrumbs } from "@mui/material";
import { Container } from "lucide-react";
import { Fragment, useState } from "react";
const Reminder = () => {
  
  const [showTimeSetter, setShowTimeSetter] = useState(false);
      const [selectedTime, setSelectedTime] = useState("04:31 PM");
      const [isToggled, setIsToggled] = useState(true); // State for toggle 

      const handleClockClick = () => {
        setShowTimeSetter(true);
      };

      const updateTime = (hours, minutes, period) => {
        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        setSelectedTime(`${formattedHours}:${formattedMinutes} ${period}`);
      };

      const handleToggle = () => {
        setIsToggled(!isToggled);
      };
  
  return (
          <div>
            {/* Breadcrumbs */}
            <div className="gap-2 pb-2 mb-3">
              <Breadcrumbs items={[{ title: "Register Face" }]} />
            </div>
           
            <div className="p-6 max-w-lg mx-auto bg-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Reminders</h2>
            
          </div>
          <div className="mb-4 flex justify-between items-center">
            <span className="text-lg">Daily Attendance Report</span>
            <button
              onClick={handleToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isToggled ? 'bg-primary' : 'bg-gray-4  00'}`}
            >
              <span className="sr-only">Toggle Daily Attendance Report</span>
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-light transition-transform ${isToggled ? 'translate-x-6' : 'translate-x-0'}`}
              />
            </button>
          </div>
          <div className="mb-4 flex justify-between items-center">
            <span className="text-lg">Daily Attendance Report Time</span>
            <div className="flex items-center">
              <button onClick={handleClockClick} className=" text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
              <i className="ki-filled ki-time me-2 text-[22px] text-success"></i>
                
              </button>
              <span className="text-primary">{selectedTime}</span>
            </div>
          </div>
          {showTimeSetter && (
            <div className="mt-2 p-2 bg-white border rounded shadow flex space-x-2">
              <input
                type="number"
                defaultValue={4}
                min={1}
                max={12}
                onChange={(e) => {
                  const hours = parseInt(e.target.value, 10);
                  if (hours >= 1 && hours <= 12) {
                    updateTime(hours, parseInt(selectedTime.split(':')[1]), selectedTime.split(' ')[1]);
                  }
                }}
                className="w-16 p-1 border rounded"
              />
              <span>:</span>
              <input
                type="number"
                defaultValue={47}
                min={0}
                max={59}
                onChange={(e) => {
                  const minutes = parseInt(e.target.value, 10);
                  if (minutes >= 0 && minutes <= 59) {
                    updateTime(parseInt(selectedTime.split(':')[0]), minutes, selectedTime.split(' ')[1]);
                  }
                }}
                className="w-16 p-1 border rounded"
              />
              <select
                onChange={(e) => {
                  const period = e.target.value;
                  updateTime(parseInt(selectedTime.split(':')[0]), parseInt(selectedTime.split(':')[1]), period);
                }}
                className="p-1 border rounded"
                defaultValue="PM"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
              <button
                onClick={() => setShowTimeSetter(false)}
                className="ml-2 bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
              >
                Set
              </button>
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-600">Timezone</label>
            <input
              type="text"
              
              placeholder="Asia/India"
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <button className="w-full bg-primary text-white  p-2 rounded hover:bg-primary/90">
            Save
          </button>
        </div>
            
        </div>   
          
  );
};
export  {Reminder};
