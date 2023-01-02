/* eslint-disable no-undef */
// @packages
import React, { useState, useEffect, useContext } from "react";
import moment from "moment";
import { Spinner } from "reactstrap";
import { useQuery } from "@apollo/client";

// @scripts
import BookingsHeader from "@molecules/bookings-header";
import Calendar from "./calendar";
import queryAllBookings from "@graphql/QueryGetBookingsWithCriteria";
import queryAllClasses from "@graphql/QueryAllClasses";
import queryAllCoordinators from "@graphql/QueryAllEventCoordinators";
import { FiltersContext } from "@context/FiltersContext/FiltersContext";
import FiltersModal from "@molecules/filters-modal";

const BookingCalendarList = () => {
  const defaultFilter = [
    {
      name: "eventDateTime",
      type: "date",
      operator: "after",
      value: moment().subtract(30, "days").format()
    },
    {
      name: "bookingStage",
      type: "string",
      operator: "neq",
      value: "rejected"
    },
    {
      name: "closedReason",
      type: "string",
      operator: "neq",
      value: "Lost"
    },
    {
      name: "closedReason",
      type: "string",
      operator: "neq",
      value: "Duplicated"
    },
    {
      name: "closedReason",
      type: "string",
      operator: "neq",
      value: "Mistake"
    },
    {
      name: "closedReason",
      type: "string",
      operator: "neq",
      value: "Test"
    }
  ];
  const defaultOrFilter = [];
  const [bookingsFilter, setBookingsFilter] = useState([...defaultOrFilter]);
  const [mainFilter, setMainFilter] = useState([...defaultFilter]);
  const [classes, setClasses] = useState([]);
  const [coordinators, setCoordinators] = useState([]);
  const [limit, setLimit] = useState(1000);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const { classFilterContext, coordinatorFilterContext, textFilterContext, dateFilterContext } = useContext(FiltersContext);
  const [filteredBookings, setFilteredBookings] = useState([]);

  const { ...allBookingsResult } = useQuery(queryAllBookings, {
    fetchPolicy: "cache-and-network",
    pollInterval: 200000,
    variables: {
      filterBy: mainFilter,
      filterByOr: bookingsFilter,
      limit,
      offset: 0
    },
    onCompleted: (data) => {
      if (data) setFilteredBookings(data.getBookingsWithCriteria.rows.map((element) => element));
    }
  });

  useQuery(queryAllClasses, {
    fetchPolicy: "cache-and-network",
    variables: {
      filter: {}
    },
    onCompleted: (data) => {
      if (data && data.teamClasses) {
        setClasses(data.teamClasses);
      }
    }
  });

  useQuery(queryAllCoordinators, {
    variables: {
      filter: {}
    },
    onCompleted: (data) => {
      if (data) setCoordinators(data.eventCoordinators);
    },
    fetchPolicy: "cache-and-network"
  });

  useEffect(() => {
    const query = [...defaultFilter];
    const queryOr = [...defaultOrFilter];

    if (textFilterContext && textFilterContext.value) {
      queryOr.push({ name: "customerName", type: "string", operator: "contains", value: textFilterContext.value });
      queryOr.push({ name: "customerEmail", type: "string", operator: "contains", value: textFilterContext.value });
      queryOr.push({ name: "customerPhone", type: "string", operator: "contains", value: textFilterContext.value });
      queryOr.push({ name: "customerCompany", type: "string", operator: "contains", value: textFilterContext.value });
      queryOr.push({ name: "_id", type: "string", operator: "contains", value: textFilterContext.value });
    }

    if (classFilterContext) {
      const filter = {
        name: "classId",
        type: "string",
        operator: "contains",
        value: classFilterContext.value
      };
      query.push(filter);
    }

    if (dateFilterContext) {
      const filter = {
        name: "createdAt",
        type: "date",
        operator: "inrange",
        value: {
          start: moment(dateFilterContext.value[0]).format(),
          end: moment(dateFilterContext.value[1]).add(23, "hours").add(59, "minutes").format()
        }
      };
      query.push(filter);
    }

    if (coordinatorFilterContext && coordinatorFilterContext.value) {
      const coordinators = coordinatorFilterContext.value;
      if (coordinators?.length) {
        const filter = {
          name: "eventCoordinatorId",
          type: "select",
          operator: "inlist",
          valueList: coordinators
        };
        query.push(filter);
      }
    }

    setBookingsFilter(queryOr);
    setMainFilter(query);
  }, [classFilterContext, coordinatorFilterContext, dateFilterContext, textFilterContext]);

  return (
    <>
      <BookingsHeader
        setShowFiltersModal={(val) => setShowFiltersModal(val)}
        showAddModal={() => handleModal()}
        onChangeLimit={(newLimit) => {
          setLimit(newLimit);
        }}
        bookings={filteredBookings}
        defaultLimit={limit}
        showLimit={false}
        showExport={true}
        showAdd={false}
        showFilter={true}
        showView={false}
        titleView={"Events calendar "}
        isClosedBookings={false}
      />
      <FiltersModal
        open={showFiltersModal}
        handleModal={() => setShowFiltersModal(!showFiltersModal)}
        classes={classes}
        coordinators={coordinators}
        isFilterByClass={true}
        isFilterByCoordinator={true}
        isFilterByCreationDate={false}
      />
      {allBookingsResult.loading ? (
        <div>
          <Spinner className="mr-25" />
          <Spinner type="grow" />
        </div>
      ) : (
        <Calendar bookings={filteredBookings} classes={classes} />
      )}
    </>
  );
};

export default BookingCalendarList;
