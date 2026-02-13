import { Fragment, useEffect, useState } from "react";
import { Container } from "@/components/container";
import { TableComponent } from "@/components/table/TableComponent";
import { columns } from "./constant";
import {
  GETAllreportconfiguration,
  DeleteReportConfiguration,
} from "@/services/apiServices";
import AddReportConfig from "@/partials/modals/add-report-config/AddReportConfig";
import { FormattedMessage } from "react-intl";
import Swal from "sweetalert2";

const SuperReportConfig = () => {
  const [tableData, setTableData] = useState([]);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    try {
      const res = await GETAllreportconfiguration();
      const list = res?.data?.data || [];
      console.log(list);

      const mapped = list.map((item, index) => ({
        sr_no: index + 1,
        mappingName: item.mappingNameEnglish,
        moduleName: item.moduleNameEnglish,
        isCategorySlogan: item.isCategorySlogan,
        isCategoryInstruction: item.isCategoryInstruction,
        isCategoryImage: item.isCategoryImage,
        isItemSlogan: item.isItemSlogan,
        isItemInstruction: item.isItemInstruction,
        isItemImage: item.isItemImage,
        isCompanyLogo: item.isCompanyLogo,
        isCompanyDetails: item.isCompanyDetails,
        isPartyDetails: item.isPartyDetails,
        isWithQuantity: item.isWithQty,
        labourType: item.type,
        size1: item.size1,
        size2: item.size2,
        rawid: item.id,
        mappingId: item.templateMappingId,
        moduleId: item.templateModuleId,
        dropdown: item.isDropDown,
        WithPrice: item.isWithPrice,
        isAgency: item.isAgency,
        isItem: item.isItem,
        isItemColumn: item.isItemColumn,
        isItemPage: item.isItemPage,
        isCombo: item.isCombo,
      }));

      setTableData(mapped);
    } catch (err) {
      console.error("API Error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* DELETE HANDLER */
  const handleDelete = async (id) => {
    try {
      const res = await DeleteReportConfiguration(id);
      if (res?.data?.success) {
        Swal.fire("Deleted!", "Configuration deleted", "success");
        fetchData();
      } else {
        Swal.fire("Error", "Delete failed", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  const filteredData = tableData.filter((item) => {
    const value = searchTerm.toLowerCase();

    return (
      item.mappingName?.toLowerCase().includes(value) ||
      item.moduleName?.toLowerCase().includes(value)
    );
  });

  return (
    <Fragment>
      <Container>
        <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
          <h1 className="text-xl font-semibold">
            <FormattedMessage
              id="REPORT.CONFIGURATION"
              defaultMessage="Report Configuration"
            />
          </h1>

          <div className="flex items-center gap-3">
            {/* SEARCH INPUT */}
            <div className="relative">
              <i className="ki-filled ki-magnifier absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Search Template / Module..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-8 w-64"
              />
            </div>

            {/* ADD REPORT BUTTON */}
            <button
              onClick={() => {
                setSelectedRow(null);
                setIsReportModalOpen(true);
              }}
              className="px-4 py-2 bg-[#005BA8] text-white rounded hover:bg-[#004a8f]"
            >
              <FormattedMessage id="ADD.REPORT" defaultMessage="Add Report" />
            </button>
          </div>
        </div>

        <TableComponent
          columns={columns(setSelectedRow, setIsReportModalOpen, handleDelete)}
          data={filteredData}
          paginationSize={10}
        />
        {/* MODAL */}
        <AddReportConfig
          isModalOpen={isReportModalOpen}
          setIsModalOpen={setIsReportModalOpen}
          editId={selectedRow?.rawid}
          onSave={fetchData}
        />
      </Container>
    </Fragment>
  );
};

export default SuperReportConfig;
