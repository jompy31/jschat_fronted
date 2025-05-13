import React, { useState } from "react";
import { FaFileCsv } from "react-icons/fa";

const CsvUpload = ({ csvFile, setCsvFile, handleCsvUpload }) => {
  const [isUploading, setIsUploading] = useState(false);

  const onUpload = async () => {
    setIsUploading(true);
    await handleCsvUpload();
    setIsUploading(false);
  };

  return (
    <div className="flex items-center space-x-2">
      <label className="block text-sm font-medium text-gray-700">
        Subir CSV
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setCsvFile(e.target.files[0])}
          className="mt-1 block w-full border rounded-lg"
        />
      </label>
      <button
        onClick={onUpload}
        disabled={isUploading || !csvFile}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 flex items-center"
      >
        <FaFileCsv className="mr-2" />
        {isUploading ? "Subiendo..." : "Subir"}
      </button>
    </div>
  );
};

export default CsvUpload;