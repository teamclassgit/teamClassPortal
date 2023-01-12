// @packages
import React from "react";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { FileText } from "react-feather";
import PropTypes from "prop-types";

const ExportToExcel = ({ apiDataFunc, fileName, setIsExporting }) => {
  const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToExcel = async () => {
    console.log("exporting...");
    setIsExporting(true);
    try {
      const apiData = await apiDataFunc();
      const ws = XLSX.utils.aoa_to_sheet(apiData);
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, fileName + fileExtension);
    } catch (ex) {
      console.log(ex);
    }
    setIsExporting(false);
  };

  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        exportToExcel();
      }}
    >
      <h6>
        <FileText size={13} />
        {" Excel File"}
      </h6>
      <small>
        <h6 className="small m-0 p-0">Download</h6>
      </small>
    </a>
  );
};

ExportToExcel.propTypes = {
  apiDataFunc: PropTypes.func,
  fileName: PropTypes.string,
  setIsExporting: PropTypes.func
};

export default ExportToExcel;
