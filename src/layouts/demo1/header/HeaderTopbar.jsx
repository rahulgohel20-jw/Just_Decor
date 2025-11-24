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
import CheckInModal from "@/partials/modals/CheckInModal";
import { getUserById } from "@/services/apiServices";

const HeaderTopbar = () => {
  const navigate = useNavigate();
  const { isRTL } = useLanguage();

  const itemChatRef = useRef(null);
  const itemUserRef = useRef(null);
  const itemNotificationsRef = useRef(null);

  const [checkInModal, setCheckInModal] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [companyName, setCompanyName] = useState("");

  // ✅ Load company name from localStorage
  useEffect(async () => {
    try {
      const Id = localStorage.getItem("userId");
      if (!Id) {
        console.warn("⚠️ No user data found in localStorage");
        return;
      }
      const user = await getUserById(Id);
      const User_data = user.data.data["User Details"][0];

      const company = User_data?.userBasicDetails?.companyName || "";

      setCompanyName(company || "Company");
    } catch (error) {
      console.error("❌ Error reading user data:", error);
      setCompanyName("Company");
    }
  }, []);

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-black text-lg truncate max-w-[200px]">
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
                src={toAbsoluteUrl("/images/user_img.jpg")}
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
