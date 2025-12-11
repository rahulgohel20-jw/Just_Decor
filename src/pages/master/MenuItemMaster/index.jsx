import { Fragment, useState } from "react";
import { Tabs, Form } from "antd";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import MenuDetailsForm from "./components/MenuDetailsForm";
import AllocationConfig from "./components/AllocationConfig";
import { useLocation } from "react-router-dom";

const MenuItemMaster = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("details");
  const [form] = Form.useForm();
  const [menuDetails, setMenuDetails] = useState({});
  const [allocationConfig, setAllocationConfig] = useState({});
  const editData = location.state?.editData || null;
  const isEdit = !!editData;
  return (
    <Fragment>
      <Container>
        <div className="pb-2">
          <Breadcrumbs
            items={[
              {
                title: "Add Menu Item",
              },
            ]}
          />
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="[&_.ant-tabs-nav]:mb-0 [&_.ant-tabs-tab-btn]:text-sm custom-tabs"
          items={[
            {
              key: "details",
              label: "Menu Item Details",
              children: (
                <MenuDetailsForm
                  form={form}
                  onNext={() => setActiveTab("allocation")}
                  setMenuDetails={setMenuDetails}
                  editData={editData}
                  isEdit={isEdit}
                />
              ),
            },
            {
              key: "allocation",
              label: "Allocation Configuration",
              children: (
                <AllocationConfig
                  form={form}
                  onPrev={() => setActiveTab("details")}
                  menuDetails={menuDetails}
                  allocationConfig={allocationConfig}
                  setAllocationConfig={setAllocationConfig}
                  editData={editData}
                  isEdit={isEdit}
                />
              ),
            },
          ]}
        />
      </Container>
    </Fragment>
  );
};

export default MenuItemMaster;
