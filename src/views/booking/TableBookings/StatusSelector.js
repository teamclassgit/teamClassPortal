import React, { useState } from 'react'
import Select from 'react-select'
import { useMutation } from '@apollo/client'
import mutationUpdateBookingStatus from '../../../graphql/MutationUpdateBookingStatus'
import { BOOKING_STATUS } from '../../../utility/Constants'

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
          updatedAt: new Date()
        }
      })
      const bkng = BOOKING_STATUS.find((sts) => sts.value === newStatus)
      setCurrentValue({
        value: bkng.value,
        label: bkng.label
      })

      // Update bookings object
      const updatedBooking = resultUpdateBooking.data.updateOneBooking
      const oldBookingIndex = bookings.findIndex((bkn) => bkn._id === updatedBooking._id)
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
      onChange={(option) => handleStatusChange(row._id, option.value)}
    />
  )
}

export default StatusSelector
