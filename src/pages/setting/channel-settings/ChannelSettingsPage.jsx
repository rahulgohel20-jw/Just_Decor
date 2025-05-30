import { Fragment, useState } from "react";
import { ContactRound, Mail } from "lucide-react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import TabComponent from "@/components/tab/TabComponent";
import { EmailTab } from "@/container/setting/Channel/EmailTab";
import { EmailTemplateTab } from "@/container/setting/Channel/EmailTemplateTab";

const ChannelSettingsPage = () => {
  const [emailNotification, setEmailNotification] = useState(false);
  const [whatsappNotification, setWhatsappNotification] = useState(false);
  const [reportTime, setReportTime] = useState("11:53 AM");
  const handleSave = () => {
    alert("Settings saved!");
  };

  const tabs = [
    {
      id: "email",
      label: (
        <>
          <Mail />
          Email
        </>
      ),
      children: <EmailTab />,
    },
    {
      id: "email_template",
      label: (
        <>
          <Mail />
          Email Template
        </>
      ),
      children: <EmailTemplateTab />,
    },
    {
      id: "whatsapp",
      label: (
        <>
          <ContactRound />
          WhatsApp
        </>
      ),
      children: <EmailTab />,
    },
    {
      id: "whatsapp_template",
      label: (
        <>
          <ContactRound />
          WhatsApp Template
        </>
      ),
      children: <EmailTab />,
    },
    {
      id: "stage_template",
      label: (
        <>
          <Mail />
          Stage Template
        </>
      ),
      children: <EmailTab />,
    },
  ];

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Channel" }]} />
        </div>
        <TabComponent tabs={tabs} />
      </Container>
    </Fragment>
  );
};
export { ChannelSettingsPage };
