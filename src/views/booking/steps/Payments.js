import React, { Fragment, useState } from 'react'
import {
  Badge,
  Button,
  Card,
  CardHeader,
  CardTitle,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalFooter,
  Row,
  Table,
  UncontrolledButtonDropdown
} from 'reactstrap'
import { useMutation } from '@apollo/client'
import mutationUpdateBookingPayments from '../../../graphql/MutationUpdateBookingPayments'
import moment from 'moment'
import { capitalizeString } from '../../../utility/Utils'
import { BOOKING_DEPOSIT_CONFIRMATION_STATUS } from '../../../utility/Constants'
import AddPaymentModal from './AddPaymentModal'
import { ChevronDown, Download, Edit, FileText, Grid, Plus, Share, Trash, X } from 'react-feather'

const Payments = ({ stepper, type, teamClass, realCountAttendees, booking, setBooking }) => {
  const [currentPayment, setCurrentPayment] = useState(null)
  const [processing, setProcessing] = React.useState(false)
  const [clickedConvert, setClickedConvert] = React.useState(false)
  const [payments, setPayments] = React.useState([])
  const [modal, setModal] = useState(false)
  const [mode, setMode] = useState(null)
  const [centeredModal, setCenteredModal] = useState(false)
  const [indexToDelete, setIndexToDelete] = useState(null)

  const [updateBooking, { ...updateBookingResult }] = useMutation(mutationUpdateBookingPayments, {})

  // ** Function to handle Modal toggle
  const handleModal = () => setModal(!modal)

  React.useEffect(() => {
    setPayments((booking && booking.payments) || [])
  }, [booking])

  // ** Custom close btn
  const CloseBtn = <X className="cursor-pointer" size={15} onClick={() => setCenteredModal(!centeredModal)} />

  const convertFinalPaymentToDeposit = async (payment) => {
    setProcessing(true)

    const newPayment = { ...payment }
    newPayment.paymentName = 'deposit'
    const newPaymentsList = payments.filter((element) => element.paymentName !== 'final')
    newPaymentsList.push(newPayment)

    try {
      const result = await updateBooking({
        variables: {
          bookingId: booking._id,
          payments: newPaymentsList,
          status: BOOKING_DEPOSIT_CONFIRMATION_STATUS,
          updatedAt: new Date()
        }
      })

      if (result && result.data && result.data.updateOneBooking) {
        setPayments(newPaymentsList)
        setBooking(result.data.updateOneBooking)
      }

      console.log('booking updated')

      setProcessing(false)
    } catch (ex) {
      console.log(ex)
      setProcessing(false)
    }
  }

  const deleteOnePayment = async () => {
    try {
      const resultUpdateBookingPayment = await updateBooking({
        variables: {
          bookingId: booking._id,
          updatedAt: new Date(),
          payments: payments.filter((element, index) => index !== indexToDelete),
          status: BOOKING_DEPOSIT_CONFIRMATION_STATUS
        }
      })

      setPayments(payments.filter((element, index) => index !== indexToDelete))
      console.log('Booking payment delete it!')
    } catch (er) {
      console.log(er)
    }
  }

  return (
    <Fragment>
      <div className="d-flex justify-content-end mb-2">
        <Button
          className="ml-2"
          color="primary"
          onClick={(e) => {
            setMode('add')
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
            }
            setCurrentPayment(newPay)
            handleModal()
          }}
        >
          <Plus size={15} />
          <span className="align-middle ml-50">Add Payment</span>
        </Button>
      </div>
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
                    <div align="left">Brand</div>
                  </th>
                  <th>
                    <div align="left">Last 4</div>
                  </th>
                  <th>
                    <div align="right">Amount</div>
                  </th>
                  <th>
                    <div align="center">Type of payment</div>
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
                          <span>
                            {capitalizeString(element.paymentName)}
                            {processing && (
                              <small>
                                <br />
                                <span>Converting...</span>
                              </small>
                            )}
                            {!processing && element.paymentName === 'final' ? (
                              !clickedConvert ? (
                                <small>
                                  <br />
                                  <a
                                    href="#"
                                    title="Convert this payment to deposit will move this booking to deposit-paid status"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      setClickedConvert(true)
                                    }}
                                  >
                                    Convert to deposit
                                  </a>
                                </small>
                              ) : (
                                <div>
                                  <p className="mt-1">
                                    <small className="text text-danger">
                                      Are you sure to convert <br />
                                      this payment to deposit?
                                    </small>
                                  </p>
                                  <small className="ml-1">
                                    <a
                                      className="btn btn-primary btn-sm"
                                      href="#"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        convertFinalPaymentToDeposit(element)
                                      }}
                                    >
                                      Yes
                                    </a>{' '}
                                    <a
                                      className="btn btn-secondary btn-sm"
                                      href="#"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        setClickedConvert(false)
                                      }}
                                    >
                                      No
                                    </a>
                                  </small>
                                  <br />
                                  <small className="ml-2"></small>
                                </div>
                              )
                            ) : (
                              <></>
                            )}
                          </span>
                        </div>
                      </td>
                      <td align="left">
                        <div className={`text-default'}`}>
                          <span>{capitalizeString(element.cardBrand)}</span>
                        </div>
                      </td>
                      <td align="left">
                        <div className={`text-default'}`}>
                          <span>{element.cardLast4}</span>
                        </div>
                      </td>
                      <td align="right">
                        <div className={`font-weight-bolder text-default'}`}>
                          <span>${element.amount / 100}</span>
                        </div>
                      </td>
                      <td align="center">
                        <div className={` text-default`}>
                          <span>{element.chargeUrl === 'outside-of-system' ? 'Manual payment' : 'Automatic payment'}</span>
                        </div>
                      </td>
                      <td align="center">
                        <div className={`text-default'}`}>
                          <Badge>{capitalizeString(element.status)}</Badge>
                        </div>
                      </td>
                      <td align="right">
                        <div className={`text-default'}`}>
                          {element.chargeUrl === 'outside-of-system' ? (
                            <div className="d-flex ">
                              <a
                                className="mr-2"
                                onClick={(e) => {
                                  e.preventDefault()
                                  setIndexToDelete(index)
                                  setMode('delete')
                                  setCenteredModal(!centeredModal)
                                }}
                                href="#"
                                title="Remove from list"
                              >
                                <Trash size={18} />
                              </a>
                              <a
                                onClick={(e) => {
                                  setCurrentPayment(payments[index])
                                  e.preventDefault()
                                  handleModal()
                                  setMode('edit')
                                }}
                                href="#"
                                title="Edit attendee"
                              >
                                <Edit size={18} title="Edit" />
                              </a>
                            </div>
                          ) : (
                            ''
                          )}
                          <Modal
                            isOpen={centeredModal}
                            toggle={() => {
                              setCenteredModal(!centeredModal)
                            }}
                            backdrop={false}
                            className="modal-dialog-centered border-0"
                          >
                            <ModalHeader toggle={() => setCenteredModal(!centeredModal)} close={CloseBtn}>
                              Delete attendee?
                            </ModalHeader>
                            <ModalFooter className="justify-content-center">
                              <Button
                                color="secondary"
                                onClick={(e) => {
                                  e.preventDefault()
                                  setCenteredModal(!centeredModal)
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                color="primary"
                                onClick={(e) => {
                                  e.preventDefault()
                                  deleteOnePayment()
                                  setCenteredModal(!centeredModal)
                                }}
                              >
                                Delete
                              </Button>
                            </ModalFooter>
                          </Modal>
                        </div>
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
        booking={booking}
        payments={payments}
        setPayments={setPayments}
        currentPayment={currentPayment}
        setCurrentPayment={setCurrentPayment}
      />
    </Fragment>
  )
}

export default Payments
