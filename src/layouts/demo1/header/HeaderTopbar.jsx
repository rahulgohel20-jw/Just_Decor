import { useRef, useState, useEffect } from "react";
import { KeenIcon } from "@/components/keenicons";
import { toAbsoluteUrl } from "@/utils";
import { Menu, MenuItem, MenuToggle } from "@/components";
import { DropdownUser } from "@/partials/dropdowns/user";
import { DropdownNotifications } from "@/partials/dropdowns/notifications";
import { useNavigate } from "react-router-dom";
import { DropdownChat } from "@/partials/dropdowns/chat";
import { ModalSearch } from "@/partials/modals/search/ModalSearch";
import { useLanguage } from "@/i18n";
import { useUser } from "@/context/UserContext";

import CheckInModal from "@/partials/modals/CheckInModal";

const HeaderTopbar = () => {
  const navigate = useNavigate();
  const { isRTL } = useLanguage();

  const itemChatRef = useRef(null);
  const itemUserRef = useRef(null);
  const itemNotificationsRef = useRef(null);

  const [checkInModal, setCheckInModal] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const { user, refreshUser } = useUser();

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const companyName = user?.userBasicDetails?.companyName || "Company";

  const userLogo = user?.logo;

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-black text-lg truncate hidden sm:inline">
          {companyName || "Company"}
        </span>
      </div>

      <div className="flex items-center gap-2 lg:gap-3">
        <button
          onClick={() => navigate(`/price`)}
          className="btn btn-sm btn-primary"
          title="Upgrade"
        >
          Upgrade
        </button>

        {/* Icons Section */}
        <div className="fixed left-0 right-0 bottom-10 flex justify-center md:static">
          <div className="flex items-center gap-2 lg:gap-3 shadow-lg md:shadow-none py-3 md:py-0 px-7 md:px-0 rounded-full md:rounded-0 bg-white md:bg-transparent border md:border-0">
            {/* Search */}
            {/* <button
              onClick={handleOpen}
              className="btn btn-icon btn-icon-lg size-9 rounded-full hover:bg-primary-clarity hover:text-primary text-gray-500"
            >
              <KeenIcon icon="magnifier" />
            </button>
            <ModalSearch open={searchModalOpen} onOpenChange={handleClose} /> */}

            {/* WhatsApp */}
            <Menu>
              <MenuItem
                ref={itemChatRef}
                toggle="dropdown"
                trigger="click"
                dropdownProps={{
                  placement: isRTL() ? "bottom-start" : "bottom-end",
                  modifiers: [
                    {
                      name: "offset",
                      options: { offset: isRTL() ? [-70, 10] : [70, 10] },
                    },
                  ],
                }}
              >
                <MenuToggle className="btn btn-icon btn-icon-lg relative cursor-pointer size-9 rounded-full hover:bg-primary-clarity hover:text-primary text-gray-500">
                  <KeenIcon icon="ki-filled ki-whatsapp" />
                </MenuToggle>
                {DropdownChat({ menuTtemRef: itemChatRef })}
              </MenuItem>
            </Menu>

            {/* Notifications */}
            <Menu>
              <MenuItem
                ref={itemNotificationsRef}
                toggle="dropdown"
                trigger="click"
                dropdownProps={{
                  placement: isRTL() ? "bottom-start" : "bottom-end",
                  modifiers: [
                    {
                      name: "offset",
                      options: { offset: isRTL() ? [-70, 10] : [70, 10] },
                    },
                  ],
                }}
              >
                <MenuToggle className="btn btn-icon btn-icon-lg relative cursor-pointer size-9 rounded-full hover:bg-primary-clarity hover:text-primary text-gray-500">
                  <KeenIcon icon="notification-status" />
                </MenuToggle>
                {DropdownNotifications({ menuTtemRef: itemNotificationsRef })}
              </MenuItem>
            </Menu>
          </div>
        </div>

        {/* User Profile */}
        <Menu>
          <MenuItem
            ref={itemUserRef}
            toggle="dropdown"
            trigger="click"
            dropdownProps={{
              placement: isRTL() ? "bottom-start" : "bottom-end",
              modifiers: [
                {
                  name: "offset",
                  options: { offset: isRTL() ? [-20, 10] : [20, 10] },
                },
              ],
            }}
          >
            <MenuToggle className="btn btn-icon rounded-full">
              <img
                className="size-9 rounded-full shrink-0"
                src={
                  userLogo &&
                  typeof userLogo === "string" &&
                  userLogo.trim() !== "" &&
                  userLogo !== "null" &&
                  userLogo !== "undefined" &&
                  !userLogo.toLowerCase().includes("/null") &&
                  /\.(jpg|jpeg|png|webp|gif)$/i.test(userLogo)
                    ? userLogo
                    : toAbsoluteUrl("/media/menu/noImage.jpg")
                }
                alt=""
              />
            </MenuToggle>
            {DropdownUser({ menuItemRef: itemUserRef })}
          </MenuItem>
        </Menu>

        {/* Check-in Modal */}
        <CheckInModal
          isModalOpen={checkInModal}
          setIsModalOpen={setCheckInModal}
        />
      </div>
    </div>
  );
};

export { HeaderTopbar };
