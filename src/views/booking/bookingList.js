import React, {Fragment} from 'react'
import DataTableBookings from './TableBookings'
import queryAllBookings from '../../graphql/QueryAllBookings'
import queryAllCalendarEvents from "../../graphql/QueryAllCalendarEvents"
import queryAllCustomers from "../../graphql/QueryAllCustomers"
import queryAllClasses from "../../graphql/QueryAllClasses"
import {useMutation, useQuery} from "@apollo/client"
import {Col, Row, Spinner} from "reactstrap"


const BookingList = () => {

    const [genericFilter, setGenericFilter] = React.useState({id: {ne: ""}})
    const [bookings, setBookings] = React.useState([])
    const [customers, setCustomers] = React.useState([])
    const [classes, setClasses] = React.useState([])
    const [calendarEvents, setCalendarEvents] = React.useState([])

    const {...allBookingsResult} = useQuery(queryAllBookings,
        {
            fetchPolicy: "no-cache",
            variables: {
                filter: genericFilter
            }
        })

    React.useEffect(() => {

        if (allBookingsResult.data) setBookings(allBookingsResult.data.listBookings.items)

    }, [allBookingsResult.data])

    const {...allCalendarEventsResults} = useQuery(queryAllCalendarEvents,
        {
            fetchPolicy: "no-cache",
            variables: {
                filter: genericFilter
            }
        })

    React.useEffect(() => {

        if (allCalendarEventsResults.data) setCalendarEvents(allCalendarEventsResults.data.listCalendarEvents.items)

    }, [allCalendarEventsResults.data])


    const {...allCustomersResult} = useQuery(queryAllCustomers,
        {
            fetchPolicy: "no-cache",
            variables: {
                filter: genericFilter
            }
        })

    React.useEffect(() => {

        if (allCustomersResult.data) setCustomers(allCustomersResult.data.listCustomers.items)

    }, [allCustomersResult.data])

    const {...allClasses} = useQuery(queryAllClasses,
        {
            fetchPolicy: "no-cache",
            variables: {
                filter: genericFilter
            }
        })

    React.useEffect(() => {

        if (allClasses.data) setClasses(allClasses.data.listTeamClasses.items)

    }, [allClasses.data])

    return (
        <Fragment>
            {(allClasses.loading || allBookingsResult.loading || allCalendarEventsResults.loading || allCustomersResult.loading) && (
                <div>
                    <Spinner className='mr-25' />
                    <Spinner type='grow' />
                </div>
            )}
            {allBookingsResult && allBookingsResult.data &&
            <Row>
                <Col sm='12'>
                    <DataTableBookings data={bookings} customers={customers} calendarEvents={calendarEvents}
                                       classes={classes}/>
                </Col>
            </Row>}
        </Fragment>
    )
}
export default BookingList
