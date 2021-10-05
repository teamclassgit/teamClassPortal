import React from 'react'

function StatusSelector({ row, calendarEvent }) {
  const getColumnData = () => {
    if (!row) return

    if (row.status.indexOf('quote') > -1) return 'quote'

    if (row.status.indexOf('date-requested') > -1 && calendarEvent && calendarEvent.status === 'reserved') return 'Date requested'

    if (row.status.indexOf('date-requested') > -1 && calendarEvent && calendarEvent.status === 'confirmed') return 'Accepted'

    if (row.status.indexOf('date-requested') > -1 && calendarEvent && calendarEvent.status === 'rejected') return 'Rejected'

    if (row.status.indexOf('confirmed') > -1 && row.payments && row.payments.length > 0) return 'Deposit paid'

    if (row.status.indexOf('confirmed') > -1 && (!row.payments || row.payments.length === 0)) return 'Reviews'

    return 'Unknown'
  }

  return <span>{`${getColumnData()}`}</span>
}

export default StatusSelector
