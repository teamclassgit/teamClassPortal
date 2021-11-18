import React from 'react';

function StatusSelector ({ row, calendarEvent }) {
  const getColumnData = () => {
    if (!row) return;

    if (row.status.indexOf('quote') > -1) return 'Quote';

    if (row.status.indexOf('canceled') > -1) return 'Canceled';

    if (row.status.indexOf('closed') > -1) return 'Closed';

    if (row.status.indexOf('date-requested') > -1 && calendarEvent && calendarEvent.status === 'reserved') return 'Date requested';

    if (row.status.indexOf('date-requested') > -1 && calendarEvent && calendarEvent.status === 'confirmed') return 'Accepted';

    if (row.status.indexOf('date-requested') > -1 && calendarEvent && calendarEvent.status === 'rejected') return 'Rejected';

    const depositPayment = row.payments && row.payments.find((element) => element.paymentName === 'deposit' && element.status === 'succeeded');

    const finalPayment = row.payments && row.payments.find((element) => element.paymentName === 'final' && element.status === 'succeeded');

    if (row.status.indexOf('confirmed') > -1 && depositPayment) return 'Deposit paid';

    if (row.status.indexOf('paid') > -1 && finalPayment) return 'Paid';

    if (row.status.indexOf('reviews') > -1 || (row.status.indexOf('confirmed') > -1 && (!row.payments || row.payments.length === 0))) return 'Reviews';

    return 'Unknown';
  };

  return <span>{`${getColumnData()}`}</span>;
}

export default StatusSelector;
