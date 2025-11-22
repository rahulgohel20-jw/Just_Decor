import { useLanguage } from "@/i18n";
import { KeenIcon } from "@/components";
import { MenuSub } from "@/components/menu";
import { DropdownNotificationsAll } from "./DropdownNotificationsAll";

const DropdownNotifications = ({ menuTtemRef }) => {
  const { isRTL } = useLanguage();

  const handleClose = () => {
    if (menuTtemRef.current) {
      menuTtemRef.current.hide();
    }
  };

  const buildHeader = () => {
    return (
      <div className="flex items-center justify-between gap-2.5 text-sm text-gray-900 font-semibold px-5 py-2.5 border-b border-b-gray-200">
        Notifications
        <button
          className="btn btn-sm btn-icon btn-light btn-clear shrink-0"
          onClick={handleClose}
        >
          <KeenIcon icon="cross" />
        </button>
      </div>
    );
  };

  const buildTabs = () => {
    return <DropdownNotificationsAll />;
  };

  return (
    <MenuSub
      rootClassName="w-full max-w-[460px]"
      className="light:border-gray-300"
    >
      <div className="relative min-h-[500px]">
        {/* Blurred content */}
        <div
          style={{
            filter: "blur(3px)",
            WebkitFilter: "blur(3px)",
          }}
        >
          {buildHeader()}
          {buildTabs()}
        </div>

        {/* Coming Soon Overlay - Covers entire area */}
        <div
          className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            backdropFilter: "blur(2px)",
            zIndex: 100,
          }}
        >
          <div className="text-center px-8 py-6 rounded-2xl bg-white shadow-2xl border border-gray-200">
            <div className="mb-3">
              <KeenIcon icon="notification" className="text-6xl text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Coming Soon
            </h3>
            <p className="text-sm text-gray-600 max-w-xs">
              Notifications feature is under development and will be available
              soon.
            </p>
          </div>
        </div>

        {/* Close Button on top */}
        <button
          className="absolute top-2.5 right-5 btn btn-sm btn-icon btn-light btn-clear shrink-0"
          style={{ zIndex: 101 }}
          onClick={handleClose}
        >
          <KeenIcon icon="cross" />
        </button>
      </div>
    </MenuSub>
  );
};

export { DropdownNotifications };
