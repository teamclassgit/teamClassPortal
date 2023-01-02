//  @packages
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";

export const getColums = (editable, onEditableChange, instructors) => {
  const columns = [
    {
      name: "tableId",
      header: "Table Id",
      type: "string",
      defaultVisible: false,
      editable: false,
      render: ({ value }) => {
        return <span className="">{value}</span>;
      }
    },
    {
      name: "title",
      header: "Listing \nClass",
      type: "string",
      filterEditor: StringFilter,
      defaultWidth: 250,
      render: ({ value }) => {
        return <span className="">{value}</span>;
      }
    },
    {
      name: "variantTitle",
      header: "Variant",
      defaultWidth: 180,
      type: "string",
      filterEditor: StringFilter,
      render: ({ cellProps }) => {
        return <span className="">{cellProps.data.variant.title}</span>;
      }
    },
    {
      name: "variantGroupEvent",
      header: "Person / Group",
      type: "string",
      editable: false,
      render: ({ cellProps }) => {
        return <span className="">{cellProps.data.variant.groupEvent ? "Group" : "Person"}</span>;
      }
    },
    {
      name: "priceTiers",
      header: "Tiers",
      type: "string",
      defaultWidth: 80,
      editable: false,
      render: ({ cellProps }) => {
        return (
          <span className="">{cellProps.data.priceTier ? `${cellProps.data.priceTier.minimum} - ${cellProps.data.priceTier.maximum}` : ""}</span>
        );
      }
    },
    {
      name: "pricePerson",
      header: "Web Price",
      type: "number",
      defaultWidth: 118,
      editable,
      render: ({ cellProps }) => {
        if (!cellProps.data.variant.groupEvent) {
          onEditableChange(false);
        } else {
          onEditableChange(true);
          return <span className="float-right">{`$ ${cellProps.data.priceTier.price}`}</span>;
        }
      }
    },
    {
      name: "pricePersonInstructor",
      header: "Instructor Price",
      type: "number",
      render: ({ cellProps }) => {
        return (
          <span className="float-right">
            {cellProps.data.variant.groupEvent && cellProps.data.priceTier.priceInstructor ? `$ ${cellProps.data.priceTier.priceInstructor}` : ""}
            {cellProps.data.variant.pricePersonInstructor ? `$ ${cellProps.data.variant.pricePersonInstructor}` : ""}
          </span>
        );
      }
    },
    {
      name: "instructorFlatFee",
      header: "Instructor Flat Fee",
      type: "number",
      render: ({ cellProps }) => {
        return (
          <span className="float-right">{cellProps.data.variant.instructorFlatFee ? `$ ${cellProps.data.variant.instructorFlatFee}` : ""} </span>
        );
      }
    },
    {
      name: "expectedProfit",
      header: "Margin/profit",
      type: "number",
      editable: (_, cellProps) => {
        return Promise.resolve(!cellProps.data.variant.groupEvent);
      },
      render: ({ cellProps }) => {
        return (
          <span className="float-right">{cellProps.data.variant.expectedProfit ? `${cellProps.data.variant.expectedProfit * 100}%` : ""} </span>
        );
      }
    },
    {
      name: "variantHasKit",
      header: "Kit Included",
      type: "string",
      editable: false,
      defaultWidth: 100,
      render: ({ cellProps }) => {
        return <span>{cellProps.data.variant.hasKit ? "Yes" : "No"}</span>;
      }
    },
    {
      name: "variantActive",
      header: "Variant status",
      type: "string",
      defaultWidth: 130,
      editable: false,
      render: ({ cellProps }) => {
        return <span>{cellProps.data.variant.active ? "Active" : "Inactive"}</span>;
      }
    },
    {
      name: "isActive",
      header: "Published",
      type: "string",
      editable: false,
      defaultWidth: 115,
      render: ({ value }) => {
        return <span>{value ? "Yes" : "No"}</span>;
      }
    },
    { name: "instructorName", header: "Instructor Name", type: "string", editable: false },
    {
      name: "instructorEmail",
      header: "Instructor Email",
      type: "string",
      editable: false,
      render: ({ cellProps }) => {
        const classInstructor = instructors.find((item) => item._id === cellProps.data.instructorId);
        return <span className="">{classInstructor && classInstructor.email}</span>;
      }
    }
  ];

  return columns;
};
