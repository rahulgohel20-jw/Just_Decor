import { useEffect, useRef, useState } from "react";
import { Modal } from "antd";
import useStyle from "./style";
const CustomModal = ({ open, onClose, children, title, width, ...rest }) => {
  const classes = useStyle();
  const [shake, setShake] = useState(false);
  const modalRef = useRef(null);
  const handleClose = (event, reason) => {
    if (reason === "backdropClick") {
      setShake(true);
      setTimeout(() => setShake(false), 300); // Clear after animation
      return;
    }
    onClose();
  };
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (open && modalRef.current && !modalRef.current.contains(e.target)) {
        // Clicked outside the modal content
        setShake(true);
        setTimeout(() => setShake(false), 300);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);
  return (
      <Modal
        maskClosable={false} //  disables closing on backdrop click
        keyboard={false} //disables closing on Esc
        title={title}
        closable={{ "aria-label": "Custom Close Button" }}
        open={open}
        onCancel={handleClose}
        modalRender={(modal) => (
          <div ref={modalRef} className={shake ? classes.shake : ""}>
            {modal}
          </div>
        )}
        {...rest}
      >
        {children}
        {/* <div className="flex justify-end modal-footer"></div> */}
      </Modal>
  );
};
export { CustomModal };
