// @packages
import React, { useState, useEffect, useCallback } from "react";
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
import queryGetBookingStatusWithCriteria from "@graphql/QueryBookingStatus";
import queryListingStatus from "@graphql/QueryListingStatus";
import queryBookingFullStatus from "@graphql/QueryBookingFullStatus";
import SystemStatusTrackerCards from "@molecules/system-status-tracker-card";
import RowDetailsListingStatus from "@molecules/listing-status-table-row-details";
import StatusSystemTasksBar from "@molecules/system-status-task-bar";
import { getColumns } from "./columns";
import { applyFilters } from "./filtersEmail";

const renderRowDetailsCatalog = ({ data }) => {
  return data ? <RowDetailsListingStatus data={data} /> : <></>;
};

const onRenderRowBookingFull = (rowProps) => {
  const updateBookingFull = rowProps.data.updateBookingFull;

  if (updateBookingFull === false) {
      rowProps.style.backgroundColor = "rgba(234,84,85,.12)";
  }
};

const onRenderRowEmails = (rowProps) => {
  const sentDocument = rowProps.data.sentDocument;

  if (sentDocument === false) {
      rowProps.style.backgroundColor = "rgba(234,84,85,.12)";
  }
};

const onRenderRowListing = (rowProps) => {
  const numListingError = rowProps.data.numListingError;

  if (numListingError > 0) {
      rowProps.style.backgroundColor = "rgba(234,84,85,.12)";
  }
};

const SystemStatus = () => {
  const defaultTypeCard = { value: "email", label: "Email Status" };
  const limitStatus = 200;
  const skin = useSelector((state) => state.bookingsBackground);
  const [typeCard, setTypeCard] = useState(defaultTypeCard);
  const [filterValue, setFilterValue] = useState([]);
  const [columns, setColumns] = useState([]);
  const [orFilters, setOrFilters] = useState([]);
  const [sortInfo, setSortInfo] = useState({ dir: -1, id: "createdAt", name: "createdAt", type: "date" });
  const [expandedRows, setExpandedRows] = useState({ 1: true, 2: true });
  const [collapsedRows, setCollapsedRows] = useState(null);
  const gridStyle = { minHeight: 600, marginTop: 10 };

  useEffect(() => {
    if (!typeCard) return;
    getColumns(setColumns, typeCard);
    if (typeCard.value === "email") {
      applyFilters(filterValue, setFilterValue, typeCard);
    }
  }, [typeCard]);

  const loadData = async ({ skip, limit, sortInfo, filterValue }) => {
    if (typeCard.value === "email") {
      const filtersEmail = getQueryFiltersFromFilterArray(filterValue);
      const response = await apolloClient.query({
        query: queryGetBookingStatusWithCriteria,
        fetchPolicy: "network-only",
        variables: {
          limit,
          offset: skip,
          sortBy: sortInfo,
          filterBy: filtersEmail,
          filterByOr: orFilters
        }
      });
      const totalCount = response.data.getBookingStatus.count;
      return { data: response.data.getBookingStatus.rows, count: totalCount };
    }
    if (typeCard.value === "catalog") {
      const response = await apolloClient.query({
        query: queryListingStatus,
        fetchPolicy: "network-only",
        variables: {
          limit: limitStatus
        }
      });
      return { data: response.data.getListingStatus, count: 0 };
    }
    if (typeCard.value === "bookingFull") {
      const response = await apolloClient.query({
        query: queryBookingFullStatus,
        fetchPolicy: "network-only",
        variables: {
          limit: limitStatus
        }
      });
      return { data: response.data.getBookingFullStatus.bookingList, count: 0 };
    }
  };

  const dataSource = useCallback(loadData, [typeCard]);

  const onExpandedRowsChange = useCallback(({ expandedRows, collapsedRows }) => {
    setExpandedRows(expandedRows);
    setCollapsedRows(collapsedRows);
  }, []);

  return (
    <div>
      <SystemStatusTrackerCards
        typeCard={typeCard}
        setTypeCard={setTypeCard}
      />
      <StatusSystemTasksBar
        titleView={"Details Log"}
        titleBadge={typeCard && typeCard.label}
      ></StatusSystemTasksBar>
      {typeCard && typeCard.value === "email" &&

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
          checkboxColumn
          enableSelection={true}
          onRenderRow={onRenderRowEmails}
          rowExpandHeight={400}
          licenseKey={process.env.REACT_APP_DATAGRID_LICENSE}
        />
      }
      {typeCard && typeCard.value === "catalog" &&
        <ReactDataGrid
          idProperty="_id"
          className="bookings-table text-small"
          style={gridStyle}
          columns={columns}
          pagination
          limit={50}
          livePagination
          dataSource={dataSource}
          sortInfo={sortInfo}
          onSortInfoChange={setSortInfo}
          onFilterValueChange={setFilterValue}
          showZebraRows={true}
          theme={skin === "dark" ? "amber-dark" : "default-light"}
          checkboxColumn
          enableSelection={true}
          expandedRows={expandedRows}
          collapsedRows={collapsedRows}
          onExpandedRowsChange={onExpandedRowsChange}
          onRenderRow={onRenderRowListing}
          rowExpandHeight={400}
          renderRowDetails={renderRowDetailsCatalog}
          licenseKey={process.env.REACT_APP_DATAGRID_LICENSE}
        />
      }
      {typeCard && typeCard.value === "bookingFull" &&
        <ReactDataGrid
          idProperty="_id"
          className="bookings-table text-small"
          style={gridStyle}
          columns={columns}
          pagination
          limit={50}
          livePagination
          dataSource={dataSource}
          sortInfo={sortInfo}
          onSortInfoChange={setSortInfo}
          onFilterValueChange={setFilterValue}
          showZebraRows={true}
          theme={skin === "dark" ? "amber-dark" : "default-light"}
          checkboxColumn
          enableSelection={true}
          onRenderRow={onRenderRowBookingFull}
          rowExpandHeight={400}
          licenseKey={process.env.REACT_APP_DATAGRID_LICENSE}
        />
      }
    </div>
  );
};

export default SystemStatus;

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
