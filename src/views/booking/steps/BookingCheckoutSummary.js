import React, { useState } from 'react';
import { Card, CardBody, CardFooter, FormText, Media, Badge, Row, Col, CardHeader } from 'reactstrap';
import {
  BOOKING_DATE_REQUESTED_STATUS,
  BOOKING_PAID_STATUS,
  CREDIT_CARD_FEE,
  DATE_AND_TIME_CONFIRMATION_STATUS,
  DATE_AND_TIME_RESERVED_STATUS,
  DEFAULT_TIME_ZONE_LABEL,
  DEFAULT_TIME_ZONE_LABEL_DESCRIPTION
} from '../../../utility/Constants';

import moment from 'moment';
import { capitalizeString } from '../../../utility/Utils';
import StatusSelector from '../TableBookings/StatusSelector';

const BookingCheckoutSummary = ({
  teamClass,
  bookingInfo,
  requestEventDate,
  calendarEvent,
  totalWithoutFee,
  totalAddons,
  totalServiceFee,
  totalCardFee,
  tax,
  totalTax,
  discount = 0,
  totalDiscount = 0,
  total,
  deposit,
  finalPayment,
  showFinalPaymentLine,
  attendeesToInvoice
}) => {
  return (
    <div>
      <Card>
        <CardHeader>
          <h4 className="text-center">
            {teamClass.title}
            <br />
            <br />
            <Badge className="booking-checkout-summary-priceBadge">
              ${bookingInfo.classVariant && bookingInfo.classVariant.pricePerson} /{' '}
              {bookingInfo.classVariant && bookingInfo.classVariant.groupEvent ? 'group' : 'person'}
            </Badge>
          </h4>
        </CardHeader>
        <CardBody className="p-0">
          <div className="text-block pb-1 pt-1 pl-2 pr-2 booking-checkout-summary-imageBox">
            <Media className="align-items-center">
              <img
                src={
                  teamClass.catalogImage && teamClass.catalogImage.indexOf('https:') !== -1
                    ? teamClass.catalogImage
                    : `/content/img/photo/listing/${teamClass.catalogImage}`
                }
                width={100}
                height={67}
                layout="fixed"
                alt=""
                className="rounded"
                sizes="(max-width: 576px) 100vw, 530px"
              />
              <Media body>
                <Row>
                  <Col>
                    <p className="text-sm mb-0 text-black ml-4">
                      <strong>{bookingInfo.classVariant && bookingInfo.classVariant.title}</strong>
                    </p>
                    <p className="text-muted text-xs mb-0 ml-4">{bookingInfo.eventDurationHours * 60} Minutes</p>
                    <p className="text-muted text-sm mb-0 ml-4">
                      {bookingInfo.classVariant && bookingInfo.classVariant.hasKit && (
                        <Badge className="booking-checkout-summary-kit-tag">
                          <i className="fa fa-gift text-primary"></i>
                          <span className="text-primary name"> Kit included </span>
                        </Badge>
                      )}
                    </p>
                  </Col>
                </Row>
              </Media>
            </Media>
          </div>
          <div className="text-block py-1">
            <h6 className="mb-0 text-black ml-2 booking-checkout-summary-subTitle">
              {`Booking status `}{' '}
              <Badge color="secondary" className="text-xs booking-checkout-summary-date-status ml-1">
                <StatusSelector row={bookingInfo} calendarEvent={calendarEvent} />
              </Badge>
            </h6>
            <ul className="list-unstyled mb-0">
              <li className="mb-0 ml-2 mr-2">
                {requestEventDate && (
                  <table className="w-100">
                    <tbody>
                      <tr>
                        <th className="font-weight-normal pt-1">
                          <span> {`${moment(requestEventDate.fullEventDate).format('LL')}`}</span>
                        </th>
                        <td className="text-right pt-2">
                          <span>
                            {' '}
                            {`${moment(requestEventDate.fullEventDate).format('hh:mm ')}`}
                            <Badge color="primary text-uppercase">{`${moment(requestEventDate.fullEventDate).format('a ')}`}</Badge>
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <th className="font-weight-normal"></th>
                        <td className="text-right text-xs text-muted">
                          <span>
                            {DEFAULT_TIME_ZONE_LABEL_DESCRIPTION} ({DEFAULT_TIME_ZONE_LABEL})
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )}
                {!requestEventDate && (
                  <Row>
                    <Col>
                      {' '}
                      <span>TBD</span>
                    </Col>
                  </Row>
                )}
              </li>
            </ul>
          </div>
        </CardBody>
        <CardFooter className="booking-summary-without-date-card-footer pb-1 pt-1 border-0">
          <h6 className="mb-0 text-black mb-1 booking-checkout-summary-subTitle">Order Summary </h6>
          <table className="w-100">
            <tbody>
              <tr>
                <th className="font-weight-normal pt-1">
                  ${bookingInfo.pricePerson} x
                  {` ${  attendeesToInvoice < bookingInfo.classMinimum ? bookingInfo.classMinimum : attendeesToInvoice  } `} attendees
                  {attendeesToInvoice < bookingInfo.classMinimum && <FormText color="muted">Under {bookingInfo.classMinimum} group fee</FormText>}
                </th>
                <td className="text-right pt-1">${totalWithoutFee}</td>
              </tr>
              {totalAddons > 0 && (
                <tr>
                  <th className="font-weight-normal text-sm pt-1">Add-ons</th>
                  <td className="text-right pt-1 text-sm">${totalAddons}</td>
                </tr>
              )}
              {bookingInfo.invoiceDetails &&
                bookingInfo.invoiceDetails.length > 2 &&
                bookingInfo.invoiceDetails.slice(2).map((additionalItem) => (
                  <tr key={additionalItem.item}>
                    <th className={`font-weight-normal text-sm pt-1 ${additionalItem.unitPrice < 0 ? 'text-danger' : ''}`}>
                      {additionalItem.item}
                      {additionalItem.units > 1 ? ` x ${additionalItem.units}` : ``}
                    </th>
                    <td className={`text-right pt-1 text-sm ${additionalItem.unitPrice < 0 ? 'text-danger' : ''}`}>
                      ${(additionalItem.unitPrice * additionalItem.units).toFixed(2)}
                    </td>
                  </tr>
                ))}
              {discount > 0 && totalDiscount > 0 && (
                <tr>
                  <th className="font-weight-normal text-sm pt-1 text-danger">Discount ({discount}%)</th>
                  <td className="text-right pt-1 text-sm text-danger">-${totalDiscount}</td>
                </tr>
              )}
              <tr>
                <th className="font-weight-normal text-sm pt-1">Booking fee ({bookingInfo.serviceFee * 100}%)</th>
                <td className="text-right pt-1 text-sm">${totalServiceFee}</td>
              </tr>
              {tax > 0 ? (
                <tr>
                  <th className="font-weight-normal text-sm pt-1">Sales Tax ({(tax * 100).toFixed(2)}%)</th>
                  <td className="text-right pt-1 text-sm">${totalTax}</td>
                </tr>
              ) : (
                <></>
              )}
              {totalCardFee > 0 && (
                <tr>
                  <th className="font-weight-normal text-sm pt-1">Card fee ({(CREDIT_CARD_FEE * 100).toFixed(2)}%)</th>
                  <td className="text-right pt-1 text-sm">${totalCardFee}</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="border-top">
                <th className="pt-1 text-lg">Total</th>
                <td className="text-right pt-1 text-lg">
                  <span className="font-weight-bold">${total}</span>
                </td>
              </tr>

              <tr className="border-top">
                <th className="pt-1">{`Deposit paid`}</th>
                <td className="text-right pt-1">
                  <span className="font-weight-bold">${deposit}</span>
                </td>
              </tr>

              {finalPayment && (showFinalPaymentLine || bookingInfo.status === BOOKING_PAID_STATUS) && (
                <tr className="border-top">
                  <th className="pt-1">{bookingInfo.status === BOOKING_PAID_STATUS ? `Final payment` : `Outstanding Balance`} </th>
                  <td className="text-right pt-1">
                    <span className="font-weight-bold">${finalPayment}</span>
                  </td>
                </tr>
              )}
            </tfoot>
          </table>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BookingCheckoutSummary;
