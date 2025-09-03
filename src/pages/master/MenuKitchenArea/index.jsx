import { Fragment, useEffect, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns } from "./constant";
import AddKitchenArea from "@/partials/modals/add-kitchen-area/AddKitchenArea";
import {GetAllKitchenAreaById} from "@/services/apiServices";

const MenuKitchenArea = () => {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedMenuCategory, setSelectedCategory] = useState(null);
  const [tableData, setTableData] = useState();
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

    // ✅ Extract the correct array
    let list = Array.isArray(res?.data?.data?.["KitchenAreas Details"])
      ? res.data.data["KitchenAreas Details"]
      : [];

    // 🔎 Apply search filter
    if (searchQuery) {
      list = list.filter((item) =>
        item.nameEnglish?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 📝 Format for table
    const formatted = list.map((item, index) => ({
      ...item,
      sr_no: index + 1,
      category: item.nameEnglish || "-",
    }));

    setTableData(formatted);
    console.log("Kitchen area data fetched successfully:", formatted);
  } catch (error) {
    console.error("Error fetching kitchen area:", error);
    setTableData([]);
  }
};





  const DeleteCategory = () => {
      FetchCategoryData();
  };
  const handleEdit = (category) => {
    setSelectedCategory(category);
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
              onClick={() => setIsCategoryModalOpen(true)}
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
          columns={columns(handleEdit, DeleteCategory)}
          data={tableData}
          paginationSize={10}
        />
      </Container>
    </Fragment>
  );
};
export default MenuKitchenArea;
