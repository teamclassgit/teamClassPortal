// @packages
import { Fragment, useEffect, useState } from 'react';
import { Alert, Button, Card, CardBody, Col, Input, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter, Row } from 'reactstrap';
import { Icon } from '@iconify/react';
import { useMutation } from '@apollo/client';
import moment from 'moment';

// @scripts
import mutationUpdateBookingInvoiceInstructor from '../../../graphql/MutationUpdateBookingInvoiceInstructor';
import DropZone from '../../../@core/components/drop-zone';
import { getEventFullDate, uploadFile } from '../../../utility/Utils';

// @styles
import './partners-invoice.scss';

const PartnersInvoice = ({ booking, calendarEvent }) => {
  const [totalInvoice, setTotalInvoice] = useState(0);
  const [isRejected, setIsRejected] = useState(false);
  const [invoiceInstructorStatus, setInvoiceInstructorStatus] = useState(booking.instructorInvoice && booking.instructorInvoice.status);
  const [rejectedReasons, setRejectedReasons] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [showPayInvoiceButton, setShowPayInvoiceButton] = useState(
    booking.instructorInvoice && booking.instructorInvoice.status === 'approved' ? true : false
  );
  const [showModal, setShowModal] = useState(false);
  const [isStripeOption, setIsStripeOption] = useState(true);
  const [isOtherOption, setIsOtherOption] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [previewArr, setPreviewArr] = useState([]);
  const [fileUrl, setFileUrl] = useState(null);
  const [updateBookingInvoiceInstructor] = useMutation(mutationUpdateBookingInvoiceInstructor, {});

  const calendarEventDate = moment(getEventFullDate(calendarEvent)).format('LL');

  useEffect(() => {
    if (booking.instructorInvoice) {
      setTotalInvoice(
        booking.instructorInvoice.invoiceItems.reduce((acc, curr) => {
          if (curr.price !== undefined && curr.units !== undefined) {
            return acc + curr.price * curr.units;
          }
          return acc;
        }, 0)
      );
    }
  }, [booking]);

  const handleSaveInfo = async () => {
    setProcessing(true);
    let newStatus = '';
    if (isPaid) {
      newStatus = 'paid';
      setInvoiceInstructorStatus('paid');
    } else if (!isRejected && !isPaid) {
      newStatus = 'approved';
      setInvoiceInstructorStatus('approved');
      setRejectedReasons('');
    } else {
      newStatus = 'rejected';
      setInvoiceInstructorStatus('rejected');
    }

    try {
      await updateBookingInvoiceInstructor({
        variables: {
          bookingId: booking._id,
          createdAt: booking.instructorInvoice.createdAt,
          invoiceItems: booking.instructorInvoice.invoiceItems,
          notes: booking.instructorInvoice.notes,
          rejectedReasons,
          status: newStatus,
          updatedAt: new Date()
        }
      });
    } catch (ex) {
      setError(ex);
    }
    setProcessing(false);
  };

  const updateImages = async () => {
    let result = '';
    for (let i = 0; i < previewArr.length; i++) {
      result = await uploadFile(previewArr[i].successful[0].data);
      if (result.error) {
        throw new Error(result.error);
      } else {
        setFileUrl(result.url);
      }
    }
    return result;
  };

  // console.log('isPaid', isPaid);
  // console.log(updateImages);

  // // console.log('booking.instructorInvoice', booking.instructorInvoice);
  // // console.log('invoiceInstructorStatus', invoiceInstructorStatus);
  console.log('invoiceInstructorStatus', invoiceInstructorStatus);

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
              <a>{calendarEventDate}</a>
            </div>
          </Col>
          <Col lg={3}>
            <span className="title">Invoice Status</span>
            <div>
              <a>{invoiceInstructorStatus}</a>
            </div>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <div className="divider" />
          </Col>
        </Row>
      </div>
      <div>
        <div className="card-container">
          <Row>
            <Col lg={4}>
              <div className="event-confirmation-container">
                <Card>
                  <CardBody>
                    <span className="d-flex justify-content-center">
                      <Icon className="mb-1 event-confirmed-icon" fontSize={30} icon="akar-icons:circle-check" />
                    </span>
                    <h2 className="text-center mt-2 mb-2 font-weight-bold">Event Confirmed</h2>
                    <p className="text-justify mb-2">Please confirm heacount, class price, and any additional charges.</p>
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
              {booking.instructorInvoice &&
                booking.instructorInvoice.invoiceItems.map((invoice) => {
                  return (
                    <Row className="mb-1">
                      <Col lg={5}>
                        <Input
                          type="text"
                          name="description"
                          id="description"
                          disabled
                          placeholder="Item / Description"
                          value={invoice.description}
                        />
                      </Col>
                      <Col lg={2}>
                        <Input type="number" name="price" id="price" disabled placeholder="Price" value={invoice.price} />
                      </Col>
                      <Col lg={2}>
                        <Input type="number" name="units" id="units" disabled placeholder="Unit" value={invoice.units} />
                      </Col>
                      <Col lg={3} className="d-flex justify-content-center pop-up-target-total-row">
                        <span>{`$${invoice.price * invoice.units}`}</span>
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

              {!isRejected && !showPayInvoiceButton ? (
                <Row>
                  <Col lg={12}>
                    {invoiceInstructorStatus !== 'paid' ? (
                      <div className="button-container d-flex justify-content-end mt-2">
                        {invoiceInstructorStatus !== 'rejected' && (
                          <Button
                            className="mr-2"
                            onClick={(e) => {
                              setIsRejected(true);
                            }}
                          >
                            {'Reject'}
                          </Button>
                        )}
                        <Button
                          onClick={(e) => {
                            setIsRejected(false);
                            setShowPayInvoiceButton(true);
                            handleSaveInfo();
                          }}
                        >
                          {processing ? 'Saving' : 'Accept'}
                        </Button>
                      </div>
                    ) : (
                      <div className="d-flex justify-content-end mt-2">
                        <Alert>This invoice has been paid!</Alert>
                      </div>
                    )}
                  </Col>
                </Row>
              ) : (
                showPayInvoiceButton && (
                  <Row>
                    <Col lg={12}>
                      <div className="d-flex justify-content-end mt-2">
                        <Button
                          color="primary"
                          onClick={(e) => {
                            setShowModal(!showModal);
                            setIsPaid(true);
                          }}
                        >
                          Pay Invoice
                        </Button>
                      </div>
                    </Col>
                  </Row>
                )
              )}

              {isRejected && (
                <Row className="mt-2">
                  <Col lg={12} className="mb-2">
                    <span>Rejected Reason*</span>
                  </Col>
                  <Col lg={12}>
                    <Input
                      type="textarea"
                      name="rejectedReasons"
                      maxLength={1000}
                      className="textarea-fit-content"
                      id="rejectedReasons"
                      placeholder=""
                      onChange={(e) => setRejectedReasons(e.target.value)}
                    />
                  </Col>
                  <Col lg={12}>
                    <div className="d-flex justify-content-end mt-2">
                      <Button
                        className="small mr-2"
                        onClick={(e) => {
                          setIsRejected(true);
                          handleSaveInfo();
                        }}
                      >
                        {processing ? 'Saving' : 'Save'}
                      </Button>
                      <Button className="small" onClick={(e) => setIsRejected(false)}>
                        Cancel
                      </Button>
                    </div>
                  </Col>
                </Row>
              )}

              {invoiceInstructorStatus === 'rejected' && booking.instructorInvoice.rejectedReasons && (
                <Row className="mt-2">
                  <Col lg={12} className="mb-2">
                    <span>Rejected Reason: </span>
                    <span className="text-justify">{booking.instructorInvoice.rejectedReasons}</span>
                  </Col>
                </Row>
              )}
              <Row className="">
                <Col lg={12} className="">
                  {invoiceInstructorStatus === 'approved' && !isPaid && (
                    <Alert color="primary" className="mt-2">
                      This invoice has been approved
                    </Alert>
                  )}
                  {invoiceInstructorStatus === 'rejected' && (
                    <Alert color="warning" className="mt-2">
                      This invoice has been rejected
                    </Alert>
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <div>
          <div className="vertically-centered-modal">
            <Modal isOpen={showModal} toggle={() => setShowModal(!showModal)} className="modal-dialog-centered">
              <ModalHeader
                toggle={() => {
                  setShowModal(!showModal);
                  setIsPaid(false);
                }}
              >
                Pay Invoice
              </ModalHeader>
              <ModalBody>
                <FormGroup check inline>
                  <Label check>
                    <Input
                      type="radio"
                      name="ex1"
                      defaultChecked
                      onClick={(e) => {
                        setIsStripeOption(true);
                        setIsOtherOption(false);
                      }}
                    />{' '}
                    Stripe
                  </Label>
                </FormGroup>
                <FormGroup check inline>
                  <Label check>
                    <Input
                      type="radio"
                      name="ex1"
                      onClick={(e) => {
                        setIsOtherOption(true);
                        setIsStripeOption(false);
                      }}
                    />{' '}
                    Other
                  </Label>
                </FormGroup>
                {isStripeOption && (
                  <div className="d-flex justify-content-center mt-2">
                    <Button
                      onClick={(e) => {
                        handleSaveInfo();
                        setShowModal(!showModal);
                        setShowPayInvoiceButton(false);
                      }}
                    >
                      Submit Payment
                    </Button>
                  </div>
                )}

                {isOtherOption && (
                  <div>
                    <DropZone dropText={'Upload your files'} previewArr={previewArr} setPreviewArr={setPreviewArr} fileUrl={fileUrl} />
                    <div className="d-flex justify-content-center mt-2">
                      <Button
                        onClick={(e) => {
                          handleSaveInfo();
                          setShowModal(!showModal);
                          setShowPayInvoiceButton(false);
                          updateImages();
                        }}
                        disabled={previewArr && previewArr.length === 0}
                      >
                        Submit Payment
                      </Button>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                {isStripeOption && (
                  <div>
                    <span className="small">Pay invoice with stripe connection</span>
                  </div>
                )}

                {isOtherOption && (
                  <div>
                    <span className="small">Upload your proof of payment</span>
                  </div>
                )}
              </ModalFooter>
            </Modal>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default PartnersInvoice;
