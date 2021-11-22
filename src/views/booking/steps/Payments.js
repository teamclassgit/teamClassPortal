import React, { useState } from 'react';
import { Badge, Button, Card, Col, Modal, ModalHeader, ModalFooter, Row, Table } from 'reactstrap';
import { useMutation } from '@apollo/client';
import mutationUpdateBookingPayments from '../../../graphql/MutationUpdateBookingPayments';
import moment from 'moment';
import AddPaymentModal from './AddPaymentModal';
import { Edit, Plus, X, XSquare } from 'react-feather';
import { capitalizeString } from '../../../utility/Utils';
import {
  BOOKING_CLOSED_STATUS,
  BOOKING_DATE_REQUESTED_STATUS,
  BOOKING_DEPOSIT_CONFIRMATION_STATUS,
  BOOKING_PAID_STATUS,
  BOOKING_QUOTE_STATUS,
  CHARGE_OUTSIDE_SYSTEM,
  PAYMENT_STATUS_CANCELED,
  PAYMENT_STATUS_SUCCEEDED
} from '../../../utility/Constants';

const Payments = ({ booking, setBooking, calendarEvent }) => {
  const [currentPayment, setCurrentPayment] = useState(null);
  const [processing, setProcessing] = React.useState(false);
  const [clickedConvert, setClickedConvert] = React.useState(false);
  const [payments, setPayments] = React.useState([]);
  const [modal, setModal] = useState(false);
  const [mode, setMode] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [indexPayment, setIndexPayment] = useState(null);
  const [updateBooking] = useMutation(mutationUpdateBookingPayments, {});

  // ** Function to handle Modal toggle
  const handleModal = () => setModal(!modal);

  React.useEffect(() => {
    if (booking && booking.payments) {
      const orderedPayments = [...booking.payments];
      orderedPayments.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
      setPayments(orderedPayments);
    } else {
      setPayments([]);
    }
  }, [booking]);

  // ** Custom close btn
  const CloseBtn = <X className="cursor-pointer" size={15} onClick={() => setDeleteModal(!deleteModal)} />;

  const convertFinalPaymentToDeposit = async (payment) => {
    setProcessing(true);

    const newPayment = { ...payment };
    newPayment.paymentName = 'deposit';
    const newPaymentsList = payments.filter((element) => element.paymentName !== 'final');
    newPaymentsList.push(newPayment);

    try {
      const result = await updateBooking({
        variables: {
          bookingId: booking._id,
          payments: newPaymentsList,
          status: BOOKING_DEPOSIT_CONFIRMATION_STATUS,
          updatedAt: new Date()
        }
      });

      if (result && result.data && result.data.updateOneBooking) {
        setPayments(newPaymentsList);
        setBooking(result.data.updateOneBooking);
      }
    } catch (ex) {
      console.log(ex);
    }

    setClickedConvert(false);
    setProcessing(false);
  };

  const cancelPayment = async () => {
    const newPaymentsArray = [...payments];
    payments[indexPayment].status = PAYMENT_STATUS_CANCELED;

    const finalPayment = newPaymentsArray && newPaymentsArray.find((element) => element.paymentName === 'final' && element.status === 'succeeded');
    const depositPayment =
      newPaymentsArray && newPaymentsArray.find((element) => element.paymentName === 'deposit' && element.status === 'succeeded');

    const newBookingStatus = finalPayment
      ? BOOKING_PAID_STATUS
      : depositPayment
        ? BOOKING_DEPOSIT_CONFIRMATION_STATUS
        : calendarEvent
          ? BOOKING_DATE_REQUESTED_STATUS
          : BOOKING_QUOTE_STATUS;

    try {
      const result = await updateBooking({
        variables: {
          bookingId: booking._id,
          updatedAt: new Date(),
          payments: newPaymentsArray,
          status: newBookingStatus
        }
      });
      if (result && result.data && result.data.updateOneBooking) {
        setPayments(newPaymentsList);
        setBooking(result.data.updateOneBooking);
      }
    } catch (er) {
      console.log(er);
    }
  };

  return (
    <>
      {booking && booking.status !== BOOKING_CLOSED_STATUS && (
        <div className="d-flex justify-content-end mb-2">
          <Button
            size="sm"
            color="primary"
            onClick={(e) => {
              setMode('add');
              const newPay = {
                name: '',
                email: '',
                phone: '',
                amount: '',
                cardBrand: '',
                cardLast4: '',
                createdAt: '',
                paymentName: '',
                paymentMethod: '',
                paymentId: '',
                chargeUrl: '',
                status: ''
              };
              setCurrentPayment(newPay);
              handleModal();
            }}
          >
            <Plus size={15} />
            <span className="align-middle ml-50">Add Payment</span>
          </Button>
        </div>
      )}
      <Row>
        <Col lg={12}>
          <Card className="card-transaction">
            <Table responsive>
              <thead>
                <tr>
                  <th>
                    <div align="left">Date</div>
                  </th>
                  <th>
                    <div align="left">Type</div>
                  </th>
                  <th>
                    <div align="left">Method</div>
                  </th>
                  <th>
                    <div align="right">Amount</div>
                  </th>
                  <th>
                    <div align="center">Type</div>
                  </th>
                  <th>
                    <div align="center">Status</div>
                  </th>
                  <th>
                    <div align="center">Actions</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments &&
                  payments.map((element, index) => (
                    <tr key={index}>
                      <td align="left">
                        <div className="transaction-item">
                          {moment(element.createdAt).calendar(null, {
                            lastDay: '[Yesterday]',
                            sameDay: 'LT',
                            lastWeek: 'dddd',
                            sameElse: 'MMMM Do, YYYY'
                          })}
                        </div>
                      </td>
                      <td align="left">
                        <div className={`text-default'}`}>
                          {capitalizeString(element.paymentName)}
                          {booking && booking.status !== BOOKING_CLOSED_STATUS && <span>
                            {processing && (
                              <small>
                                <br />
                                <span>Converting...</span>
                              </small>
                            )}
                            {!processing && element.paymentName === 'final' && element.status === PAYMENT_STATUS_SUCCEEDED ? (
                              !clickedConvert ? (
                                <small>
                                  <br />
                                  <a
                                    href="#"
                                    title="Convert this payment to deposit will move this booking to deposit-paid status"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setClickedConvert(true);
                                    }}
                                  >
                                    Convert to deposit
                                  </a>
                                </small>
                              ) : (
                                <div>
                                  <p className="mt-1">
                                    <small className="text text-danger text-justify">Are you sure to convert this payment to deposit?</small>
                                  </p>
                                  <small className="ml-1">
                                    <div className="d-flex justify-content-start">
                                      <a
                                        className="btn btn-primary btn-sm"
                                        href="#"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          convertFinalPaymentToDeposit(element);
                                        }}
                                      >
                                        Yes
                                      </a>{' '}
                                      <a
                                        className="btn btn-secondary btn-sm"
                                        href="#"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          setClickedConvert(false);
                                        }}
                                      >
                                        No
                                      </a>
                                    </div>
                                  </small>
                                  <br />
                                  <small className="ml-2"></small>
                                </div>
                              )
                            ) : (
                              <></>
                            )}
                          </span>}
                        </div>
                      </td>
                      <td align="left">
                        <div className={`text-default'}`}>
                          {element.cardBrand ? (
                            <span>
                              {capitalizeString(element.cardBrand)} {element.cardLast4}
                            </span>
                          ) : (
                            <span>{capitalizeString(element.paymentMethod)}</span>
                          )}
                        </div>
                      </td>
                      <td align="right">
                        <div className={`font-weight-bolder text-default'}`}>
                          <span>${element.amount / 100}</span>
                        </div>
                      </td>
                      <td align="center">
                        <div className={` text-default`}>
                          <span>{element.chargeUrl === CHARGE_OUTSIDE_SYSTEM ? 'Manual' : 'Automated'}</span>
                        </div>
                      </td>
                      <td align="center">
                        <div className={`text-default'}`}>
                          <Badge color={element.status === 'succeeded' ? 'primary' : 'secondary'}>{capitalizeString(element.status)}</Badge>
                        </div>
                      </td>
                      <td align="center">
                        {booking &&
                          booking.status !== BOOKING_CLOSED_STATUS &&
                          element.chargeUrl === CHARGE_OUTSIDE_SYSTEM &&
                          element.status === PAYMENT_STATUS_SUCCEEDED && (
                          <div align="center">
                            <a
                              className="mr-1"
                              onClick={(e) => {
                                e.preventDefault();
                                setIndexPayment(index);
                                setDeleteModal(!deleteModal);
                              }}
                              href="#"
                              title="Cancel payment"
                            >
                              <XSquare size={18} />
                            </a>
                            <a
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPayment({ ...element, index });
                                setMode('edit');
                                handleModal();
                              }}
                              href="#"
                              title="Edit payment"
                            >
                              <Edit size={18} title="Edit" />
                            </a>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>
      {(!payments || payments.length === 0) && (
        <div align="center">
          <p className="text-lg text-default">This booking has not received any payment.</p>
        </div>
      )}
      <AddPaymentModal
        open={modal}
        handleModal={handleModal}
        mode={mode}
        setBooking={setBooking}
        booking={booking}
        payments={payments}
        setPayments={setPayments}
        currentPayment={currentPayment}
        setCurrentPayment={setCurrentPayment}
      />
      <Modal
        isOpen={deleteModal}
        toggle={() => {
          setDeleteModal(!deleteModal);
        }}
        backdrop={false}
        className="modal-dialog-centered border-0"
      >
        <ModalHeader toggle={() => setDeleteModal(!deleteModal)} close={CloseBtn}>
          Cancel payment?
        </ModalHeader>
        <ModalFooter className="justify-content-center">
          <Button
            color="secondary"
            onClick={(e) => {
              e.preventDefault();
              setDeleteModal(!deleteModal);
            }}
            size="sm"
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={(e) => {
              e.preventDefault();
              cancelPayment();
              setDeleteModal(!deleteModal);
            }}
            size="sm"
          >
            Confirm
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Payments;
