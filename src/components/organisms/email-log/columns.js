// @packages
import { Fragment } from "react";
import { useHistory } from "react-router-dom";
import moment from "moment";

// @scripts
import { DEFAULT_TIME_ZONE_LABEL } from "@utility/Constants";
import { getBookingAndCalendarEventById } from "@services/BookingService";
import { isNotEmptyArray } from "@utility/Utils";

//@reactdatagrid packages
import NumberFilter from "@inovua/reactdatagrid-community/NumberFilter";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import { actionsLinkStage } from "../all-bookings/actionsLink";

export const getColumns = (classes, coordinators, setCurrentElement, handleClickCurrentElement) => {

  const history = useHistory();

  const handleEdit = (rowId) => {
    history.push(`/booking/${rowId}`);
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
      filterEditor: StringFilter,
      filterDelay: 1500,
      width: 350,
      render: ({ value }) => {
        if (value) {
          return <span className="float-left">{value}</span>;
        }
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
      filterEditor: StringFilter,
      filterDelay: 1500,
      width: 400,
      render: ({ value }) => {
        if (value) {
          return <span className="float-left">{value}</span>;
        }
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