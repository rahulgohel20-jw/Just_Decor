import { ApiCredentials, Attributes, Deals, GeneralInfo } from "../public-profile/profiles/crm";

export const ContactDetail = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-7.5">
      <div className="col-span-1">
        Main dtails 
      </div>
      <div className="col-span-2">
        other details
      </div>
    </div>
  );
};
