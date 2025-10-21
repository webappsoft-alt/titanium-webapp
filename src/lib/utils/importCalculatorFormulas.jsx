import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import ApiFunction from '../api/apiFuntions';
import { handleError } from '../api/errorHandler';
import toast from 'react-hot-toast';

const CalculatorFormulas = () => {
  const { post } = ApiFunction()
  const validateAndTransformData = async (data) => {
    const normalizeColumnName = (name) => {
      const value = name
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ") // Normalize multiple spaces to a single space
        .replace(/[\r\n]+/g, ""); // Remove line breaks}
      return value
    }
    const trimColumnNames = (columns) => columns.map(normalizeColumnName);

    const columnsToAnalyze = trimColumnNames([
      "Alloy",
      "Density kg./dm^3",
      "Density lbs. / in^3",
      "Family",
      "Updated/Remove	",
    ]);
    const transformedData = data?.map((row, rowIndex) => {
      const normalizedRow = {};

     
      Object.keys(row).forEach((key) => {
        normalizedRow[normalizeColumnName(key)] = row[key];
      });


      return {
        alloyType: normalizedRow[columnsToAnalyze[0]] || "",
        alloyFamily: normalizedRow[columnsToAnalyze[3]] || "",
        densityLbs: normalizedRow[columnsToAnalyze[1]] || "",
        densityKg: normalizedRow[columnsToAnalyze[2]] || "",
        updatedLabel: normalizedRow[columnsToAnalyze[4]] || "",
      };
    });
    await post('density/create', { densities: transformedData })
      .then((result) => {
        if (result?.success) {
          toast.success(result?.message)
        }
      }).catch((err) => {
        handleError(err)
      });
  }
  const processXLSX = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      const range = XLSX.utils.decode_range(worksheet['!ref']);
      const jsonData = [];

      for (let rowNum = range.s.r + 1; rowNum <= range.e.r; rowNum++) {
        const row = {};
        for (let colNum = range.s.c; colNum <= range.e.c; colNum++) {
          const cellAddress = { r: rowNum, c: colNum };
          const cellRef = XLSX.utils.encode_cell(cellAddress);
          const cell = worksheet[cellRef];
          const headerCell = XLSX.utils.encode_cell({ r: range.s.r, c: colNum });
          const header = worksheet[headerCell]?.v || `Column${colNum + 1}`;
          row[header] = cell ? cell.v : "";
        }
        jsonData.push(row);
      }

      try {
        validateAndTransformData(jsonData);
      } catch (error) {
        throw new Error(error.message);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    processXLSX(file);
  };

  return (
    <div className="p-4">
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
    </div>
  );
};

export default CalculatorFormulas;
