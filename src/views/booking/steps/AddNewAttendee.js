// ** React Imports
import React from 'react'

// ** Third Party Components
import { Mail, Phone, User, X } from 'react-feather'
import { Button, Col, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import Select from 'react-select'
// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import Cleave from 'cleave.js/react'
import 'cleave.js/dist/addons/cleave-phone.us'
import { isValidEmail } from '../../../utility/Utils'
import { v4 as uuid } from 'uuid'

import countriesData from '../../../data/countries.json'

const AddNewAttendee = ({
  open,
  handleModal,
  currentBookingId,
  currentElement,
  saveAttendee,
  data,
  setData,
  updateAttendeesCount,
  mode,
  teamClassInfo,
  hasKit
}) => {
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
  const [dinamycValues, setDinamycValues] = React.useState([])

  const options = { phone: true, phoneRegionCode: 'US' }

  const shippingCountries =
    countriesData &&
    countriesData.countries.map((country) => ({
      label: country.name,
      value: country.alpha2Code
    }))

  const emailValidation = (email) => {
    setEmailValid(isValidEmail(email))
  }

  const saveNewAttendee = async () => {
    setProcessing(true)

    let additionalFields = (teamClassInfo.registrationFields && teamClassInfo.registrationFields.filter((element) => element.active === true)) || []

    additionalFields =
      additionalFields &&
      additionalFields.map((item) => {
        const dynamicValue = dinamycValues.find((item2) => item2.name === item.label)
        return {
          name: item.label,
          value: (dynamicValue && dynamicValue.value) || '',
          order: item.order
        }
      })
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
        state: newState,
        additionalFields
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
      setDinamycValues(currentElement.additionalFields)
    }
  }, [currentElement])

  const onChangeDinamyc = (value, additionalField, field) => {
    if (field.type === 'multiSelectionList') {
      const newArr = value.map((element) => element.label)
      value = newArr.join(' | ')
    }
    if (additionalField) {
      const additionalFieldChanged = { ...additionalField }
      additionalFieldChanged.value = value
      const newDynamicValues = dinamycValues.filter((item) => item.name !== additionalField.name)
      newDynamicValues.push(additionalFieldChanged)
      setDinamycValues(newDynamicValues)
    } else {
      const newDynamicValues = dinamycValues ? [...dinamycValues] : []
      const name = field.label
      const order = field.order
      newDynamicValues.push({ order, name, value })
      setDinamycValues(newDynamicValues)
    }
  }

  return (
    <Modal isOpen={open} toggle={handleModal} className="sidebar-sm" modalClassName="modal-slide-in" contentClassName="pt-0">
      <ModalHeader className="mb-3" toggle={handleModal} close={CloseBtn} tag="div">
        {mode === 'edit' ? <h5 className="modal-title">Edit Attendee</h5> : <h5 className="modal-title">New Attendee</h5>}
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
            <Input id="full-name" placeholder="Full Name*" required={true} value={newName} onChange={(e) => setNewName(e.target.value)} />
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
              placeholder="Email*"
              required={true}
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
            <Input
              id="addressLine1"
              placeholder="Address Line 1*"
              required={true}
              value={newAddress1}
              onChange={(e) => setNewAddress1(e.target.value)}
            />
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <InputGroup>
            <Input id="addressLine2" placeholder="Address Line 2" value={newAddress2} onChange={(e) => setNewAddress2(e.target.value)} />
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <InputGroup>
            <Input id="city" placeholder="City*" required={true} value={newCity} onChange={(e) => setNewCity(e.target.value)} />
            <Input id="state" placeholder="State*" value={newState} onChange={(e) => setNewState(e.target.value)} />
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <InputGroup>
            <Input
              type="select"
              name="country"
              id="country"
              placeholder="Select..."
              required={true}
              value={newCountry}
              placeholder="Country*"
              onChange={(e) => setNewCountry(e.target.value)}
            >
              <option value={''}>{''}</option>
              {shippingCountries.map((option) => (
                <option key={`${option.value}-option-key-shipping-countries`} value={option.label}>
                  {option.label}
                </option>
              ))}
            </Input>
            <Input
              id="zip"
              type="number"
              placeholder="Zip Code*"
              required={true}
              value={newZip}
              onChange={(e) => {
                setNewZip(e.target.value)
              }}
            />
          </InputGroup>
          <small className="form-text text-muted mb-2 ml-2">Select a country*</small>
        </FormGroup>
        {teamClassInfo.registrationFields && teamClassInfo.registrationFields.length > 0 ? <Label for="full-name">Additional information</Label> : ''}
        {teamClassInfo.registrationFields &&
          teamClassInfo.registrationFields
            .filter((element) => element.active === true)
            .sort((field1, field2) => field1.order < field2.order)
            .map((field, index) => {
              const additionalField = dinamycValues && dinamycValues.find((item) => item.name === field.label)

              return (
                <FormGroup className="ml-0 pl-0">
                  <Label for={field.label}>{field.label + (field.required ? '*' : '')}</Label>
                  {field.type === 'textarea' && (
                    <Input
                      type={field.type}
                      name={field.label}
                      id={field.label}
                      required={field.required}
                      value={additionalField && additionalField.value}
                      onChange={(e) => onChangeDinamyc(e.target.value, additionalField, field)}
                    />
                  )}
                  {field.type === 'text' && (
                    <Input
                      type={field.type}
                      name={field.label}
                      id={field.label}
                      required={field.required}
                      value={additionalField && additionalField.value}
                      onChange={(e) => {
                        onChangeDinamyc(e.target.value, additionalField, field)
                      }}
                    />
                  )}
                  {field.type === 'number' && (
                    <Input
                      type={field.type}
                      name={field.label}
                      id={field.label}
                      max="1000000"
                      min="0"
                      required={field.required}
                      value={additionalField && additionalField.value}
                      onChange={(e) => onChangeDinamyc(e.target.value, additionalField, field)}
                    />
                  )}
                  {field.type === 'list' && (
                    <Input
                      type="select"
                      value={additionalField && additionalField.value}
                      name={field.label}
                      id={field.label}
                      placeholder="Select..."
                      onChange={(e) => onChangeDinamyc(e.target.value, additionalField, field)}
                    >
                      <option defaultValue></option>
                      {field.listItems.map((value) => (
                        <option key={value}>{value}</option>
                      ))}
                    </Input>
                  )}
                  {field.type === 'multiSelectionList' && (
                    <Select
                      id={field.label}
                      value={
                        additionalField &&
                        additionalField.value.split(' | ').map((item) => {
                          return {
                            label: item,
                            value: item
                          }
                        })
                      }
                      isMulti
                      required={field.required}
                      name={field.label}
                      options={field.listItems.map((element) => {
                        return {
                          label: element,
                          value: element
                        }
                      })}
                      onChange={(e) => onChangeDinamyc(e, additionalField, field)}
                      className="basic-multi-select"
                    ></Select>
                  )}
                </FormGroup>
              )
            })}
        <Button
          className="mr-1 mt-1"
          color="primary"
          onClick={saveNewAttendee}
          disabled={!newName || !newEmail || processing || !emailValid || !newAddress1 || !newCity || !newState || !newZip || !newCountry}
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

export default AddNewAttendee
