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
      icon: <LayoutPanelLeft size={30} className="text-primary" />,
      linkText: "Go To Dashboard",
      path: "/overview",
    },
    {
      title: "Automate Leads",
      desc: "Track and Convert and assign leads to your Sales Team",
      icon: <Filter size={30} className="text-primary" />,
      linkText: "Go To Leads",
      path: "/lead",
    },
    {
      title: "Contacts",
      desc: "Effortlessly manage your contacts with ease",
      icon: <BookUser size={30} className="text-primary" />,
      linkText: "Go To Contacts",
      path: "/contacts",
    },
    {
      title: "Follow-up",
      desc: "Add follow-up ta stay organize and moving forward",
      icon: <Contact size={30} className="text-primary" />,
      linkText: "Go To Follow-up",
      path: "/followup",
    },
    {
      title: "AutomateIntranet",
      desc: "Manage all your important company links",
      icon: <ContactIcon size={30} className="text-primary" />,
      linkText: "Go To Intranet",
      path: "/links",
    },
    {
      title: "Automate Team",
      desc: "Manage Your Tasks, Leaves and attendance",
      icon: <Link2 size={30} className="text-primary" />,
      linkText: "Go To Automate Team",
      path: "/team",
    },
    {
      title: "Tutorials",
      desc: "Learn how to get best out off Business Workflow",
      icon: <VideoIcon size={30} className="text-primary" />,
      linkText: "Go To Tutorials",
      path: "/support/tutorials",
    },
  ];
  const renderItem = (item, index) => {
    return (
      <div
        key={index}
        className="card flex-col justify-between gap-6 h-full bg-cover rtl:bg-[left_top_-1.7rem] bg-[right_top_-1.7rem] bg-no-repeat channel-stats-bg"
      >
        <div className="flex flex-col gap-1 px-5 mt-4">
          <div className="flex gap-1">
            {item.icon}
            <h4 className="text-primary">{item.title}</h4>
          </div>
          <span className="text-2sm font-normal mt-2 text-gray-700">
            {item.desc}
          </span>
        </div>

        <div className="flex justify-center gap-1 pb-4 px-5">
          <Link to={item.path} className="text-success ">
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
            background-image: url('${toAbsoluteUrl("/media/images/2600x1600/bg-3.png")}');
          }
          .dark .channel-stats-bg {
            background-image: url('${toAbsoluteUrl("/media/images/2600x1600/bg-3-dark.png")}');
          }
        `}
      </style>
      <Container>
        <div className="grid gap-5 lg:gap-7.5">
          <div className="lg:col-span-1">
            <div className="grid grid-cols-4 gap-5 lg:gap-7.5 h-full items-stretch">
              {items.map((item, index) => {
                return renderItem(item, index);
              })}
            </div>
          </div>
        </div>
      </Container>
    </Fragment>
  );
};
export { Dashboard };
