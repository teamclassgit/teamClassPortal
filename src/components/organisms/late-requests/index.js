// @packages
import React, { useCallback, useEffect, useState } from "react";
import { Badge, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledButtonDropdown } from "reactstrap";
import { FileText, Share } from "react-feather";
import ReactDataGrid from "@inovua/reactdatagrid-enterprise";
import { useSelector } from "react-redux";
import { useQuery } from "@apollo/client";

// @Scrips
import columns from "./columns";
import ExportToExcelLegacy from "@molecules/export-to-excel-legacy";
import queryAllAttendees from "@graphql/QueryAllAttendees";

// @Styles
import "@inovua/reactdatagrid-enterprise/index.css";
import "@inovua/reactdatagrid-enterprise/theme/default-light.css";
import "@inovua/reactdatagrid-enterprise/theme/amber-dark.css";

const gridStyle = { minHeight: 650, marginTop: 10 };

const LateRequestsComponent = () => {
  const skin = useSelector((state) => state.bookingsBackground);
  const [dataSourceAttendees, setDataSourceAttendees] = useState([]);
  const [dataAllAttendees, setDataAllAttendees] = useState([]);
  const [attendeesToExcelTable, setAttendeesToExcelTable] = useState([]);
  const [filterValue, setFilterValue] = useState([
    { name: "bookingId", operator: "startsWith", type: "string", value: "" },
    { name: "status", operator: "eq", type: "select", value: "" },
    { name: "name", operator: "startsWith", type: "string", value: "" }
  ]);

  const { loading } = useQuery(queryAllAttendees, {
    fetchPolicy: "cache-and-network",
    variables: {
      query: {
        status_ne : "confirmed",
        status_exists : true
      },
      sortBy: "UPDATEDAT_DESC"
    },
    onCompleted: (data) => {
      if (data?.attendees) {
        setDataAllAttendees([...dataAllAttendees, ...data?.attendees]);
      }
    }
  });

  useQuery(queryAllAttendees, {
    variables: {
      query: {
        lateRegistrationAnswerDate_exists: true,
        status: "confirmed"
      },
      sortBy: "UPDATEDAT_DESC"
    },
    onCompleted: (data) => {
      if (data?.attendees) {
        setDataAllAttendees([...dataAllAttendees, ...data?.attendees]);
      }
    }
  });

  useEffect(() => {
    if (dataSourceAttendees) {
      const attendeesArray = [];
      const headers = [
        "bookingId",
        "status",
        "name",
        "email",
        "phone",
        "addressLine1",
        "addressLine2",
        "country",
        "state",
        "city",
        "zip"
      ];

      attendeesArray.push(headers);

      for (const i in dataSourceAttendees) {
        const row = [
          dataSourceAttendees[i].bookingId,
          dataSourceAttendees[i].status,
          dataSourceAttendees[i].name,
          dataSourceAttendees[i].email,
          dataSourceAttendees[i].phone,
          dataSourceAttendees[i].addressLine1,
          dataSourceAttendees[i].addressLine2,
          dataSourceAttendees[i].country,
          dataSourceAttendees[i].state,
          dataSourceAttendees[i].city,
          dataSourceAttendees[i].zip
        ];

        attendeesArray.push(row);
      }
      setAttendeesToExcelTable(attendeesArray);
    }
  }, [dataSourceAttendees]);

  const filteredByBookigId = (attendees) => {
    return attendees.filter(({bookingId}) => bookingId.includes(filterValue[0].value));
  };

  const filteredByStatus = (attendees) => {
    if (filterValue[1].value === null) {
      return attendees.filter(({status}) => status.includes(""));
    }
    return attendees.filter(({status}) => status.includes(filterValue[1].value));
  };

  const filteredByName = (attendees) => {
    return attendees.filter(({name}) => name.toLowerCase().includes(filterValue[2].value.toLowerCase()));
  };

  useEffect(() => {

    let filteredAttendees = [...dataAllAttendees] || [];

    filteredAttendees = filteredByBookigId(filteredAttendees);
    filteredAttendees = filteredByStatus(filteredAttendees);
    filteredAttendees = filteredByName(filteredAttendees);
    setDataSourceAttendees(filteredAttendees);

  }, [filterValue, dataAllAttendees]);

  return (
    <>
      <div className="d-flex justify-content-between mb-2">
        <h4>
          Late requests
          <Badge color="primary" className='ml-1'>{dataSourceAttendees.length}</Badge>
        </h4>
        <UncontrolledButtonDropdown>
          <DropdownToggle color="primary" caret outline title="Export">
            <Share size={13} />
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem className="align-middle w-100">
              <ExportToExcelLegacy
                apiData={attendeesToExcelTable}
                fileName={"Late Attendees"}
                title={
                  <h6 className="p-0">
                    <FileText size={13} />
                    {"Excel file"}
                  </h6>
                }
              />
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledButtonDropdown>
      </div>
      <ReactDataGrid
        idProperty="bookingId"
        columns={columns}
        loading={loading}
        style={gridStyle}
        onFilterValueChange={setFilterValue}
        filterValue={filterValue}
        dataSource={dataSourceAttendees}
        licenseKey={process.env.REACT_APP_DATAGRID_LICENSE}
        minRowHeight={50}
        rowHeight={null}
        theme={skin === "dark" ? "amber-dark" : "default-light"}
      />
    </>
  );
};

export default LateRequestsComponent;
