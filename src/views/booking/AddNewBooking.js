// ** React Imports
import React from 'react'
import Select from 'react-select'
import {selectThemeColors} from '@utils'
// ** Third Party Components
import {Mail, Phone, User, X, Briefcase} from 'react-feather'
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
    CustomInput, Alert
} from 'reactstrap'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import Cleave from 'cleave.js/react'
import 'cleave.js/dist/addons/cleave-phone.us'
import {isValidEmail} from "../../utility/Utils"
import mutationCreateCustomer from "../../graphql/MutationCreateCustomer"
import mutationCreateQuota from "../../graphql/MutationCreateQuota"
import {useMutation} from "@apollo/client"
import moment from "moment"

const AddNewBooking = ({
                           open,
                           handleModal,
                           data,
                           setData,
                           currentElement,
                           customers,
                           setCustomers,
                           classes
                       }) => {

    const [isOldCustomer, setIsOldCustomer] = React.useState(false)
    const [newName, setNewName] = React.useState("")
    const [newEmail, setNewEmail] = React.useState("")
    const [newPhone, setNewPhone] = React.useState("")
    const [newCompany, setNewCompany] = React.useState("")
    const [newAttendees, setNewAttendees] = React.useState("")
    const [selectedClass, setSelectedClass] = React.useState(null)
    const [selectedCustomer, setSelectedCustomer] = React.useState(null)
    const [processing, setProcessing] = React.useState(false)
    const [emailValid, setEmailValid] = React.useState(true)
    const [attendeesValid, setAttendeesValid] = React.useState(true)
    const [warning, setWarning] = React.useState({open: false, message: ""})
    const [createCustomer] = useMutation(mutationCreateCustomer, {})
    const [createQuota] = useMutation(mutationCreateQuota, {})

    const serviceFeeValue = 0.1
    const salesTaxValue = 0.0825

    const options = {phone: true, phoneRegionCode: 'US'}

    const emailValidation = (email) => {
        setEmailValid(isValidEmail(email))
    }

    const groupSizeValidation = (groupSize) => {
        setAttendeesValid(groupSize > 0)
    }

    const colourOptions = [
        {value: 'ocean', label: 'Ocean'},
        {value: 'blue', label: 'Blue'},
        {value: 'purple', label: 'Purple'},
        {value: 'red', label: 'Red'},
        {value: 'orange', label: 'Orange'}
    ]

    const saveNewBooking = async () => {

        setProcessing(true)

        try {

            let customer = undefined

            if (isOldCustomer && selectedCustomer) {
                customer = customers.find(element => element.id === selectedCustomer)
            } else if (customers.find(element => element.email.toLowerCase() === newEmail.toLowerCase())) {
                setWarning({open: true, message: "A customer with the same email already exist."})
                setProcessing(false)
                return
            } else {

                const resultCreateCustomer = await createCustomer(
                    {
                        variables: {
                            name: newName, // combine with quotaTime
                            email: newEmail,
                            phone: newPhone,
                            createdAt: moment().format(),
                            updatedAt: moment().format()
                        }
                    }
                )

                if (!resultCreateCustomer || !resultCreateCustomer.data) {
                    console.log("Error creating customer", resultCreateCustomer)
                    setProcessing(false)
                    return
                }

                console.log("1. New customer created: ", resultCreateCustomer.data.createCustomer.id)
                customer = resultCreateCustomer.data.createCustomer
                setCustomers([resultCreateCustomer.data.createCustomer, ...customers])
            }

            const teamClass = classes.find(element => element.id === selectedClass)

            const resultCreateQuota = await createQuota(
                {
                    variables: {
                        date: moment().format(), // combine with quotaTime
                        teamClassId: selectedClass,
                        instructorId: teamClass.instructorId ? teamClass.instructorId : teamClass.id,
                        instructorName: teamClass.instructorName,
                        customerId: customer.id,
                        customerName: customer.name,
                        customerIntro: "",
                        eventDate: moment().format(),
                        eventDurationHours: teamClass.duration,
                        attendees: newAttendees,
                        classMinimum: teamClass.minimum,
                        pricePerson: teamClass.pricePerson,
                        serviceFee: serviceFeeValue,
                        salesTax: salesTaxValue,
                        discount: 0,
                        createdAt: moment().format(),
                        updatedAt: moment().format(),
                        status: "quote"
                    }
                }
            )

            if (!resultCreateQuota || !resultCreateQuota.data) {
                console.log("Error creating quota", resultCreateQuota)
                setProcessing(false)
                return
            }

            console.log("2. New quota created: ", resultCreateQuota.data.createBooking.id)
            setData([resultCreateQuota.data.createBooking, ...data])
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
    const CloseBtn = <X className='cursor-pointer' size={15} onClick={cancel}/>

    React.useEffect(() => {

        if (currentElement) {
            setNewName(currentElement.name)
            setNewEmail(currentElement.email)
            setNewPhone(currentElement.phone)
            setNewCompany(currentElement.company)
            setNewAttendees(currentElement.attendees)
            setSelectedClass(null)
            setSelectedCustomer(null)
            setIsOldCustomer(false)
            setWarning({open: false, message: ""})
        }

    }, [currentElement])

    return (
        <Modal
            isOpen={open}
            toggle={handleModal}
            className='sidebar-sm'
            modalClassName='modal-slide-in'
            contentClassName='pt-0'
        >
            <ModalHeader className='mb-3' toggle={handleModal} close={CloseBtn} tag='div'>
                <h5 className='modal-title'>New Booking</h5>
            </ModalHeader>
            <ModalBody className='flex-grow-1'>
                <FormGroup>
                    <div className='demo-inline-spacing'>
                        <CustomInput type='radio' id='exampleCustomRadio' name='customRadio' inline label='New Customer'
                                     onClick={e => {
                                         setIsOldCustomer(false)
                                         setSelectedCustomer(null)
                                     }} defaultChecked/>
                        <CustomInput type='radio' id='exampleCustomRadio2' name='customRadio' inline
                                     label='Old Customer' onClick={e => {
                            setIsOldCustomer(true)
                            setWarning({open:false, message: ""})
                        }}/>
                    </div>
                </FormGroup>
                {!isOldCustomer && <div>
                    <FormGroup>
                        <Label for='full-name'>Customer Information</Label>
                        <InputGroup>
                            <InputGroupAddon addonType='prepend'>
                                <InputGroupText>
                                    <User size={15}/>
                                </InputGroupText>
                            </InputGroupAddon>
                            <Input id='full-name' placeholder='Full Name *' value={newName}
                                   onChange={e => setNewName(e.target.value)}/>
                        </InputGroup>
                    </FormGroup>
                    <FormGroup>
                        <InputGroup>
                            <InputGroupAddon addonType='prepend'>
                                <InputGroupText>
                                    <Mail size={15}/>
                                </InputGroupText>
                            </InputGroupAddon>
                            <Input type='email' id='email' placeholder='Email *' value={newEmail}
                                   onChange={e => setNewEmail(e.target.value)}
                                   invalid={!emailValid}
                                   onBlur={(e) => {
                                       emailValidation(e.target.value)
                                   }}/>
                        </InputGroup>
                    </FormGroup>
                    <FormGroup>
                        <InputGroup>
                            <InputGroupAddon addonType='prepend'>
                                <InputGroupText>
                                    <Phone size={15}/>
                                </InputGroupText>
                            </InputGroupAddon>
                            <Cleave className='form-control' placeholder='Phone *' options={options} id='phone'
                                    value={newPhone} onChange={e => setNewPhone(e.target.value)}/>
                        </InputGroup>
                    </FormGroup>
                    <FormGroup>
                        <InputGroup>
                            <InputGroupAddon addonType='prepend'>
                                <InputGroupText>
                                    <Briefcase size={15}/>
                                </InputGroupText>
                            </InputGroupAddon>
                            <Input id='company' placeholder='Company' value={newCompany}
                                   onChange={e => setNewCompany(e.target.value)}/>
                        </InputGroup>
                    </FormGroup>
                </div>
                }
                {isOldCustomer && <FormGroup>
                    <Label for='selectedCustomer'>Select Customer</Label>

                    <Select
                        theme={selectThemeColors}
                        className='react-select'
                        classNamePrefix='select'
                        placeholder="Customer Name/Email *"
                        options={customers && customers.map(element => {
                            return {
                                value: element.id,
                                label: `${element.name.split(" ")[0]} <${element.email}>`
                            }
                        })}
                        onChange={(option) => setSelectedCustomer(option.value)}
                        isClearable={false}
                    />
                </FormGroup>}

                <FormGroup>
                    <Label for='full-name'>Event Details</Label>

                    <Select
                        theme={selectThemeColors}
                        className='react-select'
                        classNamePrefix='select'
                        placeholder="Select Class *"
                        options={classes && classes.map(element => {
                            return {
                                value: element.id,
                                label: element.title
                            }
                        })}
                        onChange={(option) => setSelectedClass(option.value)}
                        isClearable={false}
                    />
                </FormGroup>

                <FormGroup>

                    <Input id='attendees' placeholder='Group Size *' value={newAttendees}
                           onChange={e => setNewAttendees(e.target.value)} type="number" onBlur={(e) => {
                        groupSizeValidation(e.target.value)
                    }}/>

                </FormGroup>
                <Button className='mr-1' color='primary' onClick={saveNewBooking}
                        disabled={(!selectedCustomer && (!newName || !newEmail || !newPhone || !emailValid)) || !newAttendees || processing || !attendeesValid || !selectedClass}>
                    {processing ? "Saving..." : "Save"}
                </Button>
                <Button color='secondary' onClick={cancel} outline>
                    Cancel
                </Button>
                {warning.open && <div>
                    <br/>
                    <Alert color='warning' isOpen={warning.open}>
                        <div className='alert-body'>
                            <span>
                                {warning.message}
                            </span>
                        </div>
                    </Alert>
                </div>
                }
            </ModalBody>
        </Modal>
    )
}

export default AddNewBooking
