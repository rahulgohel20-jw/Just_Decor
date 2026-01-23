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

  // ✅ NEW: Calculate rate based on unit conversion
  const calculateRate = (raw, weightValue, selectedUnitId) => {
    const supplierRate = raw?.supplierRate || 0;
    const unitHierarchy = raw?.unitHierarchy;

    if (!unitHierarchy) {
      // Fallback if no hierarchy
      return weightValue * supplierRate;
    }

    // Check if selected unit is the parent unit
    const isParentUnit = unitHierarchy.unitId === selectedUnitId;

    if (isParentUnit) {
      // Parent unit (e.g., KILO)
      // Rate = weight * supplierRate
      return weightValue * supplierRate;
    } else {
      // Child unit (e.g., GRAM)
      // Find the child unit to get equivalentValue
      const childUnit = unitHierarchy.children?.find(
        (c) => c.unitId === selectedUnitId
      );

      if (childUnit && childUnit.equivalentValue > 0) {
        // Convert child to parent: weightInParent = weight / equivalentValue
        // Example: 50 GRAM / 1000 = 0.05 KILO
        const weightInParent = weightValue / childUnit.equivalentValue;
        return weightInParent * supplierRate;
      } else {
        // Fallback
        return weightValue * supplierRate;
      }
    }
  };

  const handleAddRecipe = () => {
    if (!selectedRaw || !weight || !unit) {
      return message.error("Please fill all recipe fields");
    }

    const raw = rawmaterialList.find((r) => r.rawMaterialId === selectedRaw);
    if (!raw) {
      return message.error("Invalid raw material selected");
    }

    const weightValue = parseFloat(weight);
    if (isNaN(weightValue) || weightValue <= 0) {
      return message.error("Please enter a valid weight");
    }

    const unitName = unitOptions.find((u) => u.value === unit)?.label || "";
    const supplierRate = raw?.supplierRate || 0;

    // ✅ CHANGED: Use the new calculateRate function
    const rate = calculateRate(raw, weightValue, unit);

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
            category: raw.category,
            name: raw.name,
            weight: weightValue,
            unit: unitName,
            unitId: unit,
            supplierRate,
            rate: Number(rate.toFixed(2)), // ✅ Round to 2 decimals
            rawMaterialId: raw.rawMaterialId, // ✅ Add this to update
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
        weight: weightValue,
        unit: unitName,
        unitId: unit,
        supplierRate,
        rate: Number(rate.toFixed(2)), // ✅ Round to 2 decimals
        menuRmId: null,
        rawMaterialId: raw.rawMaterialId,
      };

      setTableData((prev) => [...prev, newRow]);
      setRowCounter((prev) => prev + 1);
      message.success("Recipe added");
    }

    // Reset form
    setSelectedRaw(null);
    setWeight("");
    setUnit(null);
    setUnitOptions([]); // ✅ Also reset unit options
  };

  const handleDeleteRow = async (row) => {
    if (!row.menuRmId) {
      setTableData((prev) => prev.filter((item) => item.sr_no !== row.sr_no));
      return message.success("Deleted successfully");
    }

    try {
      const payload = {
        id: [row.menuRmId],
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
    const raw = rawmaterialList.find((r) => r.rawMaterialId === row.rawMaterialId);

    if (!raw) return;

    setSelectedRaw(raw.rawMaterialId);

    // ✅ Build unit options from hierarchy
    const unitHierarchy = raw.unitHierarchy;
    if (unitHierarchy) {
      const options = [
        {
          label: unitHierarchy.nameEnglish,
          value: unitHierarchy.unitId,
        },
        ...(unitHierarchy.children?.map((child) => ({
          label: child.nameEnglish,
          value: child.unitId,
        })) || []),
      ];
      setUnitOptions(options);
    } else {
      setUnitOptions([{ label: raw.unit, value: raw.unitId }]);
    }

    setUnit(row.unitId);
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
