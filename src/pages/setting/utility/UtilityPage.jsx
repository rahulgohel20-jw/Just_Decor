import { Fragment, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import UtilityDropdown from "@/components/dropdowns/UtilityDropdown";
import { Input } from "antd";
function UtilityPage() {
  const dropdownOptions = {
    decimalLimit: ["0", "1", "2", "3"],
    dateFormat: ["dd/MM/yyyy", "MM/dd/yyyy", "yyyy/MM/dd"],
    timeFormat: ["12 Hour", "24 Hour"],
    timeZone: ["Asia/Kolkata", "UTC", "America/New_York"],
    counterSize: ["8", "12", "16", "20"],
    pageSize: ["10", "25", "50", "100"],
    languages: ["Gujarati (ગુજરાતી)", "Hindi (हिंदी)", "English"],
  };
  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 mb-3">
          <Breadcrumbs items={[{ title: "Utility" }]} />
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-sm p-2">
          <div className="space-y-4">
            {/* Decimal Limit */}
            <div className="flex items-center gap-4">
              <label className="w-1/2 font-medium text-gray-700">
                Decimal Limit For Currency:
              </label>
              <UtilityDropdown
                options={dropdownOptions.decimalLimit}
                defaultValue="2"
              />
            </div>

            {/* Date Format */}
            <div className="flex items-center gap-4">
              <label className="w-1/2 font-medium text-gray-700">
                Date Format:
              </label>
              <UtilityDropdown
                options={dropdownOptions.dateFormat}
                defaultValue="dd/MM/yyyy"
              />
            </div>

            {/* Time Format */}
            <div className="flex items-center gap-4">
              <label className="w-1/2 font-medium text-gray-700">
                Time Format:
              </label>
              <UtilityDropdown
                options={dropdownOptions.timeFormat}
                defaultValue="12 Hour"
              />
            </div>

            {/* Time Zone */}
            <div className="flex items-center gap-4">
              <label className="w-1/2 font-medium text-gray-700">
                Time Zone:
              </label>
              <UtilityDropdown
                options={dropdownOptions.timeZone}
                defaultValue="Asia/Kolkata"
              />
            </div>

            {/* Counter Report Size */}
            <div className="flex items-center gap-4">
              <label className="w-1/2 font-medium text-gray-700">
                Counter Name Plate Report Size:
              </label>
              <UtilityDropdown
                options={dropdownOptions.counterSize}
                defaultValue="16"
              />
            </div>

            {/* Page Size */}
            <div className="flex items-center gap-4">
              <label className="w-1/2 font-medium text-gray-700">
                Page Size Options in Pagination:
              </label>
              <UtilityDropdown
                options={dropdownOptions.pageSize}
                defaultValue="100"
              />
            </div>

            {/* Two Language Report - Default */}
            <div className="flex items-center gap-4">
              <label className="w-1/2 font-medium text-gray-700">
                Two Language Report - Default Language:
              </label>
              <UtilityDropdown
                options={dropdownOptions.languages}
                defaultValue="Gujarati (ગુજરાતી)"
              />
            </div>

            {/* Two Language Report - Preferred */}
            <div className="flex items-center gap-4">
              <label className="w-1/2 font-medium text-gray-700">
                Two Language Report - Preferred Language:
              </label>
              <UtilityDropdown
                options={dropdownOptions.languages}
                defaultValue="Gujarati (ગુજરાતી)"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="w-1/2 font-medium text-gray-700">
                Direct sharing Whatsapp URL Expiry in days:
              </label>
              <Input type="text" placeholder="Expiry days" />
            </div>
          </div>
        </div>
      </Container>
    </Fragment>
  );
}

export { UtilityPage };
