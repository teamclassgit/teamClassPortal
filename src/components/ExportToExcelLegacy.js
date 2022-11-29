import React from "react";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const ExportToExcelLegacy = ({ apiData, fileName, title, smallText }) => {
  const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportData = () => {
    const ws = XLSX.utils.aoa_to_sheet(apiData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        exportData();
      }}
    >
      {title}
      <small>{smallText}</small>
    </a>
  );
};

export default ExportToExcelLegacy;
