import React, { useState, useEffect } from 'react'
import { Mail, Phone, User, X } from 'react-feather'
import { Button, Col, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import Flatpickr from 'react-flatpickr'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import mutationUpdateBookingPayments from '../../../graphql/MutationUpdateBookingPayments'
import { useMutation } from '@apollo/client'
import { BOOKING_DEPOSIT_CONFIRMATION_STATUS } from '../../../utility/Constants'
import { capitalizeString } from '../../../utility/Utils'

const AddPaymentModal = ({ open, handleModal, mode, booking, payments, setPayments, currentPayment, setCurrentPayment, indexToDelete }) => {
  const [newName, setNewName] = useState(null)
  const [newEmail, setNewEmail] = useState(null)
  const [newPhone, setNewPhone] = useState(null)
  const [newAmount, setNewAmount] = useState(null)
  const [newCardBrand, setNewCardBrand] = useState(null)
  const [newCardLastFourDigits, setNewCardLastFourDigits] = useState(null)
  const [newPaymentCreationDate, setNewPaymentCreationDate] = useState([])
  const [newPaymentName, setNewPaymentName] = useState(null)
  const [newPaymentMethod, setNewPaymentMethod] = useState(null)
  const [newPaymentId, setNewPaymentId] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [amountValidation, setAmountValidation] = useState(true)
  console.log('currentPayment', currentPayment)
  const [updateBookingPayment] = useMutation(mutationUpdateBookingPayments, {})

  const paymentNameOptions = [
    {
      label: 'Deposit',
      value: 'deposit'
    },
    {
      label: 'Final',
      value: 'final'
    }
  ]

  const paymentMethodOptions = [
    {
      label: 'Cash',
      value: 'cash'
    },
    {
      label: 'Card',
      value: 'card'
    },
    {
      label: 'Check',
      value: 'check'
    },
    {
      label: 'ACH',
      value: 'ach'
    }
  ]

  useEffect(() => {
    if (currentPayment) {
      setNewName(currentPayment.name)
      setNewEmail(currentPayment.email)
      setNewPhone(currentPayment.phone)
      setNewAmount(currentPayment.amount / 100)
      setNewCardBrand(currentPayment.cardBrand)
      setNewCardLastFourDigits(currentPayment.cardLast4)
      setNewPaymentCreationDate(currentPayment.createdAt)
      setNewPaymentName(currentPayment.paymentName)
      setNewPaymentMethod(currentPayment.paymentMethod)
      setNewPaymentId(currentPayment.paymentId)
    }
  }, [currentPayment])

  const cancel = () => {
    setCurrentPayment('')
    handleModal()
  }
  // ** Custom close btn
  const CloseBtn = <X className="cursor-pointer" size={15} onClick={cancel} />

  const updateBookingPaymentInfo = async () => {
    setProcessing(true)

    let newPaymentArray = payments ? [...payments] : []
    let bookingStatus = ''

    let newPayments = {
      name: newName,
      email: newEmail,
      phone: newPhone,
      amount: newAmount * 100,
      cardBrand: newCardBrand,
      cardLast4: newCardLastFourDigits,
      createdAt: newPaymentCreationDate && newPaymentCreationDate.length > 0 ? newPaymentCreationDate[0] : undefined,
      paymentName: newPaymentName,
      paymentMethod: newPaymentMethod,
      paymentId: newPaymentId,
      chargeUrl: 'outside-of-system',
      status: 'succeeded'
    }

    if (mode === 'add') {
      newPaymentArray.push(newPayments)
    }

    if (newPaymentName === 'deposit' && (booking.status === 'quote' || booking.status === 'date-requested')) {
      bookingStatus = 'confirmed'
    }

    if (newPaymentName === 'final' && (booking.status === 'quote' || booking.status === 'date-requested' || booking.status === 'confirmed')) {
      bookingStatus = 'paid'
    }

    try {
      const resultUpdateBookingPayment = await updateBookingPayment({
        variables: {
          bookingId: booking._id,
          updatedAt: new Date(),
          payments: newPaymentArray,
          status: bookingStatus
        }
      })
      if (resultUpdateBookingPayment && resultUpdateBookingPayment.data) {
        setProcessing(false)
        console.log('Booking payments updated!')
      }
      console.log('resultUpdateBookingPayment', resultUpdateBookingPayment.data.updateOneBooking)
      setPayments(newPaymentArray)
    } catch (er) {
      setProcessing(false)

      console.log(er)
    }
    handleModal()
  }

  return (
    <Modal isOpen={open} toggle={handleModal} className="sidebar-sm" modalClassName="modal-slide-in" contentClassName="pt-0">
      <ModalHeader className="mb-3" toggle={handleModal} close={CloseBtn} tag="div">
        {mode === 'edit' ? <h5 className="modal-title">Edit Payment</h5> : <h5 className="modal-title">New Payment</h5>}
      </ModalHeader>
      <ModalBody className="flex-grow-1">
        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <User size={15} />
              </InputGroupText>
            </InputGroupAddon>
            <Input id="name" placeholder="Full Name*" required={true} value={newName} onChange={(e) => setNewName(e.target.value)} />
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <Mail size={15} />
              </InputGroupText>
            </InputGroupAddon>
            <Input id="name" placeholder="Email*" required={true} value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <Phone size={15} />
              </InputGroupText>
            </InputGroupAddon>
            <Input id="name" placeholder="Phone" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
          </InputGroup>
        </FormGroup>

        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="amount">Amount*</Label>
              <Input
                id="amount"
                type="number"
                min="1"
                step="any"
                placeholder=""
                required={true}
                value={newAmount ? newAmount : ''}
                onChange={(e) => setNewAmount(e.target.value)}
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="created">Created At*</Label>
              <InputGroup>
                <Flatpickr
                  className="small"
                  value={newPaymentCreationDate}
                  dateformat="Y-m-d H:i"
                  data-enable-time
                  id="signUpDateLine"
                  className="form-control"
                  placeholder="Select Date..."
                  onChange={(selectedDates, dateStr, instance) => {
                    setNewPaymentCreationDate(selectedDates)
                  }}
                />
              </InputGroup>
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="payment-name">Payment Name*</Label>
              <Select
                value={{
                  value: newPaymentName || '',
                  label: capitalizeString(newPaymentName)
                }}
                theme={selectThemeColors}
                className="react-select"
                classNamePrefix="select"
                placeholder=""
                options={paymentNameOptions.map((item) => {
                  return {
                    label: item.label,
                    value: item.value
                  }
                })}
                onChange={(option) => setNewPaymentName(option.value)}
                isClearable={false}
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="payment-method">Payment Method*</Label>
              <Select
                value={{
                  value: newPaymentMethod || '',
                  label: capitalizeString(newPaymentMethod)
                }}
                theme={selectThemeColors}
                className="react-select"
                classNamePrefix="select"
                placeholder=""
                options={paymentMethodOptions.map((item) => {
                  return {
                    label: item.label,
                    value: item.value
                  }
                })}
                onChange={(option) => setNewPaymentMethod(option.value)}
                isClearable={false}
              />
            </FormGroup>
          </Col>
        </Row>
        {newPaymentMethod === 'card' && (
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="card-last-4">Card Last 4 Digits*</Label>
                <Input
                  id="card-last-4"
                  placeholder="4545"
                  required={true}
                  value={newCardLastFourDigits}
                  onChange={(e) => setNewCardLastFourDigits(e.target.value)}
                  maxLength="4"
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="card-brand">Card Brand*</Label>
                <Input
                  id="card-brand"
                  type="text"
                  placeholder="Visa"
                  required={true}
                  value={newCardBrand}
                  onChange={(e) => setNewCardBrand(e.target.value)}
                />
              </FormGroup>
            </Col>
          </Row>
        )}
        <FormGroup>
          <Label for="payment-id">Payment ID</Label>
          <Input id="payment-id" placeholder="" value={newPaymentId} onChange={(e) => setNewPaymentId(e.target.value)} />
          <small>ID of the payment platform.</small>
        </FormGroup>
        <Button
          className="mr-1 mt-1"
          color="primary"
          onClick={updateBookingPaymentInfo}
          disabled={
            !newName ||
            !newEmail ||
            !newAmount ||
            newAmount <= 0 ||
            !newPaymentCreationDate ||
            !newPaymentName ||
            !newPaymentMethod ||
            (newPaymentMethod === 'card' && !newCardBrand) ||
            (newPaymentMethod === 'card' && !newCardLastFourDigits)
          }
        >
          {processing ? 'Saving...' : 'Save'}
        </Button>
        <Button className="mt-1" color="secondary" onClick={cancel} outline>
          Cancel
        </Button>
      </ModalBody>
    </Modal>
  )
}

export default AddPaymentModal
