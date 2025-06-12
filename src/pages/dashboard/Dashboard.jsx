import { Fragment } from "react";
import { Container } from "@/components/container";
import { ChannelStats, EntryCallout, Highlights } from "../dashboards";
import { toAbsoluteUrl } from "@/utils/Assets";
import { Link } from "react-router-dom";
import {
  BookUser,
  Contact,
  ContactIcon,
  Filter,
  Grid,
  LayoutPanelLeft,
  Link2,
  VideoIcon,
} from "lucide-react";

const Dashboard = () => {
  const items = [
    {
      title: "Dashboard",
      desc: "Clear view of your performance anytime",
      // icon: (<CommonHexagonBadge stroke="stroke-success-clarity" fill="fill-success-light" size="size-[50px]" badge={<i className="ki-filled ki-wallet  text-xl text-success"></i>}/>),
      icon: <LayoutPanelLeft size={30} className="text-primary" />,
      linkText: "Explore More",
      path: "/overview",
    },
    {
      title: "Automate Leads",
      desc: "Track and Convert and assign leads to your Sales Team",
      icon: <Filter size={30} className="text-primary" />,
      linkText: "Explore More",
      path: "/lead",
    },
    {
      title: "Contacts",
      desc: "Effortlessly manage your contacts with ease",
      icon: <BookUser size={30} className="text-primary" />,
      linkText: "Explore More",
      path: "/contacts",
    },
    {
      title: "Follow-up",
      desc: "Add follow-up ta stay organize and moving forward",
      icon: <Contact size={30} className="text-primary" />,
      linkText: "Explore More",
      path: "/followup",
    },
    {
      title: "AutomateIntranet",
      desc: "Manage all your important company links",
      icon: <ContactIcon size={30} className="text-primary" />,
      linkText: "Explore More",
      path: "/links",
    },
    {
      title: "Automate Team",
      desc: "Manage Your Tasks, Leaves and attendance",
      icon: <Link2 size={30} className="text-primary" />,
      linkText: "Explore More",
      path: "/team",
    },
    {
      title: "Tutorials",
      desc: "Learn how to get best out off Business Workflow",
      icon: <VideoIcon size={30} className="text-primary" />,
      linkText: "Explore More",
      path: "/support/tutorials",
    },
  ];
  const renderItem = (item, index) => {
    return (
      <div
        key={index}
        className="card flex-col p-0 justify-between h-full bg-cover rtl:bg-[left_top_-1.7rem] bg-[right_top_-1.7rem] bg-no-repeat channel-stats-bg"
      >
        <div className="flex flex-col gap-2 p-5">
          <div className="flex gap-1">{item.icon}</div>
          <div className="flex flex-col gap-1.5">
            <h4 className="text-lg font-semibold text-gray-900">
              {item.title}
            </h4>
            <span className="text-sm font-normal text-gray-700">
              {item.desc}
            </span>
          </div>
        </div>
        <div className="flex justify-center p-4 border-t">
          <Link to={item.path} className="text-success">
            {item.linkText}
          </Link>
        </div>
      </div>
    );
  };
  return (
    <Fragment>
      <style>
        {`
          .channel-stats-bg {
            background-image: url('${toAbsoluteUrl("/images/bg_03.png")}');
          }
          .dark .channel-stats-bg {
            background-image: url('${toAbsoluteUrl("/images/bg_03_dark.png")}');
          }
        `}
      </style>
      <Container>
        <div className="grid gap-3 lg:gap-4">
          <div className="lg:col-span-1">
            <div className="grid grid-cols-4 gap-3.5 lg:gap-4.5 h-full items-stretch">
              {items.map((item, index) => {
                return renderItem(item, index);
              })}
            </div>
          </div>
          <div className="lg:col-span-1"></div>
        </div>
      </Container>
    </Fragment>
  );
};
export { Dashboard };
