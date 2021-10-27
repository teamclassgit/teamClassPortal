// ** React Imports
import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
// ** Third Party Components
import { Mail, Phone, User, X, Briefcase } from 'react-feather'
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
  CustomInput,
  Alert
} from 'reactstrap'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import Cleave from 'cleave.js/react'
import 'cleave.js/dist/addons/cleave-phone.us'
import { isValidEmail, isPhoneValid } from '../../utility/Utils'
import mutationUpsertBooking from '../../graphql/MutationUpsertBooking'
import { useMutation } from '@apollo/client'
import { v4 as uuid } from 'uuid'

const AddNewBooking = ({ open, handleModal, bookings, currentElement, customers, setCustomers, setBookings, classes, editMode }) => {
  const [isOldCustomer, setIsOldCustomer] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newCompany, setNewCompany] = useState('')
  const [newAttendees, setNewAttendees] = useState('')
  const [selectedClass, setSelectedClass] = useState(null)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [emailValid, setEmailValid] = useState(true)
  const [phoneValid, setPhoneValid] = useState(true)
  const [attendeesValid, setAttendeesValid] = useState(true)
  const [warning, setWarning] = useState({ open: false, message: '' })
  const [createBooking] = useMutation(mutationUpsertBooking, {})
  const [classVariantsOptions, setClassVariantsOptions] = useState([])
  const [classVariant, setClassVariant] = useState(null)

  const serviceFeeValue = 0.1
  const salesTaxValue = 0.0825

  const options = { phone: true, phoneRegionCode: 'US' }

  const emailValidation = (email) => {
    setEmailValid(isValidEmail(email))
  }

  const phoneValidation = (phone) => {
    setPhoneValid(true)
  }

  useEffect(() => {
    phoneValidation(newPhone)
  }, [newPhone])

  const groupSizeValidation = (groupSize) => {
    setAttendeesValid(groupSize > 0)
  }

  useEffect(() => {
    if (selectedClass) {
      const filteredClass = classes.find((element) => element._id === selectedClass)
      if (filteredClass) setClassVariantsOptions(filteredClass.variants)
    }
  }, [selectedClass])

  const saveNewBooking = async () => {
    setProcessing(true)

    try {
      let customer = undefined
      if (isOldCustomer && selectedCustomer) {
        customer = customers.find((element) => element._id === selectedCustomer)
      } else if (customers.find((element) => element.email.toLowerCase() === newEmail.toLowerCase())) {
        setWarning({ open: true, message: 'A customer with the same email already exist.' })
        setProcessing(false)
        return
      }

      const teamClass = classes.find((element) => element._id === selectedClass)

      const resultCreateBooking = await createBooking({
        variables: {
          bookingId: currentElement && currentElement._id ? currentElement._id : uuid(),
          date: new Date(), // combine with quotaTime
          teamClassId: selectedClass,
          classVariant: classVariant,
          instructorId: teamClass.instructorId ? teamClass.instructorId : teamClass._id,
          instructorName: teamClass.instructorName,
          customerId: customer ? customer._id : uuid(),
          customerName: customer ? customer.name : newName,
          eventDate: new Date(),
          eventDurationHours: classVariant.duration,
          attendees: newAttendees,
          classMinimum: classVariant.minimum,
          pricePerson: classVariant.pricePerson,
          serviceFee: serviceFeeValue,
          salesTax: salesTaxValue,
          discount: 0,
          createdAt: currentElement && currentElement.createdAt ? currentElement.createdAt : new Date(),
          updatedAt: new Date(),
          status: currentElement && currentElement.status ? currentElement.status : 'quote',
          email: customer ? customer.email : newEmail,
          phone: customer ? customer.phone : newPhone,
          company: customer ? customer.company : newCompany
        }
      })

      if (!resultCreateBooking || !resultCreateBooking.data) {
        setProcessing(false)
        return
      }

      // Update customers object
      setCustomers([
        resultCreateBooking.data.upsertOneCustomer,
        ...customers.filter((element) => element._id !== resultCreateBooking.data.upsertOneCustomer._id)
      ])

      // Update bookings object
      setBookings([
        resultCreateBooking.data.upsertOneBooking,
        ...bookings.filter((element) => element._id !== resultCreateBooking.data.upsertOneBooking._id)
      ])
      setProcessing(false)
      setClassVariant(null)
    } catch (ex) {
      console.log(ex)
      setProcessing(false)
    }
    // Hide modal
    handleModal()
  }

  const cancel = () => {
    handleModal()
  }

  // ** Custom close btn
  const CloseBtn = <X className="cursor-pointer" size={15} onClick={cancel} />

  useEffect(() => {
    if (currentElement) {
      setNewName(currentElement.name)
      setNewEmail(currentElement.email)
      setNewPhone(currentElement.phone)
      setNewCompany(currentElement.company)
      setNewAttendees(currentElement.attendees)
      setSelectedClass(currentElement.class)
      setSelectedCustomer(null)
      setIsOldCustomer(false)
      setWarning({ open: false, message: '' })
    }
  }, [currentElement])

  const getClassName = (id) => {
    const res = classes.find((element) => element._id === selectedClass)
    return res ? res.title : ''
  }

  return (
    <Modal isOpen={open} toggle={handleModal} className="sidebar-sm" modalClassName="modal-slide-in" contentClassName="pt-0">
      <ModalHeader className="mb-3" toggle={handleModal} close={CloseBtn} tag="div">
        <h5 className="modal-title">{editMode ? 'Edit Booking' : 'New Booking'}</h5>
      </ModalHeader>
      <ModalBody className="flex-grow-1">
        {!editMode ? (
          <FormGroup>
            <div className="demo-inline-spacing">
              <CustomInput
                type="radio"
                id="exampleCustomRadio"
                name="customRadio"
                inline
                label="New Customer"
                onClick={(e) => {
                  setIsOldCustomer(false)
                  setSelectedCustomer(null)
                }}
                defaultChecked
              />
              <CustomInput
                type="radio"
                id="exampleCustomRadio2"
                name="customRadio"
                inline
                label="Old Customer"
                onClick={(e) => {
                  setIsOldCustomer(true)
                  setWarning({ open: false, message: '' })
                }}
              />
            </div>
          </FormGroup>
        ) : (
          ''
        )}

        {!isOldCustomer && (
          <div>
            <FormGroup>
              <Label for="full-name">Customer Information</Label>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <User size={15} />
                  </InputGroupText>
                </InputGroupAddon>
                <Input id="full-name" placeholder="Full Name *" value={newName} onChange={(e) => setNewName(e.target.value)} />
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
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
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
                  className={`${phoneValid ? '' : 'border-danger'} form-control`}
                  placeholder="Phone *"
                  options={options}
                  id="phone"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  onBlur={(e) => {
                    phoneValidation(e.target.value)
                  }}
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
                <Input id="company" placeholder="Company" value={newCompany} onChange={(e) => setNewCompany(e.target.value)} />
              </InputGroup>
            </FormGroup>
          </div>
        )}
        {isOldCustomer && (
          <FormGroup>
            <Label for="selectedCustomer">Select Customer</Label>

            <Select
              theme={selectThemeColors}
              className="react-select"
              classNamePrefix="select"
              placeholder="Customer Name/Email *"
              options={
                customers &&
                customers.map((element) => {
                  return {
                    value: element._id,
                    label: `${element.name.split(' ')[0]} <${element.email}>`
                  }
                })
              }
              onChange={(option) => setSelectedCustomer(option.value)}
              isClearable={false}
            />
          </FormGroup>
        )}

        <FormGroup>
          <Label for="full-name">Event Details</Label>

          <Select
            theme={selectThemeColors}
            className="react-select"
            classNamePrefix="select"
            placeholder="Select Class *"
            options={
              classes &&
              classes.map((element) => {
                return {
                  value: element._id,
                  label: element.title
                }
              })
            }
            value={{
              value: selectedClass || '',
              label: getClassName(selectedClass)
            }}
            onChange={(option) => setSelectedClass(option.value)}
            isClearable={false}
          />
        </FormGroup>
        {selectedClass && (
          <FormGroup>
            <Label for="full-name">Class Variants</Label>
            <Select
              theme={selectThemeColors}
              className="react-select"
              classNamePrefix="select"
              placeholder="Select..."
              options={
                classVariantsOptions &&
                classVariantsOptions.map((element) => {
                  return {
                    value: element,
                    label: element.title + ' $' + element.pricePerson + '/person'
                  }
                })
              }
              onChange={(option) => setClassVariant(option.value)}
              isClearable={false}
            />
          </FormGroup>
        )}

        <FormGroup>
          <Input
            id="attendees"
            placeholder="Group Size *"
            value={newAttendees}
            onChange={(e) => setNewAttendees(e.target.value)}
            type="number"
            onBlur={(e) => {
              groupSizeValidation(e.target.value)
            }}
          />
        </FormGroup>
        <Button
          className="mr-1"
          color="primary"
          onClick={saveNewBooking}
          disabled={
            (!selectedCustomer && (!newName || !newEmail || !newPhone || !emailValid || !phoneValid)) ||
            !newAttendees ||
            processing ||
            !attendeesValid ||
            !selectedClass ||
            !classVariant
          }
        >
          {processing ? 'Saving...' : 'Save'}
        </Button>
        <Button color="secondary" onClick={cancel} outline>
          Cancel
        </Button>
        {warning.open && (
          <div>
            <br />
            <Alert color="warning" isOpen={warning.open}>
              <div className="alert-body">
                <span>{warning.message}</span>
              </div>
            </Alert>
          </div>
        )}
      </ModalBody>
    </Modal>
  )
}

export default AddNewBooking
