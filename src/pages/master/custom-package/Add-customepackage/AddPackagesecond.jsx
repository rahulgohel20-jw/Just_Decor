import { Fragment, useState, useEffect, useMemo } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { useNavigate } from "react-router-dom";

import MenuItemGridPackage from "./component/MenuItemGridPackage";
import SelectedItemPackage from "./component/SelectedItemPackage";
import CategoryListpackage from "./component/CategoryListpackage";
// import SearchInput from "../../../Event/EventPreparationPage/components/SearchInput";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import MenuNotes from "@/partials/modals/menu-notes/MenuNotes";
import CategoryNotes from "@/partials/modals/category-note/CategoryNotes";

const AddPackageSecond = () => {
  const navigate = useNavigate();

  // ---------------- UI States (Local Only) ----------------
  const [search, setSearch] = useState("");
  const [childSearch, setChildSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);

  const [itemNotes, setItemNotes] = useState({});
  const [categoryNotes, setCategoryNotes] = useState({});
  const [categoryAnyItems, setCategoryAnyItems] = useState({});
  const [globalAnyItems, setGlobalAnyItems] = useState("");

  const [showItemNoteModal, setShowItemNoteModal] = useState(false);
  const [currentItemForNotes, setCurrentItemForNotes] = useState(null);

  const [showCategoryNoteModal, setShowCategoryNoteModal] = useState(false);
  const [currentCategoryForNotes, setCurrentCategoryForNotes] = useState(null);

  // ---------------- Fake Static Data ----------------

  const categories = [
    { id: 0, name: "All" },
    { id: 1, name: "Starter" },
    { id: 2, name: "Main Course" },
    { id: 3, name: "Dessert" },
  ];

  const menuItems = [
    { id: 101, name: "Paneer Tikka", parentId: 1 },
    { id: 102, name: "Soup", parentId: 1 },
    { id: 201, name: "Dal Fry", parentId: 2 },
    { id: 202, name: "Roti", parentId: 2 },
    { id: 301, name: "Gulab Jamun", parentId: 3 },
  ];

  const filteredCategories = categories.filter(({ name }) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  const menuItemsWithSelectionState = menuItems.map((item) => ({
    ...item,
    isSelected: selectedItems.includes(item.id),
  }));

  const filteredChildren = menuItemsWithSelectionState.filter((child) =>
    child.name.toLowerCase().includes(childSearch.toLowerCase())
  );

  const selectedMenuItems = useMemo(() => {
    return selectedItems
      .map((id) => menuItems.find((item) => item.id === id))
      .filter(Boolean);
  }, [selectedItems]);

  const selectedItemsByCategory = useMemo(() => {
    const grouped = {};
    selectedMenuItems.forEach((item) => {
      const category = categories.find((cat) => cat.id === item.parentId);
      const catName = category?.name || "Other";
      if (!grouped[catName]) grouped[catName] = [];
      grouped[catName].push(item);
    });
    return grouped;
  }, [selectedMenuItems]);

  // ---------------- Item Selection ----------------

  const toggleChildSelection = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = (values) => {
    console.log("📦 Final Form Data:", values);
    console.log("🛒 Selected Items:", selectedMenuItems);
    console.log("📝 Item Notes:", itemNotes);
    console.log("📌 Category Notes:", categoryNotes);
    console.log("🎯 Any Items:", categoryAnyItems);

    alert("Form data logged in console (No API used)");
  };

  const validationSchema = Yup.object().shape({
    nameEnglish: Yup.string().required("Name is required"),
    price: Yup.number().required("Price required").positive(),
  });

  return (
    <Fragment>
      <Container className="flex flex-col min-h-screen">
        <Breadcrumbs items={[{ title: "Add Package (Static Mode)" }]} />

        <Formik
          initialValues={{ nameEnglish: "", price: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <>
              <Form className="flex flex-col gap-4">
                {/* BASIC INFO */}
                <div className="border rounded-lg p-4 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputWithFormik label="Package Name" name="nameEnglish" />
                    <InputWithFormik label="Price" name="price" type="number" />
                  </div>
                </div>

                {/* MAIN UI */}
                <div className="border p-4 rounded-lg bg-white">
                  <h3 className="font-semibold text-lg mb-2">
                    Select Package Items
                  </h3>
                  <div className="grid grid-cols-12 gap-3">
                    {/* CATEGORY SIDE */}
                    <div className="col-span-3 border rounded-md p-3">
                      {/* <SearchInput
                        placeholder="Search Category"
                        value={search}
                        onChange={setSearch}
                      /> */}
                      {filteredCategories.map((cat) => (
                        <button
                          key={cat.id}
                          className={`w-full text-left p-2 mt-2 rounded ${
                            selectedCategoryId === cat.id
                              ? "bg-primary/20"
                              : "bg-gray-100"
                          }`}
                          onClick={() => setSelectedCategoryId(cat.id)}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>

                    {/* MENU ITEMS */}
                    <div className="col-span-6 border rounded-md p-3">
                      {/* <SearchInput
                        placeholder="Search items"
                        value={childSearch}
                        onChange={setChildSearch}
                      /> */}
                      <MenuItemGridPackage
                        items={filteredChildren}
                        onToggleSelection={toggleChildSelection}
                      />
                    </div>

                    {/* SELECTED PREVIEW */}
                    <div className="col-span-3 border rounded-md">
                      <SelectedItemPackage
                        selectedItemsByCategory={selectedItemsByCategory}
                      />
                    </div>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={isSubmitting}
                  >
                    Save (Static)
                  </button>
                </div>
              </Form>
            </>
          )}
        </Formik>
      </Container>
    </Fragment>
  );
};

// ---------------- SMALL COMPONENT ----------------

const InputWithFormik = ({ label, name, type = "text" }) => (
  <div>
    <label className="block font-medium mb-1">{label}</label>
    <Field
      name={name}
      type={type}
      className="border px-2 py-2 w-full rounded"
    />
    <ErrorMessage
      name={name}
      component="div"
      className="text-red-500 text-xs"
    />
  </div>
);

export default AddPackageSecond;
