import { Fragment } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import TabComponent from "@/components/tab/TabComponent";
import { Activity, Layers, Package, Users } from "lucide-react";
import PipelineTab from "@/container/setting/Customize/PipelineTab/PipelineTab";

const CustomizeSettingsPage = () => {
  const tabs = [
    {
      id: "pipline",
      label: (
        <>
          <Activity className="text-primary" />
          Pipeline
        </>
      ),
      children: <PipelineTab />,
    },
    {
      id: "lead",
      label: (
        <>
          <Layers className="text-primary" />
          Lead
        </>
      ),
      children: "Lead",
    },
    {
      id: "contacts",
      label: (
        <>
          <Users className="text-primary" />
          Contacts
        </>
      ),
      children: "Contacts",
    },
    {
      id: "product",
      label: (
        <>
          <Package className="text-primary" />
          Products
        </>
      ),
      children: "Products",
    },
  ];
  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Customize" }]} />
        </div>
        <TabComponent tabs={tabs} />
      </Container>
    </Fragment>
  );
};
export { CustomizeSettingsPage };
