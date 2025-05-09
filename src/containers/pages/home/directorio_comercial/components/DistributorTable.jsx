import React from "react";
import { Link } from "react-router-dom";
import { ITEMS_PER_COLUMN, COLUMN_BLOCK_HEIGHT } from "../constants";
import { AutoSizer, List } from "react-virtualized";

const DistributorTable = ({ sortedDistributors, listRef }) => {
  const chunkDistributorsIntoColumns = (distributors, chunkSize) => {
    let chunks = [];
    for (let i = 0; i < distributors.length; i += chunkSize) {
      chunks.push(distributors.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const renderColumnBlock = (column, columnIndex) => (
    <div
      key={columnIndex}
      style={{
        flex: "0 0 24%",
        minWidth: "24%",
        marginBottom: "20px",
      }}
    >
      <table
        style={{
          width: "100%",
          border: "2px solid black",
          borderRadius: "10px",
          overflow: "hidden",
          backgroundColor: "white",
          boxShadow: "0 0 10px rgba(255, 0, 0, 0.3)",
          tableLayout: "fixed",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "black", color: "white" }}></tr>
        </thead>
        <tbody>
          {column.map((distributor, idx) => (
            <tr
              key={idx}
              id={`row-${distributor?.name ? distributor.name[0]?.toUpperCase() : "Unknown"}`}
            >
              <td
                style={{
                  padding: "10px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ flex: 1 }}>
                  <Link
                    to={`/servicios/${distributor?.email || ""}`}
                    state={{
                      subproductName: distributor?.name || "Sin nombre",
                      subproductEmail: distributor?.email || "",
                    }}
                    style={{
                      color: "black",
                      fontWeight: "bold",
                      fontSize: "1em",
                      textOverflow: "ellipsis",
                      display: "inline-block",
                      maxWidth: "200px",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {distributor?.name || "Sin nombre"}
                  </Link>
                </span>
                <span>{distributor?.phone || "No disponible"}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const rowRenderer = ({ index, key, style }) => {
    const columns = chunkDistributorsIntoColumns(sortedDistributors, ITEMS_PER_COLUMN);
    const startIndex = index * 4;
    const rowColumns = columns.slice(startIndex, startIndex + 4);

    return (
      <div
        key={key}
        style={{
          ...style,
          display: "flex",
          gap: "20px",
          justifyContent: "space-between",
          padding: "10px 0",
        }}
      >
        {rowColumns.map((column, columnIndex) => renderColumnBlock(column, startIndex + columnIndex))}
        {rowColumns.length < 4 &&
          Array.from({ length: 4 - rowColumns.length }).map((_, i) => (
            <div key={`empty-${i}`} style={{ flex: "0 0 24%", minWidth: "24%" }} />
          ))}
      </div>
    );
  };

  return (
    <div style={{ width: "100%", height: "600px" }}>
      <AutoSizer>
        {({ height, width }) => {
          const columns = chunkDistributorsIntoColumns(sortedDistributors, ITEMS_PER_COLUMN);
          const rowCount = Math.ceil(columns.length / 4);
          return (
            <List
              ref={listRef}
              width={width}
              height={height}
              rowCount={rowCount}
              rowHeight={COLUMN_BLOCK_HEIGHT}
              rowRenderer={rowRenderer}
              overscanRowCount={2}
            />
          );
        }}
      </AutoSizer>
    </div>
  );
};

export default DistributorTable;