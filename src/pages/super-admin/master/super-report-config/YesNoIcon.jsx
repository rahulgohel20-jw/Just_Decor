import { CheckCircle, XCircle } from "lucide-react";

export const YesNoIcon = ({ value }) => {
  return value === 1 ? (
    <CheckCircle size={18} className="text-green-600" />
  ) : (
    <XCircle size={18} className="text-red-500" />
  );
};
