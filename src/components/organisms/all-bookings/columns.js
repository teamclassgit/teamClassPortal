// @pakages
import { useHistory } from "react-router";
import moment from "moment";

//@reactdatagrid packages
import NumberFilter from "@inovua/reactdatagrid-community/NumberFilter";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";

// @scripts
import BookingStepsEdit from "@atoms/booking-steps";
import CalendarLink from "@atoms/calendar-link";
import DateTimeConfirmationLink from "@atoms/date-time-confirmation-link";
import PaymentLink from "@atoms/payment-link";
import RegistrationLink from "@atoms/registration-link";
import SignupLink from "@atoms/signup-link";
import { isNotEmptyArray } from "@utility/Utils";
import { DEFAULT_TIME_ZONE_LABEL } from "@utility/Constants";
import { getBookingAndCalendarEventById } from "@services/BookingService";

export const getColumns = (coordinators, classes, setCurrentElement, handleClickCurrentElement) => {

  const history = useHistory();

  const handleEdit = (rowId) => {
    history.push(`/booking/${rowId}`);
  };

  const columns = [
    {
      name: "actions",
      header: "Links",
      defaultWidth: 200,
      render: ({ cellProps }) => {
        if (cellProps.data) {
          return cellProps.data.status === "quote" ? (
            <div className="d-flex">
              <CalendarLink id={cellProps.data._id}/>
              <BookingStepsEdit id={cellProps.data._id} handleEdit={handleEdit} />
            </div>
          ) : cellProps.data.status === "closed" ? (
              <div className="d-flex">
                <BookingStepsEdit id={cellProps.data._id} handleEdit={handleEdit} />
              </div>
          ) : cellProps.data.status === "date-requested" &&
            cellProps.data.eventDateTimeStatus &&
            cellProps.data.eventDateTimeStatus === "reserved" ? (
              <div className="d-flex">
                <CalendarLink id={cellProps.data._id}/>
                <DateTimeConfirmationLink id={cellProps.data._id} />
                <BookingStepsEdit id={cellProps.data._id} handleEdit={handleEdit} />
              </div>
          ) : cellProps.data.status === "date-requested" &&
            cellProps.data.eventDateTimeStatus &&
            cellProps.data.eventDateTimeStatus === "confirmed" ? (
              <div className="d-flex">
                <CalendarLink id={cellProps.data._id}/>
                <PaymentLink id={cellProps.data._id} text="Deposit link" color="light-primary"/>
                <BookingStepsEdit id={cellProps.data._id} handleEdit={handleEdit} />
              </div>
          ) : cellProps.data.status === "date-requested" &&
            cellProps.data.eventDateTimeStatus &&
            cellProps.data.eventDateTimeStatus === "rejected" ? (
              <div className="d-flex">
                <CalendarLink id={cellProps.data._id}/>
                <BookingStepsEdit id={cellProps.data._id} handleEdit={handleEdit} />
              </div>
          ) : cellProps.data.status === "confirmed" ? (
              <div className="d-flex">
                <CalendarLink id={cellProps.data._id}/>
                <SignupLink id={cellProps.data._id} />
                <RegistrationLink id={cellProps.data._id} />
                <PaymentLink id={cellProps.data._id} text="Final payment link" color="secondary"/>
                <BookingStepsEdit id={cellProps.data._id} handleEdit={handleEdit} />
              </div>
          ) : (
            cellProps.data.status === "paid" && (
              <div className="d-flex">
                <CalendarLink id={cellProps.data._id}/>
                <SignupLink id={cellProps.data._id} />
                <RegistrationLink id={cellProps.data._id} />
                <PaymentLink id={cellProps.data._id} text="Final payment link" color="secondary"/>
                <BookingStepsEdit id={cellProps.data._id} handleEdit={handleEdit} />
              </div>
            )
          );
        }
      }
    },
    {
      name: "_id",
      header: "Id",
      type: "string",
      filterEditor: StringFilter,
      filterDelay: 1500,
      width: 200,
      render: ({ value }) => {
        return (
          <>
            <small
              className="text-primary cursor-pointer"
              onClick={async () => {
                const bookingAndCalendarEvent = await getBookingAndCalendarEventById(value);
                if (!bookingAndCalendarEvent) return;
                setCurrentElement(bookingAndCalendarEvent);
                handleClickCurrentElement();
              }}
              title={`Edit booking info ${value}`}
            >
              {value}
            </small>
          </>
        );
      }
    },
    {
      name: "createdAt",
      header: "Created",
      type: "date",
      width: 250,
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
      name: "eventDateTime",
      header: "Event date",
      type: "date",
      width: 250,
      filterEditor: DateFilter,
      render: ({ value, cellProps }) => {
        if (value) {
          return `${moment(value)?.tz(cellProps.data.timezone)?.format("LLL")} ${cellProps.data.timezoneLabel || DEFAULT_TIME_ZONE_LABEL}`;
        }
      }
    },
    {
      name: "eventCoordinatorEmail",
      header: "Coordinator",
      type: "string",
      filterEditor: SelectFilter,
      filterEditorProps: {
        multiple: true,
        wrapMultiple: false,
        dataSource: coordinators?.map((coordinator) => {
          return { id: coordinator.email, label: coordinator.name };
        })
      },
      width: 200
    },
    {
      name: "bookingStage",
      header: "Stage ",
      type: "string",
      filterEditor: SelectFilter,
      filterEditorProps: {
        multiple: true,
        wrapMultiple: false,
        dataSource: ["quote", "requested", "rejected", "accepted", "deposit", "paid", "closed"].map((c) => {
          return { id: c, label: c };
        })
      },
      defaultWidth: 200,
      render: ({ value }) => {
        if (value) {
          return <span className="float-left">{value}</span>;
        }
      }
    },
    {
      name: "updatedAt",
      header: "Updated",
      type: "date",
      width: 250,
      filterEditor: DateFilter,
      render: ({ value }) => {
        return moment(value).calendar(null, {
          lastDay: "[Yesterday]",
          sameDay: "LT",
          lastWeek: "dddd",
          sameElse: "MMMM Do, YYYY"
        });
      },
      defaultVisible: false
    },

    {
      name: "customerName",
      header: "Customer ",
      type: "string",
      filterEditor: StringFilter,
      filterDelay: 1500,
      render: ({ data }) => {
        if (isNotEmptyArray(data.bookingTags) && data.bookingTags.includes("repeat")) {
          return (
            <div>
              {data.customerName} <span className="card-tags text-warning">{"Repeat"}</span>
            </div>
          );
        }
        return data.customerName;
      }
    },
    { name: "customerEmail", header: "Email ", type: "string", filterEditor: StringFilter, filterDelay: 1500 },
    { name: "customerPhone", header: "Phone ", type: "number", defaultVisible: false, filterEditor: StringFilter, filterDelay: 1500 },
    { name: "customerCompany", header: "Company ", type: "string", filterEditor: StringFilter, filterDelay: 1500 },
    {
      name: "className",
      header: "Class ",
      type: "string",
      filterEditor: SelectFilter,
      filterEditorProps: {
        multiple: true,
        wrapMultiple: false,
        dataSource: classes?.map((teamClass) => {
          return { id: teamClass.title, label: teamClass.title };
        })
      },
      width: 300
    },
    {
      name: "attendees",
      header: "Attendees ",
      type: "number",
      filterEditor: NumberFilter,
      filterDelay: 1500,
      defaultWidth: 112,
      render: ({ value, cellProps }) => {
        if (value) {
          return <span className="float-right">{value}</span>;
        }
      }
    },
    {
      name: "registeredAttendees",
      header: "Registered Attendees ",
      type: "number",
      filterEditor: NumberFilter,
      filterDelay: 1500,
      defaultWidth: 112,
      render: ({ value }) => {
        if (value >= 0) {
          return <span className="float-right">{+value}</span>;
        }
      }
    },
    {
      name: "signUpDeadline",
      header: "Registration",
      type: "date",
      width: 250,
      filterEditor: DateFilter,
      render: ({ value }) => {
        if (value) {
          return `${moment(value)?.format("LLL")}`;
        }
      }
    },
    {
      name: "taxAmount",
      header: "Tax",
      type: "number",
      defaultWidth: 150,
      filterEditor: NumberFilter,
      filterDelay: 1500,
      defaultVisible: false,
      render: ({ value }) => {
        return <span className="float-right">{value.toFixed(2)}</span>;
      }
    },
    {
      name: "serviceFeeAmount",
      header: "Service Fee",
      type: "number",
      defaultWidth: 150,
      defaultVisible: false,
      filterDelay: 1500,
      filterEditor: NumberFilter,
      render: ({ value }) => {
        return <span className="float-right">{value.toFixed(2)}</span>;
      }
    },
    {
      name: "cardFeeAmount",
      header: "Card Fee",
      type: "number",
      defaultWidth: 150,
      defaultVisible: false,
      filterEditor: NumberFilter,
      filterDelay: 1500,
      render: ({ value }) => {
        return <span className="float-right">{value.toFixed(2)}</span>;
      }
    },
    {
      name: "totalInvoice",
      header: "Total",
      type: "number",
      defaultWidth: 150,
      filterEditor: NumberFilter,
      filterDelay: 1500,
      render: ({ value }) => {
        return <span className="float-right">{value.toFixed(2)}</span>;
      }
    },
    {
      name: "depositsPaid",
      header: "Deposits",
      type: "number",
      defaultWidth: 150,
      filterEditor: NumberFilter,
      filterDelay: 1500,
      render: ({ value }) => {
        return <span className="float-right">{value.toFixed(2)}</span>;
      }
    },
    {
      name: "depositPaidDate",
      header: "Deposits date",
      type: "date",
      width: 250,
      filterEditor: DateFilter,
      render: ({ value }) => {
        if (value) {
          return moment(value).format("LLL");
        }
      }
    },
    {
      name: "finalPaid",
      header: "Final paid",
      type: "number",
      defaultWidth: 150,
      filterEditor: NumberFilter,
      render: ({ value }) => {
        return <span className="float-right">{value.toFixed(2)}</span>;
      }
    },
    {
      name: "finalPaymentPaidDate",
      header: "Final payment date",
      type: "date",
      width: 250,
      filterEditor: DateFilter,
      render: ({ value }) => {
        if (value) {
          return moment(value).format("LLL");
        }
      }
    },
    {
      name: "balance",
      header: "Balance",
      type: "number",
      defaultWidth: 150,
      filterEditor: NumberFilter,
      filterDelay: 1500,
      render: ({ value }) => {
        return <span className="float-right">{value.toFixed(2)}</span>;
      }
    },
    {
      name: "closedReason",
      header: "Closed Reason ",
      type: "string",
      filterEditor: StringFilter,
      filterDelay: 1500,
      defaultWidth: 200,
      render: ({ value }) => {
        if (value) {
          return <span className="float-left">{value}</span>;
        }
      }
    },
    {
      name: "bookingTags",
      header: "Bookings Tags",
      type: "string",
      filterEditor: StringFilter,
      filterDelay: 1500,
      defaultWidth: 200,
      render: ({ value }) => {
        if (value) {
          return <span className="float-left">{value.join(", ")}</span>;
        }
      }
    },
    {
      name: "customerTags",
      header: "Customer Tags",
      type: "string",
      filterEditor: SelectFilter,
      filterEditorProps: {
        multiple: true,
        wrapMultiple: false,
        dataSource: ["repeat"].map((tag) => {
          return { id: tag, label: tag };
        })
      },
      filterDelay: 1500,
      defaultWidth: 200,
      render: ({ value }) => {
        if (isNotEmptyArray(value)) {
          return <span className="float-left">{value.join(",")}</span>;
        }
      }
    },
    {
      name: "gclid",
      header: "Gclid",
      type: "string",
      filterEditor: StringFilter,
      filterDelay: 1500,
      defaultWidth: 200,
      render: ({ value }) => {
        if (value) {
          return <span className="float-left">{value}</span>;
        }
      }
    },
    {
      name: "instantBooking",
      header: "Instant Booking",
      type: "string",
      filterEditor: StringFilter,
      filterDelay: 1500,
      defaultWidth: 200,
      render: ({ value }) => {
        if (value) {
          return <span className="float-left">{value ? "Yes" : "No"}</span>;
        }
      }
    },
    {
      name: "utm_campaign",
      header: "Utm Compaign",
      type: "string",
      filterEditor: StringFilter,
      filterDelay: 1500,
      defaultWidth: 200,
      render: ({ value }) => {
        if (value) {
          return <span className="float-left">{value}</span>;
        }
      }
    },
    {
      name: "utm_source",
      header: "Utm Source",
      type: "string",
      filterEditor: StringFilter,
      filterDelay: 1500,
      defaultWidth: 200,
      render: ({ value }) => {
        if (value) {
          return <span className="float-left">{value}</span>;
        }
      }
    },
    {
      name: "utm_medium",
      header: "Utm Medium",
      type: "string",
      filterEditor: StringFilter,
      filterDelay: 1500,
      defaultWidth: 200,
      render: ({ value }) => {
        if (value) {
          return <span className="float-left">{value}</span>;
        }
      }
    },
    {
      name: "utm_content",
      header: "Utm Content",
      type: "string",
      filterEditor: StringFilter,
      filterDelay: 1500,
      defaultWidth: 200,
      render: ({ value }) => {
        if (value) {
          return <span className="float-left">{value}</span>;
        }
      }
    },
    {
      name: "utm_term",
      header: "Utm Term",
      type: "string",
      filterEditor: StringFilter,
      filterDelay: 1500,
      defaultWidth: 200,
      render: ({ value }) => {
        if (value) {
          return <span className="float-left">{value}</span>;
        }
      }
    },
    {
      name: "preEventSurvey.submittedAt",
      header: "Pre-event submitted",
      type: "date",
      width: 250,
      filterEditor: DateFilter,
      render: ({ cellProps }) => {
        if (cellProps?.data?.preEventSurvey?.submittedAt) {
          return `${moment(cellProps.data.preEventSurvey.submittedAt)?.format("LLL")}`;
        }
      }
    },
    {
      name: "preEventSurvey.source",
      header: "Pre-event source",
      type: "string",
      filterEditor: StringFilter,
      filterDelay: 1500,
      defaultWidth: 200,
      render: ({ cellProps }) => {
        return <span className="float-left">{cellProps?.data?.preEventSurvey?.source}</span>;
      }
    },
    {
      name: "totalInstructorInvoice",
      header: "Instructor invoice",
      type: "number",
      defaultWidth: 150,
      filterEditor: NumberFilter,
      filterDelay: 1500,
      render: ({ value }) => {
        if (value) {
          return <span className="float-right">{value.toFixed(2)}</span>;
        }
      }
    },
    {
      name: "instructorInvoiceStatus",
      header: "Instructor invoice status",
      type: "string",
      filterEditor: StringFilter,
      filterDelay: 1500,
      defaultWidth: 200,
      render: ({ value }) => {
        if (value) {
          return <span className="float-left">{value}</span>;
        }
      }
    },
    {
      name: "totalDistributorInvoice",
      header: "Distributor Invoice",
      type: "number",
      defaultWidth: 150,
      filterEditor: NumberFilter,
      filterDelay: 1500,
      render: ({ value }) => {
        if (value) {
          return <span className="float-right">{value.toFixed(2)}</span>;
        }
      }
    },
    {
      name: "distributorInvoiceStatus",
      header: "Distributor Invoice Status",
      type: "string",
      filterEditor: StringFilter,
      filterDelay: 1500,
      defaultWidth: 200,
      render: ({ value }) => {
        if (value) {
          return <span className="float-left">{value}</span>;
        }
      }
    },
    {
      name: "totalMembershipDiscount",
      header: "Total Membership Discount",
      type: "number",
      filterEditor: NumberFilter,
      filterDelay: 1500,
      defaultWidth: 150,
      render: ({ value }) => {
        if (value) {
          return <span className="float-right">{value.toFixed(2)}</span>;
        }
      }
    },
    {
      name: "firstTouchChannel",
      header: "First Touch Channel",
      type: "string",
      filterEditor: StringFilter,
      filterDelay: 1500,
      defaultWidth: 200,
      render: ({ value }) => {
        if (value) {
          return <span className="float-left">{value}</span>;
        }
      }
    }
  ];

  return columns;
};
