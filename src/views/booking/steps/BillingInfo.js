import React, {Fragment} from 'react'
import {ArrowLeft} from 'react-feather'
import {Button, Col, Form, FormGroup, Input, Row} from 'reactstrap'
import '@styles/react/libs/react-select/_react-select.scss'
import CreditCardMask from "../../forms/input-mask/CreditCardMask"
import ExpCreditCardMask from "../../forms/input-mask/ExpCreditCardMask"
import Cleave from "cleave.js/react"
import 'cleave.js/dist/addons/cleave-phone.us'
import moment from "moment"
import {useMutation} from "@apollo/client"
import mutationUpdateQuota from "../../../graphql/MutationUpdateQuota"
import mutationCreateCalendarEvent from "../../../graphql/MutationCreateCalendarEvent"
import mutationUpdateCalendarEvent from "../../../graphql/MutationUpdateCalendarEvent"
import mutationUpdateCustomer from "../../../graphql/MutationUpdateCustomer"
import {isValidEmail} from "../../../utility/Utils"

const BillingInfo = ({
                         stepper,
                         type,
                         booking,
                         attendeesListCount,
                         customer,
                         calendarEvent,
                         setCalendarEvent,
                         setConfirmation
                     }) => {

    const [phone, setPhone] = React.useState("")
    const [name, setName] = React.useState("")
    const [company, setCompany] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [emailValid, setEmailValid] = React.useState(true)
    const [processing, setProcessing] = React.useState(false)
    const [updateQuota, {...finalQuotaData}] = useMutation(mutationUpdateQuota, {})
    const [createCalendarEvent, {...calendarEventData}] = useMutation(mutationCreateCalendarEvent, {})
    const [updateCalendarEvent, {...UpdatedCalendarEventData}] = useMutation(mutationUpdateCalendarEvent, {})
    const [updateCustomer, {...updateCustomerData}] = useMutation(mutationUpdateCustomer, {})

    const emailValidation = (email) => {
        setEmailValid(isValidEmail(email))
    }

    const options = {phone: true, phoneRegionCode: 'US'}

    React.useEffect(() => {

        if (customer) {
            setName(customer.name)
            setEmail(customer.email)
            setPhone(customer.phone)
            setCompany(customer.company)
        }

    }, [customer])

    const saveBooking = async () => {

        setProcessing(true)

        try {
            const date = moment(new Date(calendarEvent.year, calendarEvent.month - 1, calendarEvent.day))
            const eventDate = moment(`${date.format("DD/MM/YYYY")} ${calendarEvent.fromHour}:${calendarEvent.fromMinutes}`, 'DD/MM/YYYY HH:mm')

            await updateQuota(
                {
                    variables: {
                        id: booking.id,
                        customerName: name,
                        eventDate: eventDate.format(), // combine with quotaTime
                        attendees: attendeesListCount > 0 ? attendeesListCount : booking.attendees,
                        updatedAt: moment().format(),
                        status: "confirmed",
                        serviceFee: booking.serviceFee,
                        salesTax: booking.salesTax,
                        instructorId: booking.instructorId,
                        instructorName: booking.instructorName,
                        customerId: booking.customerId,
                        discount: 0
                    }
                }
            )

            console.log("booking updated")

            const newName = name
            const newPhone = phone
            const newEmail = email
            const newCompany = company

            await updateCustomer(
                {
                    variables: {
                        id: customer.id,
                        name: newName, // combine with quotaTime
                        phone: newPhone,
                        email: newEmail,
                        company: newCompany,
                        updatedAt: moment().format()
                    }
                }
            )

            console.log("customer updated")


            if (calendarEvent.id) {

                const calendarEventUpdated = {
                    id: calendarEvent.id,
                    classId: calendarEvent.classId,
                    bookingId: calendarEvent.bookingId,
                    year: calendarEvent.year,
                    month: calendarEvent.month,
                    day: calendarEvent.day,
                    fromHour: calendarEvent.fromHour,
                    fromMinutes: calendarEvent.fromMinutes,
                    toHour: calendarEvent.toHour,
                    toMinutes: calendarEvent.toMinutes,
                    status: "confirmed",
                    isRushFee : calendarEvent.rushFee
                }

                await updateCalendarEvent(
                    {
                        variables: calendarEventUpdated
                    }
                )

                setCalendarEvent(calendarEventUpdated)

                console.log("calendar event updated")

            }

            setProcessing(false)

            setConfirmation(true)
            //stepper.next()

        } catch (ex) {

            console.log(ex)
            setProcessing(false)

        }

    }

    return (
        <Fragment>

            <Form onSubmit={e => e.preventDefault()}>
                <Row>
                    <Col lg={12}>
                        <div className='content-header'>
                            <h5 className='mb-0'>Personal Info</h5>
                            <small>Enter your personal information</small>
                        </div>
                        <Row>
                            <FormGroup tag={Col} md='6'>
                                <Input type='text' name='full-name' id={`full-name-${type}`} placeholder='Full Name'
                                       value={name}
                                       onChange={(e) => setName(e.target.value)}/>
                            </FormGroup>
                            <FormGroup tag={Col} md='6'>
                                <Input type='text' name='company-name' id={`company-name-${type}`}
                                       placeholder='Company Name' value={company}
                                       onChange={(e) => setCompany(e.target.value)}/>
                            </FormGroup>
                        </Row>
                        <Row>
                            <FormGroup tag={Col} md='6'>
                                <Input
                                    type='email'
                                    name={`email-${type}`}
                                    id={`email-${type}`}
                                    placeholder='Email'
                                    aria-label='john.doe'
                                    value={email}
                                    invalid={!emailValid}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onBlur={(e) => {
                                        emailValidation(e.target.value)
                                    }}
                                />
                            </FormGroup>
                            <FormGroup tag={Col} md='6'>
                                <Cleave className='form-control' placeholder='Phone Number' options={options}
                                        id={`phone-${type}`} value={phone} onChange={e => setPhone(e.target.value)}/>

                            </FormGroup>
                        </Row>
                        <div className='content-header'>
                            <h5 className='mb-0'>Payment Details</h5>
                            <small>Enter your credit card information</small>
                        </div>

                        <Row>
                            <FormGroup tag={Col} md='6'>
                                <CreditCardMask/>
                            </FormGroup>
                            <FormGroup tag={Col} md='3'>
                                <ExpCreditCardMask/>
                            </FormGroup>
                            <FormGroup tag={Col} md='3'>
                                <Input
                                    type='number'
                                    name={`cvc-${type}`}
                                    id={`cvc-${type}`}
                                    placeholder='CVC'
                                    disabled={true}
                                    aria-label='john.doe'
                                />
                            </FormGroup>
                        </Row>
                    </Col>
                </Row>
                <div className='d-flex justify-content-between'>
                    <Button.Ripple color='primary' className='btn-prev' onClick={() => stepper.previous()}>
                        <ArrowLeft size={14} className='align-middle mr-sm-25 mr-0'></ArrowLeft>
                        <span className='align-middle d-sm-inline-block d-none'>Previous</span>
                    </Button.Ripple>
                    <Button.Ripple color='secondary' className='btn-submit' onClick={() => saveBooking()}
                                   disabled={!phone || !name || !email || processing || !emailValid || !calendarEvent}>
                        {processing ? `Saving...` : `Submit`}
                    </Button.Ripple>
                </div>
            </Form>
        </Fragment>
    )
}

export default BillingInfo
