import { Fragment, useState, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { Container } from "@/components/container";
import { useLanguage } from "@/i18n";
import {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
} from "@/layouts/demo1/toolbar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { addDays, format } from "date-fns";
import { cn } from "@/lib/utils";
import { KeenIcon } from "@/components/keenicons";
import {
  ChannelStats,
  EarningsChart,
  Highlights,
  Teams,
} from "../dashboards/demo1";
import {
  GetUsersByRoleId,
  SuperAdminDashboardTotalUserAndPlan,
} from "../../services/apiServices";

const Dashboard = () => {
  const [date, setDate] = useState({
    from: new Date(2025, 0, 20),
    to: addDays(new Date(2025, 0, 20), 20),
  });

  const [dashboardData, setDashboardData] = useState(null);
  const [teamsData, setTeamsData] = useState([]);
  const { isRTL } = useLanguage();

  // 🔥 Fetch dashboard data
  useEffect(() => {
    SuperAdminDashboardTotalUserAndPlan()
      .then((res) => {
        if (res?.data?.success === true) {
          setDashboardData(res.data.data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await GetUsersByRoleId(2);
        if (res?.data?.success === true) {
          const users = res?.data?.data?.["User Details"] || [];

          const mappedTeams = users.map((user) => ({
            id: user.id,
            name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
            phone: user.contactNo || user.userBasicDetails?.officeNo || "N/A",
            company_name: user["userBasicDetails"]?.companyName || "N/A",
            city: user["userBasicDetails"]?.city.name || "N/A",
            is_active: user.isActive ?? false,
            created_at:
              user.createdAt || user.userBasicDetails?.createdAt || "N/A",
            created_at_iso: user.createdAt
              ? new Date(
                  user.createdAt.split("/").reverse().join("-"),
                ).toISOString()
              : null,
          }));

          setTeamsData(mappedTeams);
        }
      } catch (err) {
        console.error("Error fetching team:", err);
      }
    };

    fetchTeam();
  }, []);

  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading
            title={
              <FormattedMessage
                id="USER.DASHBOARD.DASHBOARD_LANGUAGE"
                defaultMessage="Dashboard"
              />
            }
            description={
              <FormattedMessage
                id="USER.DASHBOARD.DASHBOARD_DESCRIPTION"
                defaultMessage="A Central Hub For Your Personal Customization"
              />
            }
          />
          <ToolbarActions>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  id="date"
                  className={cn(
                    "btn btn-sm btn-light data-[state=open]:bg-light-active",
                    !date && "text-gray-400",
                  )}
                >
                  <KeenIcon icon="calendar" className="me-0.5" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </ToolbarActions>
        </Toolbar>
      </Container>

      <Container>
        <div className="grid gap-5 lg:gap-7.5">
          <div className="grid lg:grid-cols-1 gap-y-5 lg:gap-7.5 items-stretch">
            <div className="">
              <div className="flex gap-5 h-full">
                <ChannelStats data={dashboardData} />
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-5 lg:gap-7.5 items-stretch">
            <div className="lg:col-span-1">
              <Highlights limit={3} data={dashboardData} />
            </div>

            <div className="lg:col-span-2">
              <EarningsChart />
            </div>
          </div>

          {/* Pass dynamic API data as prop */}
          <div>
            <Teams data={teamsData} />
          </div>
        </div>
      </Container>
    </Fragment>
  );
};

export default Dashboard;
