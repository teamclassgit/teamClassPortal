import React from 'react';

const ExportToCsv = ({ array, title, smallText, name, teamClassInfo }) => {
  // ** Converts table to CSV
  function convertArrayOfObjectsToCSV (array) {
    let result;
    const columnDelimiter = ';';
    const lineDelimiter = '\n';
    const dynamicLabels = array.length > 0 && array[0].additionalFields && array[0].additionalFields.map((item) => item.name);
    const keys = `name;email;phone;addressLine1;addressLine2;city;state;zip;country`;
    const arraykeys = keys.split(';');
    result = '';
    result += arraykeys.join(columnDelimiter);
    result += dynamicLabels && dynamicLabels.length > 0 && `;${dynamicLabels.join(columnDelimiter)}`;
    result += teamClassInfo.variants.map((item) => item.kitHasAlcohol && ';Delivery Restriction').join(columnDelimiter);
    result += ``;
    result += lineDelimiter;

    array.forEach((item) => {
      let ctr = 0;
      arraykeys.forEach((key) => {
        if (ctr > 0) result += columnDelimiter;
        result += (item[key] && item[key].replace('#', '')) || '';
        ctr++;
      });
      if (item.additionalFields && item.additionalFields.length > 0) {
        result += columnDelimiter;
        item.additionalFields.map((field) => {
          result += field.value;
          result += columnDelimiter;
        });
      } else {
        result += columnDelimiter;
      }
      if (item.canDeliverKitReason) result += item.canDeliverKitReason;
      result += lineDelimiter;
    });
    return result;
  }
  // ** Downloads CSV
  function downloadCSV (array) {
    const link = document.createElement('a');
    let csv = convertArrayOfObjectsToCSV(array);
    if (csv === null) return;

    const filename = name;

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', filename);
    link.click();
  }

  return (
    <a onClick={(e) => downloadCSV(array)}>
      {title}
      <small>{smallText}</small>
    </a>
  );
};

export default ExportToCsv;
