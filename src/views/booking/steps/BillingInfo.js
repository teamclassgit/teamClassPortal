import React, {Fragment} from 'react'
import {ArrowLeft} from 'react-feather'
import {Button, Col, Form, FormGroup, Input, Row} from 'reactstrap'
import '@styles/react/libs/react-select/_react-select.scss'
import CreditCardMask from "../../forms/input-mask/CreditCardMask"
import ExpCreditCardMask from "../../forms/input-mask/ExpCreditCardMask"
import Cleave from "cleave.js/react"
import 'cleave.js/dist/addons/cleave-phone.us'
import {useMutation} from "@apollo/client"
import mutationUpdateQuote from "../../../graphql/MutationUpdateQuote"
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
    const [updateBooking, {...finalQuotaData}] = useMutation(mutationUpdateQuote, {})

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

            const resultUpdate = await updateBooking(
                {
                    variables: {
                        bookingId: booking._id,
                        customerId: booking.customerId,
                        calendarEventId: calendarEvent._id,
                        name,
                        phone,
                        email,
                        company,
                        updatedAt: new Date(),
                        status: "confirmed"
                    }
                }
            )

            console.log("booking updated")

            if (resultUpdate && resultUpdate.data && resultUpdate.data.updateOneCalendarEvent) setCalendarEvent(resultUpdate.data.updateOneCalendarEvent)

            setProcessing(false)
            setConfirmation(true)

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
