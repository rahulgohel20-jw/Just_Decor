import React, { useState } from "react";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const CustomModal = ({ open, onClose, children, title, footer }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px] top-[10%] translate-y-0 [&>button]:top-8 [&>button]:end-7">
        <DialogHeader className="p-4">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody className="p-4">{children}</DialogBody>
        {footer && (
          <DialogFooter className="p-4">
            <div className="flex justify-between w-full">
              {footer.map((item, index) => {
                return item;
              })}
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
export { CustomModal };
