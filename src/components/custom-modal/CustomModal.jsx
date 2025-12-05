import { useEffect, useRef, useState } from "react";
import { Modal } from "antd";
import useStyle from "./style";

const CustomModal = ({ open, onClose, children, footer, title, ...rest }) => {
  const classes = useStyle();
  const [shake, setShake] = useState(false);
  const modalRef = useRef(null);

  const handleClose = (event, reason) => {
    if (reason === "backdropClick") {
      setShake(true);
      setTimeout(() => setShake(false), 300);
      return;
    }
    onClose();
  };

  // Enhanced body scroll lock
  useEffect(() => {
    if (open) {
      // Get current scroll position
      const scrollY = window.scrollY;

      // Lock body scroll
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      // Also lock html element
      document.documentElement.style.overflow = "hidden";
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";

      // Restore scroll position
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }

    return () => {
      // Cleanup on unmount
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const target = e.target;

      // Check if clicked element is inside any AntD popup (class starts with 'ant-')
      const isAntdPopup = [
        ...document.querySelectorAll("[class^='ant-']"),
      ].some((el) => el.contains(target));

      if (isAntdPopup) return;

      if (open && modalRef.current && !modalRef.current.contains(e.target)) {
        // Clicked outside the modal content
        setShake(true);
        setTimeout(() => setShake(false), 300);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <Modal
      maskClosable={false}
      keyboard={false}
      closable={false}
      getContainer={false}
      centered
      title={
        title ? (
          <>
            <div className="flex justify-between items-center pb-2">
              <span className="text-base font-medium">{title}</span>
              <button
                type="text"
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="ki-filled ki-cross text-xl"></i>
              </button>
            </div>
            <hr className="border-0 h-[1px] bg-[#BABABAB2]" />
          </>
        ) : null
      }
      open={open}
      onCancel={handleClose}
      modalRender={(modal) => (
        // for shake animation
        <div ref={modalRef} className={shake ? classes.shake : ""}>
          {modal}
        </div>
      )}
      footer={footer ? <div className="pt-3">{footer}</div> : null}
      {...rest}
    >
      {children}
    </Modal>
  );
};

export { CustomModal };
