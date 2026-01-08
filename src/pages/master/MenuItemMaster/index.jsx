import { Fragment, useState, useEffect, useRef } from "react";
import { Tabs, Form } from "antd";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import MenuDetailsForm from "./components/MenuDetailsForm";
import AllocationConfig from "./components/AllocationConfig";
import { useLocation } from "react-router-dom";
import { Tooltip } from "antd";

const MenuItemMaster = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("details");
  const [form] = Form.useForm();
  const [allocationForm] = Form.useForm(); // Separate form for allocation
  const [menuDetails, setMenuDetails] = useState({});
  const [allocationConfig, setAllocationConfig] = useState({});
  const editData = location.state?.editData || null;
  const isEdit = !!editData;
  const tabsContainerRef = useRef(null);

  useEffect(() => {
    if (isEdit && editData?.menuItemAllocationConfigs) {
    }
  }, [isEdit, editData]);
  const handleTabChange = (key) => {
    if (key === "allocation") {
      allocationRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }

    // Normal behavior for other tabs
    setActiveTab(key);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextToAllocation = () => {
    setActiveTab("allocation");
  };

  const handleBackToDetails = () => {
    setActiveTab("details");
  };

  return (
    <Fragment>
      <Container>
        <div className="pb-2">
          <Breadcrumbs
            items={[
              {
                title: isEdit
                  ? "Edit Menu Item"
                  : "Create Menu Item And Recipe",
              },
            ]}
          />
        </div>

        <Tabs
          ref={tabsContainerRef}
          activeKey={activeTab}
          onChange={handleTabChange}
          className="[&_.ant-tabs-nav]:mb-0 [&_.ant-tabs-tab-btn]:text-sm custom-tabs"
          items={[
            {
              key: "details",
              label: "Menu Item Details",
              children: (
                <MenuDetailsForm
                  form={form}
                  onNext={handleNextToAllocation}
                  setMenuDetails={setMenuDetails}
                  editData={editData}
                  isEdit={isEdit}
                />
              ),
            },

            {
              key: "allocation",
              label: (
                <div className="flex items-center gap-2">
                  <span>Allocation Configuration</span>

                  <Tooltip
                    placement="bottom"
                    color="#1f2937"
                    overlayInnerStyle={{ fontSize: "12px", lineHeight: "1.4" }}
                    title={
                      <div>
                        <div className="font-medium mb-1">Allocation Setup</div>
                        <div className="text-xs text-gray-300">
                          scroll down to Next to access Allocation Configuration
                        </div>
                      </div>
                    }
                  >
                    <i className="ki-filled ki-information text-[#6A7C94] cursor-pointer" />
                  </Tooltip>
                </div>
              ),
              children: (
                <AllocationConfig
                  form={allocationForm}
                  onPrev={handleBackToDetails}
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
