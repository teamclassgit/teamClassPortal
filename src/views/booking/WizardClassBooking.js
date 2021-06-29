import React, {useRef, useState} from 'react'
import Wizard from '@components/wizard'
import Attendees from './steps/Attendees'
import Confirmation from './steps/Confirmation'
import BillingInfo from './steps/BillingInfo'
import SpecialRequests from './steps/SpecialRequests'
import DateTimeConfirmation from './steps/DateTimeConfirmation'
import {Col, Row, Spinner} from 'reactstrap'
import {Calendar, Check, CreditCard, Users, List} from 'react-feather'
import {useParams} from "react-router-dom"

import queryBookingById from "../../graphql/QueryBookingById"
import queryClassById from "../../graphql/QueryClassById"
import queryCustomerById from "../../graphql/QueryCustomerById"
import queryAttendeesByBookingId from "../../graphql/QueryAttendeesByBookingId"
import queryCalendarEventsByClassId from "../../graphql/QueryCalendarEventsByClassId"
import {useLazyQuery, useQuery} from "@apollo/client"
import BookingSummaryWithoutDate from "./steps/BookingSummaryWithoutDate"

const RUSH_FEE = 0.15
const SERVICE_FEE = 0.1

const WizardClassBooking = ({oneStepOnly, step}) => {

    const [bookingInfo, setBookingInfo] = React.useState(null)
    const [bookingAdditions, setBookingAdditions] = React.useState([])
    const [totalAdditions, setTotalAdditions] = React.useState(0)
    const [confirmation, setConfirmation] = React.useState(false)
    const [teamClass, setTeamClass] = React.useState(null)
    const [customer, setCustomer] = React.useState(null)
    const [availableEvents, setAvailableEvents] = React.useState(null)
    const [stepper, setStepper] = useState(null)
    const [calendarEvent, setCalendarEvent] = React.useState(null)
    const [attendees, setAttendees] = React.useState([])
    const [realCountAttendees, setRealCountAttendees] = React.useState(0)
    const [getTeamClass, {...classResult}] = useLazyQuery(queryClassById)
    const [getCustomer, {...customerResult}] = useLazyQuery(queryCustomerById)
    const [getClassEvents, {...calendarEventsByClassResult}] = useLazyQuery(queryCalendarEventsByClassId)
    const [getAttendees, {...attendeesResult}] = useLazyQuery(queryAttendeesByBookingId)

    const ref = useRef(null)
    const {id} = useParams()

    const result = useQuery(queryBookingById,
        {
            variables: {
                bookingId: id
            },
            onCompleted: data => {
                setBookingInfo(data.getBooking)
            }
        })

    React.useEffect(() => {

        if (bookingInfo) {

            getAttendees({
                variables: {
                    bookingId: bookingInfo.id
                }
            })

            getTeamClass({
                variables: {
                    classId: bookingInfo.teamClassId
                }
            })
            getCustomer({
                variables: {
                    customerId: bookingInfo.customerId
                }
            })
            getClassEvents({
                variables: {
                    classId: bookingInfo.teamClassId
                }
            })

            setConfirmation(bookingInfo && bookingInfo.status === 'confirmed')
        }

    }, [bookingInfo])

    React.useEffect(() => {

        if (bookingInfo && attendeesResult.data) {
            setAttendees(attendeesResult.data.listAttendees.items.map(element => element))
            setRealCountAttendees(attendeesResult.data.listAttendees.items.length)
        }

    }, [attendeesResult.data])

    React.useEffect(() => {

        if (bookingInfo && classResult.data) setTeamClass(classResult.data.getTeamClass)

    }, [classResult.data])

    React.useEffect(() => {

        if (bookingInfo && customerResult.data) setCustomer(customerResult.data.getCustomer)

    }, [customerResult.data])

    React.useEffect(() => {

        if (bookingInfo && calendarEventsByClassResult.data) {
            setAvailableEvents(calendarEventsByClassResult.data.listCalendarEvents.items.map(element => element))
            const bookingEvent = calendarEventsByClassResult.data.listCalendarEvents.items.filter(element => element.bookingId === bookingInfo.id)

            if (bookingEvent && bookingEvent.length > 0) setCalendarEvent(bookingEvent[0])
        }

    }, [calendarEventsByClassResult.data])

    React.useEffect(() => {

        let total = 0

        if (bookingAdditions && bookingInfo) {
            total = bookingAdditions.reduce((accumulator, current) => {
                if (current.unit === "Class") return accumulator + (current.unitPrice * (current.quantity ? current.quantity : 0))
                else if (current.unit === "Attendee") return accumulator + (current.unitPrice * bookingInfo.attendees * (current.quantity ? current.quantity : 0))
                else return 0
            }, 0)
        }

        setTotalAdditions(total)

    }, [bookingAdditions])


    const steps = [
        {
            id: 'account-details',
            title: 'Event Date',
            subtitle: 'Date and time',
            icon: <Calendar size={18}/>,
            content: <DateTimeConfirmation classRushFee={RUSH_FEE} stepper={stepper} type='wizard-horizontal' availableEvents={availableEvents}
                                           calendarEvent={calendarEvent} setCalendarEvent={setCalendarEvent}
                                           booking={bookingInfo} teamClass={teamClass}/>
        },

       /* {
            id: 'additions',
            title: 'Additionals',
            subtitle: 'Special requests',
            icon: <List size={18}/>,
            content: <SpecialRequests stepper={stepper} type='wizard-horizontal' booking={bookingInfo}
                                      teamClass={teamClass} setBookingAdditions={setBookingAdditions}/>
        }, */

        {
            id: 'step-address',
            title: 'Attendees',
            subtitle: 'Who is coming',
            icon: <Users size={18}/>,
            content: <Attendees stepper={stepper} type='wizard-horizontal' attendees={attendees}
                                teamClass={teamClass} booking={bookingInfo}
                                setRealCountAttendees={setRealCountAttendees}/>
        },

        {
            id: 'personal-info',
            title: 'Reservation',
            subtitle: 'Billing details',
            icon: <CreditCard size={18}/>,
            content: <BillingInfo stepper={stepper} type='wizard-horizontal' calendarEvent={calendarEvent}
                                  setCalendarEvent={setCalendarEvent} customer={customer} booking={bookingInfo}
                                  attendeesListCount={attendees && attendees.length} setConfirmation={setConfirmation}/>
        }
    ]

    const stepsConfirmation = [
        {
            id: 'confirmation',
            title: 'Confirmation',
            subtitle: 'Booking summary',
            icon: <Check size={18}/>,
            content: <Confirmation stepper={stepper} type='wizard-horizontal' customer={customer}
                                   booking={bookingInfo} setConfirmation={setConfirmation}/>
        }
    ]

    const jumpToStep = (event) => {
        //if (event.detail.to === 3) event.preventDefault()
    }

    return bookingInfo && customer && teamClass ? (
        <Row>
            <Col lg={9} md={12} sm={12}>
                <div className='modern-horizontal-wizard'>

                    {!confirmation && <Wizard
                        type='modern-horizontal'
                        ref={ref}
                        steps={steps}
                        options={{
                            linear: oneStepOnly
                        }}
                        instance={el => {
                            setStepper(el)
                        }}/>}
                    {confirmation && <Wizard
                        type='modern-horizontal'
                        ref={ref}
                        steps={stepsConfirmation}
                        options={{
                            linear: oneStepOnly
                        }}
                        instance={el => {
                            setStepper(el)
                            //if (oneStepOnly && step) el.to(step)
                        }}/>}
                </div>
            </Col>

            <Col lg={3} md={12} sm={12}>
                <div className='py-3'>
                    {bookingInfo && (<BookingSummaryWithoutDate calendarEvent={calendarEvent}
                                                                classRushFee={RUSH_FEE}
                                                                teamClass={teamClass}
                                                                serviceFee={SERVICE_FEE}
                                                                attendeesAdded={realCountAttendees}
                                                                attendees={bookingInfo.attendees}
                                                                pricePerson={bookingInfo.pricePerson}
                                                                minimum={bookingInfo.classMinimum}
                                                                salesTax={bookingInfo.salesTax}
                                                                bookingId={id}
                                                                additionals={totalAdditions}/>)}
                </div>
            </Col>
        </Row>
    ) : (<div>
        <Spinner className='mr-25'/>
        <Spinner type='grow'/>
    </div>)

}

export default WizardClassBooking
