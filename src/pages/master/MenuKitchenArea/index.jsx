import { Fragment, useEffect, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns } from "./constant";
import AddKitchenArea from "@/partials/modals/add-kitchen-area/AddKitchenArea";
import {GetAllKitchenAreaById} from "@/services/apiServices";
import { DeleteKitchenArea , UpdateStatusKitchenArea } from "../../../services/apiServices";

const MenuKitchenArea = () => {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedMenuCategory, setSelectedCategory] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    FetchCategoryData();
  }, [searchQuery]);

  let userData = JSON.parse(localStorage.getItem("userData"));
  let Id = userData.id;


const FetchCategoryData = async () => {
  try {
    const res = await GetAllKitchenAreaById(Id);
    console.log("API Raw Response:", res);

    let list = Array.isArray(res?.data?.data?.["KitchenAreas Details"])
      ? res.data.data["KitchenAreas Details"]
      : [];

    if (searchQuery.trim()) {
      list = list.filter((item) =>
        item.nameEnglish?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    const formatted = list.map((item, index) => ({
     id: item.id,
      sr_no: index + 1,
      category: item.nameEnglish || "-",
      hindi: item.nameHindi || "-",
      gujarati: item.nameGujarati || "-",
      createdAt: item.createdAt,
      userName: `${item.user?.firstName || ""} ${item.user?.lastName || ""}`,
      plan: item.user?.plan?.name || "-",
      role: item.user?.userBasicDetails?.role?.name || "-",
      isActive: item.isActive ?? item.status ?? false,
      raw: item,
    }));
    setTableData(formatted);
    console.log("Kitchen area data fetched successfully:", formatted);

  } catch (error) {
    console.error("Error fetching kitchen area:", error);
    setTableData([]);
  }
};

const statusKitchen = async (id, currentStatus) => {
  try {
    const newStatus = !currentStatus; // toggle
    const res = await UpdateStatusKitchenArea(id, newStatus);
console.log("Status updated response:", res);
    FetchCategoryData();
   
  } catch (error) {
    console.error("Error updating status:", error);
  }
};
  const DeleteCategory = async (id) => {
        try{
      await DeleteKitchenArea(id);
      console.log("Kitchen area deleted successfully:", id);
      FetchCategoryData();
    }catch(error){
      console.error("Error deleting kitchen area:", error);
    }
      FetchCategoryData();
  };

  const handleEdit = (categoryRow) => {
    setSelectedCategory(categoryRow.raw);
    setIsCategoryModalOpen(true);
  };

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Kitchen Area" }]} />
        </div>
        {/* filters */}
        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className={`flex flex-wrap items-center gap-2`}>
            <div className="filItems relative">
              <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input pl-8"
                placeholder="Search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="btn btn-primary"
              onClick={() => {
                setSelectedCategory(null);
                setIsCategoryModalOpen(true);
              }}
              title="Add Kitchen Area"
            >
              <i className="ki-filled ki-plus"></i> Add Kitchen Area
            </button>
          </div>
        </div>
        <AddKitchenArea
          isModalOpen={isCategoryModalOpen}
          setIsModalOpen={setIsCategoryModalOpen}
          refreshData={FetchCategoryData}
          selectedMenuCategory={selectedMenuCategory}
        />
        <TableComponent
          columns={columns(handleEdit, DeleteCategory, statusKitchen)}
          data={tableData}
          paginationSize={10}
        />
      </Container>
    </Fragment>
  );
};
export default MenuKitchenArea;
