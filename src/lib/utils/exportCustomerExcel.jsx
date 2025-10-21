import moment from "moment";
import * as XLSX from "xlsx";

const exportToExcel = ({ data = [], name = "all_data" }) => {


    // Convert to worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Auto-adjust column width based on content
    const columnWidths = Object.keys(data[0]).map((key) => ({
        wch: Math.max(...data.map(row => (row[key] ? row[key].toString().length : 10)), key.length) + 2
    }));

    worksheet['!cols'] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    // Generate and download the file
    XLSX.writeFile(workbook, `${name}.xlsx`);
};

export default exportToExcel;
