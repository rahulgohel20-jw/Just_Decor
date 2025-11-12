import { Fragment, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import ProfileForm from "@/components/profile/ProfileForm";
import Password from "@/components/profile/Password";
import Log from "@/components/profile/log";
import clsx from "clsx";
import Priceplan from "@/partials/modals/priceplan/Priceplan";
import { toAbsoluteUrl } from "@/utils";
import { FormattedMessage } from "react-intl";
import { Form } from "antd";

const TABS = [
  {
    key: "account",
    title: <FormattedMessage id="PROFILE.PROFILE" defaultMessage="Profile" />,
  },
  {
    key: "security",
    title: <FormattedMessage id="PROFILE.SECURITY" defaultMessage="Security" />,
  },
  {
    key: "logs",
    title: <FormattedMessage id="PROFILE.LOGS" defaultMessage="User Log" />,
  },
];

const AccountUserProfilePage = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [priceModal, setPriceModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    companyAddress: "",
  });

  const handleSave = () => {
    const submitButton = document.getElementById("profile-form-submit");
    if (submitButton) {
      submitButton.click();
    }
  };

  const handleSaveSuccess = () => {
    setIsEditing(false);
  };

  const content = {
    account: (
      <ProfileForm isEditing={isEditing} onSaveSuccess={handleSaveSuccess} />
    ),
    security: <Password isEditing={isEditing} />,
    logs: <Log isEditing={isEditing} />,
  }[activeTab];

  return (
    <Fragment>
      <Container>
        <div className="mb-3">
          <Breadcrumbs
            items={[
              {
                title: (
                  <FormattedMessage
                    id="PROFILE.USER_PROFILE"
                    defaultMessage="User Profile"
                  />
                ),
              },
            ]}
          />
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <aside className="col-span-12 lg:col-span-4">
            <div className="rounded-2xl bg-white shadow-[0_12px_30px_rgba(0,0,0,0.06)] p-6">
              <div className="flex flex-col items-center relative group">
                <div className="relative">
                  <img
                    className="w-24 h-24 rounded-full object-cover ring-4 ring-white shadow"
                    src={
                      profileData.image || toAbsoluteUrl("/images/user_img.jpg")
                    }
                    alt="profile"
                  />

                  {/* Hover Overlay */}
                  <div
                    className="absolute inset-0 rounded-full bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                    onClick={() =>
                      document.getElementById("upload-image-input").click()
                    }
                  >
                    {!profileData.image ? (
                      <img
                        src={toAbsoluteUrl("/media/icons/camera.png")}
                        alt="upload"
                        className="w-6 h-6"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setProfileData({ ...profileData, image: "" });
                        }}
                        className="bg-white p-1 rounded-full"
                      >
                        <img
                          src={toAbsoluteUrl("/media/icons/delete.png")}
                          alt="delete"
                          className="w-4 h-4"
                        />
                      </button>
                    )}
                  </div>

                  {/* Hidden File Input */}
                  <input
                    id="upload-image-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          setProfileData({
                            ...profileData,
                            image: reader.result,
                          });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>

                <h3 className="mt-4 text-xl font-semibold text-[#1E293B] mb-2">
                  {JSON.parse(localStorage.getItem("userData"))?.firstName ??
                    "—"}{" "}
                  {JSON.parse(localStorage.getItem("userData"))?.lastName ?? ""}
                </h3>
                <p className="text-sm text-[#B5B5C3]">
                  <FormattedMessage
                    id="PROFILE.USER_ROLE"
                    defaultMessage="Owner"
                  />
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-6 mb-6">
                <div className="rounded-xl border border-[#EEF2F6] bg-white p-4 text-center">
                  <div className=" flex gap-2 text-base font-semibold mb-2">
                    6,900{" "}
                    <img
                      className="w-4 h-4 rounded-full object-cover ring-4 ring-white shadow"
                      src={toAbsoluteUrl("/media/images/Arrow.png")}
                      alt="profile"
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    <FormattedMessage
                      id="PROFILE.USER_EARNINGS"
                      defaultMessage="Earnings"
                    />
                  </div>
                </div>
                <div className="rounded-xl border border-[#EEF2F6] bg-white p-4 text-center">
                  <div className=" flex gap-2  text-base font-semibold mb-2">
                    130
                    <img
                      className="w-4 h-4 rounded-full object-cover ring-4 ring-white shadow"
                      src={toAbsoluteUrl("/media/images/Arrow.png")}
                      alt="profile"
                    />
                  </div>
                  <div className="  text-xs text-gray-500">
                    <FormattedMessage
                      id="PROFILE.USER_EVENTS"
                      defaultMessage="Events"
                    />
                  </div>
                </div>
                <div className="rounded-xl border border-[#EEF2F6] bg-white p-4 text-center">
                  <div className=" flex gap-2 text-base font-semibold mb-2">
                    530
                    <img
                      className="w-4 h-4 rounded-full object-cover ring-4 ring-white shadow"
                      src={toAbsoluteUrl("/media/images/Arrow.png")}
                      alt="profile"
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    <FormattedMessage
                      id="PROFILE.USER_HOURS"
                      defaultMessage="Hours"
                    />
                  </div>
                </div>
              </div>

              <hr className="border-2 border-dotted" />
              <div className=" mt-1 rounded-2xl  bg-white">
                <button className="w-full flex items-center justify-between px-3 py-2">
                  <span className="text-base  text-[#0F172A]">
                    <FormattedMessage
                      id="PROFILE.DETAILS"
                      defaultMessage="Details"
                    />
                  </span>
                </button>
                <div className="px-5 pb-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-[200px]">
                      <span className="text-sm bg-primary text-white p-2 rounded-2xl">
                        <FormattedMessage
                          id="PROFILE.LITE_VERSION"
                          defaultMessage="Lite Version"
                        />
                      </span>
                    </div>
                    <div className="flex flex-col w-[200px] gap-1 bg-[#EFF6FF] p-2 rounded-2xl">
                      <span className="text-xs text-center text-[#005BA8]">
                        <FormattedMessage
                          id="PROFILE.UPGRADE_YOUR_PLAN"
                          defaultMessage="Upgrade Your Plan"
                        />
                      </span>
                      <span className="text-xs text-center">
                        <FormattedMessage
                          id="PROFILE.GO_PRO_DESCRIPTION"
                          defaultMessage="Go Pro for more Features and better support."
                        />
                      </span>
                      <button
                        className="rounded-full bg-primary text-white text-xs px-3 py-1"
                        onClick={() => {
                          setPriceModal(true);
                        }}
                      >
                        <FormattedMessage
                          id="PROFILE.UPGRADE_NOW"
                          defaultMessage="Upgrade Now"
                        />
                      </button>
                    </div>
                  </div>
                </div>
                <hr className="border-2 border-dotted mb-4" />
                <div className="px-5 pb-5 space-y-4">
                  <div>
                    <div className="text-base text-black">
                      <FormattedMessage
                        id="PROFILE.ACCOUNT_ID"
                        defaultMessage="Account ID"
                      />
                    </div>
                    <div className="text-sm text-[#B5B5C3]">ID-45453423</div>
                  </div>
                  <div>
                    <div className="text-base  text-black">
                      <FormattedMessage
                        id="PROFILE.COMPANY_ADDRESS"
                        defaultMessage="Company Address"
                      />
                    </div>
                    <div className="text-sm text-[#B5B5C3]">
                      101 Collin Street, Gujarat 3000 VIC Ahmedabad
                    </div>
                  </div>
                  <div>
                    <div className="text-base  text-black">
                      <FormattedMessage
                        id="PROFILE.LANGUAGE"
                        defaultMessage="Language"
                      />
                    </div>
                    <div className="text-sm text-[#B5B5C3]">English</div>
                  </div>
                  <div>
                    <div className="text-base  text-black">
                      <FormattedMessage
                        id="PROFILE.GST_NO"
                        defaultMessage="GST No"
                      />
                    </div>
                    <div className="text-sm text-[#B5B5C3]">TX-8674</div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Section */}
          <section className="col-span-12 lg:col-span-8">
            <div className="rounded-2xl bg-white shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
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
                            ? "text-primary border-b-2 border-[#2563EB]"
                            : "text-[#94A3B8] hover:text-[#2563EB]"
                        )}
                      >
                        {t.title}
                      </button>
                    );
                  })}
                </div>

                {activeTab === "account" && (
                  isEditing ? (
                    <button
                      className="rounded-md bg-primary text-white text-sm px-4 py-2"
                      onClick={handleSave}
                    >
                      <FormattedMessage id="COMMON.SAVE" defaultMessage="Save" />
                    </button>
                  ) : (
                    <button
                      className="rounded-md bg-[#EDF2F7] text-primary text-sm px-4 py-2"
                      onClick={() => setIsEditing(true)}
                    >
                      <FormattedMessage id="COMMON.EDIT" defaultMessage="Edit" />
                    </button>
                  )
                )}
              </div>

              <div className="p-8">{content}</div>
            </div>
          </section>
        </div>
      </Container>
    </Fragment>
  );
};

export { AccountUserProfilePage };