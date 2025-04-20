import React from "react";
import PropTypes from "prop-types";

const TableComponent = ({ columns, data, isLoading }) => {
  return (
    <div class="grid">
      <div class="card min-w-full">
        <div className="card-table scrollable-x-auto">
          <table className="table align-middle text-gray-700 font-medium text-sm">
            <thead>
              <tr className="fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200">
                {columns.map((column) => (
                  <th key={column.key}>{column.header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : data && data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={item.id || index}>
                    {columns.map((column) => (
                      <td key={column.key}>{item[column.key]}</td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="text-center">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

TableComponent.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      header: PropTypes.string.isRequired,
      render: PropTypes.func, // Optional custom render function for the column
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
};

export { TableComponent };
