// @packages
import Avatar from "@components/avatar";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import moment from "moment-timezone";
import { Calendar, Edit2, Repeat, User, Users, Check, DollarSign, Mail, Phone, Truck, Video, Tag } from "react-feather";
import { Alert, Card, CardBody, CardHeader, CardFooter, Button, Media, Badge } from "reactstrap";
import { useHistory } from "react-router";

// @scripts
import CopyClipboard from "@atoms/copy-clipboard";
import { capitalizeString, isNotEmptyArray } from "@utility/Utils";
import {
  DATE_AND_TIME_CONFIRMATION_STATUS,
  DATE_AND_TIME_REJECTED_STATUS,
  DAYS_BEFORE_EVENT_REGISTRATION,
  DEFAULT_TIME_ZONE_LABEL
} from "@utility/Constants";
import { getBookingAndCalendarEventById } from "@services/BookingService";

// @styles
import "./BoardCard.scss";
import { actionsLinkStageBookingBoard } from "./actionsLink";
import TruckLink from "../../atoms/shipping-tracking-link";
import MeetingLink from "../../atoms/join-meeting-link";

const BoardCard = ({
  handleEditModal,
  content: {
    _id,
    addons,
    attendees,
    bookingTags,
    className,
    classVariant,
    createdAt,
    customerEmail,
    customerName,
    customerPhone,
    eventCoordinatorName,
    eventDateTime,
    eventDateTimeStatus,
    hasInternationalAttendees,
    joinInfo,
    payments,
    rescheduleDateTime,
    shippingTrackingLink,
    signUpDeadline,
    timezone,
    timezoneLabel,
    totalInvoice,
    updatedAt,
    bookingStage
  }
}) => {
  const [date, setDate] = useState(null);
  const [signUpDeadlineToShow, setSignUpDeadlineToShow] = useState(null);
  const [flippedCard, setFlippedCard] = useState(false);
  const [showFinalPaymentLabel, setShowFinalPaymentLabel] = useState(null);
  const [time, setTime] = useState(null);
  const [signUpRegistrationClass, setSignUpRegistrationClass] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [showAlertEventPayment, setShowAlertEventPayment] = useState(null);

  const history = useHistory();

  useEffect(() => {
    const depositPayment = payments && payments.find((element) => element.paymentName === "deposit" && element.status === "succeeded");
    const finalPayment = payments && payments.find((element) => element.paymentName === "final" && element.status === "succeeded");

    if (depositPayment || finalPayment) {
      setShowFinalPaymentLabel(finalPayment ? "success" : "danger");

      if (date && !finalPayment) {
        const previousEventDays = moment(date).diff(moment(), "days");
        if (previousEventDays < 0) {
          setAlertMessage({ _id, message: `Booking has not been paid and event was ${previousEventDays * -1} days ago.` });
          setShowAlertEventPayment("danger");
        } else if (previousEventDays < 7 && previousEventDays >= 0) {
          setAlertMessage({
            _id,
            message: `Booking has not been paid and event is in ${
              moment(date).format("MM/DD/YYYY") === moment().format("MM/DD/YYYY") ? 0 : previousEventDays + 1
            } days.`
          });
          setShowAlertEventPayment("warning");
        } else {
          setAlertMessage(null);
        }
      }
    }
  }, [payments, date]);

  useEffect(() => {
    if (!eventDateTime) return;

    const timeObject = `${moment(eventDateTime)?.tz(timezone)?.format("hh:mm A")} ${timezoneLabel || DEFAULT_TIME_ZONE_LABEL}`;
    setTime(timeObject);
    setDate(eventDateTime);

    let finalSignUpDeadline = null;
    if (signUpDeadline) {
      finalSignUpDeadline = moment(signUpDeadline);
    } else {
      finalSignUpDeadline = moment(eventDateTime).subtract(DAYS_BEFORE_EVENT_REGISTRATION, "days");
    }

    setSignUpDeadlineToShow(finalSignUpDeadline);
  }, [eventDateTime, rescheduleDateTime, signUpDeadline]);

  useEffect(() => {
    showAlertDeadline();
  }, [signUpDeadlineToShow]);

  const showAlertDeadline = () => {
    if (!signUpDeadlineToShow) return;

    const daysToRegistration = Math.abs(moment().diff(signUpDeadlineToShow, "days"));
    if (daysToRegistration >= 0 && daysToRegistration <= 1) {
      setSignUpRegistrationClass(true);
    } else {
      setSignUpRegistrationClass(false);
    }
  };

  const cardBack = () => {
    return (
      <div>
        <div className="z-index-1">
          <p className="mb-1 p-0">
            <strong>{capitalizeString(customerName)}</strong>
            <br />
            <small>
              <Mail size={12} /> {`${customerEmail}  `}
              <CopyClipboard className="z-index-2" text={customerEmail} />
            </small>

            <br />
            <small>
              <Phone size={12} /> {`${customerPhone}  `}
              <CopyClipboard text={customerPhone} />
            </small>
          </p>
          <p className="small">
            <strong>ID: </strong>
            <a
              href="#"
              className="cursor-pointer"
              onClick={async () => {
                const bookingAndCalendarEvent = await getBookingAndCalendarEventById(_id);
                if (!bookingAndCalendarEvent) return;
                handleEditModal(bookingAndCalendarEvent);
              }}
              title={"Edit booking info"}
            >
              {`${_id}  `}
            </a>
            <CopyClipboard text={_id} />
          </p>
          <p className="small">{`${className}  `}</p>
        </div>
        {date && time && (
          <Media className="pb-1">
            <Avatar color="light-primary" className="rounded mr-1" icon={<Calendar size={18} />} />
            <Media body>
              <h6 className="mb-0">{` ${moment(date).format("LL")}`}</h6>
              <small>{time}</small>
            </Media>
          </Media>
        )}
        {(!date || !time) && (
          <Media className="pb-1">
            <Media body>
              <h6 className="mb-0">
                <Avatar color="light-primary" className="rounded mr-1" icon={<Calendar size={18} />} /> TBD
              </h6>
            </Media>
          </Media>
        )}
        <div className="text-block pb-0">
          <table className="w-100">
            <tbody>
              <tr>
                <th className="font-weight-normal small">Attendees</th>
                <td className="text-right small align-top">{attendees}</td>
              </tr>
              <tr>
                <th className="font-weight-normal small">Option</th>
                <td className="text-right small">{classVariant && classVariant.title}</td>
              </tr>
              {addons && addons.length > 0 && (
                <tr>
                  <th className="font-weight-normal small">Upgrades</th>
                  <td className="text-right small">{addons.map(({name}) => name).join(", ")}</td>
                </tr>
              )}
              <tr>
                <th className="font-weight-normal small">Total</th>
                <td className="text-right small align-top">~ ${totalInvoice.toFixed(2)}</td>
              </tr>
              <tr>
                <th className="font-weight-normal small pt-1">International Attendees?</th>
                <td className="text-right small">{hasInternationalAttendees ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <th className="font-weight-normal small">Created</th>
                <td className="text-right small pt-1">{` ${moment(createdAt).format("LL")}`}</td>
              </tr>
              <tr>
                <th className="font-weight-normal small">Updated</th>
                <td className="text-right small">{` ${moment(updatedAt).format("LL")}`}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th className="pt-1 small">Coordinator</th>
                <td className="font-weight-bold small text-right pt-1">{eventCoordinatorName}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  };

  const cardFront = () => {
    return (
      <div
        className="cursor-pointer"
        onClick={async () => {
          const bookingAndCalendarEvent = await getBookingAndCalendarEventById(_id);
          if (!bookingAndCalendarEvent) return;
          handleEditModal(bookingAndCalendarEvent);
        }}
        title={"Edit booking info"}
      >
        <p className="text-truncate m-0 p-0">
          <small>
            <strong>{capitalizeString(customerName)}</strong>
          </small>
          <span className="text-primary small">{` ~ $${totalInvoice.toFixed(2)}`}</span>
          <br />
          <small className="text-xs">{className}</small>
        </p>

        {eventDateTime ? (
          <>
            <p className="m-0 p-0">
              <small>
                <strong>Event: </strong>
                {`${moment(eventDateTime)?.tz(timezone)?.format("MM/DD/YYYY hh:mm A")} ${timezoneLabel || DEFAULT_TIME_ZONE_LABEL}`}
              </small>
              {rescheduleDateTime && (
                <small>
                  <span>
                    <strong>
                      <br />
                      Change:{" "}
                    </strong>
                    {`${moment(rescheduleDateTime)?.tz(timezone)?.format("MM/DD/YYYY hh:mm A")} ${timezoneLabel || DEFAULT_TIME_ZONE_LABEL}`}
                  </span>
                </small>
              )}
            </p>
            {eventDateTimeStatus === DATE_AND_TIME_CONFIRMATION_STATUS && signUpDeadlineToShow && (
              <p className="m-0 p-0">
                <div>
                  <small>
                    <strong>Sign-up: </strong>
                    <span className={signUpRegistrationClass && "signup-deadline"}>{`${signUpDeadlineToShow.format(
                      "MM/DD/YYYY hh:mm A"
                    )} ${DEFAULT_TIME_ZONE_LABEL}`}</span>
                  </small>
                </div>
              </p>
            )}
          </>
        ) : (
          <p className="m-0 p-0">
            <small>
              <strong>Updated: </strong>
              {moment(updatedAt).fromNow()}
            </small>
          </p>
        )}
        <Alert isOpen={alertMessage && alertMessage._id === _id ? true : false} color={showAlertEventPayment} className="m-0 p-0">
          <div className="alert-body small">{alertMessage && alertMessage.message}</div>
        </Alert>
      </div>
    );
  };

  const handleEdit = (rowId) => {
    history.push(`/booking/${rowId}`);
  };

  return (
    <>
      <Card className="card-board">
        <CardHeader className="p-0 m-0">
          
          {isNotEmptyArray(bookingTags) && bookingTags.includes("repeat") && (
            <span className="card-tags text-warning">
              <Tag size="10"></Tag>
              {" Repeat"}
            </span>
          )}

          <Button
            color="link"
            className="flip-button text-muted"
            onClick={() => {
              setFlippedCard(!flippedCard);
            }}
          >
            <Repeat size={14} />
          </Button>
        </CardHeader>
        <CardBody className="p-1 ">{flippedCard ? cardBack() : cardFront()}</CardBody>
        <CardFooter className="card-board-footer justify-content-end">
          <div align="right">
            {actionsLinkStageBookingBoard(_id, handleEdit)[bookingStage]}
          </div>
        </CardFooter>

        {showFinalPaymentLabel && (
          <CardFooter 
            className={"card-board-footer pr-1 justify-content-between"}
          >
            <div className="ml-1">
              {classVariant && classVariant?.hasKit && (shippingTrackingLink ? (
                <TruckLink
                  color="light-primary"
                  href={shippingTrackingLink}
                  title="Shipping Tracking"
                />
              ) : (
                <TruckLink
                  color="light-danger"
                  title="Tracking link has not been provided"
                />
              ))}
              {joinInfo && joinInfo?.joinUrl ? (
                <MeetingLink
                  color="light-primary"
                  href={joinInfo?.joinUrl}
                  title={`password: ${joinInfo.password}`} 
                />
              ) : (
                <MeetingLink
                  color="light-danger"
                  title="Conference link has not been provided"
                />
              )}
            </div>
            <Badge size="sm" color={`light-${showFinalPaymentLabel}`} pill>
              Final Payment
            </Badge>
          </CardFooter>
        )}
        {eventDateTimeStatus === DATE_AND_TIME_REJECTED_STATUS && (
          <CardFooter className="card-board-footer justify-content-end pr-1">
            <Badge size="sm" color={"light-warning"} pill>
              Rejected
            </Badge>
          </CardFooter>
        )}
      </Card>
    </>
  );
};

export default BoardCard;

BoardCard.propTypes = {
  handleEditModal: PropTypes.func.isRequired,
  content: PropTypes.object.isRequired
};
