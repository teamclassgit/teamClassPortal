// @packages
import { useHistory } from "react-router-dom";
import moment from "moment";

// @scripts

//@reactdatagrid packages
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import functionsOptions from "@data/email-list-functions.json";
import templateIdOptions from "@data/email-list-template-id";

export const getColumns = () => {

  const getRecipients = (emailsTo) => {
    let result = "";
    emailsTo.forEach((email, i) => {
      result = result + (emailsTo[i + 1] ? `${email.email}, ` : `${email.email}`);
    });
    return result;
  };

  const columns = [
    {
      name: "createAt",
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
      name: "collection",
      header: "Collection",
      type: "number",
      filterEditor: StringFilter,
      filterDelay: 1500,
      render: ({ value }) => {
        if (value) {
          return <span className="float-left">{value}</span>;
        }
      }
    },
    {
      name: "to",
      header: "Recipients",
      type: "string",
      filterEditor: StringFilter,
      filterDelay: 1500,
      width: 500,
      render: ({ value }) => {
        if (value) {
          return <span className="float-left">{getRecipients(value)}</span>;
        }
      }
    },
    {
      name: "subject",
      header: "Subject",
      type: "string",
      width: 300,
      render: ({ value }) => {
        if (value) {
          return <span className="float-left">{value}</span>;
        }
      }
    },
    {
      name: "templateId",
      header: "Template Id",
      type: "string",
      filterEditor: SelectFilter,
      filterDelay: 1500,
      width: 350,
      filterEditorProps: {
        multiple: true,
        wrapMultiple: false,
        dataSource: templateIdOptions?.map((templateId) => {
          return { id: templateId.value, label: templateId.label };
        })
      }
    },
    {
      name: "log",
      header: "Message Log",
      type: "string",
      width: 250,
      render: ({ value }) => {
        if (value) {
          return <span className="float-left">{value}</span>;
        }
      }
    },
    {
      name: "functions",
      header: "Function Name",
      type: "string",
      filterEditor: SelectFilter,
      filterDelay: 1500,
      width: 400,
      filterEditorProps: {
        multiple: true,
        wrapMultiple: false,
        dataSource: functionsOptions?.map((functions) => {
          return { id: functions.value, label: functions.label };
        })
      }
    },
    {
      name: "origin",
      header: "Sending Process",
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
      name: "type",
      header: "Type",
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
      name: "isTask",
      header: "Trigger sent ?",
      type: "string",
      filterEditor: StringFilter,
      filterDelay: 1500,
      render: ({ value }) => {
        return <span className="float-left">{value ? "TRUE" : "FALSE"}</span>;
      }
    },
    {
      name: "_id",
      header: "ID",
      type: "string",
      filterEditor: StringFilter,
      filterDelay: 1500,
      width: 300,
      render: ({ value }) => {
        if (value) {
          return <span className="float-left">{value}</span>;
        }
      }
    }
  ];

  return columns;
};