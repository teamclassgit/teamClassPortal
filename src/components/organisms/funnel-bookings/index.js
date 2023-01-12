// @packages
import React, { useState, useEffect, useCallback } from "react";
import { useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import { apolloClient } from "@utility/RealmApolloClient";
import { Modal } from "reactstrap";
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
import queryGetBookingsWithCriteria from "@graphql/QueryGetBookingsWithCriteria";
import queryAllClasses from "@graphql/QueryAllClasses";
import queryAllCustomers from "@graphql/QueryAllCustomers";
import queryAllCoordinators from "@graphql/QueryAllEventCoordinators";
import queryAllInstructors from "@graphql/QueryAllInstructors";
import EditBookingModal from "@organisms/edit-booking-modal";
import AddNewBooking from "@organisms/add-new-booking";
import BookingsTableStatusCards from "@molecules/booking-table-status-card";
import RowDetails from "@molecules/booking-table-row-details";
import TasksBar from "@molecules/task-bar";
import { getAllDataToExport } from "@services/BookingService";
import ConfirmBookingsToClose from "@molecules/confirm-bookings-to-close";
import { getColumns } from "./columns";
import { applyFilters } from "./filters";

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

const FunnelTable = () => {
  const defaultStatus = { value: "quote", label: "Quote", calendarEventStatus: "" };
  const skin = useSelector((state) => state.bookingsBackground);
  const genericFilter = {};
  const [status, setStatus] = useState(defaultStatus);
  const [editModal, setEditModal] = useState(false);
  const [currentElement, setCurrentElement] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [elementToAdd, setElementToAdd] = useState({});
  const [customers, setCustomers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [coordinators, setCoordinators] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [filterValue, setFilterValue] = useState([]);
  const [orFilters, setOrFilters] = useState([]);
  const [sortInfo, setSortInfo] = useState({ dir: -1, id: "createdAt", name: "createdAt", type: "date" });
  const [expandedRows, setExpandedRows] = useState({ 1: true, 2: true });
  const [collapsedRows, setCollapsedRows] = useState(null);
  const [selected, setSelected] = useState({});
  const [closedReason, setClosedReason] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleModal = () => setShowAddModal(!showAddModal);

  const handleEditModal = () => {
    setEditModal(!editModal);
  };

  const toggle = () => {
    setOrFilters([]);
    setSortInfo({ dir: -1, id: "createdAt", name: "createdAt", type: "date" });
    setIsOpenModal(!isOpenModal);
  };

  const handleClickCurrentElement = () => {
    setOrFilters([]);
    setSortInfo({ dir: -1, id: "createdAt", name: "createdAt", type: "date" });
    handleEditModal();
  };

  useQuery(queryAllClasses, {
    fetchPolicy: "cache-and-network",
    variables: {
      filter: genericFilter
    },
    onCompleted: (data) => {
      if (data && data.teamClasses) {
        setClasses(data.teamClasses);
      }
    }
  });

  useQuery(queryAllCoordinators, {
    variables: {
      filter: genericFilter
    },
    onCompleted: (data) => {
      if (data) setCoordinators(data.eventCoordinators);
    },
    fetchPolicy: "cache-and-network"
  });

  useQuery(queryAllCustomers, {
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
  const columns = getColumns(classes, coordinators, setCurrentElement, handleClickCurrentElement);

  useEffect(() => {
    if (!status) return;
    applyFilters(filterValue, setFilterValue, status);    
  }, [status]);

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
    return { data: response.data.getBookingsWithCriteria.rows, count: totalCount };
  };

  const dataSource = useCallback(loadData, []);

  const onExpandedRowsChange = useCallback(({ expandedRows, collapsedRows }) => {
    setExpandedRows(expandedRows);
    setCollapsedRows(collapsedRows);
  }, []);

  const getDataToExport = async () => {
    const filters = getQueryFiltersFromFilterArray(filterValue);
    return await getAllDataToExport(filters, orFilters, sortInfo);
  };

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
      <BookingsTableStatusCards status={status} setStatus={setStatus} filters={filterValue} />
      <TasksBar
        setElementToAdd={(element) => {
          setStatus(defaultStatus);
          setElementToAdd(element);
        }}
        titleView={"Bookings funnel"}
        titleBadge={status && status.label}
        showAddModal={() => handleModal()}
        getDataToExport={getDataToExport}
      ></TasksBar>
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
        customers={customers}
        baseElement={elementToAdd}
        coordinators={coordinators}
        onAddCompleted={onAddCompleted}
      />
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
      />
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

export default FunnelTable;

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
