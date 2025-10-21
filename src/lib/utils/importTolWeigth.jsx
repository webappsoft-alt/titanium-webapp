import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import ApiFunction from '../api/apiFuntions';

const ToleranceWeight = () => {
  const { post } = ApiFunction()
  const validateAndTransformData = async (data) => {
    const normalizeColumnName = (name) =>
      name
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ")
        .replace(/[\r\n]+/g, "");

    const columnsToAnalyze = [
      "+/- tol.",
      "Diameter Min.",
      "dia. Max",
      "Dia, HX, Th. Min.",
      "Dia, HX, Th. Max",
      "HEX A/F Min.",
      "HEX Max",
      "Thickness min.",
      "Th. Max",
      "Thick. Max",
      "Thickness min.",
    ].map(normalizeColumnName);

    const extractFirstNumber = (value) => {
      const match = String(value).match(/[\d.]+/); // Match first number (handles decimals too)
      return match ? Number(match[0]) : null;
    };

    const transformedData = data?.map((row) => {
      const normalizedRow = {};
      Object.keys(row).forEach((key) => {
        const normalizedKey = normalizeColumnName(key);
        if (columnsToAnalyze.includes(normalizedKey)) {
          normalizedRow[normalizedKey] = row[key];
        }
      });

      let tol = "", min = "", max = "";

      for (const key in normalizedRow) {
        if (key.includes("tol")) {
          tol = normalizedRow[key];
        } else if (key.includes("min") && !min) {
          min = extractFirstNumber(normalizedRow[key]);
        } else if (key.includes("max") && !max) {
          max = normalizedRow[key];
        }
      }

      return {
        tolerance: tol,
        min,
        max,
      };
    });

    console.log(transformedData);
    return transformedData;
  };

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

export default ToleranceWeight;
