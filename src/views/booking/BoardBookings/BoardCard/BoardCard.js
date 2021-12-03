// @packages
import Avatar from '@components/avatar';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Calendar, Edit2, Repeat, User, Users, Check, DollarSign, Mail, Phone } from 'react-feather';
import { Card, CardBody, CardHeader, CardFooter, Button, Media, CardLink, Badge } from 'reactstrap';
import { useHistory } from 'react-router';

// @scripts
import CopyClipboard from '../../../../components/CopyClipboard';
import { capitalizeString, getBookingTotals, getEventFullDate, getSignUpDeadlineFromEventDate, toAmPm } from '../../../../utility/Utils';

// @styles
import './BoardCard.scss';
import {
  DATE_AND_TIME_CONFIRMATION_STATUS,
  DATE_AND_TIME_REJECTED_STATUS,
  DAYS_BEFORE_EVENT_REGISTRATION,
  DEFAULT_TIME_ZONE_LABEL
} from '../../../../utility/Constants';
import { getEventDates } from '../../common';

const BoardCard = ({
  handleEditModal,
  content: {
    customerName,
    _id,
    attendees,
    classVariant,
    teamClassId,
    createdAt,
    updatedAt,
    status,
    classTitle,
    eventDurationHours,
    email,
    phone,
    company,
    serviceFee,
    pricePerson,
    minimum,
    salesTax,
    calendarEvent,
    customerId,
    coordinatorName,
    payments,
    eventCoordinatorId,
    signUpDeadline,
    closedReason,
    notes,
    hasInternationalAttendees
  }
}) => {
  const [date, setDate] = useState(null);
  const [signUpDeadlineToShow, setSignUpDeadlineToShow] = useState(null);
  const [flippedCard, setFlippedCard] = useState(false);
  const [showFinalPaymentLabel, setShowFinalPaymentLabel] = useState(null);
  const [time, setTime] = useState(null);
  const [total, setTotal] = useState(0);
  const [signUpRegistrationClass, setSignUpRegistrationClass] = useState(null);

  const history = useHistory();

  const getTotals = () => {
    const bookingInfo = {
      classVariant,
      classMinimum: minimum,
      pricePerson,
      serviceFee,
      payments,
      attendees,
      salesTax
    };

    const bookingTotals = getBookingTotals(bookingInfo, false, salesTax, true);
    setTotal(bookingTotals.finalValue.toFixed(2));
  };

  useEffect(() => {
    getTotals();
  }, [classVariant]);

  useEffect(() => {
    const depositPayment = payments && payments.find((element) => element.paymentName === 'deposit' && element.status === 'succeeded');
    const finalPayment = payments && payments.find((element) => element.paymentName === 'final' && element.status === 'succeeded');

    if (depositPayment || finalPayment) {
      setShowFinalPaymentLabel(finalPayment ? 'success' : 'danger');
    }
  }, [payments]);

  useEffect(() => {
    const dates = getEventDates(calendarEvent, signUpDeadline);
    setDate(dates && dates.date);
    setTime(dates && dates.time);
    setSignUpDeadlineToShow(dates && dates.signUpDeadline);
  }, [calendarEvent, signUpDeadline]);

  useEffect(() => {
    if (signUpDeadline) {
      const isRegistrationDeadlinePast = moment(signUpDeadline).isBefore(moment());

      console.log(new Date(signUpDeadline), '>', new Date(), isRegistrationDeadlinePast);
      console.log(new Date(date), new Date(), new Date(date) > new Date());
      if (moment(date).isAfter(moment())) {
        setSignUpRegistrationClass('signup-deadline');
      }
    }
  }, [signUpDeadline, date]);

  const cardBack = () => {
    return (
      <div>
        <div className="z-index-1">
          <p className="mb-1 p-0">
            <strong>{capitalizeString(customerName)}</strong>
            <br />
            <small>
              <Mail size={12} /> {`${email}  `}
              <CopyClipboard className="z-index-2" text={email} />
            </small>

            <br />
            <small>
              <Phone size={12} /> {`${phone}  `}
              <CopyClipboard text={phone} />
            </small>
          </p>
          <p className="small">
            <strong>ID: </strong>
            <a
              href="#"
              className="cursor-pointer"
              onClick={() => handleEditModal({
                bookingId: _id,
                currentCustomerId: customerId,
                currentName: customerName,
                currentEmail: email,
                currentPhone: phone,
                currentCompany: company,
                currentCoordinatorId: eventCoordinatorId,
                currentCoordinatorName: coordinatorName,
                currentTeamclassId: teamClassId,
                currentTeamclassName: classTitle,
                currentGroupSize: attendees,
                currentSignUpDeadline: signUpDeadline,
                currentClassVariant: classVariant,
                currentServiceFee: serviceFee,
                currentSalesTax: salesTax,
                createdAt,
                updatedAt,
                currentStatus: status,
                currentEventDurationHours: eventDurationHours,
                currentClosedReason: closedReason,
                currentNotes: notes,
                currentPayments: payments
              })
              }
              title={'Edit booking info'}
            >
              {`${_id}  `}
            </a>
            <CopyClipboard text={_id} />
          </p>
          <p className="small">{`${classTitle}  `}</p>
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
                <td className="text-right small align-top">~ ${total}</td>
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
                <td className="font-weight-bold small text-right pt-1">{coordinatorName}</td>
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
        onClick={() => handleEditModal({
          bookingId: _id,
          currentCustomerId: customerId,
          currentName: customerName,
          currentEmail: email,
          currentPhone: phone,
          currentCompany: company,
          currentCoordinatorId: eventCoordinatorId,
          currentCoordinatorName: coordinatorName,
          currentTeamclassId: teamClassId,
          currentTeamclassName: classTitle,
          currentGroupSize: attendees,
          currentSignUpDeadline: signUpDeadline,
          currentClassVariant: classVariant,
          currentServiceFee: serviceFee,
          currentSalesTax: salesTax,
          createdAt,
          updatedAt,
          currentStatus: status,
          currentEventDurationHours: eventDurationHours,
          currentClosedReason: closedReason,
          currentNotes: notes,
          currentPayments: payments
        })
        }
        title={'Edit booking info'}
      >
        <p className="text-truncate m-0 p-0">
          <small>
            <strong>{capitalizeString(customerName)}</strong>
          </small>
          <span className="text-primary small">{` ~ $${total}`}</span>
          <br />
          <small className="text-xs">{classTitle}</small>
        </p>

        {calendarEvent ? (
          <>
            <p className="m-0 p-0">
              <small>
                <strong>Event: </strong>
                {`${moment(date).format('MM/DD/YYYY')} ${time}`}
              </small>
            </p>
            {calendarEvent.status === DATE_AND_TIME_CONFIRMATION_STATUS && (
              <p className="m-0 p-0">
                <small className={signUpRegistrationClass}>
                  <strong>Sign-up by: </strong>
                  {signUpDeadlineToShow}
                </small>
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
        <CardFooter className="card-board-footer pr-1">
          {status === 'quote' ? (
            <div align="right">
              <CardLink href={`https://www.teamclass.com/booking/select-date-time/${_id}`} target={'_blank'} title={'Select date and time link'}>
                <Avatar color="light-primary" size="sm" icon={<Calendar size={18} />} />
              </CardLink>
              <CardLink onClick={() => handleEdit(_id)} target={'_blank'} title={'Time / Attendees / Invoice Builder'}>
                <Avatar color="light-dark" size="sm" icon={<Edit2 size={18} />} />
              </CardLink>
            </div>
          ) : status === 'date-requested' && calendarEvent && calendarEvent.status === 'reserved' ? (
            <div align="right">
              <CardLink href={`https://www.teamclass.com/booking/date-time-confirmation/${_id}`} target={'_blank'} title={'Approve/Reject link'}>
                <Avatar color="light-primary" size="sm" icon={<Check size={18} />} />
              </CardLink>
              <CardLink href={`https://www.teamclass.com/event/${_id}`} target={'_blank'} title={'Sign-up link'}>
                <Avatar color="light-primary" size="sm" icon={<User size={18} />} />
              </CardLink>
              <CardLink href={`https://www.teamclass.com/signUpStatus/${_id}`} target={'_blank'} title={'Sign-up status'}>
                <Avatar color="light-primary" size="sm" icon={<Users size={18} />} />
              </CardLink>
              <CardLink href={`https://www.teamclass.com/booking/event-confirmation/${_id}`} target={'_blank'} title={'Deposit link'}>
                <Avatar color="light-primary" size="sm" icon={<DollarSign size={18} />} />
              </CardLink>
              <CardLink onClick={() => handleEdit(_id)} target={'_blank'} title={'Time / Attendees / Invoice Builder'}>
                <Avatar color="light-dark" size="sm" icon={<Edit2 size={18} />} />
              </CardLink>
            </div>
          ) : status === 'date-requested' && calendarEvent && calendarEvent.status === 'confirmed' ? (
            <div align="right">
              <CardLink href={`https://www.teamclass.com/booking/date-time-confirmation/${_id}`} target={'_blank'} title={'Approve/Reject link'}>
                <Avatar color="light-primary" size="sm" icon={<Check size={18} />} />
              </CardLink>
              <CardLink href={`https://www.teamclass.com/event/${_id}`} target={'_blank'} title={'Sign-up link'}>
                <Avatar color="light-primary" size="sm" icon={<User size={18} />} />
              </CardLink>
              <CardLink href={`https://www.teamclass.com/signUpStatus/${_id}`} target={'_blank'} title={'Sign-up status'}>
                <Avatar color="light-primary" size="sm" icon={<Users size={18} />} />
              </CardLink>
              <CardLink href={`https://www.teamclass.com/booking/event-confirmation/${_id}`} target={'_blank'} title={'Deposit link'}>
                <Avatar color="light-primary" size="sm" icon={<DollarSign size={18} />} />
              </CardLink>
              <CardLink onClick={() => handleEdit(_id)} target={'_blank'} title={'Time / Attendees / Invoice Builder'}>
                <Avatar color="light-dark" size="sm" icon={<Edit2 size={18} />} />
              </CardLink>
            </div>
          ) : status === 'date-requested' && calendarEvent && calendarEvent.status === 'rejected' ? (
            <div align="right">
              <CardLink href={`https://www.teamclass.com/booking/date-time-confirmation/${_id}`} target={'_blank'} title={'Approve/Reject link'}>
                <Avatar color="light-primary" size="sm" icon={<Check size={18} />} />
              </CardLink>
              <CardLink href={`https://www.teamclass.com/event/${_id}`} target={'_blank'} title={'Sign-up link'}>
                <Avatar color="light-primary" size="sm" icon={<User size={18} />} />
              </CardLink>
              <CardLink href={`https://www.teamclass.com/signUpStatus/${_id}`} target={'_blank'} title={'Sign-up status'}>
                <Avatar color="light-primary" size="sm" icon={<Users size={18} />} />
              </CardLink>
              <CardLink href={`https://www.teamclass.com/booking/event-confirmation/${_id}`} target={'_blank'} title={'Deposit link'}>
                <Avatar color="light-primary" size="sm" icon={<DollarSign size={18} />} />
              </CardLink>
              <CardLink onClick={() => handleEdit(_id)} target={'_blank'} title={'Time / Attendees / Invoice Builder'}>
                <Avatar color="light-dark" size="sm" icon={<Edit2 size={18} />} />
              </CardLink>
            </div>
          ) : status === 'confirmed' ? (
            <div align="right">
              <CardLink href={`https://www.teamclass.com/event/${_id}`} target={'_blank'} title={'Sign-up link'}>
                <Avatar color="light-primary" size="sm" icon={<User size={18} />} />
              </CardLink>
              <CardLink href={`https://www.teamclass.com/signUpStatus/${_id}`} target={'_blank'} title={'Sign-up status'}>
                <Avatar color="light-primary" size="sm" icon={<Users size={18} />} />
              </CardLink>
              <CardLink href={`https://www.teamclass.com/booking/event-confirmation/${_id}`} target={'_blank'} title={'Deposit link'}>
                <Avatar color="light-primary" size="sm" icon={<DollarSign size={18} />} />
              </CardLink>
              <CardLink href={`https://www.teamclass.com/booking/payment/${_id}`} target={'_blank'} title={'Final payment link'}>
                <Avatar color="secondary" size="sm" icon={<DollarSign size={18} />} />
              </CardLink>
              <CardLink onClick={() => handleEdit(_id)} target={'_blank'} title={'Time / Attendees / Invoice Builder'}>
                <Avatar color="light-dark" size="sm" icon={<Edit2 size={18} />} />
              </CardLink>
            </div>
          ) : status === 'paid' ? (
            <div align="right">
              <CardLink href={`https://www.teamclass.com/event/${_id}`} target={'_blank'} title={'Sign-up link'}>
                <Avatar color="light-primary" size="sm" icon={<User size={18} />} />
              </CardLink>
              <CardLink href={`https://www.teamclass.com/signUpStatus/${_id}`} target={'_blank'} title={'Sign-up status'}>
                <Avatar color="light-primary" size="sm" icon={<Users size={18} />} />
              </CardLink>
              <CardLink href={`https://www.teamclass.com/booking/event-confirmation/${_id}`} target={'_blank'} title={'Deposit link'}>
                <Avatar color="light-primary" size="sm" icon={<DollarSign size={18} />} />
              </CardLink>
              <CardLink href={`https://www.teamclass.com/booking/payment/${_id}`} target={'_blank'} title={'Final payment link'}>
                <Avatar color="secondary" size="sm" icon={<DollarSign size={18} />} />
              </CardLink>
              <CardLink onClick={() => handleEdit(_id)} target={'_blank'} title={'Time / Attendees / Invoice Builder'}>
                <Avatar color="light-dark" size="sm" icon={<Edit2 size={18} />} />
              </CardLink>
            </div>
          ) : (
            status !== 'canceled' && (
              <div align="right">
                <CardLink href={`https://www.teamclass.com/event/${_id}`} target={'_blank'} title={'Sign-up link'}>
                  <Avatar color="light-primary" size="sm" icon={<User size={18} />} />
                </CardLink>
                <CardLink href={`https://www.teamclass.com/signUpStatus/${_id}`} target={'_blank'} title={'Sign-up status'}>
                  <Avatar color="light-primary" size="sm" icon={<Users size={18} />} />
                </CardLink>
                <CardLink href={`https://www.teamclass.com/booking/event-confirmation/${_id}`} target={'_blank'} title={'Deposit link'}>
                  <Avatar color="light-primary" size="sm" icon={<DollarSign size={18} />} />
                </CardLink>
                <CardLink href={`https://www.teamclass.com/booking/payment/${_id}`} target={'_blank'} title={'Final payment link'}>
                  <Avatar color="secondary" size="sm" icon={<DollarSign size={18} />} />
                </CardLink>
                <CardLink onClick={() => handleEdit(_id)} target={'_blank'} title={'Time / Attendees / Invoice Builder'}>
                  <Avatar color="light-dark" size="sm" icon={<Edit2 size={18} />} />
                </CardLink>
              </div>
            )
          )}
        </CardFooter>

        {showFinalPaymentLabel && (
          <CardFooter className="card-board-footer pr-1">
            <Badge size="sm" color={`light-${showFinalPaymentLabel}`} pill>
              Final Payment
            </Badge>
          </CardFooter>
        )}
        {calendarEvent && calendarEvent.status === DATE_AND_TIME_REJECTED_STATUS && (
          <CardFooter className="card-board-footer pr-1">
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
