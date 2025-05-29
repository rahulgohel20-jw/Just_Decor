import { React, Fragment, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { toAbsoluteUrl } from "@/utils";

const ChannelSettingsPage = () => {
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
          <Breadcrumbs items={[{ title: "channel" }]} />
        </div>
        <div className="card min-w-full">
          <div className="card-table">
            <h1 className="text-center p-10">Channel page</h1>
          </div>
        </div>
      </Container>
    </Fragment>
  );
};
export { ChannelSettingsPage };
