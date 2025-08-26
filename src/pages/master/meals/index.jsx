import { Fragment, useEffect, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns } from "./constant";
import useStyle from "./style";
import { GetMealType, DeleteMealType } from "@/services/apiServices";

import AddMeal from "@/partials/modals/add-meal/AddMeal";

const MealMaster = () => {
  const classes = useStyle();
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [tableData, setTableData] = useState();
  useEffect(() => {
    FetchMealType();
  }, []);

  let userData = JSON.parse(localStorage.getItem("userData"));
  let Id = userData.id;
  const FetchMealType = () => {
    GetMealType(Id)
      .then((res) => {
        console.log(res);
        const formatted = res.data.data["MealType Details"].map(
          (cust, index) => ({
            sr_no: index + 1,
            meal_type: cust.nameEnglish || "-",
            mealid: cust.id,
          })
        );

        setTableData(formatted);
      })
      .catch((error) => {
        console.error("Error deleting customer:", error);
      });
  };

  const DeleteMealtype = (mealid) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      DeleteMealType(mealid)
        .then(() => {
          FetchMealType();
        })
        .catch((error) => {
          console.error("Error deleting customer:", error);
        });
    }
  };

  const handleEdit = (meal) => {
    setSelectedMeal(meal);
    setIsMemberModalOpen(true);
  };

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Meals Master" }]} />
        </div>
        {/* filters */}
        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          <div
            className={`flex flex-wrap items-center gap-2 ${classes.customStyle}`}
          >
            <div className="filItems relative">
              <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input pl-8"
                placeholder="Search Meal"
                type="text"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="btn btn-primary"
              onClick={() => {
                setSelectedMeal(null);
                setIsMemberModalOpen(true);
              }}
              title="Add Meal"
            >
              <i className="ki-filled ki-plus"></i> Add Meal
            </button>
          </div>
        </div>
        <AddMeal
          isOpen={isMemberModalOpen}
          onClose={setIsMemberModalOpen}
          refreshData={FetchMealType}
          selectedMeal={selectedMeal}
        />
        <TableComponent
          columns={columns(handleEdit, DeleteMealtype)}
          data={tableData}
          paginationSize={10}
        />
      </Container>
    </Fragment>
  );
};
export default MealMaster;
