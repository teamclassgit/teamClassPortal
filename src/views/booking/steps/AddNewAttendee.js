// ** React Imports
import React from 'react'

// ** Third Party Components
import { Mail, Phone, User, X } from 'react-feather'
import { Button, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label, Modal, ModalBody, ModalHeader } from 'reactstrap'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import Cleave from 'cleave.js/react'
import 'cleave.js/dist/addons/cleave-phone.us'
import { isValidEmail } from '../../../utility/Utils'
import { v4 as uuid } from 'uuid'

const AddNewAttendee = ({ open, handleModal, currentBookingId, currentElement, saveAttendee, data, setData, updateAttendeesCount }) => {
  const [newName, setNewName] = React.useState('')
  const [newEmail, setNewEmail] = React.useState('')
  const [newPhone, setNewPhone] = React.useState('')
  const [newAddress1, setNewAddress1] = React.useState('')
  const [newAddress2, setNewAddress2] = React.useState('')
  const [newCity, setNewCity] = React.useState('')
  const [newState, setNewState] = React.useState('')
  const [newZip, setNewZip] = React.useState('')
  const [newCountry, setNewCountry] = React.useState('')
  const [processing, setProcessing] = React.useState(false)
  const [emailValid, setEmailValid] = React.useState(true)

  const options = { phone: true, phoneRegionCode: 'US' }

  const emailValidation = (email) => {
    setEmailValid(isValidEmail(email))
  }

  const saveNewAttendee = async () => {
    setProcessing(true)
    try {
      const newElement = {
        id: currentElement && currentElement._id ? currentElement._id : uuid(),
        city: newCity,
        phone: newPhone,
        bookingId: currentBookingId,
        zip: newZip,
        addressLine1: newAddress1,
        addressLine2: newAddress2,
        email: newEmail,
        country: newCountry,
        name: newName,
        state: newState
      }

      const savedRow = await saveAttendee(newElement)
      const newData = data.filter((element) => element._id !== savedRow._id)
      newData.push(savedRow)
      setData(newData)
      updateAttendeesCount(newData.length)

      setProcessing(false)

      handleModal()
    } catch (ex) {
      console.log(ex)
      setProcessing(false)
    }
  }

  const cancel = () => {
    handleModal()
  }

  // ** Custom close btn
  const CloseBtn = <X className="cursor-pointer" size={15} onClick={cancel} />

  React.useEffect(() => {
    if (currentElement) {
      setNewName(currentElement.name)
      setNewEmail(currentElement.email)
      setNewPhone(currentElement.phone)
      setNewAddress1(currentElement.addressLine1)
      setNewAddress2(currentElement.addressLine2)
      setNewCity(currentElement.city)
      setNewState(currentElement.state)
      setNewZip(currentElement.zip)
      setNewCountry(currentElement.country)
    }
  }, [currentElement])

  return (
    <Modal isOpen={open} toggle={handleModal} className="sidebar-sm" modalClassName="modal-slide-in" contentClassName="pt-0">
      <ModalHeader className="mb-3" toggle={handleModal} close={CloseBtn} tag="div">
        <h5 className="modal-title">New Attendee</h5>
      </ModalHeader>
      <ModalBody className="flex-grow-1">
        <FormGroup>
          <Label for="full-name">Personal Information</Label>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <User size={15} />
              </InputGroupText>
            </InputGroupAddon>
            <Input id="full-name" placeholder="Full Name" value={newName} onChange={(e) => setNewName(e.target.value)} />
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
              placeholder="Email"
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
              className="form-control"
              placeholder="Phone"
              options={options}
              id="phone"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
            />
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <Label for="addressLine1">Shipping Address</Label>
          <InputGroup>
            <Input id="addressLine1" placeholder="Address Line 1" value={newAddress1} onChange={(e) => setNewAddress1(e.target.value)} />
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <InputGroup>
            <Input id="addressLine2" placeholder="Address Line 2" value={newAddress2} onChange={(e) => setNewAddress2(e.target.value)} />
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <InputGroup>
            <Input id="city" placeholder="City" value={newCity} onChange={(e) => setNewCity(e.target.value)} />
            <Input id="state" placeholder="State" value={newState} onChange={(e) => setNewState(e.target.value)} />
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <InputGroup>
            <Input id="country" placeholder="Country" value={newCountry} onChange={(e) => setNewCountry(e.target.value)} />
            <Input id="zip" type="number" placeholder="Zip Code" value={newZip} onChange={(e) => setNewZip(e.target.value)} />
          </InputGroup>
        </FormGroup>

        <Button className="mr-1" color="primary" onClick={saveNewAttendee} disabled={!newName || !newEmail || processing || !emailValid}>
          {processing ? 'Saving...' : 'Save'}
        </Button>
        <Button color="secondary" onClick={cancel} outline>
          Cancel
        </Button>
      </ModalBody>
    </Modal>
  )
}

export default AddNewAttendee
