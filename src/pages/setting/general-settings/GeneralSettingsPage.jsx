import { Fragment, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import ProfileForm from "@/components/profile/ProfileForm";
import { UserOutlined } from "@ant-design/icons";
import { Form } from "antd";
import { FormattedMessage } from "react-intl";
const GeneralSettingsPage = () => {
  const [activeTab, setActiveTab] = useState("account");

  const tabs = [
    {
      key: "account",
      icon: UserOutlined,
      title: "Account",
      subtitle: "Manage your profile",
      content: <ProfileForm />,
    },
  ];

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 mb-3">
          <Breadcrumbs items={[{ title: <FormattedMessage id="SETTING.COMPANY_PROFILE" defaultMessage="Company Profile"/> }]} />
        </div>
        <div className="bg-white rounded-lg shadow-sm">
          {tabs.find((tab) => tab.key === activeTab)?.content}
        </div>
      </Container>
    </Fragment>
  );
};

export { GeneralSettingsPage };
