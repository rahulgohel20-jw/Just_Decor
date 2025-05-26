import { useState } from "react"; // Add this
import { IconButton, Typography } from "@mui/material";
import { X } from "lucide-react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import useStyle from "./style";

const CustomModal = ({ open, onClose, children, title, footer, width }) => {
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
    <Dialog
      className={`${classes.customModal} ${shake ? classes.shake : ""}`}
      open={open}
      onClose={handleClose}
      scroll={"body"}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      fullWidth={!!width === false}
      maxWidth={false}
      PaperProps={{
        sx: {
          width: width || "600px",
          maxWidth: "100%",
        },
      }}
    >
      <DialogTitle id="scroll-dialog-title">
        <Typography variant="h6">{title}</Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <X />
        </IconButton>
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        {footer.map((item, index) => {
          return item;
        })}
      </DialogActions>
    </Dialog>
  );
};
export { CustomModal };
