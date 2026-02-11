import { Fragment, useState, useEffect } from "react";
import { Container } from "@/components/container";
import {
  GetrawMaterialCatIdbytypeid,
  GETcrockerycutlerygetByRawMaterialCat,
  Addupdatecrockerycutlery,
} from "@/services/apiServices";
import { utensilColumns } from "./utensilColumns";
import { gasBatlaColumns } from "./gasBatlaColumns";
import Swal from "sweetalert2";

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
    k;
  };

  useEffect(() => {
    const fetchTabs = async () => {
      try {
        setLoading(true);

        // Fetch categories dynamically (parent categories)
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
          setActiveTab(formattedTabs[0]); // first tab active
        }

        // initialize empty table data per tab
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

        // Fetch crockery/cutlery data by category
        const res = await GETcrockerycutlerygetByRawMaterialCat(
          activeTab.id,
          userId,
        );

        console.log("GETcrockerycutlerygetByRawMaterialCat Response:", res); // Add this

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

      // Transform data to match API format
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

        const userId = localStorage.getItem("userId");
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

  const handleValueChange = (id, field, value) => {
    setTabDataMap((prev) => ({
      ...prev,
      [activeTab.key]: prev[activeTab.key].map((row) =>
        row.id === id ? { ...row, [field]: value } : row,
      ),
    }));
  };

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

  const currentColumns = activeTab.columns({
    onValueChange: handleValueChange,
  });
  const currentData = tabDataMap[activeTab.key] || [];

  const nameColumn = currentColumns[0];
  const rangeColumns = currentColumns.slice(1);

  return (
    <Fragment>
      {/* Header */}
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

          {!loading && (
            <div
              className="bg-white rounded shadow mb-10 overflow-hidden"
              style={{ border: "1px solid #e5e7eb" }}
            >
              <div className="p-4 overflow-x-auto">
                <div style={{ display: "flex", minWidth: "max-content" }}>
                  {/* Fixed Name Column */}
                  <div style={{ flexShrink: 0 }}>
                    <table style={{ borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ backgroundColor: "#f3f4f6" }}>
                          <th
                            style={{
                              border: "1px solid #d1d5db",
                              padding: "20px 35px",
                              textAlign: "left",
                              fontWeight: "600",
                              whiteSpace: "nowrap",
                              fontSize: "14px",
                            }}
                          >
                            {nameColumn.Header}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentData.map((row) => (
                          <tr key={row.id}>
                            <td
                              style={{
                                border: "1px solid #d1d5db",
                                padding: "20px 35px",
                                whiteSpace: "nowrap",
                                backgroundColor: "white",
                              }}
                            >
                              {nameColumn.Cell
                                ? nameColumn.Cell({ row: { original: row } })
                                : row[nameColumn.accessor]}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Scrollable Range Columns */}
                  <div
                    style={{
                      overflowX: "auto",
                      flexGrow: 1,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <table
                      style={{
                        borderCollapse: "collapse",
                        width: "max-content",
                        minWidth: "100%",
                      }}
                    >
                      <thead>
                        <tr style={{ backgroundColor: "#f3f4f6" }}>
                          {rangeColumns.map((col) => (
                            <th
                              key={col.id}
                              style={{
                                border: "1px solid #d1d5db",
                                borderLeft: "none",
                                padding: "20px 35px",
                                textAlign: "left",
                                fontWeight: "600",
                                whiteSpace: "nowrap",
                                fontSize: "14px",
                              }}
                            >
                              {col.Header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {currentData.map((row) => (
                          <tr key={row.id}>
                            {rangeColumns.map((col) => (
                              <td
                                key={col.id}
                                style={{
                                  border: "1px solid #d1d5db",
                                  borderLeft: "none",
                                  padding: "12px",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {col.Cell
                                  ? col.Cell({ row: { original: row } })
                                  : row[col.accessor]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </Fragment>
  );
};

export { CrockeryConfiguration };
