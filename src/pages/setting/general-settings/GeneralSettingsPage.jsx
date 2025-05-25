import { Fragment } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import TabComponent from "@/components/tab/TabComponent";
import {
  Activity,
  Database,
  DatabaseIcon,
  Layers,
  Package,
  User,
  Users,
} from "lucide-react";
import {
  RoleAndPermission,
  BulkDataImport,
  ExportLead,
} from "@/container/setting";

const GeneralSettingsPage = () => {
  const tabs = [
    {
      id: "roleandpermission",
      label: (
        <>
          {/* <User className="text-primary" /> */}
          <i className="ki-filled ki-security-user"></i>
          Role And Permission
        </>
      ),
      children: <RoleAndPermission />,
    },
    {
      id: "bulkdata",
      label: (
        <>
          {/* <DatabaseIcon className="text-primary" /> */}
          <i className="ki-filled ki-parcel"></i>
          Bulk Data Import
        </>
      ),
      children: <BulkDataImport />,
    },
    {
      id: "exportleads",
      label: (
        <>
          {/* <Layers className="text-primary" /> */}
          <i className="ki-filled ki-file-down"></i>
          Export Leads
        </>
      ),
      children: <ExportLead />,
    },
  ];
  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "General Setting" }]} />
        </div>
        <TabComponent tabs={tabs} />
      </Container>
    </Fragment>
  );
};
export { GeneralSettingsPage };
