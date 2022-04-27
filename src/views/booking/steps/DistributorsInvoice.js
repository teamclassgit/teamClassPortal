// @packages
import { Fragment, useEffect, useState } from 'react';
import { Alert, Button, Card, CardBody, Col, Input, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter, Row } from 'reactstrap';
import { Icon } from '@iconify/react';
import { useMutation } from '@apollo/client';
import moment from 'moment';

// @scripts
import mutationUpdateBookingDistributorInvoice from '../../../graphql/MutationUpdateBookingDistributorInvoice';
import DropZone from '../../../@core/components/drop-zone';
import { getEventFullDate, uploadFile } from '../../../utility/Utils';

// @styles
import './partners-invoice.scss';

const DistributorInvoice = ({ booking, calendarEvent }) => {
  const [totalInvoice, setTotalInvoice] = useState(0);
  const [isRejected, setIsRejected] = useState(booking.distributorInvoice && booking.distributorInvoice.status === 'rejected' ? true : false);
  const [isPaid, setIsPaid] = useState(booking.distributorInvoice && booking.distributorInvoice.status === 'paid' ? true : false);
  const [invoiceDistributorStatus, setInvoiceDistributorStatus] = useState(booking.distributorInvoice && booking.distributorInvoice.status);
  const [rejectedReasons, setRejectedReasons] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [showPayDistributorButton, setShowPayDistributorButton] = useState(
    booking.distributorInvoice && booking.distributorInvoice.status === 'approved' ? true : false
  );
  const [showModal, setShowModal] = useState(false);
  const [isStripeOption, setIsStripeOption] = useState(true);
  const [isOtherOption, setIsOtherOption] = useState(false);
  const [attachedFile, setAttachedFile] = useState([]);
  const [fileUrl, setFileUrl] = useState(null);
  const [isApprovedInvoice, setIsApprovedInvoice] = useState(false);
  const [updateBookingInvoiceDistributor] = useMutation(mutationUpdateBookingDistributorInvoice, {});

  const calendarEventDate = moment(getEventFullDate(calendarEvent)).format('LL');

  useEffect(() => {
    if (booking.distributorInvoice) {
      setTotalInvoice(
        booking.distributorInvoice.invoiceItems.reduce((acc, curr) => {
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
    } else if (!isRejected && !isPaid) {
      newStatus = 'approved';
      setRejectedReasons('');
    } else {
      newStatus = 'rejected';
    }

    console.log('newStatus', newStatus);

    setInvoiceDistributorStatus(newStatus);
    console.log('ENTRNADO A LA MUTATIOM');

    try {
      await updateBookingInvoiceDistributor({
        variables: {
          bookingId: booking._id,
          createdAt: booking.distributorInvoice.createdAt,
          invoiceItems: booking.distributorInvoice.invoiceItems,
          notes: booking.distributorInvoice.notes,
          rejectedReasons,
          status: newStatus,
          updatedAt: new Date(),
          paymentReceipt: fileUrl
        }
      });
    } catch (ex) {
      setError(ex);
    }
    setProcessing(false);
  };

  const updateAttachedFile = async () => {
    let result = '';
    for (let i = 0; i < attachedFile.length; i++) {
      result = await uploadFile(attachedFile[i].successful[0].data);
      if (result.error) {
        console.log(result.error);
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
    setShowPayDistributorButton(true);
    setRejectedReasons('');
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
            <span className="title">Customer</span>
            <div>
              <a>{booking?.customerName}</a>
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
              <a>{invoiceDistributorStatus}</a>
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
                    {(invoiceDistributorStatus === 'submitted' ||
                      invoiceDistributorStatus === 'approved' ||
                      invoiceDistributorStatus === 'rejected ' ||
                      invoiceDistributorStatus === 'paid ') && (
                      <p className="text-justify mb-2">Our customer has submitted a new invoice for this event.</p>
                    )}
                    {invoiceDistributorStatus === 'created' && (
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
              {booking.distributorInvoice &&
                booking.distributorInvoice.invoiceItems.map((invoice) => {
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
                    value={booking?.distributorInvoice?.notes}
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
              <Row>
                <Col lg={12}>
                  <div className="button-container d-flex justify-content-end mt-2">
                    {invoiceDistributorStatus === 'submitted' && (
                      <Button
                        className="mr-2"
                        onClick={(e) => {
                          setIsRejected(true);
                        }}
                      >
                        {'Reject'}
                      </Button>
                    )}
                    {(invoiceDistributorStatus === 'submitted' || invoiceDistributorStatus === 'rejected') && (
                      <Button
                        onClick={(e) => {
                          handleApprove();
                        }}
                      >
                        {processing ? 'Saving' : 'Approve'}
                      </Button>
                    )}
                  </div>
                </Col>

                {invoiceDistributorStatus === 'paid' && (
                  <Col lg={12}>
                    <div className="d-flex justify-content-end mt-2">
                      <Alert>This invoice has been paid!</Alert>
                    </div>
                    <div className="d-flex justify-content-end">
                      <small>
                        <a href={fileUrl || booking.distributorInvoice.paymentReceipt} target="_blank" className="pop-up-payment-link">
                          Payment receipt
                        </a>
                      </small>
                    </div>
                  </Col>
                )}
              </Row>

              {isRejected && invoiceDistributorStatus !== 'rejected' && (
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
                        {'Save'}
                      </Button>
                      <Button className="small" onClick={(e) => setIsRejected(false)}>
                        Cancel
                      </Button>
                    </div>
                  </Col>
                </Row>
              )}

              {isRejected && invoiceDistributorStatus === 'rejected' && (
                <Row className="mt-2">
                  <Col lg={12} className="">
                    <span>Rejected Reason: </span>
                    <span className="text-justify">{rejectedReasons}</span>
                  </Col>
                </Row>
              )}

              {showPayDistributorButton && invoiceDistributorStatus === 'approved' && (
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
              )}

              <Row className="">
                <Col lg={12} className="">
                  {invoiceDistributorStatus === 'approved' && !isPaid && (
                    <Alert color="primary" className="mt-2">
                      This invoice has been approved
                    </Alert>
                  )}
                  {invoiceDistributorStatus === 'rejected' && (
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
                      checked={isStripeOption}
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
                      checked={isOtherOption}
                      onClick={(e) => {
                        setIsOtherOption(true);
                        setIsStripeOption(false);
                      }}
                    />{' '}
                    Other
                  </Label>
                </FormGroup>
                {isStripeOption && (
                  <div>
                    <small className="stripe-option-message">
                      Stripe payments are not available yet. This feature will be available in the near future.
                    </small>
                    <div className="d-flex justify-content-center">
                      <Button
                        onClick={(e) => {
                          setShowModal(!showModal);
                          setShowPayDistributorButton(false);
                          handleSaveInfo();
                        }}
                        disabled={isStripeOption}
                      >
                        Submit Payment
                      </Button>
                    </div>
                  </div>
                )}

                {isOtherOption && (
                  <div>
                    <DropZone dropText={'Upload your file'} attachedFile={attachedFile} setAttachedFile={setAttachedFile} fileUrl={fileUrl} />
                    <div className="d-flex justify-content-center mt-2">
                      {attachedFile && attachedFile.length > 1 ? (
                        'Upload just one file'
                      ) : (
                        <Button
                          onClick={(e) => {
                            setShowModal(!showModal);
                            setShowPayDistributorButton(false);
                            updateAttachedFile();
                          }}
                          disabled={(attachedFile && attachedFile.length === 0) || (attachedFile && attachedFile.length > 1)}
                        >
                          Submit Payment
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

export default DistributorInvoice;
