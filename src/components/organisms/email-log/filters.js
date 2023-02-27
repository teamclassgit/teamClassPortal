export const applyFilters = (filterValue, setFilterValue, status) => {

  let currentFilters = [...filterValue];

  if (currentFilters && currentFilters.length === 0) {
      currentFilters = [
        { name: "createAt", type: "date", operator: "inrange", value: undefined },
        { name: "_id", type: "string", operator: "contains", value: "" },
        { name: "subject", type: "string", operator: "contains", value: "" },
        { name: "templateId", type: "select", operator: "inlist", value:  undefined },
        { name: "documentId", type: "string", operator: "contains", value: "" },
        { name: "collection", type: "string", operator: "contains", value: "" },
        { name: "functions", type: "select", operator: "inlist", value: undefined },
        { name: "origin", type: "string", operator: "contains", value: "" },
        { name: "type", type: "string", operator: "contains", value: "" }
      ];
    }
    currentFilters = currentFilters.filter((filter) => filter.name !== "status");
    currentFilters.push({ name: "status", type: "string", operator: "contains", value: status.value });
    setFilterValue(currentFilters);
};