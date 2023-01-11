// @packages
import { Fragment, useEffect, useState } from "react";
import { Alert, Button, Card, CardBody, Col, Input, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter, Row } from "reactstrap";
import { Icon } from "@iconify/react";
import { useMutation, useQuery } from "@apollo/client";
import moment from "moment";
import PropTypes from "prop-types";

// @scripts
import mutationUpdateBookingInvoiceInstructor from "@graphql/MutationUpdateBookingInvoiceInstructor";
import mutationPayEventToInstructor from "@graphql/MutationPayEventToInstructor";
import queryInstructorById from "@graphql/QueryInstructorById";
import DropZone from "@components/drop-zone";
import { uploadFile } from "@utility/Utils";
import { getEventFullDate } from "@services/CalendarEventService";

// @styles
import "./partners-invoice.scss";

const PartnersInvoice = ({ booking, calendarEvent }) => {
  const [totalInvoice, setTotalInvoice] = useState(0);
  const [isRejected, setIsRejected] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [invoiceInstructorStatus, setInvoiceInstructorStatus] = useState(null);
  const [rejectedReasons, setRejectedReasons] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [error, setError] = useState(null);
  const [showPayInvoiceButton, setShowPayInvoiceButton] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isStripeOption, setIsStripeOption] = useState(true);
  const [isOtherOption, setIsOtherOption] = useState(false);
  const [attachedFile, setAttachedFile] = useState([]);
  const [fileUrl, setFileUrl] = useState(null);
  const [isApprovedInvoice, setIsApprovedInvoice] = useState(false);
  const [isPaidWithStripe, setIsPaidWithStripe] = useState(false);
  const [instructorData, setInstructorData] = useState(null);

  const [updateBookingInvoiceInstructor] = useMutation(mutationUpdateBookingInvoiceInstructor, {});
  const [payEventToInstructor] = useMutation(mutationPayEventToInstructor, {});
  const { data } = useQuery(queryInstructorById, {
    fetchPolicy: "network-only",
    pollInterval: 10000,
    variables: {
      instructorId: booking?.instructorId
    }
  });
  const calendarEventDate = moment(getEventFullDate(calendarEvent)).format("LL");

  useEffect(() => {
    setInstructorData(data?.instructor);
  }, [data]);

  useEffect(() => {
    if (booking?.instructorInvoice) {
      setTotalInvoice(
        booking.instructorInvoice.invoiceItems.reduce((acc, curr) => {
          if (curr.price !== undefined && curr.units !== undefined) {
            return acc + curr.price * curr.units;
          }
          return acc;
        }, 0)
      );
      setInvoiceInstructorStatus(booking.instructorInvoice.status);

      if (booking?.instructorInvoice?.paymentReceipt && booking?.instructorInvoice?.paymentReceipt !== "") {
        setIsPaidWithStripe(false);
      } else {
        setIsPaidWithStripe(true);
      }

      if (booking?.instructorInvoice?.status === "approved") {
        setShowPayInvoiceButton(true);
        setIsPaid(true);
      } else {
        setShowPayInvoiceButton(false);
      }

      if (booking?.instructorInvoice?.status === "rejected") {
        setRejectedReasons(booking.instructorInvoice.rejectedReasons);
        setIsRejected(true);
      } else {
        setIsRejected(false);
      }

      if (booking?.instructorInvoice?.status === "paid") {
        setRejectedReasons(booking.instructorInvoice.rejectedReasons);
        setIsPaid(true);
      } else {
        setIsPaid(false);
      }
    }
  }, [booking]);

  const handleSaveInfo = async () => {
    setProcessing(true);
    let newStatus = "";
    if (isPaid) {
      newStatus = "paid";
    } else if (!isRejected && !isPaid) {
      newStatus = "approved";
      setRejectedReasons("");
    } else {
      newStatus = "rejected";
    }

    setInvoiceInstructorStatus(newStatus);

    try {
      await updateBookingInvoiceInstructor({
        variables: {
          bookingId: booking._id,
          createdAt: booking.instructorInvoice.createdAt,
          invoiceItems: booking.instructorInvoice.invoiceItems,
          notes: booking.instructorInvoice.notes,
          rejectedReasons,
          status: newStatus,
          updatedAt: new Date(),
          paymentReceipt: fileUrl
        }
      });
      setIsPaidWithStripe(false);
    } catch (ex) {
      setError(ex);
    }
    setProcessing(false);
  };

  const handleStripePayment = async () => {
    setProcessingPayment(true);
    if (instructorData?.stripeConnect?.status === "connected") {
      try {
        await payEventToInstructor({
          variables: {
            bookingId: booking._id
          }
        });
        setIsPaidWithStripe(true);
        setIsPaid(true);
        setInvoiceInstructorStatus("paid");
        setShowModal(!showModal);
        setShowPayInvoiceButton(false);
      } catch (ex) {
        console.log("ex", ex);
      }
    } else if (instructorData?.stripeConnect?.status === "pending") {
      setError("Instructor without stripe connect setup.");
    } else if (!instructorData?.stripeConnect) {
      setError("Instructorwithout stripe account");
    }
    setProcessingPayment(false);
  };

  const updateAttachedFile = async () => {
    let result = "";
    for (let i = 0; i < attachedFile.length; i++) {
      result = await uploadFile(attachedFile[i].successful[0].data);
      if (result.error) {
        throw new Error(result.error);
      } else {
        setFileUrl(result.url);
      }
    }
    return result;
  };

  useEffect(() => {
    if (fileUrl) {
      handleSaveInfo();
    }
  }, [fileUrl]);

  useEffect(() => {
    if (isApprovedInvoice) {
      handleSaveInfo();
    }
    setIsApprovedInvoice(false);
  }, [isApprovedInvoice]);

  const handleApprove = () => {
    setIsRejected(false);
    setShowPayInvoiceButton(true);
    setRejectedReasons("");
    setIsApprovedInvoice(true);
  };

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
              <div className="event-confirmation-container ">
                <Card>
                  <CardBody>
                    <span className="d-flex justify-content-center">
                      <Icon className="mb-1 event-confirmed-icon" fontSize={30} icon="akar-icons:circle-check" />
                    </span>
                    <h2 className="text-center mt-2 mb-2 font-weight-bold">Event Confirmed</h2>
                    {(invoiceInstructorStatus === "submitted" ||
                      invoiceInstructorStatus === "approved" ||
                      invoiceInstructorStatus === "rejected" ||
                      invoiceInstructorStatus === "paid") && (
                      <p className="text-justify mb-2">Our partner has submitted a new invoice for this event.</p>
                    )}
                    {invoiceInstructorStatus === "created" && (
                      <p className="text-justify mb-2">This is just a draft. Final invoice has not been summitted for approval.</p>
                    )}
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
                        <span>{`$${(invoice.price * invoice.units).toFixed(2)}`}</span>
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
                    <span className="total-title">Total{"  "}</span>
                    <span className="total-value">{`$ ${totalInvoice.toFixed(2)}`}</span>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg={12}>
                  <div className="button-container d-flex justify-content-end mt-2">
                    {invoiceInstructorStatus === "submitted" && (
                      <Button
                        className="mr-2"
                        onClick={(e) => {
                          setIsRejected(true);
                        }}
                      >
                        {"Reject"}
                      </Button>
                    )}
                    {(invoiceInstructorStatus === "submitted" || invoiceInstructorStatus === "rejected") && (
                      <Button
                        onClick={(e) => {
                          handleApprove();
                        }}
                      >
                        {processing ? "Saving" : "Approve"}
                      </Button>
                    )}
                  </div>
                </Col>

                {invoiceInstructorStatus === "paid" && (
                  <Col lg={12}>
                    <div className="d-flex justify-content-end">
                      <Alert>This invoice has been paid!</Alert>
                    </div>
                    <div className="d-flex justify-content-end">
                      {!isPaidWithStripe && (
                        <small>
                          <a href={fileUrl || booking.instructorInvoice.paymentReceipt} target="_blank" className="pop-up-payment-link">
                            Payment receipt
                          </a>
                        </small>
                      )}
                    </div>
                  </Col>
                )}
              </Row>

              {showPayInvoiceButton && invoiceInstructorStatus === "approved" && (
                <Row>
                  <Col className="d-flex justify-content-end">
                    <Button
                      color="primary"
                      className="mr-2"
                      onClick={(e) => {
                        setIsRejected(true);
                      }}
                    >
                      {"Reject"}
                    </Button>
                    <Button
                      color="primary"
                      onClick={(e) => {
                        setShowModal(!showModal);
                        setIsPaid(true);
                      }}
                    >
                      Pay Invoice
                    </Button>
                  </Col>
                </Row>
              )}


              {isRejected && invoiceInstructorStatus !== "rejected" && (
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
                        disabled={!rejectedReasons}
                      >
                        {"Save"}
                      </Button>
                      <Button className="small" onClick={(e) => setIsRejected(false)}>
                        Cancel
                      </Button>
                    </div>
                  </Col>
                </Row>
              )}

              <Row>
                <Col lg={12} className="d-flex justify-content-end">
                  {invoiceInstructorStatus === "approved" && !isPaid && (
                    <Alert color="primary" className="mt-2">
                      This invoice has been approved
                    </Alert>
                  )}
                  {invoiceInstructorStatus === "rejected" && (
                    <Row>
                      <Col lg={12} className="">
                        <Alert color="warning" className="mt-2 px-3 py-1">
                          This invoice has been rejected.
                          {invoiceInstructorStatus === "rejected" && (
                            <p>
                              <span>Rejected Reason: </span>
                              <span className="text-justify">{rejectedReasons}</span>
                            </p>
                          )}
                        </Alert>
                      </Col>
                    </Row>
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
                      checked={isStripeOption}
                      onClick={(e) => {
                        setIsStripeOption(true);
                        setIsOtherOption(false);
                      }}
                    />{" "}
                    Stripe
                  </Label>
                </FormGroup>
                <FormGroup check inline>
                  <Label check>
                    <Input
                      type="radio"
                      name="ex1"
                      checked={isOtherOption}
                      onClick={(e) => {
                        setIsOtherOption(true);
                        setIsStripeOption(false);
                      }}
                    />{" "}
                    Other
                  </Label>
                </FormGroup>
                {isStripeOption && (
                  <div>
                    <div className="d-flex justify-content-center">
                      <Button
                        onClick={(e) => {
                          handleStripePayment();
                        }}
                      >
                        {processingPayment ? "Submitting" : "Submit Payment"}
                      </Button>
                    </div>
                    {error && (
                      <Row className="mt-2 d-flex justify-content-center">
                        <Col lg={9}>
                          <Alert className="text-center" color="danger">
                            {error}
                          </Alert>
                        </Col>
                      </Row>
                    )}
                  </div>
                )}

                {isOtherOption && (
                  <div>
                    <DropZone dropText={"Upload your file"} attachedFile={attachedFile} setAttachedFile={setAttachedFile} fileUrl={fileUrl} />
                    <div className="d-flex justify-content-center mt-2">
                      {attachedFile && attachedFile.length > 1 ? (
                        "Upload just one file"
                      ) : (
                        <Button
                          onClick={(e) => {
                            setShowModal(!showModal);
                            setShowPayInvoiceButton(false);
                            updateAttachedFile();
                          }}
                          disabled={(attachedFile && attachedFile.length === 0) || (attachedFile && attachedFile.length > 1)}
                        >
                          {processing ? "Submitting" : "Submit Payment"}
                        </Button>
                      )}
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

PartnersInvoice.propTypes = {
  booking: PropTypes.object.isRequired,
  calendarEvent: PropTypes.object.isRequired
};

export default PartnersInvoice;
