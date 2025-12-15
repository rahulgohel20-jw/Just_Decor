import { useEffect, useMemo, useState } from "react";
import { message } from "antd";
import { deleteRawmatrialcatidInmenuitem } from "@/services/apiServices";

export default function useRecipe(rawmaterialList, initialData = []) {
  const [tableData, setTableData] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRaw, setSelectedRaw] = useState(null);
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState(null);
  const [unitOptions, setUnitOptions] = useState([]);
  const [rowCounter, setRowCounter] = useState(
    initialData && initialData.length ? initialData.length + 1 : 1
  );
  const [editingRowId, setEditingRowId] = useState(null);
  const [totalRate, setTotalRate] = useState(0);
  const [dishCosting, setDishCosting] = useState(0);

  // Filtered data for search
  const filteredTableData = useMemo(() => {
    if (!searchTerm) return tableData;
    return tableData.filter((item) =>
      (item.name || "")
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [tableData, searchTerm]);

  // Total & costing
  useEffect(() => {
    const total = tableData.reduce(
      (sum, item) => sum + Number(item.rate || 0),
      0
    );
    setTotalRate(total);
    setDishCosting(total > 0 ? total / 100 : 0);
  }, [tableData]);

  const handleAddRecipe = () => {
    if (!selectedRaw || !weight || !unit) {
      return message.error("Please fill all recipe fields");
    }

    const raw = rawmaterialList.find((r) => r.rawMaterialId === selectedRaw);
    if (!raw) {
      return message.error("Invalid raw material selected");
    }

    const unitName = unitOptions.find((u) => u.value === unit)?.label || "";

    const supplierRate = raw?.supplierRate || 0;
    const rate = Number(weight) * Number(supplierRate);

    const duplicate = tableData.find(
      (r) => r.rawMaterialId === raw.rawMaterialId
    );
    if (!editingRowId && duplicate) {
      return message.error("This raw material is already added.");
    }

    if (editingRowId) {
      const updatedRows = tableData.map((row) =>
        row.sr_no === editingRowId
          ? {
              ...row,
              category: raw.category, // ← Fixed: use raw.category instead of raw.rawMaterialCat?.nameEnglish
              name: raw.name, // ← Fixed: use raw.name instead of raw.nameEnglish
              weight,
              unit: unitName,
              unitId: unit,
              supplierRate,
              rate,
            }
          : row
      );

      setTableData(updatedRows);
      setEditingRowId(null);
      message.success("Recipe updated");
    } else {
      const newRow = {
        sr_no: rowCounter,
        category: raw.category,
        name: raw.name,
        weight,
        unit: unitName,
        unitId: unit,
        supplierRate,
        rate,
        menuRmId: null,
        rawMaterialId: raw.rawMaterialId,
      };

      setTableData((prev) => [...prev, newRow]);
      setRowCounter((prev) => prev + 1);
      message.success("Recipe added");
    }

    setSelectedRaw(null);
    setWeight("");
    setUnit(null);
  };

  const handleDeleteRow = async (row) => {
    if (!row.menuRmId) {
      setTableData((prev) => prev.filter((item) => item.sr_no !== row.sr_no));
      return message.success("Deleted successfully");
    }

    try {
      const payload = {
        id: row.menuRmId,
      };
      await deleteRawmatrialcatidInmenuitem(payload);
      setTableData((prev) => prev.filter((item) => item.sr_no !== row.sr_no));
      message.success("Deleted successfully");
    } catch (error) {
      console.error(error);
      message.error("Failed to delete");
    }
  };

  const handleEditRow = (row) => {
    setEditingRowId(row.sr_no);
    const raw = rawmaterialList.find((r) => r.name === row.name);
    if (!raw) return;
    setSelectedRaw(raw.rawMaterialId);
    setUnitOptions([{ label: raw.unit, value: raw.unitId }]);
    setUnit(raw.unitId);
    setWeight(row.weight);
  };

  return {
    tableData,
    setTableData,
    filteredTableData,
    searchTerm,
    setSearchTerm,
    selectedRaw,
    setSelectedRaw,
    weight,
    setWeight,
    unit,
    setUnit,
    unitOptions,
    setUnitOptions,
    totalRate,
    dishCosting,
    handleAddRecipe,
    handleDeleteRow,
    handleEditRow,
  };
}
