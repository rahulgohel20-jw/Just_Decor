import { useState } from "react";
import { Modal } from "antd";
import useStyle from "./style";

const CustomModal = ({ open, onClose, children, title, width, ...rest }) => {
  const classes = useStyle();
  const [shake, setShake] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "backdropClick") {
      setShake(true);
      setTimeout(() => setShake(false), 300); // Clear after animation
      return;
    }
    onClose();
  };
  return (
    <Modal
      title={title}
      closable={{ "aria-label": "Custom Close Button" }}
      open={open}
      onCancel={handleClose}
      {...rest}
    >
      {children}
      <div className="flex justify-end modal-footer"></div>
    </Modal>
  );
};
export { CustomModal };
