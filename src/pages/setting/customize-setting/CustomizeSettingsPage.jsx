import { Fragment } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import TabComponent from "@/components/tab/TabComponent";
import { Activity, Layers, Package, Users } from "lucide-react";
import {
  ProductTab,
  PipelineTab,
  LeadTab,
  ContactTab,
} from "@/container/setting";

const CustomizeSettingsPage = () => {
  const tabs = [
    {
      id: "pipeline",
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
      children: <LeadTab />,
    },
    {
      id: "contacts",
      label: (
        <>
          <Users className="text-primary" />
          Contacts
        </>
      ),
      children: <ContactTab />,
    },
    {
      id: "product",
      label: (
        <>
          <Package className="text-primary" />
          Products
        </>
      ),
      children: <ProductTab />,
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
