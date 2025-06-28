import { React, Fragment, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { CommonHexagonBadge } from "@/partials/common";
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
      <style>
        {`
          .user-access-bg {
            background-image: url('${toAbsoluteUrl("/images/bg_01.png")}');
          }
          .dark .user-access-bg {
            background-image: url('${toAbsoluteUrl("/images/bg_01_dark.png")}');
          }
        `}
      </style>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Notifications" }]} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 lg:gap-4 mb-4">
          <div className="col-span-3 md:col-start-2 card min-w-full">
            <div class="flex justify-between items-center p-5 border-b">
              <h4 class="font-semibold text-gray-900">General Settings</h4>
            </div>
            <div class="flex flex-col rtl:[background-position:center_center] [background-position:center_center] bg-no-repeat bg-[length:650px] user-access-bg">
              <div class="flex justify-between items-center p-5 gap-2 border-b">
                <div class="flex items-center gap-4">
                  <CommonHexagonBadge
                    stroke="stroke-success-clarity"
                    fill="fill-success-light"
                    size="size-[50px]"
                    badge={
                      <i className="ki-filled ki-ki-filled ki-sms text-xl text-success"></i>
                    }
                  />
                  <div class="flex flex-col">
                    <h3 class="text-base font-medium text-gray-900">
                      New lead email notification to team
                    </h3>
                    <p class="text-sm text-gray-700">
                      An email notification will be sent to the team whenever a
                      new lead is added.
                    </p>
                  </div>
                </div>
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
              <div class="flex justify-between items-center p-5 gap-2 border-b">
                <div class="flex items-center gap-4">
                  <CommonHexagonBadge
                    stroke="stroke-success-clarity"
                    fill="fill-success-light"
                    size="size-[50px]"
                    badge={
                      <i className="ki-filled ki-ki-filled ki-whatsapp text-xl text-success"></i>
                    }
                  />
                  <div class="flex flex-col">
                    <h3 class="text-base font-medium text-gray-900">
                      New lead whatsapp notification to team
                    </h3>
                    <p class="text-sm text-gray-700">
                      Get instant WhatsApp alerts to the team whenever a new
                      lead is generated.
                    </p>
                  </div>
                </div>
                <label className="switch switch-lg">
                  <input
                    type="checkbox"
                    value="1"
                    name="check"
                    checked={whatsappNotification}
                    onChange={() =>
                      setWhatsappNotification(!whatsappNotification)
                    }
                    defaultChecked
                    readOnly
                  />
                </label>
              </div>
              <div class="flex justify-between items-center p-5 gap-2 border-b">
                <div class="flex items-center gap-4">
                  <CommonHexagonBadge
                    stroke="stroke-success-clarity"
                    fill="fill-success-light"
                    size="size-[50px]"
                    badge={
                      <i className="ki-filled ki-time text-xl text-success"></i>
                    }
                  />
                  <div class="flex flex-col">
                    <h3 class="text-base font-medium text-gray-900">
                      Set report time
                    </h3>
                    <p class="text-sm text-gray-700">
                      Define report sending time as needed.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="input">
                    <i className="ki-filled ki-time"></i>
                    <input className="h-full" type="time" placeholder="HH:MM" />
                  </div>
                </div>
              </div>
            </div>
            <div class="flex justify-end items-center p-5">
              <button
                onClick={handleSave}
                type="button"
                className="btn btn-primary"
                title="Save Changes"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </Container>
    </Fragment>
  );
};
export { NotificationsSettingsPage };
