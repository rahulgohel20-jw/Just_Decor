import React, { useState } from "react";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CustomModal = ({ open, onClose, children }) => {
  const [searchInput, setSearchInput] = useState("");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px] top-[5%] lg:top-[15%] translate-y-0 [&>button]:top-8 [&>button]:end-7">
        <DialogHeader className="py-4">
          <DialogTitle>Add Contact</DialogTitle>
        </DialogHeader>
        <DialogBody className="p-0 pb-5">{children}</DialogBody>
      </DialogContent>
    </Dialog>
  );
};
export { CustomModal };
