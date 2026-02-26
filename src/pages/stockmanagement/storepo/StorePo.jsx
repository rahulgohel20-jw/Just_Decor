import { Fragment, useState, useEffect } from "react";
import { Container } from "@/components/container";
import { TableComponent } from "@/components/table/TableComponent";
import { columns } from "./constant";
import useStyle from "./style";
import { FormattedMessage, useIntl } from "react-intl";
import { useNavigate } from "react-router";
import { GetAllStorePO } from "../../../services/apiServices";
import Swal from "sweetalert2";

const StorePo = () => {
  const classes = useStyle();
  const [searchQuery, setSearchQuery] = useState("");
  const [tableData, setTableData] = useState([]);
const [originalData, setOriginalData] = useState([]);
const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const intl = useIntl();

  const userId = localStorage.getItem("userId");

useEffect(() => {
  fetchStorePO();
}, []);

const fetchStorePO = async () => {
  try {
    setLoading(true);
    const res = await GetAllStorePO(userId);
    const data = (res?.data?.data || []).map((item, index) => ({
      ...item,
      sr_no: index + 1,
    }));
    setTableData(data);
    setOriginalData(data);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

 
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

 
  const handleDelete = (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "This Store PO entry will be deleted.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      setTableData((prev) =>
        prev.filter((item) => item.id !== id)
            .map((item, index) => ({ ...item, sr_no: index + 1 }))
      );
      setOriginalData((prev) =>
        prev.filter((item) => item.id !== id)
            .map((item, index) => ({ ...item, sr_no: index + 1 }))
      );
      Swal.fire({ icon: "success", title: "Deleted!", text: "Store PO deleted.", confirmButtonColor: "#16a34a" });
    }
  });
};

  
  const handleEdit = (item) => {
  navigate('/stock-management/storepo/add', { state: { editData: item } });
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
              id="USER.STORE_PO.TITLE"
              defaultMessage="Store PO"
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
                  id: "USER.STORE_PO.SEARCH",
                  defaultMessage: "Search Store PO",
                })}
                type="text"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button className="btn btn-primary" onClick={() => navigate('/stock-management/storepo/add')}>
              <i className="ki-filled ki-plus"></i>{" "}
              <FormattedMessage
                id="USER.STORE_PO.ADD"
                defaultMessage="Add Store PO"
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

export default StorePo;