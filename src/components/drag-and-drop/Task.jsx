import { useLanguage } from "@/i18n";
import {
  KeenIcon,
  MenuIcon,
  MenuItem,
  MenuSeparator,
  MenuToggle,
  MenuLink,
  MenuSub,
  MenuTitle,
  Menu,
} from "@/components";

const Task = ({ item, dropdown, index }) => {
  const { isRTL } = useLanguage();

  return (
    <div key={index} className="card p-4 lg:p-5">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-semibold">{item.user_first_name}</h2>
          {dropdown && (
            <Menu className="items-stretch">
              <MenuItem
                toggle="dropdown"
                trigger="click"
                dropdownProps={{
                  placement: isRTL() ? "bottom-start" : "bottom-end",
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: isRTL() ? [0, -10] : [0, 10], // [skid, distance]
                      },
                    },
                  ],
                }}
              >
                <MenuToggle className="btn btn-sm btn-icon btn-light btn-clear">
                  <KeenIcon icon="dots-vertical" />
                </MenuToggle>
                <MenuSub
                  className="menu-default"
                  rootClassName="w-full max-w-[200px]"
                >
                  <MenuItem>
                    <MenuLink>
                      <MenuIcon>
                        <KeenIcon icon="ki-filled ki-notepad-edit" />
                      </MenuIcon>
                      <MenuTitle>Edit</MenuTitle>
                    </MenuLink>
                  </MenuItem>
                  <MenuItem>
                    <MenuLink>
                      <MenuIcon>
                        <KeenIcon icon="ki-filled ki-mouse-square" />
                      </MenuIcon>
                      <MenuTitle>Move To</MenuTitle>
                    </MenuLink>
                  </MenuItem>
                  <MenuItem>
                    <MenuLink>
                      <MenuIcon>
                        <KeenIcon icon="ki-filled ki-share" />
                      </MenuIcon>
                      <MenuTitle>Add Follow-up</MenuTitle>
                    </MenuLink>
                  </MenuItem>
                  <MenuItem>
                    <MenuLink>
                      <MenuIcon>
                        <KeenIcon icon="ki-filled ki-whatsapp" />
                      </MenuIcon>
                      <MenuTitle>Send Whatsapp</MenuTitle>
                    </MenuLink>
                  </MenuItem>
                  <MenuItem>
                    <MenuLink>
                      <MenuIcon>
                        <KeenIcon icon="ki-filled ki-sms" />
                      </MenuIcon>
                      <MenuTitle>Send Email</MenuTitle>
                    </MenuLink>
                  </MenuItem>
                  <MenuItem>
                    <MenuLink>
                      <MenuIcon>
                        <KeenIcon icon="ki-filled ki-note-2" />
                      </MenuIcon>
                      <MenuTitle>Add Notes</MenuTitle>
                    </MenuLink>
                  </MenuItem>
                  <MenuItem>
                    <MenuLink>
                      <MenuIcon>
                        <KeenIcon icon="ki-filled ki-copy" />
                      </MenuIcon>
                      <MenuTitle>Clone Lead</MenuTitle>
                    </MenuLink>
                  </MenuItem>
                  <MenuSeparator />
                  <MenuItem>
                    <MenuLink path="">
                      <MenuIcon>
                        <KeenIcon icon="ki-filled ki-trash" />
                      </MenuIcon>
                      <MenuTitle>Delete</MenuTitle>
                    </MenuLink>
                  </MenuItem>
                </MenuSub>
              </MenuItem>
            </Menu>
          )}
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <KeenIcon icon="user" className="text-lg" />
            <span>{item.user_full_name}</span>
          </div>
          <div className="flex items-center gap-2">
            <KeenIcon icon="bill" className="text-lg" />
            <span>Amount: {item.amount}</span>
          </div>
          <div className="flex items-center gap-2">
            <KeenIcon icon="calendar" className="text-lg" />
            <span>Close Date: {item.close_date}</span>
          </div>
          <div className="flex items-center gap-2">
            <KeenIcon icon="user-tick" className="text-lg" />
            <span>Assigned To: {item.assign_to}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export { Task };
