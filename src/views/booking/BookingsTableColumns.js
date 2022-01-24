// @packages
import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import { Briefcase, Calendar, Check, DollarSign, Edit2, Mail, Phone, TrendingUp, User, Users } from 'react-feather';
import Avatar from '@components/avatar';

//@reactdatagrid packages
import NumberFilter from '@inovua/reactdatagrid-community/NumberFilter';
import DateFilter from '@inovua/reactdatagrid-community/DateFilter';

const columns = [
  {
    name: 'createdAt',
    header: 'Created',
    type: 'date',
    filterEditor: DateFilter,
    render: ({ value, cellProps }) => {
      return moment(value).calendar(null, {
        lastDay: '[Yesterday]',
        sameDay: 'LT',
        lastWeek: 'dddd',
        sameElse: 'MMMM Do, YYYY'
      });
    }
  },
  {
    name: 'updatedAt',
    header: 'Updated',
    type: 'date',
    filterEditor: DateFilter,
    render: ({ value, cellProps }) => {
      return moment(value).calendar(null, {
        lastDay: '[Yesterday]',
        sameDay: 'LT',
        lastWeek: 'dddd',
        sameElse: 'MMMM Do, YYYY'
      });
    },
    defaultVisible: false
  },
  {
    name: '_id',
    header: 'Id',
    type: 'string',
    render: ({ value, cellProps }) => {
      return (
        <>
          <small>
            <a
              href="#"
              onClick={() => {
                console.log('entró handle modal fila', value);
                handleEditModal({
                  bookingId: value,
                  currentCustomerId: cellProps.data.customerId,
                  currentName: cellProps.data.customerName,
                  currentEmail: cellProps.data.customerEmail,
                  currentPhone: cellProps.data.customerPhone,
                  currentCompany: cellProps.data.customerCompany,
                  currentCoordinatorId: cellProps.data.eventCoordinatorId,
                  currentCoordinatorName: cellProps.data.eventCoordinatorName,
                  currentTeamclassId: cellProps.data.classId,
                  currentTeamclassName: cellProps.data.className,
                  currentGroupSize: cellProps.data.attendees,
                  currentSignUpDeadline: cellProps.data.signUpDeadline,
                  currentClassVariant: cellProps.data.classVariant,
                  currentServiceFee: cellProps.data.serviceFee,
                  currentSalesTax: cellProps.data.salesTax,
                  createdAt: cellProps.data.createdAt,
                  updatedAt: cellProps.data.updatedAt,
                  currentStatus: cellProps.data.status,
                  currentEventDurationHours: cellProps.data.eventDurationHours,
                  currentClosedReason: cellProps.data.closedReason,
                  currentNotes: cellProps.data.notes,
                  currentPayments: cellProps.data.payments,
                  currentCapRegistration: cellProps.data.capRegistration
                });
              }}
              title={`Edit booking info ${cellProps.data._id}`}
            >
              {cellProps.data._id}
            </a>
          </small>
        </>
      );
    }
  },
  { name: 'customerName', header: 'Customer ', type: 'string' },
  { name: 'customerEmail', header: 'Email ', type: 'string' },
  { name: 'customerPhone', header: 'Phone ', type: 'number', defaultVisible: false },
  { name: 'customerCompany', header: 'Company ', type: 'string' },
  { name: 'className', header: 'Class ', type: 'string' },
  {
    name: 'attendees',
    header: 'Attendees ',
    type: 'number',
    filterEditor: NumberFilter,
    defaultWidth: 112,
    render: ({ value, cellProps }) => {
      if (value) {
        return <span className="float-right">{value}</span>;
      }
    }
  },
  {
    name: 'eventDateTime',
    header: 'Event date',
    type: 'date',
    filterEditor: DateFilter,
    render: ({ value, cellProps }) => {
      if (value) {
        return moment(value).format('LLL');
      }
    }
  },
  {
    name: 'signUpDeadline',
    header: 'Sign Up Date',
    type: 'date',
    filterEditor: DateFilter,
    render: ({ value, cellProps }) => {
      if (value) {
        return moment(value).format('LLL');
      }
    }
  },
  {
    name: 'taxAmount',
    header: 'Tax',
    type: 'number',
    defaultWidth: 100,
    filterEditor: NumberFilter,
    render: ({ value, cellProps }) => {
      return value.toFixed(2);
    }
  },
  {
    name: 'serviceFeeAmount',
    header: 'Service Fee',
    type: 'number',
    defaultWidth: 100,
    filterEditor: NumberFilter,
    render: ({ value, cellProps }) => {
      return value.toFixed(2);
    }
  },
  {
    name: 'cardFeeAmount',
    header: 'Card Fee',
    type: 'number',
    defaultWidth: 100,
    filterEditor: NumberFilter,
    render: ({ value, cellProps }) => {
      return value.toFixed(2);
    }
  },
  {
    name: 'totalInvoice',
    header: 'Total Invoice',
    type: 'number',
    defaultWidth: 100,
    filterEditor: NumberFilter,
    render: ({ value, cellProps }) => {
      return value.toFixed(2);
    }
  },
  {
    name: 'depositsPaid',
    header: 'Deposit Paid',
    type: 'number',
    defaultWidth: 100,
    filterEditor: NumberFilter,
    defaultVisible: false,
    render: ({ value, cellProps }) => {
      return value.toFixed(2);
    }
  },
  {
    name: 'finalPaid',
    header: 'Final paid',
    type: 'number',
    defaultWidth: 100,
    filterEditor: NumberFilter,
    defaultVisible: false,
    render: ({ value, cellProps }) => {
      return value.toFixed(2);
    }
  },
  {
    name: 'balance',
    header: 'Balance',
    type: 'number',
    defaultWidth: 100,
    filterEditor: NumberFilter,
    defaultVisible: false,
    render: ({ value, cellProps }) => {
      return value.toFixed(2);
    }
  },
  {
    name: 'actions',
    header: 'Actions',
    defaultWidth: 200,
    render: ({ value, cellProps }) => {
      if (cellProps.data) {
        return cellProps.data.status === 'quote' ? (
          <small>
            <div className="d-flex">
              <a
                className="mr-1"
                href={`https://www.teamclass.com/booking/select-date-time/${cellProps.data._id}`}
                target={'_blank'}
                title={'Select date and time link'}
              >
                <Avatar color="light-primary" size="sm" icon={<Calendar />} />
              </a>
              <a className="mr-1" onClick={() => handleEdit(cellProps.data._id)} target={'_blank'} title={'Time / Attendees / Invoice Builder'}>
                <Avatar color="light-dark" size="sm" icon={<Edit2 />} />
              </a>
            </div>
          </small>
        ) : cellProps.data.status === 'date-requested' && cellProps.data.eventDateTimeStatus && cellProps.data.eventDateTimeStatus === 'reserved' ? (
          <small>
            <div className="d-flex">
              <a
                className="mr-1"
                href={`https://www.teamclass.com/booking/select-date-time/${cellProps.data._id}`}
                target={'_blank'}
                title={'Select date and time link'}
              >
                <Avatar color="light-primary" size="sm" icon={<Calendar />} />
              </a>
              <a
                className="mr-1"
                href={`https://www.teamclass.com/booking/date-time-confirmation/${cellProps.data._id}`}
                target={'_blank'}
                title={'Approve/Reject link'}
              >
                <Avatar color="light-primary" size="sm" icon={<Check />} />
              </a>
              <a className="mr-1" onClick={() => handleEdit(cellProps.data._id)} target={'_blank'} title={'Time / Attendees / Invoice Builder'}>
                <Avatar color="light-dark" size="sm" icon={<Edit2 />} />
              </a>
            </div>
          </small>
        ) : cellProps.data.status === 'date-requested' && cellProps.data.eventDateTimeStatus && cellProps.data.eventDateTimeStatus === 'confirmed' ? (
          <small>
            <div className="d-flex">
              <a
                className="mr-1"
                href={`https://www.teamclass.com/booking/select-date-time/${cellProps.data._id}`}
                target={'_blank'}
                title={'Select date and time link'}
              >
                <Avatar color="light-primary" size="sm" icon={<Calendar />} />
              </a>
              <a
                className="mr-1"
                href={`https://www.teamclass.com/booking/event-confirmation/${cellProps.data._id}`}
                target={'_blank'}
                title={'Deposit link'}
              >
                <Avatar color="light-primary" size="sm" icon={<DollarSign />} />
              </a>
              <a className="mr-1" onClick={() => handleEdit(cellProps.data._id)} target={'_blank'} title={'Time / Attendees / Invoice Builder'}>
                <Avatar color="light-dark" size="sm" icon={<Edit2 />} />
              </a>
            </div>
          </small>
        ) : cellProps.data.status === 'date-requested' && cellProps.data.eventDateTimeStatus && cellProps.data.eventDateTimeStatus === 'rejected' ? (
          <small>
            <div className="d-flex">
              <a
                className="mr-1"
                href={`https://www.teamclass.com/booking/select-date-time/${cellProps.data._id}`}
                target={'_blank'}
                title={'Select date and time link'}
              >
                <Avatar color="light-primary" size="sm" icon={<Calendar />} />
              </a>
              <a className="mr-1" onClick={() => handleEdit(cellProps.data._id)} title={'Time / Attendees / Invoice Builder'}>
                <Avatar color="light-dark" size="sm" icon={<Edit2 />} />
              </a>
            </div>
          </small>
        ) : cellProps.data.status === 'confirmed' ? (
          <small>
            <div className="d-flex">
              <a
                className="mr-1"
                href={`https://www.teamclass.com/booking/select-date-time/${cellProps.data._id}`}
                target={'_blank'}
                title={'Select date and time link'}
              >
                <Avatar color="light-primary" size="sm" icon={<Calendar />} />
              </a>
              <a className="mr-1" href={`https://www.teamclass.com/event/${cellProps.data._id}`} target={'_blank'} title={'Sign-up link'}>
                <Avatar color="light-primary" size="sm" icon={<User />} />
              </a>
              <a className="mr-1" href={`https://www.teamclass.com/signUpStatus/${cellProps.data._id}`} target={'_blank'} title={'Sign-up status'}>
                <Avatar color="light-primary" size="sm" icon={<Users />} />
              </a>
              <a
                className="mr-1"
                href={`https://www.teamclass.com/booking/payment/${cellProps.data._id}`}
                target={'_blank'}
                title={'Final payment link'}
              >
                <Avatar color="secondary" size="sm" icon={<DollarSign />} />
              </a>
              <a className="mr-1" onClick={() => handleEdit(cellProps.data._id)} target={'_blank'} title={'Time / Attendees / Invoice Builder'}>
                <Avatar color="light-dark" size="sm" icon={<Edit2 />} />
              </a>
            </div>
          </small>
        ) : (
          cellProps.data.status === 'paid' && (
            <small>
              <div className="d-flex">
                <a
                  className="mr-1"
                  href={`https://www.teamclass.com/booking/select-date-time/${cellProps.data._id}`}
                  target={'_blank'}
                  title={'Select date and time link'}
                >
                  <Avatar color="light-primary" size="sm" icon={<Calendar />} />
                </a>
                <a className="mr-1" href={`https://www.teamclass.com/event/${cellProps.data._id}`} target={'_blank'} title={'Sign-up link'}>
                  <Avatar color="light-primary" size="sm" icon={<User />} />
                </a>
                <a className="mr-1" href={`https://www.teamclass.com/signUpStatus/${cellProps.data._id}`} target={'_blank'} title={'Sign-up status'}>
                  <Avatar color="light-primary" size="sm" icon={<Users />} />
                </a>
                <a
                  className="mr-1"
                  href={`https://www.teamclass.com/booking/payment/${cellProps.data._id}`}
                  target={'_blank'}
                  title={'Final payment link'}
                >
                  <Avatar color="secondary" size="sm" icon={<DollarSign />} />
                </a>
                <a className="mr-1" onClick={() => handleEdit(cellProps.data._id)} target={'_blank'} title={'Time / Attendees / Invoice Builder'}>
                  <Avatar color="light-dark" size="sm" icon={<Edit2 />} />
                </a>
              </div>
            </small>
          )
        );
      }
    }
  }
];

export default columns;
