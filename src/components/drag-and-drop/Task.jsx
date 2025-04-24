import { useLanguage } from "@/i18n";
import {
  KeenIcon,
  MenuIcon,
  MenuItem,
  MenuToggle,
  MenuLink,
  MenuSub,
  MenuTitle,
  Menu,
} from "@/components";

const Task = ({ item, dropdown, index }) => {
  const { isRTL } = useLanguage();

  return (
    <div key={index} className="card p-5 lg:p-7.5 lg:pt-7">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <h2>{item.user_first_name}</h2>
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
                    <MenuLink path="">
                      <MenuIcon>
                        <KeenIcon icon="setting-3" />
                      </MenuIcon>
                      <MenuTitle>Delete</MenuTitle>
                    </MenuLink>
                  </MenuItem>
                  <MenuItem>
                    <MenuLink>
                      <MenuIcon>
                        <KeenIcon icon="some-files" />
                      </MenuIcon>
                      <MenuTitle>Edit Lead</MenuTitle>
                    </MenuLink>
                  </MenuItem>
                  <MenuItem>
                    <MenuLink>
                      <MenuIcon>
                        <KeenIcon icon="cloud-change" />
                      </MenuIcon>
                      <MenuTitle>Move To</MenuTitle>
                    </MenuLink>
                  </MenuItem>
                  <MenuItem>
                    <MenuLink>
                      <MenuIcon>
                        <KeenIcon icon="dislike" />
                      </MenuIcon>
                      <MenuTitle>Add Follow-up</MenuTitle>
                    </MenuLink>
                  </MenuItem>
                  <MenuItem>
                    <MenuLink>
                      <MenuIcon>
                        <KeenIcon icon="dislike" />
                      </MenuIcon>
                      <MenuTitle>Send Whatsapp</MenuTitle>
                    </MenuLink>
                  </MenuItem>
                  <MenuItem>
                    <MenuLink>
                      <MenuIcon>
                        <KeenIcon icon="dislike" />
                      </MenuIcon>
                      <MenuTitle>Send Email</MenuTitle>
                    </MenuLink>
                  </MenuItem>
                  <MenuItem>
                    <MenuLink>
                      <MenuIcon>
                        <KeenIcon icon="dislike" />
                      </MenuIcon>
                      <MenuTitle>Add Notes</MenuTitle>
                    </MenuLink>
                  </MenuItem>
                  <MenuItem>
                    <MenuLink>
                      <MenuIcon>
                        <KeenIcon icon="dislike" />
                      </MenuIcon>
                      <MenuTitle>Clone Lead</MenuTitle>
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
