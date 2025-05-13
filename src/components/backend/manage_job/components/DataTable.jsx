import React from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

const DataTable = ({ columns, data, onAction, actionButtons }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-blue-600 text-white">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => col.onSort?.(col.key)}
                className="px-4 py-2 text-left cursor-pointer hover:bg-blue-700"
              >
                {col.label}
              </th>
            ))}
            {actionButtons && (
              <th className="px-4 py-2 text-left">Acciones</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-b hover:bg-gray-50">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-2">
                  {col.render ? col.render(item) : item[col.key]}
                </td>
              ))}
              {actionButtons && (
                <td className="px-4 py-2 flex space-x-2">
                  {actionButtons.map((btn) => (
                    <Button
                      key={btn.label}
                      variant={btn.variant}
                      onClick={() => btn.onClick(item)}
                      className={`px-2 py-1 rounded ${
                        btn.variant === 'danger'
                          ? 'bg-red-600 hover:bg-red-700'
                          : btn.variant === 'warning'
                          ? 'bg-yellow-600 hover:bg-yellow-700'
                          : 'bg-blue-600 hover:bg-blue-700'
                      } text-white`}
                    >
                      {btn.label}
                    </Button>
                  ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      render: PropTypes.func,
      onSort: PropTypes.func,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  onAction: PropTypes.func,
  actionButtons: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      variant: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
    })
  ),
};

export default DataTable;