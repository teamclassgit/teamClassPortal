import React, { useState, useEffect } from 'react'
import {
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
import { Mail, Phone, User, X, Briefcase } from 'react-feather'
import Select from 'react-select'
import { isValidEmail } from '../utility/Utils'
import Cleave from 'cleave.js/react'
import { selectThemeColors } from '@utils'
import Flatpickr from 'react-flatpickr'
import mutationUpsertBooking from '../graphql/MutationUpsertBooking'
import { useMutation } from '@apollo/client'
import moment from 'moment'
import Timeline from '@components/timeline'
import { basicData } from './data'
import Avatar from '@components/avatar'

const EditBookingModal = ({
  open,
  handleModal,
  bookingId,
  currentCustomerId,
  currentName,
  currentEmail,
  currentPhone,
  currentCompany,
  allCoordinators,
  allClasses,
  allBookings,
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
  // setCustomers,
  // setBookings,
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
  const [bookingSignUpDeadline, setBookingSignUpDeadline] = useState(new Date())
  const [closedBookingReason, setClosedBookingReason] = useState(null)
  const [bookingNotes, setBookingNotes] = useState([])
  const [active, setActive] = useState('1')
  const [processing, setProcessing] = useState(false)
  const [createBooking] = useMutation(mutationUpsertBooking, {})

  const closeBookingOptions = [
    {
      label: 'Won',
      value: 'won'
    },
    {
      label: 'Lost',
      value: 'lost'
    },
    {
      label: 'Duplicated',
      value: 'duplicated'
    },
    {
      label: 'Mistake',
      value: 'mistake'
    }
  ]

  // console.log(customerName)
  // console.log(customerEmail)
  // console.log('currentCoordinatorId', currentCoordinatorId)
  // console.log('allCordinators', allCoordinators)
  // console.log(' currentClassVariants', currentClassVariant)
  // console.log('coordinatorId', coordinatorId)
  // console.log('coordinatorName', coordinatorName)
  // console.log('bookingSignUpDeadline', bookingSignUpDeadline)
  // console.log('new Date()', new Date())
  // console.log('closeBookingReason', closedBookingReason)
  // console.log('processing', processing)
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
    setBookingSignUpDeadline(currentSignUpDeadline)
    setClosedBookingReason(currentClosedReason)
    setBookingNotes(currentNotes)
  }, [allBookings])

  console.log('classVariant', classVariant)

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

  const groupSizeValidation = (groupSize) => {
    setAttendeesValid(groupSize > 0)
  }
  const editBooking = async () => {
    setProcessing(true)

    try {
      const teamClass = allClasses.find((element) => element._id === bookingTeamClassId)

      const resultCreateBooking = await createBooking({
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
          signUpDeadline: bookingSignUpDeadline, // todavía queda pendiente de guardar la fecha
          closedReason: closedBookingReason,
          notes: bookingNotes
        }
      })

      if (!resultCreateBooking || !resultCreateBooking.data) {
        setProcessing(false)
        return
      }

      // Update customers object
      // setCustomers([
      //   resultCreateBooking.data.upsertOneCustomer,
      //   ...customers.filter((element) => element._id !== resultCreateBooking.data.upsertOneCustomer._id)
      // ])

      // // Update bookings object
      // setBookings([
      //   resultCreateBooking.data.upsertOneBooking,
      //   ...bookings.filter((element) => element._id !== resultCreateBooking.data.upsertOneBooking._id)
      // ])
      console.log('SALIENDO DEL EDITAR')
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
    const newArray = [...currentNotes] || []
    newArray.push({
      note: e.target.value,
      author: coordinatorName,
      date: new Date()
    })
    setBookingNotes(newArray)
  }

  console.log('bookingNotes', bookingNotes)
  return (
    <Modal isOpen={open} toggle={handleModal} className="sidebar-sm" modalClassName="modal-slide-in" contentClassName="pt-0">
      <ModalHeader className="mb-2" toggle={handleModal} close={CloseBtn} tag="div">
        <h5 className="modal-title">Edit Booking</h5>
      </ModalHeader>
      <Nav tabs>
        <NavItem>
          <NavLink
            active={active === '1'}
            onClick={() => {
              toggle('1')
            }}
          >
            Basic Information
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '2'}
            onClick={() => {
              toggle('2')
            }}
          >
            Notes
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '3'}
            onClick={() => {
              toggle('3')
            }}
          >
            Settings
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent className="py-50" activeTab={active} color="primary">
        <TabPane tabId="1">
          <ModalBody className="flex-grow-1">
            <FormGroup>
              <Label for="full-name">Customer Information</Label>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <User size={15} />
                    {' *'}
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
                    {`  *`}
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
                    {' *'}
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
                // defaultValue={{ value: defaultCoordinatorOption._id, label: defaultCoordinatorOption.name }}
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
                // onBlur={(e) => {
                //   groupSizeValidation(e.target.value)
                // }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="date-time-picker">Custom Sign Up Deadline</Label>
              <Flatpickr
                value={bookingSignUpDeadline}
                data-enable-time
                id="date-time-picker"
                className="form-control"
                placeholder="2021-10-28 12:00"
                onChange={(date) => {
                  console.log('date', date)
                  setBookingSignUpDeadline(date)
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="full-name">Close Booking</Label>
              <Select
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
              color={closedBookingReason ? 'warning' : 'primary'}
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
              {closedBookingReason ? 'Close booking?' : 'Save'}
            </Button>
            <Button color="secondary" onClick={cancel} outline>
              Cancel
            </Button>
          </ModalBody>
        </TabPane>
        <TabPane tabId="2">
          <Card className="ml-2 mr-2">
            <CardHeader>
              <CardTitle tag="h4">Booking Notes</CardTitle>
            </CardHeader>
            <CardBody>
              {bookingNotes && bookingNotes.length ? (
                bookingNotes.map((item, index) => (
                  <div className="mt-1">
                    {item.note}
                    <div className="d-flex justify-content-between">
                      <p>
                        <h6>
                          {' '}
                          <Avatar color={`light-dark`} content={currentCoordinatorName} initials /> By {item.author}
                        </h6>
                      </p>
                      <p>
                        <small className="">
                          {/* <strong>Updated: </strong> */}
                          {moment(item.date).fromNow()}
                        </small>
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <h3>There is no Notes for this Booking!</h3>
              )}
            </CardBody>
          </Card>
          <div className="row ml-2 mr-2">
            <Input className="col-10" type="text" id="bookingNotes" onChange={(e) => onChangeNotes(e)} />
            <Button onClick={editBooking} size="sm" className="col-2">
              {' >'}
            </Button>
          </div>
        </TabPane>
        <TabPane tabId="3">Settings tab</TabPane>
      </TabContent>
    </Modal>
  )
}

export default EditBookingModal
