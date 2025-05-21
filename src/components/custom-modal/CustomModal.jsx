import { IconButton, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { X } from "lucide-react";

const CustomModal = ({ open, onClose, children, title, footer }) => {
  const handleClose = (event, reason) => {
    if (reason !== "backdropClick") {
      onClose();
    }
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll={"body"}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      fullWidth={true}
      maxWidth={"sm"}
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
