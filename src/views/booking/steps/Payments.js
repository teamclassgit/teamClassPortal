import React, { Fragment, useState } from 'react'
import { Input, Button, Card, Col, Form, Media, Row, Table, CardLink, Badge } from 'reactstrap'
import { useMutation } from '@apollo/client'
import mutationUpdateBookingPayments from '../../../graphql/MutationUpdateBookingPayments'
import moment from 'moment'
import { capitalizeString } from '../../../utility/Utils'
import { BOOKING_DEPOSIT_CONFIRMATION_STATUS } from '../../../utility/Constants'
import AddPaymentModal from './AddPaymentModal'
import { ChevronDown, Download, Edit, FileText, Grid, Plus, Share, Trash, X } from 'react-feather'

const Payments = ({ stepper, type, teamClass, realCountAttendees, booking, setBooking }) => {
  const [processing, setProcessing] = React.useState(false)
  const [clickedConvert, setClickedConvert] = React.useState(false)
  const [payments, setPayments] = React.useState([])
  const [modal, setModal] = useState(false)

  const [updateBooking, { ...updateBookingResult }] = useMutation(mutationUpdateBookingPayments, {})

  // ** Function to handle Modal toggle
  const handleModal = () => setModal(!modal)

  React.useEffect(() => {
    setPayments((booking && booking.payments) || [])
  }, [booking])

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

  console.log('payment', payments)

  return (
    <Fragment>
      <div className="d-flex justify-content-end mb-2">
        <Button className="ml-2" color="primary" onClick={handleModal}>
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
                </tr>
              </thead>
              <tbody>
                {payments.map((element, index) => (
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
      <AddPaymentModal open={modal} handleModal={handleModal} mode={'add'} booking={booking} />
    </Fragment>
  )
}

export default Payments
