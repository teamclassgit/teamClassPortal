// @packagess
import moment from "moment";

// @scripts

//@reactdatagrid packages
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import statusOptions from "@data/system-status-options.json";
import BoolFilter from "@inovua/reactdatagrid-community/BoolFilter";

export const getColumns = (setColumns, typeCard) => {
  let columns = [];
  if (typeCard.value === "email") {
    columns = [
      {
        name: "createdAt",
        header: "Created",
        type: "date",
        width: 230,
        filterEditor: DateFilter,
        render: ({ value }) => {
          return moment(value).calendar(null, {
            lastDay: "[Yesterday]",
            sameDay: "LT",
            lastWeek: "dddd",
            sameElse: "MMMM Do, YYYY"
          });
        }
      },
      {
        name: "sentDocumentDate",
        header: "Date Document Sent",
        type: "date",
        width: 230,
        filterEditor: DateFilter,
        render: ({ value }) => {
          return moment(value).calendar(null, {
            lastDay: "[Yesterday]",
            sameDay: "LT",
            lastWeek: "dddd",
            sameElse: "MMMM Do, YYYY"
          });
        }
      },
      {
        name: "status",
        header: "Status",
        type: "string",
        filterEditor: SelectFilter,
        filterDelay: 1500,
        width: 300,
        filterEditorProps: {
          multiple: true,
          wrapMultiple: false,
          dataSource: statusOptions?.map((functions) => {
            return { id: functions.value, label: functions.label };
          })
        }
      },
      {
        name: "documentId",
        header: "Document Id",
        type: "string",
        filterEditor: StringFilter,
        filterDelay: 1500,
        width: 300,
        render: ({ value }) => {
          if (value) {
            return <span className="float-left">{value}</span>;
          }
        }
      },
      {
        name: "attendeeId",
        header: "Attendee Id",
        type: "string",
        filterEditor: StringFilter,
        filterDelay: 1500,
        width: 300,
        render: ({ value }) => {
          if (value) {
            return <span className="float-left">{value}</span>;
          }
        }
      },
      {
        name: "operationType",
        header: "Operation Type",
        type: "string",
        filterEditor: StringFilter,
        filterDelay: 1500,
        render: ({ value }) => {
          if (value) {
            return <span className="float-left">{value}</span>;
          }
        }
      },
      {
        name: "createdDocument",
        header: "Created Document ?",
        type: "bool",
        filterEditor: BoolFilter,
        defaultWidth: 200,
        render: ({ value }) => {
          return <span className="float-left">{value ? "true" : "false"}</span>;
        }
      },
      {
        name: "sentDocument",
        header: "Sent document ?",
        type: "bool",
        filterEditor: BoolFilter,
        defaultWidth: 200,
        render: ({ value, data }) => {
          return <span className="float-left">{value ? "true" : "false"}</span>;
        }
      }
    ];
  }
  if (typeCard.value === "catalog") {
    columns = [
      {
        name: "createdAt",
        header: "Created",
        type: "date",
        width: 180,
        render: ({ value }) => {
          return moment(value).calendar(null, {
            lastDay: "[Yesterday]",
            sameDay: "LT",
            lastWeek: "dddd",
            sameElse: "MMMM Do, YYYY"
          });
        }
      },
      {
        name: "numlisting",
        header: "Listing Number",
        type: "number",
        width: 200,
        render: ({ value }) => {
          if (value) {
            return <span className="float-left">{value}</span>;
          }
        }
      },
      {
        name: "numlistingOpened",
        header: "Number Open Listings",
        type: "number",
        width: 200,
        render: ({ value }) => {
          if (value) {
            return <span className="float-left">{value}</span>;
          }
        }
      },
      {
        name: "numListingError",
        header: "Number Error Listings",
        type: "number",
        width: 200,
        render: ({ value }) => {
          if (value) {
            return <span className="float-left">{value}</span>;
          }
        }
      },
      {
        name: "_id",
        header: "ID",
        type: "string",
        width: 300,
        render: ({ value }) => {
          if (value) {
            return <span className="float-left">{value}</span>;
          }
        }
      }
    ];
  }
  if (typeCard.value === "bookingFull") {
    columns = [
      {
        name: "updateBookingFull",
        header: "Update Successful",
        type: "string",
        filterEditor: StringFilter,
        filterDelay: 1500,
        render: ({ value }) => {
          return <span className="float-left">{value ? "TRUE" : "FALSE"}</span>;
        }
      },
      {
        name: "updatedAtBooking",
        header: "Booking Update Date",
        type: "string",
        width: 250,
        render: ({ value }) => {
          if (value) {
            return <span className="float-left">{value}</span>;
          }
        }
      },
      {
        name: "updatedAtBookingFull",
        header: "BookingFULL update date",
        type: "string",
        width: 250,
        render: ({ value }) => {
          if (value) {
            return <span className="float-left">{value}</span>;
          }
        }
      },
      {
        name: "_id",
        header: "ID",
        type: "string",
        width: 300,
        render: ({ value }) => {
          if (value) {
            return <span className="float-left">{value}</span>;
          }
        }
      }
    ];
  }
  setColumns(columns);
};