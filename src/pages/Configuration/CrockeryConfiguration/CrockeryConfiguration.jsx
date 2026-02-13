import { Fragment, useState, useEffect, useMemo, useCallback } from "react";
import { Container } from "@/components/container";
import { TableComponent } from "@/components/table/TableComponent";

import {
  GetrawMaterialCatIdbytypeid,
  GETcrockerycutlerygetByRawMaterialCat,
  Addupdatecrockerycutlery,
} from "@/services/apiServices";
import { utensilColumns } from "./utensilColumns";
import { gasBatlaColumns } from "./gasBatlaColumns";
import Swal from "sweetalert2";
import styles from "./CrockeryConfiguration.module.css";

const CrockeryConfiguration = () => {
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [tabDataMap, setTabDataMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const getColumnsForTab = (tabKey) => {
    const columnMap = {
      UTENSILS: utensilColumns,
      GAS: gasBatlaColumns,
    };
    return columnMap[tabKey] || utensilColumns;
  };

  useEffect(() => {
    const fetchTabs = async () => {
      try {
        setLoading(true);
        const res = await GetrawMaterialCatIdbytypeid(2);
        const apiTabs =
          res?.data?.data?.["Raw Material Category Details"] || [];

        const formattedTabs = apiTabs.map((item) => ({
          key: item.id,
          label: item.nameEnglish,
          id: item.id,
          columns: getColumnsForTab(
            item.nameEnglish.toUpperCase().replace(/\s+/g, "_"),
          ),
        }));

        setTabs(formattedTabs);
        if (formattedTabs.length > 0) {
          setActiveTab(formattedTabs[0]);
        }

        const initialMap = {};
        formattedTabs.forEach((tab) => {
          initialMap[tab.key] = [];
        });
        setTabDataMap(initialMap);
      } catch (err) {
        console.error("Error fetching tabs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTabs();
  }, []);

  useEffect(() => {
    if (!activeTab) return;

    const fetchTableData = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem("userId");
        const res = await GETcrockerycutlerygetByRawMaterialCat(
          activeTab.id,
          userId,
        );
        console.log("GETcrockerycutlerygetByRawMaterialCat Response:", res);
        const tableData = res?.data?.data || [];
        setTabDataMap((prev) => ({
          ...prev,
          [activeTab.key]: tableData,
        }));
      } catch (err) {
        console.error("Error fetching table data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTableData();
  }, [activeTab]);

  const handleSave = async () => {
    try {
      setSaveLoading(true);
      const userId = localStorage.getItem("userId");
      const currentData = tabDataMap[activeTab.key] || [];

      const payload = currentData.map((row) => ({
        id: row.id || 0,
        rawMaterialCategoryId: activeTab.id,
        rawMaterialId: row.rawMaterialId,
        rawMaterialNameEnglish: row.rawMaterialNameEnglish,
        rawMaterialNameHindi: row.rawMaterialNameHindi,
        rawMaterialNameGujarati: row.rawMaterialNameGujarati,
        userId: Number(userId),
        r_0_to_100: Number(row.r_0_to_100) || 0,
        r_101_to_200: Number(row.r_101_to_200) || 0,
        r_201_to_300: Number(row.r_201_to_300) || 0,
        r_301_to_400: Number(row.r_301_to_400) || 0,
        r_401_to_500: Number(row.r_401_to_500) || 0,
        r_501_to_600: Number(row.r_501_to_600) || 0,
        r_601_to_700: Number(row.r_601_to_700) || 0,
        r_701_to_800: Number(row.r_701_to_800) || 0,
        r_801_to_900: Number(row.r_801_to_900) || 0,
        r_901_to_1000: Number(row.r_901_to_1000) || 0,
        r_1001_to_1100: Number(row.r_1001_to_1100) || 0,
        r_1101_to_1200: Number(row.r_1101_to_1200) || 0,
        r_1201_to_1300: Number(row.r_1201_to_1300) || 0,
        r_1301_to_1400: Number(row.r_1301_to_1400) || 0,
        r_1401_to_1500: Number(row.r_1401_to_1500) || 0,
        r_1501_to_1600: Number(row.r_1501_to_1600) || 0,
        r_1601_to_1700: Number(row.r_1601_to_1700) || 0,
        r_1701_to_1800: Number(row.r_1701_to_1800) || 0,
        r_1801_to_1900: Number(row.r_1801_to_1900) || 0,
        r_1901_to_2000: Number(row.r_1901_to_2000) || 0,
      }));

      const response = await Addupdatecrockerycutlery(payload);

      if (response?.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: response?.data?.msg || "Data saved successfully!",
          confirmButtonColor: "#3b82f6",
        });

        const res = await GETcrockerycutlerygetByRawMaterialCat(
          activeTab.id,
          userId,
        );
        const tableData = res?.data?.data || [];
        setTabDataMap((prev) => ({
          ...prev,
          [activeTab.key]: tableData,
        }));
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: response?.data?.msg || "Failed to save data",
          confirmButtonColor: "#3b82f6",
        });
      }
    } catch (err) {
      console.error("Error saving data:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.response?.data?.msg || err?.message || "Error saving data",
        confirmButtonColor: "#3b82f6",
      });
    } finally {
      setSaveLoading(false);
    }
  };

  useEffect(() => {
    document.body.style.overflowX = "hidden";
    document.documentElement.style.overflowX = "hidden";
    return () => {
      document.body.style.overflowX = "";
      document.documentElement.style.overflowX = "";
    };
  }, []);

  // ✅ FIX 1: useCallback ensures handleValueChange has a stable reference.
  // Without this, a new function is created every render, which causes
  // useMemo below to recompute columns, which remounts inputs and kills focus.
  const handleValueChange = useCallback(
    (id, field, value) => {
      setTabDataMap((prev) => ({
        ...prev,
        [activeTab.key]: prev[activeTab.key].map((row) =>
          row.id === id ? { ...row, [field]: value } : row,
        ),
      }));
    },
    [activeTab?.key],
  );

  // ✅ FIX 2: useMemo ensures columns are only recomputed when the active tab
  // actually changes — NOT on every keystroke/state update. This prevents
  // React from unmounting/remounting inputs, which was causing focus loss.
  const currentColumns = useMemo(() => {
    if (!activeTab) return [];
    return activeTab.columns({ onValueChange: handleValueChange });
  }, [activeTab?.key, handleValueChange]);

  const currentData = tabDataMap[activeTab?.key] || [];

  if (!activeTab) {
    return (
      <Container>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">
            {loading ? "Loading..." : "No tabs available"}
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Fragment>
      <Container>
        <div className="max-w-full overflow-hidden">
          {/* Header */}
          <div className="mb-3 px-4 sm:px-0">
            <h1 className="text-gray-900 text-2xl font-bold">
              Crockery Configuration
            </h1>
          </div>

          {/* Tabs */}
          <div className="flex border-b mb-4 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-semibold transition-all ${
                  activeTab?.key === tab.key
                    ? "border-b-2 border-blue-500 text-blue-500 bg-blue-50"
                    : "text-gray-500 hover:text-blue-500"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Save Button */}
          <div className="flex justify-end mb-4 px-4 sm:px-0">
            <button
              onClick={handleSave}
              disabled={saveLoading || loading}
              className="px-6 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {saveLoading ? "Saving..." : "Save Configuration"}
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-500">Loading data...</p>
            </div>
          )}

          {/* Table with scoped styles */}
          {!loading && (
            <div className={`mb-10 ${styles.crockeryTableWrapper}`}>
              <TableComponent
                columns={currentColumns}
                data={currentData}
                paginationSize={50}
              />
            </div>
          )}
        </div>
      </Container>
    </Fragment>
  );
};

export { CrockeryConfiguration };
