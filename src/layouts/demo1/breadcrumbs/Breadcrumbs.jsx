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
      <div className="flex [.header_&]:below-lg:hidden justify-between items-center gap-1.25 text-xs lg:text-sm font-medium mb-2.5 lg:mb-0">
        <div>{items && items[items.length - 1].title}</div>
        <div>{items && renderItems(items)}</div>
      </div>
    );
  };
  return render();
};
export { Breadcrumbs };
