// ** React Imports
import React, {forwardRef, Fragment, useState} from 'react'
import Board from '@lourenci/react-kanban'
import '@lourenci/react-kanban/dist/styles.css'
import {toAmPm} from "../../utility/Utils"
import moment from "moment"

const BoardBookings = ({bookings, customers, setCustomers, classes, calendarEvents}) => {

    const getCustomerEmail = (customerId) => {

        const result = customers.filter(element => element.id === customerId)
        return result && result.length > 0 ? result[0].email : ''
    }

    const getClassTitle = (teamClassId) => {

        const result = classes.filter(element => element.id === teamClassId)
        return result && result.length > 0 ? result[0].title : ''
    }

    const getFormattedEventDate = (bookingId) => {

        const result = calendarEvents.filter(element => element.bookingId === bookingId)

        if (result && result.length > 0) {
            const calendarEvent = result[0]
            const date = new Date(calendarEvent.year, calendarEvent.month - 1, calendarEvent.day)
            const time = toAmPm(calendarEvent.fromHour, calendarEvent.fromMinutes, '')
            return `${moment(date).format("LL")} ${time}`
        }

        return ''
    }

    const bookingCards = bookings.map(element => {

        return {
            id: element.id,
            title: `${element.customerName} - (${element.attendees} attendees)`,
            description: getClassTitle(element.teamClassId),
            status: element.status
        }

    })

    console.log(bookingCards)

    const board = {
        columns: [
            {
                id: 1,
                title: 'Quote',
                cards: bookingCards.filter(element => element.status.indexOf('quote') > -1)
            },
            {
                id: 2,
                title: 'Scheduled',
                cards: bookingCards.filter(element => element.status.indexOf('scheduled') > -1)
            },
            {
                id: 3,
                title: 'Coordinating',
                cards: bookingCards.filter(element => element.status.indexOf('coordinating') > -1)
            },
            {
                id: 4,
                title: 'Headcount',
                cards: bookingCards.filter(element => element.status.indexOf('headcount') > -1)
            },
            {
                id: 5,
                title: 'Invoice sent',
                cards: bookingCards.filter(element => element.status.indexOf('invoiced') > -1)
            },
            {
                id: 6,
                title: 'Invoice paid',
                cards: bookingCards.filter(element => element.status.indexOf('confirmed') > -1)
            }
        ]
    }

    return <div>
        <Board initialBoard={board}/>
    </div>
}

export default BoardBookings