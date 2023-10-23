export const applyFilters = (filterValue, setFilterValue, typeCard) => {

  let currentFilters = [...filterValue];
  if (currentFilters && currentFilters.length === 0 && typeCard.value === "email") {
      currentFilters = [
        { name: "createdAt", type: "date", operator: "inrange", value: undefined },
        { name: "sentDocumentDate", type: "date", operator: "inrange", value: undefined },
        { name: "_id", type: "string", operator: "contains", value: "" },
        { name: "attendeeId", type: "select", operator: "contains", value:  "" },
        { name: "documentId", type: "string", operator: "contains", value: "" },
        { name: "operationType", type: "string", operator: "contains", value: "" },
        { name: "createdDocument", type: "bool", operator: "eq", value: null },
        { name: "sentDocument", type: "bool", operator: "eq", value: null },
        { name: "status", type: "select", operator: "inlist", value: undefined }

      ];
    }
    setFilterValue(currentFilters);
};