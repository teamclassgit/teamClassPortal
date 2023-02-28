// @packages
import React, { useState, useEffect, useCallback} from "react";
import { useSelector } from "react-redux";
import { apolloClient } from "@utility/RealmApolloClient";
import moment from "moment-timezone";
window.moment = moment;
import { getQueryFiltersFromFilterArray } from "@utility/Utils";

//@reactdatagrid packages
import ReactDataGrid from "@inovua/reactdatagrid-enterprise";
import "@inovua/reactdatagrid-enterprise/index.css";
import "@inovua/reactdatagrid-enterprise/theme/default-light.css";
import "@inovua/reactdatagrid-enterprise/theme/amber-dark.css";
import "@organisms/all-bookings/BookingsTable.scss";

// @scripts
import queryEmailsNotificationsDeliveredWithCriteria from "@graphql/QueryEmailsNotificationsDeliveredWithCriteria";
import queryEmailsNotificationsErrorWithCriteria from "@graphql/QueryEmailsNotificationsErrorWithCriteria";
import queryEmailsNotificationsRequestWithCriteria from "@graphql/QueryEmailsNotificationsRequestWithCriteria";
import EmailLogTableStatusCards from "@molecules/email-log-table-status-card";
import RowDetailsEmailLog from "@molecules/email-log-table-row-details";
import EmailLogTasksBar from "@molecules/email-log-task-bar";
import { getAllDataToExportEmailLog } from "@services/EmailService";
import { getColumns } from "./columns";
import { applyFilters } from "./filters";

const renderRowDetails = ({ data }) => {
  return data ? <RowDetailsEmailLog data={data} /> : <></>;
};

const onRenderRow = (rowProps) => {
  const depositPayment = rowProps.data.depositsPaid;
  const finalPayment = rowProps.data.finalPaid;
  const previousEventDays = moment(rowProps.data.eventDateTime).diff(moment(), "days");

  if (depositPayment && rowProps.data.eventDateTime && !finalPayment) {
    if (previousEventDays < 0) {
      rowProps.style.backgroundColor = "rgba(234,84,85,.12)";
    } else if (previousEventDays < 7 && previousEventDays >= 0) {
      rowProps.style.backgroundColor = "rgba(255,159,67,.12)";
    }
  }
};

const EmailLogTable = () => {
  const defaultStatus = { value: "sent", label: "Sent" };
  const skin = useSelector((state) => state.bookingsBackground);
  const [status, setStatus] = useState(defaultStatus);
  const [filterValue, setFilterValue] = useState([]);
  const [filterValueDelivered, setFilterValueDelivered] = useState([]);
  const [filterValueError, setFilterValueError] = useState([]);
  const [filterValueRequest, setFilterValueRequest] = useState([]);
  const [orFilters, setOrFilters] = useState([]);
  const [sortInfo, setSortInfo] = useState({ dir: -1, id: "createAt", name: "createAt", type: "date" });
  const [expandedRows, setExpandedRows] = useState({ 1: true, 2: true });
  const [collapsedRows, setCollapsedRows] = useState(null);
  const [selected, setSelected] = useState({});
  const gridStyle = { minHeight: 600, marginTop: 10 };
  const columns = getColumns();

  useEffect(() => {
    if (!status) return;
    applyFilters(filterValue, setFilterValue, status);
    applyFilters(filterValueDelivered, setFilterValueDelivered, status);
    applyFilters(filterValueError, setFilterValueError, status);
    applyFilters(filterValueRequest, setFilterValueRequest, status);
  }, [status]);

  const loadData = async ({ skip, limit, sortInfo, filterValue }) => {
    if (status.value === "sent") {
      const filters = getQueryFiltersFromFilterArray(filterValue);
      const response = await apolloClient.query({
        query: queryEmailsNotificationsDeliveredWithCriteria,
        fetchPolicy: "network-only",
        variables: {
          limit,
          offset: skip,
          sortBy: sortInfo,
          filterBy: filters,
          filterByOr: orFilters
        }
      });
      const totalCount = response.data.getEmailsNotificationsDeliveredWithCriteria.count;
      return { data: response.data.getEmailsNotificationsDeliveredWithCriteria.rows, count: totalCount };
    }
    if (status.value === "error") {
      const filters = getQueryFiltersFromFilterArray(filterValue);
      const response = await apolloClient.query({
        query: queryEmailsNotificationsErrorWithCriteria,
        fetchPolicy: "network-only",
        variables: {
          limit,
          offset: skip,
          sortBy: sortInfo,
          filterBy: filters,
          filterByOr: orFilters
        }
      });
      const totalCount = response.data.getEmailsNotificationsErrorWithCriteria.count;
      return { data: response.data.getEmailsNotificationsErrorWithCriteria.rows, count: totalCount };
    }
    if (status.value === "scheduled") {
      const filters = getQueryFiltersFromFilterArray(filterValue);
      const response = await apolloClient.query({
        query: queryEmailsNotificationsRequestWithCriteria,
        fetchPolicy: "network-only",
        variables: {
          limit,
          offset: skip,
          sortBy: sortInfo,
          filterBy: filters,
          filterByOr: orFilters
        }
      });
      const totalCount = response.data.getEmailsNotificationsRequestWithCriteria.count;
      return { data: response.data.getEmailsNotificationsRequestWithCriteria.rows, count: totalCount };
    }
  };

  const dataSource = useCallback(loadData, [status]);

  const onExpandedRowsChange = useCallback(({ expandedRows, collapsedRows }) => {
    setExpandedRows(expandedRows);
    setCollapsedRows(collapsedRows);
  }, []);

  const getDataToExport = async () => {
    const filters = getQueryFiltersFromFilterArray(filterValue);
    return await getAllDataToExportEmailLog(filters, orFilters, sortInfo, status);
  };

  return (
    <div>
      <EmailLogTableStatusCards status={status} setStatus={setStatus} filtersDelivered={filterValueDelivered} filtersError={filterValueError} filtersRequest={filterValueRequest} />
      <EmailLogTasksBar
        titleView={"Mail List"}
        titleBadge={status && status.label}
        getDataToExport={getDataToExport}
      ></EmailLogTasksBar>
      <ReactDataGrid
        idProperty="_id"
        className="bookings-table text-small"
        style={gridStyle}
        columns={columns}
        filterValue={filterValue}
        pagination
        limit={50}
        livePagination
        dataSource={dataSource}
        sortInfo={sortInfo}
        onSortInfoChange={setSortInfo}
        onFilterValueChange={setFilterValue}
        showZebraRows={true}
        theme={skin === "dark" ? "amber-dark" : "default-light"}
        selected={selected}
        checkboxColumn
        enableSelection={true}
        expandedRows={expandedRows}
        collapsedRows={collapsedRows}
        onExpandedRowsChange={onExpandedRowsChange}
        onRenderRow={onRenderRow}
        rowExpandHeight={400}
        renderRowDetails={renderRowDetails}
        licenseKey={process.env.REACT_APP_DATAGRID_LICENSE}
      />

    </div>
  );
};

export default EmailLogTable;

ReactDataGrid.defaultProps.filterTypes.string = {
  type: "string",
  emptyValue: "",
  operators: [
    {
      name: "contains",
      fn: {}
    }
  ]
};

ReactDataGrid.defaultProps.filterTypes.select = {
  type: "select",
  emptyValue: undefined,
  operators: [
    {
      name: "inlist",
      fn: {}
    },
    {
      name: "notinlist",
      fn: {}
    }
  ]
};
