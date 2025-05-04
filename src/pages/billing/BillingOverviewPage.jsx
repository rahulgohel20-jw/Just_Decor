import { Fragment } from "react";
import { Container } from "@/components/container";
import { KeenIcon } from "@/components";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { CommonHexagonBadge } from "@/partials/common";
import { toAbsoluteUrl } from "@/utils";
import {
  FeaturesHighlight,
  Works,
} from "../public-profile/profiles/creator/blocks";

const BillingOverviewPage = () => {
  return (
    <Fragment>
      <style>
        {`
          .user-access-bg {
            background-image: url('${toAbsoluteUrl("/images/bg-5.png")}');
          }
          .dark .user-access-bg {
            background-image: url('${toAbsoluteUrl("/images/bg-5-dark.png")}');
          }
        `}
      </style>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Overview" }]} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 mb-4">
          <div className="flex items-center flex-wrap sm:flex-nowrap justify-between grow border border-gray-200 rounded-xl gap-2 py-7 px-5 rtl:[background-position:-195px_-85px] [background-position:195px_-85px] bg-no-repeat bg-[length:650px] user-access-bg">
            <div className="flex items-center gap-4">
              <CommonHexagonBadge
                stroke="stroke-success-clarity"
                fill="fill-success-light"
                size="size-[50px]"
                badge={<i class="ki-filled ki-wallet text-xl text-success"></i>}
              />
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center flex-wrap gap-2.5">
                  <h3 className="text-xl font-semibold text-success">
                    &#8377; 0.00
                  </h3>
                  <span className="badge badge-sm badge-outline shrink-0">
                    16 days left
                  </span>
                </div>
                <div className="form-info text-gray-800 font-normal">
                  Wallet Balance
                </div>
              </div>
            </div>
            <div className="flex items-center flex-wrap md:flex-nowrap gap-1.5">
              <button
                className="btn btn-sm btn-success shrink-0"
                title="Recharge Now"
              >
                &#8377; Recharge Now
              </button>
            </div>
          </div>
          <div className="flex items-center flex-wrap sm:flex-nowrap justify-between grow border border-gray-200 rounded-xl gap-2 py-7 px-5 rtl:[background-position:-195px_-85px] [background-position:195px_-85px] bg-no-repeat bg-[length:650px] user-access-bg">
            <div className="flex items-center gap-4">
              <CommonHexagonBadge
                stroke="stroke-brand-clarity"
                fill="fill-brand-light"
                size="size-[50px]"
                badge={
                  <KeenIcon
                    icon="security-user"
                    className="text-xl text-brand text-brand"
                  />
                }
              />
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center flex-wrap gap-2.5">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Contact Seles Team
                  </h3>
                  <span className="badge badge-sm badge-outline shrink-0">
                    Hurry up!
                  </span>
                </div>
                <div className="form-info text-gray-800 font-normal">
                  Get personalized assistance for your business needs
                </div>
              </div>
            </div>
            <div className="flex items-center flex-wrap md:flex-nowrap gap-1.5">
              <button
                className="btn btn-sm btn-success shrink-0"
                title="Connect"
              >
                <i class="ki-filled ki-ki-filled ki-whatsapp"></i> Connect
              </button>
            </div>
          </div>
        </div>

          {/* <div className="col-span-2">
            <div className="flex flex-col gap-5 lg:gap-7.5">
              <FeaturesHighlight
                image={
                  <Fragment>
                    <img
                      src={toAbsoluteUrl("/media/illustrations/18.svg")}
                      className="dark:hidden max-h-[200px]"
                      alt=""
                    />
                    <img
                      src={toAbsoluteUrl("/media/illustrations/18-dark.svg")}
                      className="light:hidden max-h-[200px]"
                      alt=""
                    />
                  </Fragment>
                }
                title="Automate Tasks"
                description="Delegate Tasks and get them completed without manual followups"
                more={{
                  title: "Get Started",
                  url: "/network/get-started",
                }}
                features={[
                  ["Time-Saving", "Easy Revamp"],
                  ["Budget-Friendly", "Fresh Look"],
                ]}
              />
            </div>
          </div> */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
          <div className="card min-w-full">
            <div className="card-body p-5">
              <div className="flex flex-col gap-3 lg:gap-4 grow">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <h2 className="text-xl font-semibold text-gray-900">Automate Tasks</h2>
                    </div>
                    <p className="text-2sm text-gray-700">Delegate Tasks and get them completed without manual followups</p>
                  </div>
                  <div className="flex items-center">
                    <button
                      className="btn btn-sm btn-primary shrink-0"
                      title="Add Users"
                    >
                      <i class="ki-filled ki-ki-filled ki-user"></i>Add
                      Users
                    </button>
                  </div>
                </div>
                <div class="flex items-center flex-wrap gap-1 lg:gap-2">
                  <div class="flex items-center gap-2.5 border border-dashed border-input shrink-0 rounded-md px-3.5 py-3 min-w-24 max-w-auto">
                    <i class="ki-filled ki-users text-xl"></i>
                    <div class="flex flex-col">
                      <span class="text-sm text-base leading-none font-bold text-gray-800">5 Users</span>
                      <span class="text-2sm text-2sm text-gray-700">Subscribers</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2.5 border border-dashed border-input shrink-0 rounded-md px-3.5 py-3 min-w-24 max-w-auto">
                    <i class="ki-filled ki-timer text-xl"></i>
                    <div class="flex flex-col">
                      <span class="text-sm text-base leading-none font-bold text-gray-800">Feb 26, 2026</span>
                      <span class="text-2sm text-2sm text-gray-700">Renews On</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2.5 border border-dashed border-input shrink-0 rounded-md px-3.5 py-3 min-w-24 max-w-auto">
                    <span class="text-xl">&#8377;</span>
                    <div class="flex flex-col">
                      <span class="text-sm text-base leading-none font-bold text-gray-800">1,999</span>
                      <span class="text-2sm text-2sm text-gray-700">per user per year</span>
                    </div>
                  </div>
                </div>
                <hr />
                <div class="grid md:grid-cols-1 gap-2">
                  <h4 className="text-llg font-semibold text-gray-900">Features:</h4>
                  <div class="grid md:grid-cols-1 gap-2">
                    <div class="flex items-center gap-1.5">
                      <i class="ki-filled ki-check-circle text-base text-success"></i>
                      <span class="text-sm text-gray-900 text-nowrap">Delegate Unlimited Tasks Team Performance Report</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <i class="ki-filled ki-check-circle text-base text-success"></i>
                      <span class="text-sm text-gray-900 text-nowrap">Links Management for Your Team</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <i class="ki-filled ki-check-circle text-base text-success"></i>
                      <span class="text-sm text-gray-900 text-nowrap">Email Notifications</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <i class="ki-filled ki-check-circle text-base text-success"></i>
                      <span class="text-sm text-gray-900 text-nowrap">WhatsApp Notifications</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <i class="ki-filled ki-check-circle text-base text-success"></i>
                      <span class="text-sm text-gray-900 text-nowrap">Mobile Apps</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <i class="ki-filled ki-check-circle text-base text-success"></i>
                      <span class="text-sm text-gray-900 text-nowrap">Repeated Tasks</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <i class="ki-filled ki-check-circle text-base text-success"></i>
                      <span class="text-sm text-gray-900 text-nowrap">File Uploads</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <i class="ki-filled ki-check-circle text-base text-success"></i>
                      <span class="text-sm text-gray-900 text-nowrap">Delegate Tasks with Voice Notes</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <i class="ki-filled ki-check-circle text-base text-success"></i>
                      <span class="text-sm text-gray-900 text-nowrap">Task Wise Reminders</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <i class="ki-filled ki-check-circle text-base text-success"></i>
                      <span class="text-sm text-gray-900 text-nowrap">Save more than 4 hours per day per employee</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card min-w-full">
            <div className="card-body p-5">
              <div className="flex flex-col gap-3 lg:gap-4 grow">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <h2 className="text-xl font-semibold text-gray-900">Automate Tasks</h2>
                    </div>
                    <p className="text-2sm text-gray-700">Delegate Tasks and get them completed without manual followups</p>
                  </div>
                  <div className="flex items-center">
                    <button
                      className="btn btn-sm btn-primary shrink-0"
                      title="Add Users"
                    >
                      <i class="ki-filled ki-ki-filled ki-user"></i>Add
                      Users
                    </button>
                  </div>
                </div>
                <div class="flex items-center flex-wrap gap-1 lg:gap-2">
                  <div class="flex items-center gap-2.5 border border-dashed border-input shrink-0 rounded-md px-3.5 py-3 min-w-24 max-w-auto">
                    <i class="ki-filled ki-users text-xl"></i>
                    <div class="flex flex-col">
                      <span class="text-sm text-base leading-none font-bold text-gray-800">5 Users</span>
                      <span class="text-2sm text-2sm text-gray-700">Subscribers</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2.5 border border-dashed border-input shrink-0 rounded-md px-3.5 py-3 min-w-24 max-w-auto">
                    <i class="ki-filled ki-timer text-xl"></i>
                    <div class="flex flex-col">
                      <span class="text-sm text-base leading-none font-bold text-gray-800">Feb 26, 2026</span>
                      <span class="text-2sm text-2sm text-gray-700">Renews On</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2.5 border border-dashed border-input shrink-0 rounded-md px-3.5 py-3 min-w-24 max-w-auto">
                    <span class="text-xl">&#8377;</span>
                    <div class="flex flex-col">
                      <span class="text-sm text-base leading-none font-bold text-gray-800">1,999</span>
                      <span class="text-2sm text-2sm text-gray-700">per user per year</span>
                    </div>
                  </div>
                </div>
                <hr />
                <div class="grid md:grid-cols-1 gap-2">
                  <h4 className="text-llg font-semibold text-gray-900">Features:</h4>
                  <div class="grid md:grid-cols-1 gap-2">
                    <div class="flex items-center gap-1.5">
                      <i class="ki-filled ki-check-circle text-base text-success"></i>
                      <span class="text-sm text-gray-900 text-nowrap">Delegate Unlimited Tasks Team Performance Report</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <i class="ki-filled ki-check-circle text-base text-success"></i>
                      <span class="text-sm text-gray-900 text-nowrap">Links Management for Your Team</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <i class="ki-filled ki-check-circle text-base text-success"></i>
                      <span class="text-sm text-gray-900 text-nowrap">Email Notifications</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <i class="ki-filled ki-check-circle text-base text-success"></i>
                      <span class="text-sm text-gray-900 text-nowrap">WhatsApp Notifications</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <i class="ki-filled ki-check-circle text-base text-success"></i>
                      <span class="text-sm text-gray-900 text-nowrap">Mobile Apps</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <i class="ki-filled ki-check-circle text-base text-success"></i>
                      <span class="text-sm text-gray-900 text-nowrap">Repeated Tasks</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <i class="ki-filled ki-check-circle text-base text-success"></i>
                      <span class="text-sm text-gray-900 text-nowrap">File Uploads</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <i class="ki-filled ki-check-circle text-base text-success"></i>
                      <span class="text-sm text-gray-900 text-nowrap">Delegate Tasks with Voice Notes</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <i class="ki-filled ki-check-circle text-base text-success"></i>
                      <span class="text-sm text-gray-900 text-nowrap">Task Wise Reminders</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <i class="ki-filled ki-check-circle text-base text-success"></i>
                      <span class="text-sm text-gray-900 text-nowrap">Save more than 4 hours per day per employee</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card min-w-full">
            <div className="card-body p-5">
              <div className="flex flex-col gap-3 lg:gap-4 grow">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <h2 className="text-xl font-semibold text-gray-900">Automate Tasks</h2>
                    </div>
                    <p className="text-2sm text-gray-700">Delegate Tasks and get them completed without manual followups</p>
                  </div>
                  <div className="flex items-center">
                    <button
                      className="btn btn-sm btn-primary shrink-0"
                      title="Add Users"
                    >
                      <i class="ki-filled ki-ki-filled ki-user"></i>Add
                      Users
                    </button>
                  </div>
                </div>
                <div class="flex items-center flex-wrap gap-1 lg:gap-2">
                  <div class="flex items-center gap-2.5 border border-dashed border-input shrink-0 rounded-md px-3.5 py-3 min-w-24 max-w-auto">
                    <i class="ki-filled ki-users text-xl"></i>
                    <div class="flex flex-col">
                      <span class="text-sm text-base leading-none font-bold text-gray-800">5 Users</span>
                      <span class="text-2sm text-2sm text-gray-700">Subscribers</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2.5 border border-dashed border-input shrink-0 rounded-md px-3.5 py-3 min-w-24 max-w-auto">
                    <i class="ki-filled ki-timer text-xl"></i>
                    <div class="flex flex-col">
                      <span class="text-sm text-base leading-none font-bold text-gray-800">Feb 26, 2026</span>
                      <span class="text-2sm text-2sm text-gray-700">Renews On</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2.5 border border-dashed border-input shrink-0 rounded-md px-3.5 py-3 min-w-24 max-w-auto">
                    <span class="text-xl">&#8377;</span>
                    <div class="flex flex-col">
                      <span class="text-sm text-base leading-none font-bold text-gray-800">1,999</span>
                      <span class="text-2sm text-2sm text-gray-700">per user per year</span>
                    </div>
                  </div>
                </div>
                <hr />
                <div class="grid md:grid-cols-1 gap-2">
                  <h4 className="text-llg font-semibold text-gray-900">Features:</h4>
                  <div class="grid md:grid-cols-1 gap-2">
                    <div class="flex items-center gap-1.5">
                      <i class="ki-filled ki-check-circle text-base text-success"></i>
                      <span class="text-sm text-gray-900 text-nowrap">Delegate Unlimited Tasks Team Performance Report</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <i class="ki-filled ki-check-circle text-base text-success"></i>
                      <span class="text-sm text-gray-900 text-nowrap">Links Management for Your Team</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <i class="ki-filled ki-check-circle text-base text-success"></i>
                      <span class="text-sm text-gray-900 text-nowrap">Email Notifications</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <i class="ki-filled ki-check-circle text-base text-success"></i>
                      <span class="text-sm text-gray-900 text-nowrap">WhatsApp Notifications</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <i class="ki-filled ki-check-circle text-base text-success"></i>
                      <span class="text-sm text-gray-900 text-nowrap">Mobile Apps</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <i class="ki-filled ki-check-circle text-base text-success"></i>
                      <span class="text-sm text-gray-900 text-nowrap">Repeated Tasks</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <i class="ki-filled ki-check-circle text-base text-success"></i>
                      <span class="text-sm text-gray-900 text-nowrap">File Uploads</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <i class="ki-filled ki-check-circle text-base text-success"></i>
                      <span class="text-sm text-gray-900 text-nowrap">Delegate Tasks with Voice Notes</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <i class="ki-filled ki-check-circle text-base text-success"></i>
                      <span class="text-sm text-gray-900 text-nowrap">Task Wise Reminders</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <i class="ki-filled ki-check-circle text-base text-success"></i>
                      <span class="text-sm text-gray-900 text-nowrap">Save more than 4 hours per day per employee</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card min-w-full">
            <div className="card-body p-5">
              <div className="flex flex-col gap-3 lg:gap-4 grow">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <h2 className="text-xl font-semibold text-gray-900">Automate Tasks</h2>
                    </div>
                    <p className="text-2sm text-gray-700">Delegate Tasks and get them completed without manual followups</p>
                  </div>
                  <div className="flex items-center">
                    <button
                      className="btn btn-sm btn-primary shrink-0"
                      title="Add Users"
                    >
                      <i class="ki-filled ki-ki-filled ki-user"></i>Add
                      Users
                    </button>
                  </div>
                </div>
                <div class="flex items-center flex-wrap gap-1 lg:gap-2">
                  <div class="flex items-center gap-2.5 border border-dashed border-input shrink-0 rounded-md px-3.5 py-3 min-w-24 max-w-auto">
                    <i class="ki-filled ki-users text-xl"></i>
                    <div class="flex flex-col">
                      <span class="text-sm text-base leading-none font-bold text-gray-800">5 Users</span>
                      <span class="text-2sm text-2sm text-gray-700">Subscribers</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2.5 border border-dashed border-input shrink-0 rounded-md px-3.5 py-3 min-w-24 max-w-auto">
                    <i class="ki-filled ki-timer text-xl"></i>
                    <div class="flex flex-col">
                      <span class="text-sm text-base leading-none font-bold text-gray-800">Feb 26, 2026</span>
                      <span class="text-2sm text-2sm text-gray-700">Renews On</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2.5 border border-dashed border-input shrink-0 rounded-md px-3.5 py-3 min-w-24 max-w-auto">
                    <span class="text-xl">&#8377;</span>
                    <div class="flex flex-col">
                      <span class="text-sm text-base leading-none font-bold text-gray-800">1,999</span>
                      <span class="text-2sm text-2sm text-gray-700">per user per year</span>
                    </div>
                  </div>
                </div>
                <hr />
                <div class="grid md:grid-cols-1 gap-2">
                  <h4 className="text-llg font-semibold text-gray-900">Features:</h4>
                  <div class="grid md:grid-cols-1 gap-2">
                    <div class="flex items-center gap-1.5">
                      <i class="ki-filled ki-check-circle text-base text-success"></i>
                      <span class="text-sm text-gray-900 text-nowrap">Delegate Unlimited Tasks Team Performance Report</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <i class="ki-filled ki-check-circle text-base text-success"></i>
                      <span class="text-sm text-gray-900 text-nowrap">Links Management for Your Team</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <i class="ki-filled ki-check-circle text-base text-success"></i>
                      <span class="text-sm text-gray-900 text-nowrap">Email Notifications</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <i class="ki-filled ki-check-circle text-base text-success"></i>
                      <span class="text-sm text-gray-900 text-nowrap">WhatsApp Notifications</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <i class="ki-filled ki-check-circle text-base text-success"></i>
                      <span class="text-sm text-gray-900 text-nowrap">Mobile Apps</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <i class="ki-filled ki-check-circle text-base text-success"></i>
                      <span class="text-sm text-gray-900 text-nowrap">Repeated Tasks</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <i class="ki-filled ki-check-circle text-base text-success"></i>
                      <span class="text-sm text-gray-900 text-nowrap">File Uploads</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <i class="ki-filled ki-check-circle text-base text-success"></i>
                      <span class="text-sm text-gray-900 text-nowrap">Delegate Tasks with Voice Notes</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <i class="ki-filled ki-check-circle text-base text-success"></i>
                      <span class="text-sm text-gray-900 text-nowrap">Task Wise Reminders</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <i class="ki-filled ki-check-circle text-base text-success"></i>
                      <span class="text-sm text-gray-900 text-nowrap">Save more than 4 hours per day per employee</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Fragment>
  );
};
export { BillingOverviewPage };
