// @packages
import { Fragment, useEffect, useState } from 'react';
import { Button, Card, CardBody, Col, Input, Row } from 'reactstrap';
import { Icon } from '@iconify/react';
import moment from 'moment';

// @styles
import './partners-invoice.scss';

const PartnersInvoice = ({ booking }) => {
  const [totalInvoice, setTotalInvoice] = useState(0);
  const [isRejected, setIsRejected] = useState(false);
  const [rejectedReasons, setRejectedReasons] = useState(null);

  useEffect(() => {
    setTotalInvoice(
      booking.invoiceDetails.reduce((acc, curr) => {
        if (curr.unitPrice !== undefined && curr.units !== undefined) {
          return acc + curr.unitPrice * curr.units;
        }
        return acc;
      }, 0)
    );
  }, [booking]);

  // console.log('booking', booking);
  // console.log('rejectedReasons', rejectedReasons);
  return (
    <Fragment>
      <div className="header-container">
        <Row>
          <Col lg={12}>
            <div className="divider" />
          </Col>
        </Row>
        <Row>
          <Col lg={3}>
            <span className="title">Instructor</span>
            <div>
              <a>{booking?.instructorName}</a>
            </div>
          </Col>
          <Col lg={3}>
            <span className="title">BookingId</span>
            <div className="booking-id-text">
              <a title={booking?._id}>{booking?._id}</a>
            </div>
          </Col>
          <Col lg={3}>
            <span className="title">Event Date</span>
            <div>
              <a>{moment(booking?.eventDate).format('MMM DD, YYYY')}</a>
            </div>
          </Col>
          <Col lg={3}>
            <span className="title">Invoice Status</span>
            <div>
              <a>{booking?.instructorInvoice?.status}</a>
            </div>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <div className="divider" />
          </Col>
        </Row>
      </div>
      <div className="card-container">
        <Row>
          <Col lg={4}>
            <div className="event-confirmation-container">
              <Card>
                <CardBody>
                  <span className="d-flex justify-content-center">
                    <Icon className="mb-1 event-confirmed-icon" fontSize={30} icon="akar-icons:circle-check" />
                  </span>
                  <h2 className="text-center mt-2 mb-3 font-weight-bold">Event Confirmed</h2>
                  <p className="text-justify mb-3">Please confirm heacount, class price, and any additional charges.</p>
                  <p className="text-justify">Click submit to confirm your invoice and collect the payment.</p>
                </CardBody>
              </Card>
            </div>
          </Col>
          <Col lg={8}>
            <Row>
              <Col lg={5} className="mb-2">
                <span>Item/Description</span>
              </Col>
              <Col lg={2} className="mb-2">
                <span>Price($)</span>
              </Col>
              <Col lg={2} className="mb-2">
                <span>Quantity</span>
              </Col>
              <Col lg={3} className="d-flex justify-content-center mb-2">
                <span>Total</span>
              </Col>
            </Row>
            {booking.invoiceDetails.map((invoiceDetail) => {
              return (
                <Row className="mb-1">
                  <Col lg={5}>
                    <Input
                      type="text"
                      name="description"
                      id="description"
                      disabled
                      placeholder="Item / Description"
                      value={invoiceDetail.item}
                      // onChange={(e) => handleChange(e, index)}
                    />
                  </Col>
                  <Col lg={2}>
                    <Input
                      type="number"
                      name="price"
                      id="price"
                      disabled
                      placeholder="Price"
                      value={invoiceDetail.unitPrice}
                      // onChange={(e) => handleChange(e, index)}
                    />
                  </Col>
                  <Col lg={2}>
                    <Input
                      type="number"
                      name="units"
                      id="units"
                      disabled
                      placeholder="Unit"
                      value={invoiceDetail.units}
                      // onChange={(e) => handleChange(e, index)}
                    />
                  </Col>
                  <Col lg={3} className="d-flex justify-content-center pop-up-target-total-row">
                    <span>{`$${invoiceDetail.unitPrice * invoiceDetail.units}`}</span>
                  </Col>
                </Row>
              );
            })}
            <Row>
              <Col lg={12} className="my-2">
                <span>Notes/comments (optional)</span>
              </Col>
              <Col lg={12}>
                <Input
                  type="textarea"
                  name="notes"
                  value={booking?.instructorInvoice?.notes}
                  disabled
                  // onChange={(e) => setNotes(e.target.value)}
                  maxLength={1000}
                  className="textarea-fit-content"
                  id="notes"
                  placeholder="Share notes/comments about your invoice"
                />
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <div className="mt-2 d-flex justify-content-end">
                  <span className="total-title">Total{'  '}</span>
                  <span className="total-value">{`$ ${totalInvoice}`}</span>
                </div>
              </Col>
            </Row>
            {!isRejected && (
              <Row>
                <Col lg={12}>
                  <div className="button-container d-flex justify-content-end mt-2">
                    <Button className="mr-2" onClick={(e) => setIsRejected(true)}>
                      Reject
                    </Button>
                    <Button>Accept</Button>
                  </div>
                </Col>
              </Row>
            )}
            {isRejected && (
              <Row className="mt-2">
                <Col lg={12} className="mb-2">
                  <span>Rejected Reasons*</span>
                </Col>
                <Col lg={12}>
                  <Input
                    type="textarea"
                    name="rejectedReasons"
                    value={booking?.instructorInvoice?.notes}
                    // onChange={(e) => setNotes(e.target.value)}
                    maxLength={1000}
                    className="textarea-fit-content"
                    id="rejectedReasons"
                    placeholder=""
                    onChange={(e) => setRejectedReasons(e.target.value)}
                  />
                </Col>
                <Col lg={12}>
                  <div className="d-flex justify-content-end mt-2">
                    <Button className="small mr-2">Save</Button>
                    <Button className="small" onClick={(e) => setIsRejected(false)}>
                      Cancel
                    </Button>
                  </div>
                </Col>
              </Row>
            )}
          </Col>
        </Row>
      </div>
    </Fragment>
  );
};

export default PartnersInvoice;
