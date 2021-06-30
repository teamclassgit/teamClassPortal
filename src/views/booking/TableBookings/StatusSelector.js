import React, { useState } from 'react'
import moment from 'moment'
import Select from 'react-select'
import { useMutation } from '@apollo/client'
import mutationUpdateBookingStatus from '../../../graphql/MutationUpdateBookingStatus'
import { BOOKING_STATUS } from '../../../utility/constants'

function StatusSelector({ row, value, bookings, setBookings }) {
  const [currentValue, setCurrentValue] = useState(value)
  const [updateBookingStatus] = useMutation(mutationUpdateBookingStatus, {})

  // Here we change the status of the dragged card
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const resultUpdateBooking = await updateBookingStatus({
        variables: {
          id: bookingId,
          status: newStatus,
          updatedAt: moment().format()
        }
      })
      const bkng = BOOKING_STATUS.find((sts) => sts.value === newStatus)
      setCurrentValue({
        value: bkng.value,
        label: bkng.label
      })

      // Update bookings object
      const updatedBooking = resultUpdateBooking.data.updateBooking
      const oldBookingIndex = bookings.findIndex((bkn) => bkn.id === updatedBooking.id)
      const newBookings = [...bookings]
      newBookings[oldBookingIndex] = updatedBooking
      setBookings(newBookings)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Select
      className="react-select-status"
      menuPortalTarget={document.querySelector('body')}
      value={currentValue}
      placeholder="Status"
      options={BOOKING_STATUS.map((bkng) => {
        return {
          value: bkng.value,
          label: bkng.label
        }
      })}
      onChange={(option) => handleStatusChange(row.id, option.value)}
    />
  )
}

export default StatusSelector
