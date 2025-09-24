import { Fragment, useEffect, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns } from "./constant";
import useStyle from "./style";
import {
  GetMealType,
  DeleteMealType,
  SearchMealtype,
} from "@/services/apiServices";
import Swal from "sweetalert2";
import AddMeal from "@/partials/modals/add-meal/AddMeal";

const MealMaster = () => {
  const classes = useStyle();
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [tableData, setTableData] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    FetchMealType();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (!searchQuery.trim()) {
        FetchMealType();
        return;
      }

      SearchMealtype(searchQuery, Id)
        .then(({ data: { data } }) => {
          if (data && data["MealType Details"]) {
            const formatted = data["MealType Details"].map((cust, index) => ({
              sr_no: index + 1,
              meal_type: cust.nameEnglish || "-",
              mealid: cust.id,
            }));
            setTableData(formatted);
          } else {
            setTableData([]);
          }
        })
        .catch((error) => {
          console.error("Error searching customer:", error);
        });
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  let userData = JSON.parse(localStorage.getItem("userData"));
  let Id = userData.id;
  const FetchMealType = () => {
    GetMealType(Id)
      .then((res) => {
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
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        DeleteMealType(mealid)
          .then((response) => {
            if (response && (response.success || response.status === 200)) {
              FetchMealType();
              Swal.fire({
                title: "Removed!",
                text: "Meal has been removed successfully.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
              });
            } else {
              throw new Error(response?.message || "API call failed");
            }
          })
          .catch((error) => {
            console.error("Error deleting customer:", error);
          });
      }
    });
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
