import React, { useState, useEffect } from 'react'
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
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
import { getUserData, isValidEmail } from '../utility/Utils'
import Cleave from 'cleave.js/react'
import { selectThemeColors } from '@utils'
import Flatpickr from 'react-flatpickr'
import mutationUpdateBooking from '../graphql/MutationUpdateBookingAndCustomer'
import mutationUpdateCalendarEventByBookindId from '../graphql/MutationUpdateCalendarEventByBookindId'
import removeCampaignRequestQuoteMutation from '../graphql/email/removeCampaignRequestQuote'
import mutationUpdateBookingNotes from '../graphql/MutationUpdateBookingNotes'
import { useMutation } from '@apollo/client'
import Avatar from '@components/avatar'
import moment from 'moment'
import classnames from 'classnames'

import './EditBookingModal.scss'
import { BOOKING_CLOSED_STATUS } from '../utility/Constants'

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
  allCalendarEvents,
  handleClose,
  editMode
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
  const [inputNote, setInputNote] = useState('')

  const [updateBooking] = useMutation(mutationUpdateBooking, {})

  const [removeCampaignRequestQuote] = useMutation(removeCampaignRequestQuoteMutation, {})

  const [updateCalendarEventStatus] = useMutation(mutationUpdateCalendarEventByBookindId, {})

  const [updateBookingNotes] = useMutation(mutationUpdateBookingNotes, {})

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
    },
    {
      label: 'Test',
      value: 'Test'
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
          instructorId: teamClass.instructorId,
          instructorName: teamClass.instructorName,
          customerId: currentCustomerId,
          customerName: customerName,
          eventDate: new Date(),
          eventDurationHours: classVariant.duration ? classVariant.duration : currentEventDurationHours,
          eventCoordinatorId: coordinatorId,
          attendees: groupSize,
          classMinimum: classVariant.minimum,
          pricePerson: classVariant.pricePerson,
          serviceFee: currentServiceFee,
          salesTax: currentSalesTax,
          discount: 0,
          createdAt: createdAt,
          updatedAt: new Date(),
          status: closedBookingReason ? BOOKING_CLOSED_STATUS : currentStatus,
          email: customerEmail,
          phone: customerPhone,
          company: customerCompany,
          signUpDeadline: bookingSignUpDeadline && bookingSignUpDeadline.length > 0 ? bookingSignUpDeadline[0] : undefined,
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
        resultUpdateBooking.data.updateOneCustomer,
        ...allCustomers.filter((element) => element._id !== resultUpdateBooking.data.updateOneCustomer._id)
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

      if (closedBookingReason === 'Lost' || closedBookingReason === 'Duplicated' || closedBookingReason === 'Mistake') {
        const calendarEventObject = allCalendarEvents.find((item) => item.bookingId === bookingId)
        if (calendarEventObject) {
          const resultStatusUpdated = await updateCalendarEventStatus({
            variables: {
              calendarEventId: calendarEventObject._id,
              status: 'canceled'
            }
          })
          console.log('Changing calendar event status', resultStatusUpdated)
        }
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

  const editNotes = async () => {
    setProcessing(true)
    const newArray = bookingNotes ? [...bookingNotes] : []
    const userData = getUserData()
    newArray.unshift({
      note: inputNote,
      author: (userData && userData.customData && userData.customData['name']) || 'Unknown',
      date: new Date()
    })

    try {
      const resultNotesUpdated = await updateBookingNotes({
        variables: {
          id: bookingId,
          notes: newArray,
          updatedAt: new Date()
        }
      })
      setBookingNotes(newArray.sort((a, b) => (a.date > b.date ? -1 : 1)))
      setBookings([
        resultNotesUpdated.data.updateOneBooking,
        ...allBookings.filter((element) => element._id !== resultNotesUpdated.data.updateOneBooking._id)
      ])
      setProcessing(false)
    } catch (ex) {
      console.log(ex)
      setProcessing(false)
    }
  }
  const CloseBtn = <X className="cursor-pointer" size={15} onClick={cancel} />

  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  const onChangeNotes = () => {
    editNotes()
    setInputNote('')
  }

  const selectStyles = {
    control: (base) => ({
      ...base,
      height: 30,
      minHeight: 30,
      fontSize: 12
    }),
    option: (provided) => ({
      ...provided,
      borderBottom: '1px dotted',
      padding: 10,
      fontSize: 12
    }),
    singleValue: (provided) => ({
      ...provided,
      padding: 0,
      fontSize: 12
    })
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
      <ModalHeader toggle={handleModal} close={CloseBtn} tag="div">
        <h5 className="modal-title">Edit Booking</h5>
      </ModalHeader>
      <Nav tabs className="d-flex justify-content-around mt-1">
        <NavItem>
          <NavLink
            title="Basic information"
            active={active === '1'}
            onClick={() => {
              toggle('1')
            }}
          >
            <Info size="18" />
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            title="Notes"
            active={active === '2'}
            onClick={() => {
              toggle('2')
            }}
          >
            <Edit size="18" />
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink title="Settings">
            <Settings size="18" />
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
              <InputGroup size="sm">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <User size={15} />
                  </InputGroupText>
                </InputGroupAddon>
                <Input id="full-name" placeholder="Full Name *" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <InputGroup size="sm">
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
              <InputGroup size="sm">
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
              <InputGroup size="sm">
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
                styles={selectStyles}
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
                styles={selectStyles}
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
              <Label for="full-name">Class Variant*</Label>
              <Select
                theme={selectThemeColors}
                styles={selectStyles}
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
              <InputGroup size="sm">
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
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <Label for="date-time-picker">Sign Up Deadline (Custom)</Label>
              <InputGroup size="sm">
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
              </InputGroup>
              {bookingSignUpDeadline && (
                <dt className="text-right">
                  <small>
                    <a href="#" onClick={(e) => setBookingSignUpDeadline([])}>
                      clear
                    </a>
                  </small>
                </dt>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="full-name">Close Booking</Label>
              <Select
                styles={selectStyles}
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
            {editMode && (
              <div align="center">
                <Button
                  className="mr-1"
                  size="sm"
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
                <Button color="secondary" size="sm" onClick={cancel} outline>
                  Cancel
                </Button>
              </div>
            )}
          </ModalBody>
        </TabPane>
        <TabPane tabId="2">
          <b className="text-primary ml-2">Notes</b>
          <Card className="notes-card mt-1">
            <CardBody>
              <ul className="timeline p-0 m-0">
                {bookingNotes && bookingNotes.length > 0 ? (
                  bookingNotes.map((item, index) => {
                    return (
                      <li key={index} className="timeline-item">
                        <span className={classnames('timeline-point timeline-point-secondary timeline-point-indicator')}>
                          {item.icon ? item.icon : null}
                        </span>
                        <div className="timeline-event">
                          <div className={classnames('d-flex justify-content-between flex-sm-row flex-column')}>
                            <small>
                              <strong>{item.author && item.author.split(' ')[0]}</strong>
                            </small>
                            <span className="timeline-event-time">
                              <small>{moment(item.date).fromNow()}</small>
                            </span>
                          </div>
                          <p
                            className={classnames({
                              'mb-0': index === bookingNotes.length - 1 && !item.customContent
                            })}
                          >
                            <small>{item.note}</small>
                          </p>
                        </div>
                      </li>
                    )
                  })
                ) : (
                  <li>
                    <p>Write your first note below...</p>
                  </li>
                )}
              </ul>
            </CardBody>
          </Card>
          <div className=" ml-2 mr-2" align="right">
            <Input className="" type="textarea" id="bookingNotes" value={inputNote} onChange={(e) => setInputNote(e.target.value)} />
            <Button onClick={onChangeNotes} size="sm" className="mt-1" color="primary" disabled={!inputNote}>
              {processing ? 'Saving note...' : 'Add Note'}
            </Button>
          </div>
        </TabPane>
        <TabPane tabId="3">Settings tab</TabPane>
      </TabContent>
    </Modal>
  )
}

export default EditBookingModal
