// @packages
import Avatar from '@components/avatar';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import { Calendar, Edit2, Repeat, User, Users, Check, DollarSign, Mail, Phone, Truck, Video, Tag } from 'react-feather';
import { Alert, Card, CardBody, CardHeader, CardFooter, Button, Media, CardLink, Badge } from 'reactstrap';
import { useHistory } from 'react-router';
// @scripts
import CopyClipboard from '../../../../components/CopyClipboard';
import { capitalizeString, isNotEmptyArray } from '../../../../utility/Utils';
// @styles
import './BoardCard.scss';
import {
  DATE_AND_TIME_CONFIRMATION_STATUS,
  DATE_AND_TIME_REJECTED_STATUS,
  DAYS_BEFORE_EVENT_REGISTRATION,
  DEFAULT_TIME_ZONE_LABEL
} from '../../../../utility/Constants';
import { getBookingAndCalendarEventById } from '../../../../services/BookingService';

const BoardCard = ({
  handleEditModal,
  content: {
    customerName,
    _id,
    attendees,
    classVariant,
    classId,
    createdAt,
    updatedAt,
    status,
    className,
    customerEmail,
    customerPhone,
    customerCompany,
    eventDateTime,
    timezone,
    rescheduleDateTime,
    customerId,
    eventCoordinatorName,
    capRegistration,
    eventDateTimeStatus,
    hasInternationalAttendees,
    payments,
    eventCoordinatorId,
    signUpDeadline,
    closedReason,
    totalInvoice,
    shippingTrackingLink,
    joinInfo,
    customerTags
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
    const depositPayment = payments && payments.find((element) => element.paymentName === 'deposit' && element.status === 'succeeded');
    const finalPayment = payments && payments.find((element) => element.paymentName === 'final' && element.status === 'succeeded');

    if (depositPayment || finalPayment) {
      setShowFinalPaymentLabel(finalPayment ? 'success' : 'danger');

      if (date && !finalPayment) {
        const previousEventDays = moment(date).diff(moment(), 'days');
        if (previousEventDays < 0) {
          setAlertMessage({ _id, message: `Booking has not been paid and event was ${previousEventDays * -1} days ago.` });
          setShowAlertEventPayment('danger');
        } else if (previousEventDays < 7 && previousEventDays >= 0) {
          setAlertMessage({
            _id,
            message: `Booking has not been paid and event is in ${
              moment(date).format('MM/DD/YYYY') === moment().format('MM/DD/YYYY') ? 0 : previousEventDays + 1
            } days.`
          });
          setShowAlertEventPayment('warning');
        } else {
          setAlertMessage(null);
        }
      }
    }
  }, [payments, date]);

  useEffect(() => {
    if (!eventDateTime) return;

    const timeObject = `${moment(eventDateTime)?.tz(timezone)?.format('hh:mm A')} ${DEFAULT_TIME_ZONE_LABEL}`;
    setTime(timeObject);
    setDate(eventDateTime);

    let finalSignUpDeadline = null;
    if (signUpDeadline) {
      finalSignUpDeadline = moment(signUpDeadline);
    } else {
      finalSignUpDeadline = moment(eventDateTime).subtract(DAYS_BEFORE_EVENT_REGISTRATION, 'days');
    }

    setSignUpDeadlineToShow(finalSignUpDeadline);
  }, [eventDateTime, rescheduleDateTime, signUpDeadline]);

  useEffect(() => {
    showAlertDeadline();
  }, [signUpDeadlineToShow]);

  const showAlertDeadline = () => {
    if (!signUpDeadlineToShow) return;

    const daysToRegistration = Math.abs(moment().diff(signUpDeadlineToShow, 'days'));
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
              title={'Edit booking info'}
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
              <h6 className="mb-0">{` ${moment(date).format('LL')}`}</h6>
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
              <tr>
                <th className="font-weight-normal small">Total</th>
                <td className="text-right small align-top">~ ${totalInvoice.toFixed(2)}</td>
              </tr>
              <tr>
                <th className="font-weight-normal small pt-1">International Attendees?</th>
                <td className="text-right small">{hasInternationalAttendees ? 'Yes' : 'No'}</td>
              </tr>
              <tr>
                <th className="font-weight-normal small">Created</th>
                <td className="text-right small pt-1">{` ${moment(createdAt).format('LL')}`}</td>
              </tr>
              <tr>
                <th className="font-weight-normal small">Updated</th>
                <td className="text-right small">{` ${moment(updatedAt).format('LL')}`}</td>
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
        title={'Edit booking info'}
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
                {`${moment(eventDateTime)?.tz(timezone)?.format('MM/DD/YYYY hh:mm A')} ${DEFAULT_TIME_ZONE_LABEL}`}
              </small>
              {rescheduleDateTime && (
                <small>
                  <span>
                    <strong>
                      <br />
                      Change:{' '}
                    </strong>
                    {`${moment(rescheduleDateTime)?.tz(timezone)?.format('MM/DD/YYYY hh:mm A')} ${DEFAULT_TIME_ZONE_LABEL}`}
                  </span>
                </small>
              )}
            </p>
            {eventDateTimeStatus === DATE_AND_TIME_CONFIRMATION_STATUS && signUpDeadlineToShow && (
              <p className="m-0 p-0">
                <div>
                  <small>
                    <strong>Sign-up: </strong>
                    <span className={signUpRegistrationClass && 'signup-deadline'}>{`${signUpDeadlineToShow.format(
                      'MM/DD/YYYY hh:mm A'
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
          
          {isNotEmptyArray(customerTags) && (
            <span className="card-tags text-warning">
              <Tag size="10"></Tag>
              {" "}{customerTags.join(", ")}
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
          {status === 'quote' ? (
            <div align="right">
              <a
                className="mr-1"
                href={`https://www.teamclass.com/booking/select-date-time/${_id}`}
                target={'_blank'}
                title={'Select date and time link'}
              >
                <Avatar color="light-primary" size="sm" icon={<Calendar size={18} />} />
              </a>
              <a className="mr-1" onClick={() => handleEdit(_id)} target={'_blank'} title={'Time / Attendees / Invoice Builder'}>
                <Avatar color="light-dark" size="sm" icon={<Edit2 size={18} />} />
              </a>
            </div>
          ) : status === 'date-requested' && eventDateTimeStatus === 'reserved' ? (
            <div align="right">
              <a
                className="mr-1"
                href={`https://www.teamclass.com/booking/select-date-time/${_id}`}
                target={'_blank'}
                title={'Select date and time link'}
              >
                <Avatar color="light-primary" size="sm" icon={<Calendar size={18} />} />
              </a>
              <a
                className="mr-1"
                href={`https://www.teamclass.com/booking/date-time-confirmation/${_id}`}
                target={'_blank'}
                title={'Approve/Reject link'}
              >
                <Avatar color="light-primary" size="sm" icon={<Check size={18} />} />
              </a>
              <a className="mr-1" onClick={() => handleEdit(_id)} target={'_blank'} title={'Time / Attendees / Invoice Builder'}>
                <Avatar color="light-dark" size="sm" icon={<Edit2 size={18} />} />
              </a>
            </div>
          ) : status === 'date-requested' && eventDateTimeStatus === 'confirmed' ? (
            <div>
              <a
                className="mr-1"
                href={`https://www.teamclass.com/booking/select-date-time/${_id}`}
                target={'_blank'}
                title={'Select date and time link'}
              >
                <Avatar color="light-primary" size="sm" icon={<Calendar size={18} />} />
              </a>
              <a className="mr-1" href={`https://www.teamclass.com/event/${_id}`} target={'_blank'} title={'Sign-up link'}>
                <Avatar color="light-primary" size="sm" icon={<User size={18} />} />
              </a>
              <a className="mr-1" href={`https://www.teamclass.com/signUpStatus/${_id}`} target={'_blank'} title={'Sign-up status'}>
                <Avatar color="light-primary" size="sm" icon={<Users size={18} />} />
              </a>
              <a className="mr-1" href={`https://www.teamclass.com/booking/event-confirmation/${_id}`} target={'_blank'} title={'Deposit link'}>
                <Avatar color="light-primary" size="sm" icon={<DollarSign size={18} />} />
              </a>
              <a className="mr-1" onClick={() => handleEdit(_id)} target={'_blank'} title={'Time / Attendees / Invoice Builder'}>
                <Avatar color="light-dark" size="sm" icon={<Edit2 size={18} />} />
              </a>
            </div>
          ) : status === 'date-requested' && eventDateTimeStatus === 'rejected' ? (
            <div align="right">
              <a
                className="mr-1"
                href={`https://www.teamclass.com/booking/select-date-time/${_id}`}
                target={'_blank'}
                title={'Select date and time link'}
              >
                <Avatar color="light-primary" size="sm" icon={<Calendar size={18} />} />
              </a>
              <a className="mr-1" onClick={() => handleEdit(_id)} target={'_blank'} title={'Time / Attendees / Invoice Builder'}>
                <Avatar color="light-dark" size="sm" icon={<Edit2 size={18} />} />
              </a>
            </div>
          ) : status === 'confirmed' ? (
            <div align="right">
              <a className="mr-1" href={`https://www.teamclass.com/booking/select-date-time/${_id}`} target={'_blank'} title={'Reschedule link'}>
                <Avatar color="light-primary" size="sm" icon={<Calendar size={18} />} />
              </a>
              <a className="mr-1" href={`https://www.teamclass.com/event/${_id}`} target={'_blank'} title={'Sign-up link'}>
                <Avatar color="light-primary" size="sm" icon={<User size={18} />} />
              </a>
              <a className="mr-1" href={`https://www.teamclass.com/signUpStatus/${_id}`} target={'_blank'} title={'Sign-up status'}>
                <Avatar color="light-primary" size="sm" icon={<Users size={18} />} />
              </a>
              <a className="mr-1" href={`https://www.teamclass.com/booking/event-confirmation/${_id}`} target={'_blank'} title={'Deposit link'}>
                <Avatar color="light-primary" size="sm" icon={<DollarSign size={18} />} />
              </a>
              <a className="mr-1" href={`https://www.teamclass.com/booking/payment/${_id}`} target={'_blank'} title={'Final payment link'}>
                <Avatar color="secondary" size="sm" icon={<DollarSign size={18} />} />
              </a>
              <a className="mr-1" onClick={() => handleEdit(_id)} target={'_blank'} title={'Time / Attendees / Invoice Builder'}>
                <Avatar color="light-dark" size="sm" icon={<Edit2 size={18} />} />
              </a>
            </div>
          ) : (
            status === 'paid' && (
              <div align="right">
                <a className="mr-1" href={`https://www.teamclass.com/booking/select-date-time/${_id}`} target={'_blank'} title={'Reschedule link'}>
                  <Avatar color="light-primary" size="sm" icon={<Calendar size={18} />} />
                </a>
                <a className="mr-1" href={`https://www.teamclass.com/event/${_id}`} target={'_blank'} title={'Sign-up link'}>
                  <Avatar color="light-primary" size="sm" icon={<User size={18} />} />
                </a>
                <a className="mr-1" href={`https://www.teamclass.com/signUpStatus/${_id}`} target={'_blank'} title={'Sign-up status'}>
                  <Avatar color="light-primary" size="sm" icon={<Users size={18} />} />
                </a>
                <a className="mr-1" href={`https://www.teamclass.com/booking/event-confirmation/${_id}`} target={'_blank'} title={'Deposit link'}>
                  <Avatar color="light-primary" size="sm" icon={<DollarSign size={18} />} />
                </a>
                <a className="mr-1" href={`https://www.teamclass.com/booking/payment/${_id}`} target={'_blank'} title={'Final payment link'}>
                  <Avatar color="secondary" size="sm" icon={<DollarSign size={18} />} />
                </a>
                <a className="mr-1" onClick={() => handleEdit(_id)} target={'_blank'} title={'Time / Attendees / Invoice Builder'}>
                  <Avatar color="light-dark" size="sm" icon={<Edit2 size={18} />} />
                </a>
              </div>
            )
          )}
        </CardFooter>

        {showFinalPaymentLabel && (
          <CardFooter 
            className={`card-board-footer pr-1 ${shippingTrackingLink || joinInfo?.joinUrl ? 
              "justify-content-between" : 
                "justify-content-end"}`}
          >
            <div className="ml-1">
              {shippingTrackingLink && (
                <a
                className="mr-1"
                  href={shippingTrackingLink}
                  target={'_blank'}
                  rel="noopener noreferrer"
                  title={'Shipping Tracking'}
                >
                  <Avatar color="light-primary" size="sm" icon={<Truck size={18} />} />
                </a>
              )}
              {joinInfo && joinInfo?.joinUrl && (
                <a
                  href={joinInfo?.joinUrl}
                  target={'_blank'}
                  rel="noopener noreferrer"
                  title={`password: ${joinInfo.password}`}
                >
                  <Avatar color="light-primary" size="sm" icon={<Video size={18} />} />
                </a>
              )}
            </div>
            <Badge size="sm" color={`light-${showFinalPaymentLabel}`} pill>
              Final Payment
            </Badge>
          </CardFooter>
        )}
        {eventDateTimeStatus === DATE_AND_TIME_REJECTED_STATUS && (
          <CardFooter className="card-board-footer justify-content-end pr-1">
            <Badge size="sm" color={`light-warning`} pill>
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
