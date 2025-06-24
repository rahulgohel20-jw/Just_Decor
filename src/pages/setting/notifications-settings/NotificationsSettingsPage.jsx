import { React, Fragment, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { toAbsoluteUrl } from "@/utils";

const NotificationsSettingsPage = () => {
  const [emailNotification, setEmailNotification] = useState(false);
  const [whatsappNotification, setWhatsappNotification] = useState(false);
  const [reportTime, setReportTime] = useState("11:53 AM");
  const handleSave = () => {
    alert("Settings saved!");
  };

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Notifications" }]} />
        </div>
        {/* Notification Toggles */}
        <div className=" container my-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-md font-semibold">
              NEW LEAD EMAIL NOTIFICATION TO TEAM
            </span>
            <label className="switch switch-lg">
              <input
                type="checkbox"
                value="1"
                name="check"
                checked={emailNotification}
                onChange={() => setEmailNotification(!emailNotification)}
                defaultChecked
                readOnly
              />
            </label>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-md font-semibold">
              NEW LEAD WHATSAPP NOTIFICATION TO TEAM
            </span>
            <label className="switch switch-lg">
              <input
                type="checkbox"
                value="1"
                name="check"
                checked={whatsappNotification}
                onChange={() => setWhatsappNotification(!whatsappNotification)}
                defaultChecked
                readOnly
              />
            </label>
          </div>
        </div>
        {/* Report Time - In line and full width with dark red theme */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <span className="text-md font-semibold">SET REPORT TIME</span>
            <div className="flex items-center">
              <input
                type="text"
                value={reportTime}
                onChange={(e) => setReportTime(e.target.value)}
                className="border border-red-700 bg-red-100 rounded px-2 py-1 w-24 focus:outline-none focus:ring-2 focus:ring-red-800 text-red-900"
              />
              <div className="w-8 h-8 bg-red-200 rounded-full flex items-center justify-center ml-2">
                <svg
                  className="w-5 h-5 text-red-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            type="button"
            className="btn btn-primary"
            title="Save Changes"
          >
            Save Changes
          </button>
        </div>
      </Container>
    </Fragment>
  );
};
export { NotificationsSettingsPage };
