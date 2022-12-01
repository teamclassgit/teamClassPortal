// @packages
import React, { useState, useEffect, useCallback } from "react";
import { useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import { apolloClient } from "@utility/RealmApolloClient";

import moment from "moment-timezone";
window.moment = moment;
import { getQueryFiltersFromFilterArray, getUserData, isNotEmptyArray } from "@utility/Utils";
import { Modal } from "reactstrap";

//@reactdatagrid packages
import ReactDataGrid from "@inovua/reactdatagrid-enterprise";

// @scripts
import queryGetBookingsWithCriteria from "@graphql/QueryGetBookingsWithCriteria";
import queryAllClasses from "@graphql/QueryAllClasses";
import queryAllCoordinators from "@graphql/QueryAllEventCoordinators";
import queryAllCustomers from "@graphql/QueryAllCustomers";
import queryAllInstructors from "@graphql/QueryAllInstructors";
import EditBookingModal from "@organisms/edit-booking-modal";
import AddNewBooking from "../../AddNewBooking";
import RowDetails from "../../BookingTableRowDetails";
import TasksBar from "../../TasksBar";
import { getAllDataToExport, getBookingAndCalendarEventById } from "@services/BookingService";
import ConfirmBookingsToClose from "../../ConfirmBookingsToClose";
import { getColumns } from "./columns";

// @styles
import "@inovua/reactdatagrid-enterprise/index.css";
import "@inovua/reactdatagrid-enterprise/theme/default-light.css";
import "@inovua/reactdatagrid-enterprise/theme/amber-dark.css";
import "./BookingsTable.scss";

const renderRowDetails = ({ data }) => {
  return data ? <RowDetails data={data} /> : <></>;
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

const AllBookingsTable = () => {
  const skin = useSelector((state) => state.bookingsBackground);
  const genericFilter = {};
  const [gridRef, setGridRef] = useState(null);
  const [totalRows, setTotalRows] = useState(0);
  const [editModal, setEditModal] = useState(false);
  const [currentElement, setCurrentElement] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [elementToAdd, setElementToAdd] = useState({});
  const [customers, setCustomers] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [classes, setClasses] = useState([]);
  const [coordinators, setCoordinators] = useState([]);
  const [filterValue, setFilterValue] = useState([]);
  const [orFilters, setOrFilters] = useState([]);
  const [sortInfo, setSortInfo] = useState({ dir: -1, id: "createdAt", name: "createdAt", type: "date" });
  const [filteredRows, setFilteredRows] = useState(null);
  const [expandedRows, setExpandedRows] = useState({ 1: true, 2: true });
  const [collapsedRows, setCollapsedRows] = useState(null);
  const [cellSelection, setCellSelection] = useState({});
  const [selected, setSelected] = useState({});
  const [closedReason, setClosedReason] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleModal = () => setShowAddModal(!showAddModal);

  const handleEditModal = () => {
    setEditModal(!editModal);
  };

  const toggle = () => {
    if (isOpenModal) {
      setSortInfo({ dir: 1, id: "createdAt", name: "createdAt", type: "date" });
    }
    setSortInfo({ dir: -1, id: "createdAt", name: "createdAt", type: "date" });
    setIsOpenModal(!isOpenModal);
  };

  const { ...allClasses } = useQuery(queryAllClasses, {
    fetchPolicy: "cache-and-network",
    variables: {
      filter: { isActive: true }
    },
    onCompleted: (data) => {
      if (data && data.teamClasses) {
        setClasses(data.teamClasses);
      }
    }
  });

  const { ...allCoordinatorResult } = useQuery(queryAllCoordinators, {
    variables: {
      filter: genericFilter
    },
    onCompleted: (data) => {
      if (data) setCoordinators(data.eventCoordinators);
    },
    fetchPolicy: "cache-and-network"
  });

  const { ...allCustomersResult } = useQuery(queryAllCustomers, {
    fetchPolicy: "cache-and-network",
    variables: {
      filter: {}
    },
    onCompleted: (data) => {
      if (data) setCustomers(data.customers);
    },
    pollInterval: 200000
  });

  useQuery(queryAllInstructors, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      if (data) setInstructors(data.instructors);
    },
    pollInterval: 200000
  });

  const gridStyle = { minHeight: 600, marginTop: 10 };
  const columns = getColumns(coordinators, classes);

  const applyFilters = () => {
    let currentFilters = [...filterValue];

    if (currentFilters && currentFilters.length === 0) {
      const userData = getUserData();
      let coordinatorFilterValue = "";

      if (userData && userData.customData && userData.customData.coordinatorId) {
        coordinatorFilterValue = userData.customData.email;
      }

      currentFilters = [
        { name: "createdAt", type: "date", operator: "inrange", value: undefined },
        { name: "updatedAt", type: "date", operator: "inrange", value: undefined },
        { name: "_id", type: "string", operator: "contains", value: "" },
        { name: "customerName", type: "string", operator: "contains", value: "" },
        { name: "bookingStage", type: "select", operator: "inlist", value: undefined },
        { name: "closedReason", type: "string", operator: "contains", value: "" },
        { name: "gclid", type: "string", operator: "contains", value: "" },
        { name: "customerEmail", type: "string", operator: "contains", value: "" },
        { name: "customerPhone", type: "string", operator: "contains", value: "" },
        { name: "customerCompany", type: "string", operator: "contains", value: "" },
        { name: "eventCoordinatorEmail", type: "select", operator: "inlist", value: coordinatorFilterValue ? [coordinatorFilterValue] : undefined },
        { name: "className", type: "select", operator: "inlist", value: undefined },
        { name: "attendees", type: "number", operator: "gte", value: undefined },
        { name: "registeredAttendees", type: "number", operator: "gte", value: undefined },
        { name: "taxAmount", type: "number", operator: "gte", value: undefined },
        { name: "serviceFeeAmount", type: "number", operator: "gte", value: undefined },
        { name: "cardFeeAmount", type: "number", operator: "gte", value: undefined },
        { name: "totalInvoice", type: "number", operator: "gte", value: undefined },
        { name: "depositsPaid", type: "number", operator: "gte", value: undefined },
        { name: "finalPaid", type: "number", operator: "gte", value: undefined },
        { name: "depositPaidDate", type: "date", operator: "inrange", value: undefined },
        { name: "finalPaymentPaidDate", type: "date", operator: "inrange", value: undefined },
        { name: "balance", type: "number", operator: "gte", value: undefined },
        { name: "eventDateTime", type: "date", operator: "inrange", value: undefined },
        { name: "signUpDeadline", type: "date", operator: "inrange", value: undefined },
        { name: "customerTags", type: "select", operator: "inlist", value: undefined },
        { name: "utm_campaign", type: "string", operator: "contains", value: "" },
        { name: "utm_source", type: "string", operator: "contains", value: "" },
        { name: "utm_medium", type: "string", operator: "contains", value: "" },
        { name: "utm_content", type: "string", operator: "contains", value: "" },
        { name: "utm_term", type: "string", operator: "contains", value: "" },
        { name: "bookingTags", type: "string", operator: "contains", value: "" },
        { name: "totalInstructorInvoice", type: "number", operator: "contains", value: "" },
        { name: "instructorInvoiceStatus", type: "string", operator: "contains", value: "" },
        { name: "totalDistributorInvoice", type: "number", operator: "contains", value: "" },
        { name: "distributorInvoiceStatus", type: "string", operator: "contains", value: "" },
        { name: "preEventSurvey.submittedAt", type: "date", operator: "inrange", value: undefined },
        { name: "preEventSurvey.source", type: "string", operator: "contains", value: "" },
        { name: "totalMembershipDiscount", type: "number", operator: "contains", value: "" },
        { name: "firstTouchChannel", type: "string", operator: "contains", value: "" }
      ];
    }

    setFilterValue(currentFilters);
    setOrFilters([]);
  };
  useEffect(() => {
    applyFilters();
  }, []);

  const onEditCompleted = (bookingId) => {
    const sortEditedData = { dir: -1, id: "updatedAt", name: "updatedAt", type: "date" };
    const currentFilters = [...orFilters];
    currentFilters.push({ name: "_id", type: "string", operator: "eq", value: bookingId });
    currentFilters.push({ name: "_id", type: "string", operator: "neq", value: bookingId });
    setOrFilters(currentFilters);
    setSortInfo(sortEditedData);
  };

  const onAddCompleted = (bookingId) => {
    const currentFilters = [...filterValue.filter((element) => element.name !== "_id")];
    const idFilter = { name: "_id", type: "string", operator: "contains", value: bookingId };
    currentFilters.push(idFilter);
    setFilterValue(currentFilters);
  };

  const getDataToExport = async () => {
    const filters = getQueryFiltersFromFilterArray(filterValue);
    return await getAllDataToExport(filters, orFilters, sortInfo);
  };

  const loadData = async ({ skip, limit, sortInfo, filterValue }) => {
    const filters = getQueryFiltersFromFilterArray(filterValue);
    const response = await apolloClient.query({
      query: queryGetBookingsWithCriteria,
      fetchPolicy: "network-only",
      variables: {
        limit,
        offset: skip,
        sortBy: sortInfo,
        filterBy: filters,
        filterByOr: orFilters
      }
    });
    const totalCount = response.data.getBookingsWithCriteria.count;
    setTotalRows(totalCount);
    return { data: response.data.getBookingsWithCriteria.rows, count: totalCount };
  };

  const dataSource = useCallback(loadData, []);

  const onExpandedRowsChange = useCallback(({ expandedRows, collapsedRows }) => {
    setExpandedRows(expandedRows);
    setCollapsedRows(collapsedRows);
  }, []);

  const onCopySelectedCellsChange = useCallback((cells) => {
    console.log(cells);
  }, []);

  const onPasteSelectedCellsChange = useCallback((cells) => {
    console.log(cells);
  }, []);

  const renderRowContextMenu = (menuProps) => {
    menuProps.autoDismiss = true;
    menuProps.items = [
      {
        label: "Close with reason:",
        disabled: true
      },
      {
        label: "Won",
        onClick: () => {
          setClosedReason("Won");
          toggle();
        }
      },
      {
        label: "Lost",
        onClick: () => {
          setClosedReason("Lost");
          toggle();
        }
      },
      {
        label: "Mistake",
        onClick: () => {
          setClosedReason("Mistake");
          toggle();
        }
      },
      {
        label: "Duplicated",
        onClick: () => {
          setClosedReason("Duplicated");
          toggle();
        }
      },
      {
        label: "Test",
        onClick: () => {
          setClosedReason("Test");
          toggle();
        }
      },
      {
        label: "Postponed",
        onClick: () => {
          setClosedReason("Postponed");
          toggle();
        }
      }
    ];
  };

  const onSelectionChange = useCallback(({ selected, data }) => {
    if (selected === true) {
      data.forEach((booking) => setSelected((prev) => ({ ...prev, [booking._id]: booking })));
    } else {
      setSelected(selected);
    }
  }, []);

  const toArray = (selected) => Object.keys(selected);

  const selectedBookingsIds = toArray(selected);

  return (
    <div>
      <TasksBar
        setElementToAdd={setElementToAdd}
        titleView={"ALL Time Bookings (Beta)"}
        titleBadge={` ${totalRows} records found`}
        showAddModal={() => handleModal()}
        getDataToExport={getDataToExport}
      ></TasksBar>
      <ReactDataGrid
        idProperty="_id"
        onReady={setGridRef}
        className="bookings-table text-small"
        style={gridStyle}
        columns={columns}
        filteredRowsCount={setFilteredRows}
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
        /*cellSelection={cellSelection}
        onCellSelectionChange={setCellSelection}
        enableClipboard={true}
        onCopySelectedCellsChange={onCopySelectedCellsChange}
        onPasteSelectedCellsChange={onPasteSelectedCellsChange}*/
        selected={selected}
        checkboxColumn
        enableSelection={true}
        onSelectionChange={onSelectionChange}
        renderRowContextMenu={selectedBookingsIds.length > 0 ? renderRowContextMenu : null}
        expandedRows={expandedRows}
        collapsedRows={collapsedRows}
        onExpandedRowsChange={onExpandedRowsChange}
        onRenderRow={onRenderRow}
        rowExpandHeight={400}
        renderRowDetails={renderRowDetails}
        licenseKey={process.env.REACT_APP_DATAGRID_LICENSE}
      />
      <AddNewBooking
        open={showAddModal}
        handleModal={handleModal}
        classes={classes}
        setCustomers={setCustomers}
        customers={customers}
        baseElement={elementToAdd}
        coordinators={coordinators}
        onAddCompleted={onAddCompleted}
      />
      {editModal && !!currentElement ? 
        <EditBookingModal
          open={editModal}
          handleModal={handleEditModal}
          currentElement={currentElement}
          allCoordinators={coordinators}
          allInstructors={instructors}
          allClasses={classes}
          handleClose={() => setCurrentElement({})}
          editMode={currentElement && currentElement.status !== "closed" ? true : false}
          onEditCompleted={onEditCompleted}
        /> : null
      }
      <Modal isOpen={isOpenModal} centered>
        <ConfirmBookingsToClose
          toggle={toggle}
          closedReason={closedReason}
          selectedBookingsIds={selectedBookingsIds}
          onEditCompleted={onEditCompleted}
          setSelected={setSelected}
        />
      </Modal>
    </div>
  );
};

export default AllBookingsTable;

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
