import { Fragment, useState, useEffect } from "react";
import { Container } from "@/components/container";
import { RAW_MATERIAL_TABS } from "./constant";

const CrockeryConfiguration = () => {
  const [activeTab, setActiveTab] = useState(RAW_MATERIAL_TABS[0]);

  const [tabDataMap, setTabDataMap] = useState(() => {
    const initialMap = {};
    RAW_MATERIAL_TABS.forEach((tab) => {
      initialMap[tab.key] = tab.data;
    });
    return initialMap;
  });

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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const currentColumns = activeTab.columns({
    onValueChange: handleValueChange,
  });
  const currentData = tabDataMap[activeTab.key];

  // Separate name column from range columns
  const nameColumn = currentColumns[0];
  const rangeColumns = currentColumns.slice(1);

  return (
    <Fragment>
      <Container>
        {/* Header */}
        <div className="mb-3">
          <h1 className="text-gray-900 text-2xl font-bold">
            Crockery Configuration
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-4">
          {RAW_MATERIAL_TABS.map((tab) => (
            <button
              key={tab.key}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab.key === tab.key
                  ? "border-b-2 border-blue-500 text-blue-500 bg-blue-50"
                  : "text-gray-500 hover:text-blue-500"
              }`}
              onClick={() => handleTabChange(tab)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Table Card with Fixed Name Column */}
        <div
          className="bg-white rounded shadow mb-10"
          style={{ border: "1px solid #e5e7eb" }}
        >
          <div className="p-4">
            <div style={{ display: "flex", overflow: "hidden" }}>
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
      </Container>
    </Fragment>
  );
};

export { CrockeryConfiguration };
