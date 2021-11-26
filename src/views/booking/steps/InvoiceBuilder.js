import React, { Fragment } from 'react';
import NumberInput from '@components/number-input';
import { DollarSign, MinusCircle, PlusCircle } from 'react-feather';
import { BOOKING_CLOSED_STATUS, BOOKING_PAID_STATUS, SALES_TAX, SALES_TAX_STATE } from '../../../utility/Constants';
import { Input, Button, Card, Col, Row, Table, CardLink, CustomInput, CardText } from 'reactstrap';
import { useMutation } from '@apollo/client';
import mutationUpdateBookingInvoiceDetails from '../../../graphql/MutationUpdateBookingInvoiceDetails';
import Avatar from '@components/avatar';

const InvoiceBuilder = ({ stepper, type, teamClass, realCountAttendees, booking, setBooking }) => {
  const defaultInvoiceItems = [
    {
      item: 'Initial Deposit',
      unitPrice: 0,
      units: 1,
      priceEditable: true,
      unitsEditable: false,
      taxable: true,
      readOnly: true
    },
    {
      item: 'Class / Attendees',
      unitPrice: 0,
      units: 1,
      priceEditable: false,
      unitsEditable: true,
      taxable: true,
      readOnly: true
    }
  ];

  const [processing, setProcessing] = React.useState(false);
  const [taxExempt, setTaxExempt] = React.useState(false);
  const [formValid, setFormValid] = React.useState(true);
  const [invoiceItems, setInvoiceItems] = React.useState([]);
  const [discount, setDiscount] = React.useState(0);
  const [hasFinalPayment, setHasFinalPayment] = React.useState(false);
  const [updateBooking, { ...updateBookingResult }] = useMutation(mutationUpdateBookingInvoiceDetails, {});

  React.useEffect(() => {
    if (booking && booking.invoiceDetails) {
      setInvoiceItems(
        booking.invoiceDetails.map(({ ...element }) => {
          return {
            ...element
          };
        })
      );
      const currentDiscount = booking.discount > 0 ? booking.discount * 100 : 0;
      setDiscount(currentDiscount);
    } else if (booking) {
      const depositsPaid =
        booking && booking.payments && booking.payments.filter((element) => element.paymentName === 'deposit' && element.status === 'succeeded');

      if (depositsPaid && depositsPaid.length > 0) {
        const depositAmountPaid = depositsPaid.reduce((previous, current) => previous + current.amount, 0);
        defaultInvoiceItems[0].unitPrice = depositAmountPaid / 100;
      }

      const minimum = booking.classVariant ? booking.classVariant.minimum : booking.classMinimum;
      //pricePerson is currently in use for group based pricing too
      const price = booking.classVariant ? booking.classVariant.pricePerson : booking.pricePerson;
      const attendees = realCountAttendees > booking.attendees ? realCountAttendees : booking.attendees;

      defaultInvoiceItems[1].unitPrice = price;
      defaultInvoiceItems[1].units = attendees > minimum ? attendees : minimum;

      setInvoiceItems(defaultInvoiceItems);
    }

    const finalPaymentPaid =
      booking && booking.payments && booking.payments.find((element) => element.paymentName === 'final' && element.status === 'succeeded');

    setHasFinalPayment(finalPaymentPaid ? true : false);
    setTaxExempt(booking && booking.taxExempt ? true : false);
  }, [booking]);

  React.useEffect(() => {
    if (invoiceItems) {
      let i = 0;
      let valid = true;
      while (i < invoiceItems.length && valid) {
        const current = invoiceItems[i++];
        valid = current.item && current.item.length > 0 && !isNaN(current.unitPrice) && current.units > 0;
      }

      setFormValid(valid);
    }
  }, [invoiceItems]);

  const addNewInvoiceItem = () => {
    const newInvoiceItems = [...invoiceItems];
    newInvoiceItems.push({
      item: '',
      unitPrice: 0,
      units: 1,
      priceEditable: true,
      unitsEditable: true,
      taxable: false,
      readOnly: false
    });

    setInvoiceItems(newInvoiceItems);
  };

  const removeInvoiceItem = (index) => {
    const newInvoiceItems = invoiceItems.filter((element, i) => index !== i);
    setInvoiceItems(newInvoiceItems);
  };

  const saveInvoiceDetails = async () => {
    setProcessing(true);

    try {
      const result = await updateBooking({
        variables: {
          bookingId: booking._id,
          invoiceDetails: invoiceItems,
          discount: discount / 100,
          taxExempt,
          salesTax: taxExempt ? 0 : booking.salesTax > 0 ? booking.salesTax : SALES_TAX,
          salesTaxState: taxExempt ? '' : booking.salesTax > 0 && booking.salesTaxState ? booking.salesTaxState : SALES_TAX_STATE,
          updatedAt: new Date()
        }
      });

      if (result && result.data && result.data.updateOneBooking) {
        setBooking(result.data.updateOneBooking);
      }

      console.log('booking updated');

      setProcessing(false);
    } catch (ex) {
      console.log(ex);
      setProcessing(false);
    }
  };

  return (
    <Fragment>
      <Row>
        <Col lg={12}>
          <div align="right" className="pb-2">
            <CustomInput
              type="switch"
              id="taxExempt"
              onClick={(e) => {
                setTaxExempt(e.target.checked);
              }}
              checked={taxExempt}
              className="custom-control-secondary"
              label="Tax Exempt?"
              name="taxExempt"
              inline
            />
          </div>
          <Card className="card-transaction">
            <Table responsive>
              <thead>
                <tr>
                  <th>
                    <div align="center">Item / Detail</div>
                  </th>
                  <th>
                    <div align="center">Price ($)</div>
                  </th>
                  <th>
                    <div align="center">UNITS</div>
                  </th>
                  <th>
                    <div align="center">
                      Taxable
                      <br />
                      <small>
                        {taxExempt || !booking.salesTaxState ? '' : `(${booking.salesTaxState}, ${(booking.salesTax * 100).toFixed(2)}%)`}
                      </small>
                    </div>
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {invoiceItems.map((element, index) => (
                  <tr key={index}>
                    <td>
                      <div className="transaction-item">
                        <Input
                          type="text"
                          bsSize="sm"
                          disabled={element.readOnly}
                          value={element.item}
                          onChange={(e) => {
                            element.item = e.target.value;
                            const newInvoiceItems = [...invoiceItems];
                            newInvoiceItems.splice(index, 1, element);
                            setInvoiceItems(newInvoiceItems);
                          }}
                        ></Input>
                      </div>
                    </td>
                    <td align="right">
                      <div className={`font-weight-bolder ${element.down ? 'text-danger' : 'text-default'}`}>
                        <Input
                          type="number"
                          required={true}
                          bsSize="sm"
                          disabled={!element.priceEditable}
                          value={element.unitPrice}
                          onChange={(e) => {
                            element.unitPrice = e.target.value;
                            const newInvoiceItems = [...invoiceItems];
                            newInvoiceItems.splice(index, 1, element);
                            setInvoiceItems(newInvoiceItems);
                          }}
                        ></Input>
                      </div>
                    </td>
                    <td align="center">
                      <NumberInput
                        min={1}
                        max={10000}
                        value={element.units}
                        size="sm"
                        className="w-50"
                        disabled={!element.unitsEditable}
                        required={true}
                        onChange={(newValue) => {
                          element.units = newValue;
                          const newInvoiceItems = [...invoiceItems];
                          newInvoiceItems.splice(index, 1, element);
                          setInvoiceItems(newInvoiceItems);
                        }}
                      />
                    </td>
                    <td align="center">
                      <CustomInput
                        inline
                        id={`taxable-${index}`}
                        type="checkbox"
                        checked={!taxExempt && element.taxable}
                        disabled={element.readOnly || taxExempt}
                        onChange={(e) => {
                          element.taxable = e.target.checked;
                          const newInvoiceItems = [...invoiceItems];
                          newInvoiceItems.splice(index, 1, element);
                          setInvoiceItems(newInvoiceItems);
                        }}
                        className="custom-control-secondary"
                      />
                    </td>

                    <td align="center">
                      {booking && booking.status !== BOOKING_CLOSED_STATUS && (
                        <div className="d-flex">
                          {element && !element.readOnly && (
                            <a
                              onClick={(e) => {
                                e.preventDefault();
                                removeInvoiceItem(index);
                              }}
                              href="#"
                              title="Remove current line"
                            >
                              <MinusCircle size={20} />
                            </a>
                          )}
                          {index === invoiceItems.length - 1 && (
                            <a
                              onClick={(e) => {
                                e.preventDefault();
                                addNewInvoiceItem();
                              }}
                              href="#"
                              title="Add line below"
                            >
                              <PlusCircle size={20} />
                            </a>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Table>
              <thead>
                <tr>
                  <th width="70%"></th>
                  <th width="30%">
                    <div align="center">
                      <CardText className="mb-0">Discount (%)</CardText>
                      <NumberInput
                        min={0}
                        max={100}
                        value={booking.discount > 0 ? booking.discount * 100 : 0}
                        size="sm"
                        className="w-50"
                        required={true}
                        onChange={(newValue) => {
                          setDiscount(newValue);
                        }}
                      />
                    </div>
                  </th>
                </tr>
              </thead>
            </Table>
          </Card>
        </Col>
      </Row>

      {booking && booking.status !== BOOKING_CLOSED_STATUS && (
        <div className="d-flex justify-content-between">
          <span>
            <CardLink href={`https://www.teamclass.com/booking/payment/${booking._id}`} target={'_blank'} title={'Final payment link'}>
              <Avatar color="secondary" size="sm" icon={<DollarSign size={18} />} /> <small>Final payment link</small>
            </CardLink>
          </span>
          <Button.Ripple
            size="sm"
            disabled={booking.status === BOOKING_PAID_STATUS || !formValid || hasFinalPayment}
            color="primary"
            className="btn-next"
            onClick={() => saveInvoiceDetails()}
          >
            <span className="align-middle d-sm-inline-block d-none">{processing ? 'Saving...' : 'Save'}</span>
          </Button.Ripple>
        </div>
      )}
    </Fragment>
  );
};

export default InvoiceBuilder;
