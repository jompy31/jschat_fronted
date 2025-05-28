import React, { useState } from "react";
import { useTable, useSortBy } from "react-table";
import { FaSort, FaEdit, FaTrash } from "react-icons/fa";

const SubproductTable = ({
  filteredSubproducts,
  handleShowServicesModal,
  handleEditSubproduct,
  handleDeleteS,
}) => {
  const [expandedRows, setExpandedRows] = useState({});

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Nombre",
        accessor: "name",
        Cell: ({ row }) => (
          <button
            onClick={() => handleShowServicesModal(row.original)}
            className="text-blue-600 hover:underline truncate block w-full text-left"
          >
            {row.original.name}
          </button>
        ),
      },
      { Header: "Teléfono", accessor: "phone" },
      { Header: "Email", accessor: "email" },
      { Header: "Dirección", accessor: "address" },
      { Header: "Página Web", accessor: "url" },
      {
        Header: "Acciones",
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              onClick={() => handleEditSubproduct(row.original)}
              className="text-blue-600 hover:text-blue-800"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => handleDeleteS(row.original.id)}
              className="text-red-600 hover:text-red-800"
            >
              <FaTrash />
            </button>
          </div>
        ),
      },
    ],
    [handleShowServicesModal, handleEditSubproduct, handleDeleteS]
  );

  // Use filteredSubproducts directly, ensuring it's an array
  const data = React.useMemo(
    () => (Array.isArray(filteredSubproducts) ? filteredSubproducts : []),
    [filteredSubproducts]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden w-full">
      <div className="overflow-x-auto">
        <table
          {...getTableProps()}
          className="min-w-full divide-y divide-gray-200 table-fixed"
          style={{ width: "100%" }}
        >
          <thead className="bg-gray-50">
            {headerGroups.map((headerGroup) => {
              const { key, ...headerGroupProps } = headerGroup.getHeaderGroupProps();
              return (
                <tr key={key} {...headerGroupProps}>
                  {headerGroup.headers.map((column, index) => {
                    const { key: columnKey, ...columnProps } = column.getHeaderProps(column.getSortByToggleProps());
                    return (
                      <th
                        key={columnKey}
                        {...columnProps}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider truncate"
                        style={{
                          width: index === 0
                            ? "20%" // Nombre
                            : index === 1
                            ? "15%" // Teléfono
                            : index === 2
                            ? "20%" // Email
                            : index === 3
                            ? "20%" // Dirección
                            : index === 4
                            ? "15%" // Página Web
                            : "10%", // Acciones
                        }}
                      >
                        <div className="flex items-center">
                          {column.render("Header")}
                          {column.isSorted && (
                            <FaSort
                              className={`ml-1 ${column.isSortedDesc ? "rotate-180" : ""}`}
                            />
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              );
            })}
          </thead>
          <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
            {rows.map((row) => {
              prepareRow(row);
              const isExpanded = expandedRows[row.original.id];
              const { key, ...rowProps } = row.getRowProps();
              return (
                <React.Fragment key={key}>
                  <tr {...rowProps}>
                    {row.cells.map((cell) => {
                      const { key: cellKey, ...cellProps } = cell.getCellProps();
                      return (
                        <td
                          key={cellKey}
                          {...cellProps}
                          className="px-6 py-4 text-sm text-gray-500 truncate"
                          title={typeof cell.value === "string" ? cell.value : ""}
                        >
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                  {isExpanded && (
                    <tr>
                      <td colSpan={columns.length} className="px-6 py-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <h4 className="font-semibold">Horas de Operación</h4>
                            <ul className="list-disc pl-5">
                              {row.original.business_hours?.map((hour, index) => (
                                <li key={index} className="truncate">
                                  {hour.day}: {hour.start_time} - {hour.end_time}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold">Miembros del Equipo</h4>
                            {row.original.team_members?.map((member) => (
                              <div key={member.id} className="flex items-center mb-2">
                                <img
                                  src={member.photo}
                                  alt={member.name}
                                  className="w-10 h-10 rounded-full mr-2"
                                />
                                <div>
                                  <p className="truncate">{member.name}</p>
                                  <p className="text-sm text-gray-500 truncate">{member.position}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div>
                            <h4 className="font-semibold">Cupones</h4>
                            {row.original.coupons?.map((coupon) => (
                              <div key={coupon.id} className="mb-2">
                                <p className="font-bold truncate">{coupon.code}</p>
                                <img
                                  src={coupon.image}
                                  alt={coupon.code}
                                  className="w-16 h-auto"
                                />
                                <p className="text-sm truncate">{coupon.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      {data.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          No se encontraron subproductos que coincidan con la búsqueda.
        </div>
      )}
    </div>
  );
};

export default SubproductTable;