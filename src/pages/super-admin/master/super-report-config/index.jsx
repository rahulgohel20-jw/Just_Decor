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
        dropdown:item.isDropDown,
        WithPrice:item.isWithPrice,
        isAgency:item.isAgency,
        isItem:item.isItem,
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

  return (
    <Fragment>
      <Container>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">
            <FormattedMessage
              id="REPORT.CONFIGURATION"
              defaultMessage="Report Configuration"
            />
          </h1>

          {/* ADD REPORT BUTTON */}
          <button
            onClick={() => setSelectedRow(null) || setIsReportModalOpen(true)}
            className="px-4 py-2 bg-[#005BA8] text-white rounded hover:bg-[#004a8f]"
          >
            <FormattedMessage id="ADD.REPORT" defaultMessage="Add Report" />
          </button>
        </div>

        <TableComponent
          columns={columns(setSelectedRow, setIsReportModalOpen, handleDelete)}
          data={tableData}
          paginationSize={10}
        />

        {/* MODAL */}
        <AddReportConfig
          isModalOpen={isReportModalOpen}
          setIsModalOpen={setIsReportModalOpen}
          editId={selectedRow?.rawid} // null for Add, ID for Edit
          onSave={fetchData} // refresh table after add/update
        />
      </Container>
    </Fragment>
  );
};

export default SuperReportConfig;
