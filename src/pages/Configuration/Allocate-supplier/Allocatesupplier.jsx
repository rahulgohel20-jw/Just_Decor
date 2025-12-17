import { Fragment, useEffect, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { FormattedMessage, useIntl } from "react-intl";
import { columns } from "./constant";
import FromCategoryDropdown from "../../../components/form-inputs/FromCategoryDropdown/FromCategoryDropdown";

const Allocatesupplier = () => {
  const intl = useIntl();

  const [fromCategory, setFromCategory] = useState("");
  const [toCategory, setToCategory] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);

  const staticCategories = [
    { id: "all", name: "All Categories" },
    { id: "uncategorized", name: "Uncategorized" },
  ];
  useEffect(() => {
    const mockData = [
      {
        id: 1,
        rawMaterial: "Sugar",
        category: "Food",
      },
      {
        id: 2,
        rawMaterial: "Flour",
        category: "Food",
      },
      {
        id: 3,
        rawMaterial: "Oil",
        category: "Grocery",
      },
    ];

    setTableData(mockData);
    setLoading(false);
  }, []);

  const combinedCategories = [...staticCategories, ...categoryList];

  return (
    <Fragment>
      <Container>
        {/* Breadcrumb */}
        <div className="gap-2 mb-3">
          <Breadcrumbs
            items={[
              {
                title: (
                  <FormattedMessage
                    id="RAW_MATERIAL.CHANGE_CATEGORY"
                    defaultMessage="Allocate Supplier"
                  />
                ),
              },
            ]}
          />
        </div>

        {/* FROM / TO CATEGORY CARD */}
        <div className="card min-w-full p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">
                <FormattedMessage
                  id="FROM_CATEGORY"
                  defaultMessage="From Category"
                />
              </label>

              <FromCategoryDropdown
                value={fromCategory}
                onChange={setFromCategory}
                options={combinedCategories}
              />
            </div>
            <div>
              <label className="form-label">
                <FormattedMessage
                  id="TO_CATEGORY"
                  defaultMessage="To Vendor Supplier"
                />
              </label>

              <div className="relative">
                <select
                  className="input appearance-none pr-10"
                  value={toCategory}
                  onChange={(e) => setToCategory(e.target.value)}
                >
                  <option value="">Select a category</option>
                  {categoryList.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                {/* Dropdown Icon */}
                <i className="ki-filled ki-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"></i>
              </div>
            </div>
          </div>
        </div>

        {/* RAW MATERIAL LIST CARD */}
        <div className="card min-w-full p-4 mb-10">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h2 className="text-black text-lg font-semibold">
              <FormattedMessage
                id="RAW_MATERIAL.LIST"
                defaultMessage="Raw Material Item List"
              />
            </h2>

            <div className="relative">
              <i className="ki-filled ki-magnifier text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input pl-8"
                type="text"
                placeholder={intl.formatMessage({
                  id: "RAW_MATERIAL.SEARCH",
                  defaultMessage: "To search, type and press Enter.",
                })}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <TableComponent
            columns={columns({
              selectedRows,
              setSelectedRows,
              data: tableData,
            })}
            data={tableData}
            paginationSize={10}
          />
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-3 mb-10">
          <button className="btn btn-light">
            <FormattedMessage id="COMMON.CANCEL" defaultMessage="Cancel" />
          </button>
          <button className="btn btn-primary">
            <FormattedMessage
              id="COMMON.SAVE_CHANGES"
              defaultMessage="Save Changes"
            />
          </button>
        </div>
      </Container>
    </Fragment>
  );
};

export { Allocatesupplier };
