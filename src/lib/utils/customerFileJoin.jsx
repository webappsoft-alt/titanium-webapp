import React, { useState } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Input } from '@/components/ui/input';

const FileJoinerFromFolder = () => {
  const [mergedData, setMergedData] = useState([]);
  const [loading, setLoading] = useState(false);
  // Same master data and referenceMap as before...

  // 🧠 Recursive function to resolve any object's references
  const populateReferences = (row, masterData, referenceMap) => {
    const result = { ...row };

    Object.entries(referenceMap).forEach(([refKey, masterKey]) => {
      const refId = result[refKey];

      if (refId && masterData[masterKey]) {
        const refData = getById(masterData[masterKey], refId);
        if (refData) {
          const fieldName = refKey.replace(/_id$/, '');

          // 🌀 Recurse into the referenced object
          result[fieldName] = populateReferences(refData, masterData, referenceMap);
        }
      }
    });

    return result;
  };

  const loadCSV = (file) =>
    new Promise((resolve) => {
      Papa.parse(file, {
        header: true,
        complete: (results) => resolve(results.data),
      });
    });

  const loadXLSX = async (file) => {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(sheet);
  };

  const getById = (arr, id) => arr?.find((item) => item.id == id || item.ID == id);

  const referenceMap = {
    bill_address_id: 'addresses',
    ship_address_id: 'addresses',
    customer_territory: 'territories',
    country_id: 'countries',
    state_id: 'states',
    os_id: 'users',
    is_id: 'users',
    rm_id: 'users',
  };

  const handleFolderUpload = async (e) => {
    setLoading(true);
    const files = Array.from(e.target.files);

    const fileMap = {};
    for (let file of files) {
      const name = file.name.toLowerCase();
      if (name.endsWith('.csv')) {
        fileMap[name] = await loadCSV(file);
      } else if (name.endsWith('.xlsx')) {
        fileMap[name] = await loadXLSX(file);
      }
    }

    // Load reference/master data
    const addresses = fileMap['addresses.csv'] || [];
    const territories = fileMap['territories.csv'] || [];
    const countries = fileMap['countries.csv'] || [];
    const states = fileMap['states.csv'] || [];
    const users = fileMap['users.csv'] || [];

    const masterData = { addresses, territories, countries, states, users };

    const referenceMap = {
      bill_address_id: 'addresses',
      ship_address_id: 'addresses',
      customer_territory: 'territories',
      country_id: 'countries',
      state_id: 'states',
      os_id: 'users',
      is_id: 'users',
      rm_id: 'users',
    };

    const output = [];

    for (const [filename, data] of Object.entries(fileMap)) {
      if (['addresses.csv', 'territories.csv', 'countries.csv', 'states.csv', 'users.csv'].includes(filename)) continue;

      const resolved = data.map((row) =>
        populateReferences(row, masterData, referenceMap)
      );

      output.push(...resolved);
    }

    setMergedData(output);
    setLoading(false);
  };

  return (
    <div className="p-4">
      <label className="block mb-2 text-lg font-medium">Upload Folder</label>
      <Input
        type="file"
        webkitdirectory="true"
        directory=""
        multiple
        onChange={handleFolderUpload}
        className="mb-4 cursor-pointer"
      />

      {loading ? (
        <p>Loading and joining data...</p>
      ) : (
        <pre className="text-sm max-h-[500px] overflow-auto bg-gray-100 p-2 rounded">
          {JSON.stringify(mergedData, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default FileJoinerFromFolder;
