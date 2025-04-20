import clsx from "clsx";
import { Fragment } from "react";
import { useLocation } from "react-router";
import { KeenIcon } from "@/components";
import { useMenuBreadcrumbs } from "@/components/menu";
import { useMenus } from "@/providers";
import { Link } from "react-router-dom";
const Breadcrumbs = ({ items }) => {
  const { pathname } = useLocation();
  const { getMenuConfig } = useMenus();
  const menuConfig = getMenuConfig("primary");
  const renderItems = (items) => {
    const dashboardItem = (
      <Fragment key={`root-${0}`}>
        <Link
          to={"/"}
          className={
            "text-2sm link shrink-0 hover:underline no-underline text-gray-700"
          }
          key={`item-${0}`}
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
  const render = () => {
    return (
      <div className="flex [.header_&]:below-lg:hidden justify-between items-center gap-1.25 text-xs lg:text-sm font-medium">
        <h1 className="text-xl font-medium leading-none text-gray-900">
          {items && items[items.length - 1].title}
        </h1>
        <div className="sm:flex hidden flex flex-wrap items-center gap-1">
          {items && renderItems(items)}

          {/* <div className="dropdown" data-dropdown="true" data-dropdown-trigger="click">
            <button className="dropdown-toggle btn btn-sm btn-light ms-1">Create new</button>
            <div className="dropdown-content w-full max-w-56 py-2">
              <div className="menu menu-default flex flex-col w-full">
                <div className="menu-item">
                  <a className="menu-link" href="#">
                    <span className="menu-icon"><i className="ki-outline ki-badge"></i></span>
                    <span className="menu-title">Menu item 1</span>
                  </a>
                </div>
                <div className="menu-item">
                  <a className="menu-link" href="#">
                    <span className="menu-icon"><i className="ki-outline ki-profile-circle"></i></span>
                    <span className="menu-title">Menu item 2</span>
                  </a>
                </div>
                <div className="menu-item">
                  <a className="menu-link" href="#">
                    <span className="menu-icon"><i className="ki-outline ki-setting-2"></i></span>
                    <span className="menu-title">Menu item 3</span>
                    <span className="menu-badge"><span className="badge badge-sm badge-outline badge-pill badge-primary">New</span></span>
                  </a>
                </div>
                <div className="menu-item">
                  <a className="menu-link" href="#">
                    <span className="menu-icon"><i className="ki-outline ki-message-programming"></i></span>
                    <span className="menu-title">Menu item 4</span>
                  </a>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    );
  };
  return render();
};
export { Breadcrumbs };
