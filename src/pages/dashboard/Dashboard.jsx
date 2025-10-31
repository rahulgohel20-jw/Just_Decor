import { Fragment, useState } from "react";
import { FormattedMessage } from 'react-intl';
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

const Dashboard = () => {
  const [date, setDate] = useState({
    from: new Date(2025, 0, 20),
    to: addDays(new Date(2025, 0, 20), 20),
  });
  const { isRTL } = useLanguage();
  
  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading
            title={<FormattedMessage id="USER.DASHBOARD.DASHBOARD_LANGUAGE" defaultMessage="Dashboard" />}
            description={<FormattedMessage id="USER.DASHBOARD.DASHBOARD_DESCRIPTION" defaultMessage="A Central Hub For Your Personal Customization" />}
          />
          <ToolbarActions>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  id="date"
                  className={cn(
                    "btn btn-sm btn-light data-[state=open]:bg-light-active",
                    !date && "text-gray-400"
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
                <ChannelStats />
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-5 lg:gap-7.5 items-stretch">
            <div className="lg:col-span-1">
              <Highlights limit={3} />
            </div>

            <div className="lg:col-span-2">
              <EarningsChart />
            </div>
          </div>
          
          <div>
            <Teams />
          </div>
        </div>
      </Container>
    </Fragment>
  );
};

export { Dashboard };