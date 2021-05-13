import React, {useRef, useState} from 'react'
import Wizard from '@components/wizard'
import Attendees from './steps/Attendees'
import Confirmation from './steps/Confirmation'
import PersonalInfo from './steps/PersonalInfo'
import DateTimeConfirmation from './steps/DateTimeConfirmation'
import {Row, Col, Spinner} from 'reactstrap'
import {Calendar, Users, Check, CreditCard} from 'react-feather'
import {
    useParams
} from "react-router-dom"

import queryBookingById from "../../graphql/QueryBookingById"
import queryClassById from "../../graphql/QueryClassById"
import queryCustomerById from "../../graphql/QueryCustomerById"
import queryAttendeesByBookingId from "../../graphql/QueryAttendeesByBookingId"
import queryCalendarEventsByClassId from "../../graphql/QueryCalendarEventsByClassId"
import {useLazyQuery, useQuery} from "@apollo/client"
import BookingSummaryWithoutDate from "./steps/BookingSummaryWithoutDate"

const WizardClassBooking = () => {
    const [bookingInfo, setBookingInfo] = React.useState(null)
    const [teamClass, setTeamClass] = React.useState(null)
    const [customer, setCustomer] = React.useState(null)
    const [availableEvents, setAvailableEvents] = React.useState(null)
    const [stepper, setStepper] = useState(null)
    const [calendarEvent, setCalendarEvent] = React.useState(null)
    const [attendees, setAttendees] = React.useState([])
    const [realCountAttendees, setRealCountAttendees] = React.useState(0)

    const ref = useRef(null)

    const {id} = useParams()

    const [getTeamClass, {...classResult}] = useLazyQuery(queryClassById)
    const [getCustomer, {...customerResult}] = useLazyQuery(queryCustomerById)
    const [getClassEvents, {...calendarEventsByClassResult}] = useLazyQuery(queryCalendarEventsByClassId)
    const [getAttendees, {...attendeesResult}] = useLazyQuery(queryAttendeesByBookingId)

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

    const steps = [
        {
            id: 'account-details',
            title: 'Event Date',
            subtitle: 'Date and time',
            icon: <Calendar size={18}/>,
            content: <DateTimeConfirmation stepper={stepper} type='wizard-horizontal' availableEvents={availableEvents}
                                           calendarEvent={calendarEvent} setCalendarEvent={setCalendarEvent}
                                           booking={bookingInfo} teamClass={teamClass}/>
        },
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
            content: <PersonalInfo stepper={stepper} type='wizard-horizontal' calendarEvent={calendarEvent}
                                   setCalendarEvent={setCalendarEvent} customer={customer} booking={bookingInfo}
                                   attendeesListCount={attendees && attendees.length}/>
        },
        {
            id: 'social-links',
            title: 'Confirmation',
            subtitle: 'Booking summary',
            icon: <Check size={18}/>,
            content: <Confirmation stepper={stepper} type='wizard-horizontal' customer={customer}
                                   booking={bookingInfo}/>
        }
    ]

    return bookingInfo && customer && teamClass ? (
        <Row>
            <Col lg={9} md={12} sm={12}>
                <div className='modern-horizontal-wizard'>

                    <Wizard
                        type='modern-horizontal'
                        ref={ref}
                        steps={steps}
                        options={{
                            linear: true
                        }}
                        instance={el => setStepper(el)}
                    />

                </div>
            </Col>

            <Col lg={3} md={12} sm={12}>
                <div className='py-3'>
                    {bookingInfo && (<BookingSummaryWithoutDate calendarEvent={calendarEvent}
                                                                teamClass={teamClass}
                                                                serviceFee={0.1}
                                                                attendeesAdded={realCountAttendees}
                                                                attendees={bookingInfo.attendees}
                                                                pricePerson={bookingInfo.pricePerson}
                                                                minimum={bookingInfo.classMinimum}
                                                                salesTax={bookingInfo.salesTax}/>)}
                </div>
            </Col>
        </Row>
    ) : (<div>
        <Spinner className='mr-25'/>
        <Spinner type='grow'/>
    </div>)

}

export default WizardClassBooking
