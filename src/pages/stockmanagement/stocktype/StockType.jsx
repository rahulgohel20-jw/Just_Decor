import { Fragment, useState, useEffect } from "react";
import { Container } from "@/components/container";
import { TableComponent } from "@/components/table/TableComponent";
import { columns } from "./constant";
import useStyle from "./style";
import { GetStockTypeByUserId, DeleteStockType } from "@/services/apiServices";
import { FormattedMessage, useIntl } from "react-intl";
import AddStockType from "../../../partials/modals/add-stocktype/AddStockType";
import Swal from "sweetalert2";

const StockType = () => {
  const classes = useStyle();
  const [isStockTypeModalOpen, setIsStockTypeModalOpen] = useState(false);
  const [selectedStockType, setSelectedStockType] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const intl = useIntl();

  // ── Helper: picks whichever id key the API actually returns ──────────────
  const getId = (item) =>
    item.stocktypeid ??
    item.stockTypeId ??
    item.StockTypeId ??
    item.stock_type_id ??
    item.id ??
    item.Id ??
    item._id ??
    undefined;

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchStockTypes = async () => {
    try {
      setLoading(true);
      const userId = JSON.parse(localStorage.getItem("userId")) || 0;
      const res = await GetStockTypeByUserId(userId);

      
      const apiData = Array.isArray(res?.data?.data)
        ? res.data.data
        : Array.isArray(res?.data)
        ? res.data
        : [];

      

      const formattedData = apiData.map((item, index) => ({
        sr_no: index + 1,
        type_name: item.nameEnglish || "-",
        stocktypeid: getId(item),   // auto-picks correct key
        nameEnglish: item.nameEnglish || "",
        nameGujarati: item.nameGujarati || "",
        nameHindi: item.nameHindi || "",
      }));


      setTableData(formattedData);
      setOriginalData(formattedData);
    } catch (error) {
      console.error("Failed to fetch stock types:", error);
      setTableData([]);
      setOriginalData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockTypes();
  }, []);

  // ── Search ───────────────────────────────────────────────────────────────
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (!query.trim()) {
      setTableData(originalData);
    } else {
      const filtered = originalData.filter((item) =>
        item.type_name.toLowerCase().includes(query.toLowerCase())
      );
      setTableData(filtered);
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async (stocktypeid) => {

    if (!stocktypeid) {
      console.error("handleDelete: id is undefined");
      Swal.fire({
        icon: "error",
        title: "Invalid ID",
        text: "Stock type ID is missing. Check console for API key name.",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#005BA8",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await DeleteStockType(stocktypeid);
      Swal.fire({ icon: "success", title: "Deleted!", timer: 1500, showConfirmButton: false });
      fetchStockTypes();
    } catch (error) {
      console.error("Delete API failed:", error);
      Swal.fire({ icon: "error", title: "Delete Failed", text: "Something went wrong." });
    }
  };

  // ── Edit ─────────────────────────────────────────────────────────────────
  const handleEdit = (rowData) => {

    if (!rowData?.stocktypeid) {
      console.error("handleEdit: stocktypeid missing in rowData", rowData);
      return;
    }

    setSelectedStockType(rowData);
    setIsStockTypeModalOpen(true);
  };

  // ── Add ──────────────────────────────────────────────────────────────────
  const handleOpenAddModal = () => {
    setSelectedStockType(null);
    setIsStockTypeModalOpen(true);
  };

  return (
    <Fragment>
      <Container>
        <div className="pb-2 mb-3">
          <h1 className="text-xl text-gray-900">
            <FormattedMessage
              id="USER.MASTER.STOCK_TYPE_MASTER"
              defaultMessage="Stock Type Master"
            />
          </h1>
        </div>

        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className={`flex flex-wrap items-center gap-2 ${classes.customStyle}`}>
            <div className="filItems relative">
              <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input pl-8"
                placeholder={intl.formatMessage({
                  id: "USER.MASTER.SEARCH_STOCK_TYPE",
                  defaultMessage: "Search Stock Type",
                })}
                type="text"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button className="btn btn-primary" onClick={handleOpenAddModal}>
              <i className="ki-filled ki-plus"></i>{" "}
              <FormattedMessage id="USER.MASTER.ADD_TYPE" defaultMessage="Add Type" />
            </button>
          </div>
        </div>

        <AddStockType
          isOpen={isStockTypeModalOpen}
          onClose={setIsStockTypeModalOpen}
          stockType={selectedStockType}
          refreshData={fetchStockTypes}
        />

        <TableComponent
          columns={columns(handleEdit, handleDelete)}
          data={tableData}
          paginationSize={10}
          loading={loading}
        />
      </Container>
    </Fragment>
  );
};

export default StockType;