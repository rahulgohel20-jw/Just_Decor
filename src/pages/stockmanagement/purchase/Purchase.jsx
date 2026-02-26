import { Fragment, useState } from "react";
import { Container } from "@/components/container";
import { TableComponent } from "@/components/table/TableComponent";
import { columns, defaultData } from "./constant";
import useStyle from "./style";
import { FormattedMessage, useIntl } from "react-intl";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { GetAllPurchase } from "../../../services/apiServices"; 
import Swal from "sweetalert2";

const Purchase = () => {
  const classes = useStyle();
  const [searchQuery, setSearchQuery] = useState("");
  const [tableData, setTableData] = useState([]);
const [originalData, setOriginalData] = useState([]);
const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const intl = useIntl();

  
  const handleSearch = (e) => {
  const query = e.target.value;
  setSearchQuery(query);
  if (!query.trim()) {
    setTableData(originalData);
  } else {
    const filtered = originalData.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(query.toLowerCase())
      )
    );
    setTableData(filtered.map((item, index) => ({ ...item, sr_no: index + 1 })));
  }
};

  const userId = localStorage.getItem("userId");

useEffect(() => {
  fetchPurchase();
}, []);

const fetchPurchase = async () => {
  try {
    setLoading(true);
    const res = await GetAllPurchase(userId);
    const data = (res?.data?.data || []).map((item, index) => ({
      ...item,
      sr_no: index + 1,
      purchaseid: item.id,
      // format date dd/mm/yyyy
      podate: item.podate
        ? item.podate.split("-").reverse().join("/")
        : "",
    }));
    setTableData(data);
    setOriginalData(data);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};
  const handleDelete = (purchaseid) => {
  Swal.fire({
    title: "Are you sure?",
    text: "This purchase entry will be deleted.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      setTableData((prev) =>
        prev
          .filter((item) => item.id !== purchaseid)
          .map((item, index) => ({ ...item, sr_no: index + 1 }))
      );
      setOriginalData((prev) =>
        prev
          .filter((item) => item.id !== purchaseid)
          .map((item, index) => ({ ...item, sr_no: index + 1 }))
      );
      Swal.fire({ icon: "success", title: "Deleted!", text: "Purchase entry deleted.", confirmButtonColor: "#16a34a" });
    }
  });
};

  const handleEdit = (item) => {
  navigate('/stock-management/purchase/add', { state: { editData: item } });
};

  
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
              id="USER.PURCHASE.TITLE"
              defaultMessage="Purchase"
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
            <button className="btn btn-primary" onClick={() => navigate('/stock-management/purchase/add')}>
              <i className="ki-filled ki-plus"></i>{" "}
              <FormattedMessage
                id="USER.PURCHASE.ADD"
                defaultMessage="Add Purchase"
              />
            </button>
          </div>
        </div>

        {/* Table */}
       <TableComponent
  columns={columns(handleEdit, handleDelete, handlePrint)}
  data={tableData}
  paginationSize={100}
  loading={loading}
/>
      </Container>
    </Fragment>
  );
};

export default Purchase;