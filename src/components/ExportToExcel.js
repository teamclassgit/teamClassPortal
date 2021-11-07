import React from 'react'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import { FileText } from 'react-feather'

const ExportToExcel = ({ apiData, fileName, title }) => {

  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  const fileExtension = '.xlsx'

  const exportToCSV = (apiData, fileName) => {
    const ws = XLSX.utils.aoa_to_sheet(apiData)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(data, fileName + fileExtension)
  }

  return <a onClick={(e) => exportToCSV(apiData, fileName)}>{title}</a>
}

export default ExportToExcel
