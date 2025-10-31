import clsx from "clsx";
import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { KeenIcon } from "@/components";
import AddFunctionType from "@/partials/modals/add-function-type/AddFunctionType";
import { Dropdown, Space } from "antd";
import AddEventType from "@/partials/modals/add-event-type/AddEventType";
import AddMember from "@/partials/modals/add-member/AddMember";
import AddCustomer from "@/partials/modals/add-customer/AddCustomer";
import { useNavigate } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { useLanguage } from "@/i18n";

const Breadcrumbs = ({ items }) => {
  const [isCustomerModal, setisCustomerModal] = useState(false);
  const [isEventTypeModalOpen, setIsEventTypeModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isFunctionModal, setIsFunctionModal] = useState(false);
  const navigate = useNavigate();

  const { isRTL } = useLanguage();  

  const renderItems = (items) => {
    const dashboardItem = (
      <Fragment key={`root-${0}`}>
        <Link
          to={"/"}
          className={"text-sm link shrink-0 hover:underline no-underline"}
          key={`item-${0}`}
          title="Dashboard"
        >
          <FormattedMessage id="USER.DASHBOARD.DASHBOARD_LANGUAGE" defaultMessage="Dashboard" />
        </Link>
        <KeenIcon
          icon="right"
          className="text-gray-500 text-3xs"
          key={`separator-${0}`}
        />
      </Fragment>
    );
    let data = items.map((item, index) => {
      const last = index === items.length - 1;
      const key = index + 1;
      return (
        <Fragment key={`root-${key}`}>
          {item.path ? (
            <Link
              to={item.path}
              className={clsx(
                "text-sm link shrink-0 hover:underline no-underline"
              )}
              key={`item-${key}`}
              title={item.title}
            >
              {item.title}
            </Link>
          ) : (
            <span
              className={clsx("text-2sm shrink-0 no-underline text-gray-700")}
              key={`item-${key}`}
            >
              {item.title}
            </span>
          )}
          {!last && (
            <KeenIcon
              icon="right"
              className="text-gray-500 text-3xs"
              key={`separator-${key}`}
            />
          )}
        </Fragment>
      );
    });
    return [dashboardItem, ...data];
  };

  const menuItems = [
    {
      label: (
        <div onClick={() => setisCustomerModal(true)}>
          <i className="ki-filled ki-user me-1.5"></i>
          Customer
        </div>
      ),
      key: "0",
    },
    {
      label: (
        <div onClick={() => setIsEventTypeModalOpen(true)}>
          <i className="ki-filled ki-bank me-1.5"></i>Event Type
        </div>
      ),
      key: "1",
    },
    {
      label: (
        <div onClick={() => setIsFunctionModal(true)}>
          <i className="ki-filled ki-bank me-1.5"></i>Function Type
        </div>
      ),
      key: "2",
    },
    {
      label: (
        <div onClick={() => setIsMemberModalOpen(true)}>
          <i className="ki-filled ki-user me-1.5"></i>Manager
        </div>
      ),
      key: "3",
    },
    {
      label: (
        <div onClick={() => navigate("/quick-custom-package")}>
          <i className="ki-filled ki-package me-1.5"></i>Custom Package
        </div>
      ),
      key: "4",
    },
  ];
  return (
    <div className="flex [.header_&]:below-lg:hidden justify-between items-center gap-1.25 text-xs lg:text-sm font-medium">
      <h1 className="text-xl font-medium leading-none text-gray-900">
        {items && items[items.length - 1].title}
      </h1>
      <div className="flex flex-wrap items-center gap-3">
        <div className="sm:flex hidden flex flex-wrap items-center gap-1">
          {items && renderItems(items)}
        </div>
        {/* Menu Dropdown */}
        <Dropdown
          menu={{ items: menuItems }}
          trigger={["click"]}
          // className="max-w-[370px] w-full"
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <button className="btn btn-sm btn-success" title="Create New">
                <i className="ki-filled ki-plus"></i>
                Create New
              </button>
            </Space>
          </a>
        </Dropdown>
        {/* End Menu Dropdown */}
      </div>

      <AddCustomer
        isModalOpen={isCustomerModal}
        setIsModalOpen={setisCustomerModal}
      />
      <AddEventType
        isModalOpen={isEventTypeModalOpen}
        setIsModalOpen={setIsEventTypeModalOpen}
      />

      <AddMember
        isModalOpen={isMemberModalOpen}
        setIsModalOpen={setIsMemberModalOpen}
      />
      <AddFunctionType
        isOpen={isFunctionModal}
        onClose={() => setIsFunctionModal(false)}
      />
    </div>
  );
};
export { Breadcrumbs };
