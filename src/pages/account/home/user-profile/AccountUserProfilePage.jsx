// src/pages/account/user-profile/index.jsx
import { Fragment, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { useLayout } from "@/providers";
import ProfileForm from "@/components/profile/ProfileForm";
import Password from "@/components/profile/Password";
import Log from "@/components/profile/log";
import clsx from "clsx";

const TABS = [
  { key: "account", title: "Account" },
  { key: "security", title: "Security" },
  { key: "logs", title: "User Log" },
];

const AccountUserProfilePage = () => {
  const { currentLayout } = useLayout();
  const [activeTab, setActiveTab] = useState("account");

  const content = {
    account: <ProfileForm />,
    security: <Password />,
    logs: <Log />,
  }[activeTab];

  return (
    <Fragment>
      <Container>
        <div className="mb-3">
          <Breadcrumbs items={[{ title: "User Profile" }]} />
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* LEFT PROFILE CARD */}
          <aside className="col-span-12 lg:col-span-4">
            <div className="rounded-2xl bg-white shadow-[0_12px_30px_rgba(0,0,0,0.06)] p-6">
              <div className="flex flex-col items-center">
                <img
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-white shadow"
                  src="/images/user_img.jpg"
                  alt="profile"
                />
                <h3 className="mt-4 text-xl font-semibold text-[#1E293B]">
                  {/* name is filled by ProfileForm via localStorage fetch */}
                  {/* fallback keeps UI consistent */}
                  {JSON.parse(localStorage.getItem("userData"))?.firstName ??
                    "—"}{" "}
                  {JSON.parse(localStorage.getItem("userData"))?.lastName ?? ""}
                </h3>
                <p className="text-sm text-gray-400">Event Manager</p>
              </div>

              {/* stats */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="rounded-xl border border-[#EEF2F6] bg-white p-4 text-center">
                  <div className="text-[22px] font-semibold">6,900</div>
                  <div className="text-xs text-gray-500">Earnings</div>
                </div>
                <div className="rounded-xl border border-[#EEF2F6] bg-white p-4 text-center">
                  <div className="text-[22px] font-semibold">130</div>
                  <div className="text-xs text-gray-500">Tasks</div>
                </div>
                <div className="rounded-xl border border-[#EEF2F6] bg-white p-4 text-center">
                  <div className="text-[22px] font-semibold">530</div>
                  <div className="text-xs text-gray-500">Hours</div>
                </div>
              </div>

              {/* details */}
              <div className="mt-6 rounded-2xl border border-[#EEF2F6] bg-white">
                <button className="w-full flex items-center justify-between px-5 py-4">
                  <span className="font-medium text-[#0F172A]">Details</span>
                  <i className="ki-filled ki-down text-gray-400" />
                </button>
                <div className="px-5 pb-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Lite Version</span>
                    <button className="rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs px-3 py-1">
                      Upgrade Now
                    </button>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Account ID</div>
                    <div className="text-sm text-[#334155]">ID-45453423</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Company Address</div>
                    <div className="text-sm text-[#334155]">
                      101 Collin Street, Gujarat 3000 VIC Ahmedabad
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Language</div>
                    <div className="text-sm text-[#334155]">English</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">GST No.</div>
                    <div className="text-sm text-[#334155]">TX-8674</div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT MAIN CARD */}
          <section className="col-span-12 lg:col-span-8">
            <div className="rounded-2xl bg-white shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
              {/* tabs + edit */}
              <div className="flex items-center justify-between px-8 pt-6">
                <div className="flex gap-8">
                  {TABS.map((t) => {
                    const active = t.key === activeTab;
                    return (
                      <button
                        key={t.key}
                        onClick={() => setActiveTab(t.key)}
                        className={clsx(
                          "pb-3 text-sm font-medium transition-colors",
                          active
                            ? "text-[#2563EB] border-b-2 border-[#2563EB]"
                            : "text-[#94A3B8] hover:text-[#2563EB]"
                        )}
                      >
                        {t.title}
                      </button>
                    );
                  })}
                </div>
                <button className="rounded-md bg-[#EDF2F7] text-[#0F172A] text-sm px-4 py-2">
                  Edit
                </button>
              </div>

              <hr className="border-0 h-[1px] bg-[#E9EEF5]" />

              <div className="p-8">{content}</div>
            </div>
          </section>
        </div>
      </Container>
    </Fragment>
  );
};

export { AccountUserProfilePage };
