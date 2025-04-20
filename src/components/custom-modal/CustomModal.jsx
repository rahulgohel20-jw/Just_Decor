import React, { useState } from "react";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CustomModal = ({ open, onClose, children, title }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px] top-[5%] lg:top-[15%] translate-y-0 [&>button]:top-8 [&>button]:end-7">
        <DialogHeader className="py-4">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody className="scrollable-y py-0 mb-5 ps-6 pe-3 me-3">
          {children}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};
export { CustomModal };
