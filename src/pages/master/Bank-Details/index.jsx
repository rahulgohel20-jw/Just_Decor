import { Fragment, useEffect, useState } from "react";
import { Container } from "@/components/container";
import { TableComponent } from "@/components/table/TableComponent";
import { columns } from "./constant";

import Swal from "sweetalert2";
import { FormattedMessage } from "react-intl";
import { useIntl } from "react-intl";
import {  GetBankDetails } from "../../../services/apiServices";
import AddBankDetailsModal from "../../../partials/modals/add-bank-details/AddBankDetailsModal";


const BankDetails = () => {
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [selectedBankDetails, setSelectedBankDetails] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const intl = useIntl();

  let Id = JSON.parse(localStorage.getItem("userId"));

 
 const FetchBankDetails = () => {
  GetBankDetails(Id)
    .then((res) => {
      const list = res?.data?.data || [];
      console.log("Fetched Bank Details:", list);
      setOriginalData(list);
      
      const mapped = list.map((bank, index) => ({
        sr_no: index + 1,
        id: bank.id,
        accountHolderName: bank.accountHolderName || "-",
        accountNo: bank.accountNo || "-",
        bankName: bank.bankName || "-",
        branchName: bank.branchName || "-",
        ifscCode: bank.ifscCode || "-",
        upiId: bank.upiId || "-",
        isPrimary: bank.isPrimary || false,  // ADD THIS LINE
      }));
      setTableData(mapped);
    })
    .catch((error) => console.error("Error fetching bank details:", error));
};


  useEffect(() => {
    FetchBankDetails();
  }, []);

  
  

 
  
 
  const handleEdit = (item) => {
    const originalItem = originalData.find(bank => bank.id === item.id);
    setSelectedBankDetails(originalItem || item);
    setIsBankModalOpen(true);
  };

  
  const handleAddNew = () => {
    setSelectedBankDetails(null);
    setIsBankModalOpen(true);
  };

  return (
    <Fragment>
      <Container>
        {/* Page Header */}
        <div className="pb-2 mb-3">
          <h1 className="text-xl text-gray-900 font-semibold">
            <FormattedMessage
              id="BANK.BANK_DETAILS_MASTER"
              defaultMessage="Bank Details Master"
            />
          </h1>
        </div>

        {/* Filters and Actions */}
        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          {/* Search Input */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="filItems relative">
              <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input pl-8"
                placeholder={intl.formatMessage({
                  id: "BANK.SEARCH_BANK_DETAILS",
                  defaultMessage: "Search Bank Details",
                })}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Add Button */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="btn btn-primary"
              onClick={handleAddNew}
            >
              <i className="ki-filled ki-plus"></i>{" "}
              <FormattedMessage
                id="BANK.ADD_BANK_DETAILS"
                defaultMessage="Add Bank Details"
              />
            </button>
          </div>
        </div>

        {/* Modal */}
        <AddBankDetailsModal
          isOpen={isBankModalOpen}
          onClose={setIsBankModalOpen}
          refreshData={FetchBankDetails}
          bankDetails={selectedBankDetails}
          allBankDetails={originalData}
        />

        {/* Table */}
        <TableComponent
          columns={columns(handleEdit)}
          data={tableData}
          paginationSize={10}
        />
      </Container>
    </Fragment>
  );
};

export default BankDetails;