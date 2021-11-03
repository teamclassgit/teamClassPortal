import React, { useState, useEffect } from 'react'
import {
  Button,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap'
import { Mail, Phone, User, X, Briefcase, Info, Settings, Edit } from 'react-feather'
import Select from 'react-select'
import { isValidEmail } from '../utility/Utils'
import Cleave from 'cleave.js/react'
import { selectThemeColors } from '@utils'
import Flatpickr from 'react-flatpickr'
import mutationUpdateBooking from '../graphql/MutationUpdateBookingAndCustomer'
import removeCampaignRequestQuoteMutation from '../graphql/email/removeCampaignRequestQuote'
import { useMutation } from '@apollo/client'

import './EditBookingModal.scss'

const EditBookingModal = ({
  currentElement: {
    bookingId,
    currentCustomerId,
    currentName,
    currentEmail,
    currentPhone,
    currentCompany,
    currentCoordinatorName,
    currentCoordinatorId,
    currentTeamclassId,
    currentTeamclassName,
    currentGroupSize,
    currentSignUpDeadline,
    currentClassVariant,
    currentServiceFee,
    currentSalesTax,
    createdAt,
    currentStatus,
    currentEventDurationHours,
    currentClosedReason,
    currentNotes
  },
  open,
  handleModal,
  setCustomers,
  setBookings,
  allCoordinators,
  allClasses,
  allBookings,
  allCustomers,
  handleClose
}) => {
  const [customerName, setCustomerName] = useState(null)
  const [customerEmail, setCustomerEmail] = useState(null)
  const [emailValid, setEmailValid] = useState(true)
  const [customerPhone, setCustomerPhone] = useState(null)
  const [customerCompany, setCustomerCompany] = useState(null)
  const [coordinatorName, setCoordinatorName] = useState(null)
  const [coordinatorId, setCoordinatorId] = useState(null)
  const [bookingTeamClassId, setBookingTeamClassId] = useState(null)
  const [bookingTeamClassName, setBookingTeamClassName] = useState(null)
  const [classVariantsOptions, setClassVariantsOptions] = useState([])
  const [classVariant, setClassVariant] = useState(null)
  const [groupSize, setGroupSize] = useState(null)
  const [attendeesValid, setAttendeesValid] = useState(true)
  const [bookingSignUpDeadline, setBookingSignUpDeadline] = useState([])
  const [closedBookingReason, setClosedBookingReason] = useState(null)
  const [bookingNotes, setBookingNotes] = useState([])
  const [active, setActive] = useState('1')
  const [processing, setProcessing] = useState(false)
  const [updateBooking] = useMutation(mutationUpdateBooking, {})

  const [removeCampaignRequestQuote] = useMutation(removeCampaignRequestQuoteMutation, {})
  const closeBookingOptions = [
    {
      label: '',
      value: ''
    },
    {
      label: 'Won',
      value: 'Won'
    },
    {
      label: 'Lost',
      value: 'Lost'
    },
    {
      label: 'Duplicated',
      value: 'Duplicated'
    },
    {
      label: 'Mistake',
      value: 'Mistake'
    }
  ]

  useEffect(() => {
    setCustomerName(currentName)
    setCustomerEmail(currentEmail)
    setCustomerPhone(currentPhone)
    setCustomerCompany(currentCompany)
    setCoordinatorId(currentCoordinatorId)
    setCoordinatorName(currentCoordinatorName)
    setBookingTeamClassId(currentTeamclassId)
    setBookingTeamClassName(currentTeamclassName)
    setClassVariant(currentClassVariant)
    setGroupSize(currentGroupSize)
    setBookingSignUpDeadline([currentSignUpDeadline])
    setClosedBookingReason(currentClosedReason)
    setBookingNotes(currentNotes)
  }, [bookingId])

  useEffect(() => {
    if (bookingTeamClassId) {
      const filteredClass = allClasses.find((element) => element._id === bookingTeamClassId)
      if (filteredClass) setClassVariantsOptions(filteredClass.variants)
    }
  }, [bookingTeamClassId])

  const emailValidation = (email) => {
    setEmailValid(isValidEmail(email))
  }

  const options = { phone: true, phoneRegionCode: 'US' }

  const cancel = () => {
    setClosedBookingReason(null)
    handleModal()
  }

  const groupSizeValidation = (size) => {
    setAttendeesValid(size > 0)
  }
  const editBooking = async () => {
    setProcessing(true)

    try {
      const teamClass = allClasses.find((element) => element._id === bookingTeamClassId)
      const resultUpdateBooking = await updateBooking({
        variables: {
          bookingId: bookingId,
          date: new Date(), // combine with quotaTime
          teamClassId: bookingTeamClassId,
          classVariant: classVariant,
          instructorId: teamClass.instructorId ? teamClass.instructorId : teamClass._id,
          instructorName: teamClass.instructorName,
          customerId: currentCustomerId,
          customerName: customerName,
          eventDate: new Date(),
          eventDurationHours: currentEventDurationHours,
          eventCoordinatorId: coordinatorId,
          attendees: groupSize,
          classMinimum: classVariant.minimum,
          pricePerson: classVariant.pricePerson,
          serviceFee: currentServiceFee,
          salesTax: currentSalesTax,
          discount: 0,
          createdAt: createdAt,
          updatedAt: new Date(),
          status: closedBookingReason ? 'closed' : currentStatus,
          email: customerEmail,
          phone: customerPhone,
          company: customerCompany,
          signUpDeadline: bookingSignUpDeadline && bookingSignUpDeadline.length > 0 ? bookingSignUpDeadline[0] : null,
          closedReason: closedBookingReason,
          notes: bookingNotes
        }
      })

      if (!resultUpdateBooking || !resultUpdateBooking.data) {
        setProcessing(false)
        return
      }

      // Update customers object
      setCustomers([
        resultUpdateBooking.data.upsertOneCustomer,
        ...allCustomers.filter((element) => element._id !== resultUpdateBooking.data.upsertOneCustomer._id)
      ])

      if (closedBookingReason) {
        const resultEmail = await removeCampaignRequestQuote({
          variables: { customerEmail: customerEmail.toLowerCase() }
        })
        console.log('Remove campaign before redirecting:', resultEmail)
        setBookings([...allBookings.filter((element) => element._id !== resultUpdateBooking.data.updateOneBooking._id)])
      } else {
        // Update bookings object
        setBookings([
          resultUpdateBooking.data.updateOneBooking,
          ...allBookings.filter((element) => element._id !== resultUpdateBooking.data.updateOneBooking._id)
        ])
      }

      setProcessing(false)
      setClosedBookingReason(null)
    } catch (ex) {
      console.log(ex)
      setProcessing(false)
      setClosedBookingReason(null)
    }
    // Hide modal
    handleModal()
  }

  const CloseBtn = <X className="cursor-pointer" size={15} onClick={cancel} />

  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  const onChangeNotes = (e) => {
    const newArray = currentNotes ? [...currentNotes] : []
    newArray.push({
      note: e.target.value,
      author: coordinatorName,
      date: new Date()
    })
    setBookingNotes(newArray)
  }

  return (
    <Modal
      isOpen={open}
      toggle={handleModal}
      className="sidebar-sm"
      modalClassName="modal-slide-in"
      contentClassName="pt-0"
      onClosed={(e) => handleClose()}
    >
      <ModalHeader className="mb-2" toggle={handleModal} close={CloseBtn} tag="div">
        <h5 className="modal-title">Edit Booking</h5>
      </ModalHeader>
      <Nav tabs className="d-flex justify-content-around">
        <NavItem>
          <NavLink
            active={active === '1'}
            onClick={() => {
              toggle('1')
            }}
          >
            <Info />
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink>
            <Edit />
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink>
            <Settings />
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent className="py-50" activeTab={active} color="primary">
        <TabPane tabId="1">
          <ModalBody className="flex-grow-1">
            <FormGroup>
              <Label for="full-name">
                <strong>Id:</strong> <span className="text-primary">{`${bookingId}`}</span>
              </Label>
            </FormGroup>
            <FormGroup>
              <Label for="full-name">Customer Information</Label>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <User size={15} />
                  </InputGroupText>
                </InputGroupAddon>
                <Input id="full-name" placeholder="Full Name *" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <Mail size={15} />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  type="email"
                  id="email"
                  placeholder="Email *"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  invalid={!emailValid}
                  onBlur={(e) => {
                    emailValidation(e.target.value)
                  }}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <Phone size={15} />
                  </InputGroupText>
                </InputGroupAddon>
                <Cleave
                  className="form-control"
                  placeholder="Phone *"
                  options={options}
                  id="phone"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <Briefcase size={15} />
                  </InputGroupText>
                </InputGroupAddon>
                <Input id="company" placeholder="Company" value={customerCompany} onChange={(e) => setCustomerCompany(e.target.value)} />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <Label for="full-name">Event Coordinator*</Label>
              <Select
                theme={selectThemeColors}
                className="react-select"
                classNamePrefix="select"
                placeholder="Select..."
                value={{
                  label: coordinatorName,
                  value: coordinatorId
                }}
                options={
                  allCoordinators &&
                  allCoordinators.map((item) => {
                    return {
                      value: item._id,
                      label: item.name
                    }
                  })
                }
                onChange={(option) => {
                  setCoordinatorId(option.value)
                  setCoordinatorName(option.label)
                }}
                isClearable={false}
              />
            </FormGroup>
            <FormGroup>
              <Label for="full-name">Event Details*</Label>
              <Select
                theme={selectThemeColors}
                className="react-select"
                classNamePrefix="select"
                placeholder="Select one class"
                options={
                  allClasses &&
                  allClasses.map((element) => {
                    return {
                      value: element._id,
                      label: element.title
                    }
                  })
                }
                value={{
                  value: bookingTeamClassId || '',
                  label: bookingTeamClassName
                }}
                onChange={(option) => {
                  setClassVariant(null)
                  setBookingTeamClassId(option.value)
                  setBookingTeamClassName(option.label)
                }}
                isClearable={false}
              />
            </FormGroup>

            <FormGroup>
              <Label for="full-name">Class Variants*</Label>
              <Select
                theme={selectThemeColors}
                className="react-select"
                classNamePrefix="select"
                placeholder="Select..."
                value={{
                  label: classVariant && classVariant.title + ' $' + classVariant.pricePerson + (classVariant.groupEvent ? '/group' : '/person'),
                  value: classVariant
                }}
                options={
                  classVariantsOptions &&
                  classVariantsOptions.map((element) => {
                    return {
                      value: element,
                      label: element.title + ' $' + element.pricePerson + (element.groupEvent ? '/group' : '/person')
                    }
                  })
                }
                onChange={(option) => setClassVariant(option.value)}
                isClearable={false}
              />
            </FormGroup>

            <FormGroup>
              <Label for="full-name">Group Size*</Label>
              <Input
                id="attendees"
                placeholder="Group Size *"
                value={groupSize}
                onChange={(e) => setGroupSize(e.target.value)}
                type="number"
                onBlur={(e) => {
                  groupSizeValidation(e.target.value)
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="date-time-picker">Custom Sign Up Deadline</Label>
              <Flatpickr
                value={bookingSignUpDeadline}
                dateformat="Y-m-d H:i"
                data-enable-time
                id="signUpDateLine"
                className="form-control"
                placeholder="Select Date..."
                onChange={(selectedDates, dateStr, instance) => {
                  setBookingSignUpDeadline(selectedDates)
                }}
              />
              {bookingSignUpDeadline && (
                <dt className="text-right">
                  <small>
                    <a href="#" onClick={(e) => setBookingSignUpDeadline([])}>
                      Clear
                    </a>
                  </small>
                </dt>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="full-name">Close Booking</Label>
              <Select
                styles={{ option: (styles) => ({ minHeight: 40, ...styles }) }}
                value={{
                  label: closedBookingReason,
                  value: closedBookingReason
                }}
                theme={selectThemeColors}
                className="react-select"
                classNamePrefix="select"
                placeholder="Select one reason.."
                options={closeBookingOptions.map((item) => {
                  return {
                    label: item.label,
                    value: item.value
                  }
                })}
                onChange={(option) => setClosedBookingReason(option.value)}
                isClearable={false}
              />
            </FormGroup>
            <Button
              className="mr-1"
              color={closedBookingReason ? 'danger' : 'primary'}
              onClick={editBooking}
              disabled={
                !customerName ||
                !customerEmail ||
                !emailValid ||
                !customerPhone ||
                !coordinatorId ||
                !bookingTeamClassId ||
                !classVariant ||
                !groupSize
              }
            >
              {!processing && !closedBookingReason
                ? 'Save'
                : closedBookingReason && processing
                ? 'Saving...'
                : processing
                ? 'Saving...'
                : 'Close booking?'}
            </Button>
            <Button color="secondary" onClick={cancel} outline>
              Cancel
            </Button>
          </ModalBody>
        </TabPane>
      </TabContent>
    </Modal>
  )
}

export default EditBookingModal
