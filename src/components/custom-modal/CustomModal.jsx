import React, { useState } from "react";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const CustomModal = ({ open, onClose, children, title }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px] top-[10%] translate-y-0 [&>button]:top-8 [&>button]:end-7">
        <DialogHeader className="p-4">
          <DialogTitle>Add Contact</DialogTitle>
        </DialogHeader>
        <DialogBody className="p-4 scrollable-y h-[560px] max-h-[95%]">
          {children}
        </DialogBody>
        <DialogFooter className="p-4">
          <div className="flex justify-between w-full">
            <button className="btn btn-sm btn-secondary">Cancel</button>
            <button className="btn btn-sm btn-primary">+ Add Contact</button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export { CustomModal };
