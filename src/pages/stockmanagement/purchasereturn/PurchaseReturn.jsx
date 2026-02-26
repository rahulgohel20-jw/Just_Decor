import { Fragment, useState } from "react";
import { Container } from "@/components/container";
import { TableComponent } from "@/components/table/TableComponent";
import { columns, defaultData } from "./constant";
import useStyle from "./style";
import { FormattedMessage, useIntl } from "react-intl";
import { useNavigate } from "react-router";

const PurchaseReturn = () => {
  const classes = useStyle();
  const [tableData, setTableData] = useState(defaultData);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const intl = useIntl();

  // --------------------------
  // SEARCH (client-side filter)
  // --------------------------
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      setTableData(defaultData);
    } else {
      const filtered = defaultData.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(query.toLowerCase())
        )
      );
      setTableData(filtered.map((item, index) => ({ ...item, sr_no: index + 1 })));
    }
  };

  // --------------------------
  // DELETE
  // --------------------------
  const handleDelete = (purchaseid) => {
    if (window.confirm("Are you sure you want to delete this purchase entry?")) {
      setTableData((prev) =>
        prev
          .filter((item) => item.purchaseid !== purchaseid)
          .map((item, index) => ({ ...item, sr_no: index + 1 }))
      );
    }
  };

  // --------------------------
  // EDIT
  // --------------------------
  const handleEdit = (item) => {
    console.log("Edit purchase:", item);
    // Open your edit modal here and pass `item`
  };

  // --------------------------
  // PRINT
  // --------------------------
  const handlePrint = (item) => {
    console.log("Print purchase:", item);
    // Trigger print logic here
  };

  return (
    <Fragment>
      <Container>
        {/* Page Title */}
        <div className="pb-2 mb-3">
          <h1 className="text-xl text-gray-900">
            <FormattedMessage
              id="USER.PURCHASE_RETURN.TITLE"
              defaultMessage="Purchase Return"
            />
          </h1>
        </div>

        {/* Filters */}
        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className={`flex flex-wrap items-center gap-2 ${classes?.customStyle ?? ""}`}>
            <div className="filItems relative">
              <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input pl-8"
                placeholder={intl.formatMessage({
                  id: "USER.PURCHASE.SEARCH",
                  defaultMessage: "Search Purchase",
                })}
                type="text"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button className="btn btn-primary" onClick={() => navigate('/stock-management/purchase-return/add')}>
              <i className="ki-filled ki-plus"></i>{" "}
              <FormattedMessage
                id="USER.PURCHASE.ADD"
                defaultMessage="Add Purchase Return"
              />
            </button>
          </div>
        </div>

        {/* Table */}
        <TableComponent
          columns={columns(handleEdit, handleDelete, handlePrint)}
          data={tableData}
          paginationSize={100}
        />
      </Container>
    </Fragment>
  );
};

export default PurchaseReturn;