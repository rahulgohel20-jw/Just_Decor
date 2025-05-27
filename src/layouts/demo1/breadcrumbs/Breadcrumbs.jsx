import clsx from "clsx";
import { Fragment, useState } from "react";
import { Building2, Contact, Filter, Plus, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import {
  KeenIcon,
  MenuItem,
  MenuToggle,
  MenuLink,
  MenuSub,
  MenuTitle,
  MenuIcon,
  Menu,
} from "@/components";
import AddLead from "@/partials/modals/add-lead/AddLead";
import AddFollowUp from "@/partials/modals/add-follow-up/AddFollowUp";
import AddContact from "@/partials/modals/add-contact/AddContact";
import AddCompany from "@/partials/modals/add-company/AddCompany";

const Breadcrumbs = ({ items }) => {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);

  const renderItems = (items) => {
    const dashboardItem = (
      <Fragment key={`root-${0}`}>
        <Link
          to={"/"}
          className={"text-2sm link shrink-0 hover:underline no-underline"}
          key={`item-${0}`}
          title="Dashboard"
        >
          Dashboard
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
                "text-2sm link shrink-0 hover:underline no-underline"
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

  return (
    <div className="flex [.header_&]:below-lg:hidden justify-between items-center gap-1.25 text-xs lg:text-sm font-medium">
      <h1 className="text-xl font-medium leading-none text-gray-900">
        {items && items[items.length - 1].title}
      </h1>
      <div className="flex items-center">
        <div className="sm:flex hidden flex flex-wrap items-center gap-1">
          {items && renderItems(items)}
        </div>
        {/* Menu Dropdown */}
        <Menu className="items-stretch">
          <MenuItem
            toggle="dropdown"
            trigger="click"
            dropdownProps={{
              placement: "bottom-start",
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, -10],
                  },
                },
              ],
            }}
          >
            <MenuToggle className="btn btn-sm btn-icon">
              <button className="btn btn-sm btn-secondary">
                <Plus />
                Create New
              </button>
            </MenuToggle>
            <MenuSub
              className="menu-default"
              rootClassName="w-full max-w-[200px]"
            >
              <MenuItem onClick={() => setIsLeadModalOpen(true)}>
                <MenuLink>
                  <MenuIcon>
                    <Filter />
                  </MenuIcon>
                  <MenuTitle>Lead</MenuTitle>
                </MenuLink>
              </MenuItem>
              <MenuItem onClick={() => setIsFollowUpModalOpen(true)}>
                <MenuLink>
                  <MenuIcon>
                    <Contact />
                  </MenuIcon>
                  <MenuTitle>Follow Up</MenuTitle>
                </MenuLink>
              </MenuItem>
              <MenuItem onClick={() => setIsContactModalOpen(true)}>
                <MenuLink>
                  <MenuIcon>
                    <UserPlus />
                  </MenuIcon>
                  <MenuTitle>Contact</MenuTitle>
                </MenuLink>
              </MenuItem>
              <MenuItem onClick={() => setIsCompanyModalOpen(true)}>
                <MenuLink>
                  <MenuIcon>
                    <Building2 />
                  </MenuIcon>
                  <MenuTitle>Company</MenuTitle>
                </MenuLink>
              </MenuItem>
            </MenuSub>
          </MenuItem>
        </Menu>
        {/* End Menu Dropdown */}
      </div>
      <AddLead
        isModalOpen={isLeadModalOpen}
        setIsModalOpen={setIsLeadModalOpen}
      />
      <AddFollowUp
        isModalOpen={isFollowUpModalOpen}
        setIsModalOpen={setIsFollowUpModalOpen}
      />
      <AddContact
        isModalOpen={isContactModalOpen}
        setIsModalOpen={setIsContactModalOpen}
      />
      <AddCompany
        isModalOpen={isCompanyModalOpen}
        setIsModalOpen={setIsCompanyModalOpen}
      />
    </div>
  );
};
export { Breadcrumbs };
