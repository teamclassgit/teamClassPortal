import React, { useEffect, useState, useContext } from 'react';
import { useMutation } from '@apollo/client';
import { Row } from 'reactstrap';
import mutationUpdateBookingStatus from '../../../graphql/MutationUpdateBookingStatus';
import BoardCard from './BoardCard/BoardCard';
import Board from '@lourenci/react-kanban';
import { BOOKING_STATUS } from '../../../utility/Constants';
import { getCustomerPhone, getCustomerCompany, getCustomerEmail, getClassTitle, getFormattedEventDate, getCoordinatorName } from '../common';
import './BoardBookings.scss';
import '@lourenci/react-kanban/dist/styles.css';

const BoardBookings = ({ filteredBookings, customers, classes, calendarEvents, coordinators, handleEditModal }) => {
  const [updateBookingStatus] = useMutation(mutationUpdateBookingStatus, {});
  const [loading, setLoading] = useState(true);

  const getEmptyBoard = () => {
    return {
      columns: BOOKING_STATUS.filter((element) => element.board === true).map(({ label, value }, index) => ({
        id: index,
        title: label,
        cards: []
      }))
    };
  };

  const getLoadingBoard = () => {
    return {
      columns: BOOKING_STATUS.filter((element) => element.board === true).map(({ label, value }, index) => ({
        id: index,
        title: 'Loading...',
        cards: []
      }))
    };
  };

  const getColumnData = (bookingCards, column) => {
    if (column === 'quote' || column === 'canceled') return bookingCards.filter(({ status }) => status.indexOf(column) > -1);

    if (column === 'date-requested') {
      return bookingCards.filter(({ status, calendarEvent }) => {
        return status.indexOf(column) > -1 && calendarEvent && (calendarEvent.status === 'reserved' || calendarEvent.status === 'rejected');
      });
    }

    if (column === 'accepted') {
      return bookingCards.filter(({ status, calendarEvent }) => {
        return status.indexOf('date-requested') > -1 && calendarEvent && calendarEvent.status === 'confirmed';
      });
    }

    if (column === 'confirmed') {
      return bookingCards.filter(({ status, payments }) => {
        const depositPayment = payments && payments.find((element) => element.paymentName === 'deposit' && element.status === 'succeeded');
        return status.indexOf(column) > -1 && depositPayment;
      });
    }

    if (column === 'paid') {
      return bookingCards.filter(({ status, payments }) => {
        const finalPayment = payments && payments.find((element) => element.paymentName === 'final' && element.status === 'succeeded');
        return status.indexOf(column) > -1 && finalPayment;
      });
    }

    return [];
  };

  const getBoard = () => {
    const bookingCards = filteredBookings.map(
      ({
        _id,
        teamClassId,
        customerId,
        customerName,
        attendees,
        eventDurationHours,
        eventCoordinatorId,
        classMinimum,
        pricePerson,
        serviceFee,
        salesTax,
        classVariant,
        status,
        payments,
        createdAt,
        updatedAt,
        signUpDeadline,
        closedReason,
        notes,
        hasInternationalAttendees
      }) => {
        return {
          customerName,
          _id,
          attendees,
          teamClassId,
          createdAt,
          updatedAt,
          signUpDeadline,
          classVariant,
          status,
          payments,
          customerId,
          eventDurationHours,
          eventCoordinatorId,
          coordinatorName: getCoordinatorName(eventCoordinatorId, coordinators),
          classTitle: getClassTitle(teamClassId, classes),
          email: getCustomerEmail(customerId, customers),
          phone: getCustomerPhone(customerId, customers),
          company: getCustomerCompany(customerId, customers),
          serviceFee,
          pricePerson,
          minimum: classMinimum,
          salesTax,
          attendeesAdded: 0,
          additionals: 0,
          calendarEvent: calendarEvents.find((element) => element.bookingId === _id),
          closedReason,
          notes,
          hasInternationalAttendees
        };
      }
    );
    return {
      columns: BOOKING_STATUS.filter((element) => element.board === true).map(({ label, value }, index) => ({
        id: index,
        title: label,
        cards: getColumnData(bookingCards, value)
      }))
    };
  };

  const [loadingBoard, setLoadingBoard] = useState(getLoadingBoard());
  const [board, setBoard] = useState(getEmptyBoard());

  useEffect(() => {
    setLoading(true);
    const newBoard = getBoard();
    setBoard(newBoard);
    setLoading(false);
  }, [filteredBookings]);

  // Here we change the status of the dragged card
  const handleDragCard = async (booking, source, destination) => {
    const sourceStatus = BOOKING_STATUS[source.fromColumnId].value;
    const newStatus = BOOKING_STATUS[destination.toColumnId].value;
    const bookingId = booking._id;

    try {
      await updateBookingStatus({
        variables: {
          id: bookingId,
          status: newStatus,
          updatedAt: new Date()
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Row>
        <Board
          disableColumnDrag={true}
          onNewCardConfirm={(draftCard) => ({
            id: new Date().getTime(),
            ...draftCard
          })}
          onCardDragEnd={(a, card, source, destination) => handleDragCard(card, source, destination)}
          renderCard={(cardConTent) => <BoardCard content={cardConTent} handleEditModal={handleEditModal} />}
        >
          {(!loading && board) || loadingBoard}
        </Board>
      </Row>
    </>
  );
};

export default BoardBookings;
