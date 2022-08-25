import moment from 'moment';
import queryGetTotalsUsingFilter from '../graphql/QueryTotalsBookingsUsingFilter';
import queryGetBookingsWithCriteria from '../graphql/QueryGetBookingsWithCriteria';
import queryBookingAndCalendarEventById from '../graphql/QueryBookingAndCalendarEventById';
import mutationUpdateManyBookings from '../graphql/MutationUpdateManyBookings';
import queryCustomerById from '../graphql/QueryCustomerById';
import { CREDIT_CARD_FEE, DEPOSIT, RUSH_FEE, SALES_TAX, SERVICE_FEE } from '../utility/Constants';
import { apolloClient } from '../utility/RealmApolloClient';
import { getQueryFiltersFromFilterArray, isNotEmptyArray } from '../utility/Utils';

//get totals associated to a booking
const getBookingTotals = (bookingInfo, isRushDate, salesTax = SALES_TAX, isCardFeeIncluded = false, includeInstructorFlatFee = false) => {
  const minimum = bookingInfo.classVariant ? bookingInfo.classVariant.minimum : bookingInfo.classMinimum;

  //pricePerson is currently in use for group based pricing too
  let price = bookingInfo.classVariant ? bookingInfo.classVariant.pricePerson : bookingInfo.pricePerson;

  const discount = bookingInfo.discount;
  let totalTaxableAdditionalItems = 0;
  let totalNoTaxableAdditionalItems = 0;
  let customDeposit = 0,
    customAttendees = undefined;

  if (bookingInfo.invoiceDetails && bookingInfo.invoiceDetails.length >= 2) {
    customDeposit = bookingInfo.invoiceDetails[0].unitPrice;
    customAttendees = bookingInfo.invoiceDetails[1].units;
    price = bookingInfo.invoiceDetails[1].unitPrice;

    const items = bookingInfo.invoiceDetails.slice(2);

    totalTaxableAdditionalItems = items
      .filter((element) => element.taxable === true)
      .reduce((previous, current) => {
        const currentTotal = current.unitPrice * current.units;
        return previous + currentTotal;
      }, 0);

    totalNoTaxableAdditionalItems = items
      .filter((element) => element.taxable === false)
      .reduce((previous, current) => {
        const currentTotal = current.unitPrice * current.units;
        return previous + currentTotal;
      }, 0);
  }

  const attendees = customAttendees || bookingInfo.attendees;

  const addons = bookingInfo.addons
    ? bookingInfo.addons.reduce((previous, current) => {
      return previous + (current.unit === 'Attendee' ? current.unitPrice * attendees : current.unitPrice);
    }, 0)
    : 0;

  const withoutFee =
    bookingInfo.classVariant && bookingInfo.classVariant.groupEvent ? price : attendees > minimum ? price * attendees : price * minimum;

  const underGroupFee = attendees > minimum || (bookingInfo.classVariant && bookingInfo.classVariant.groupEvent) ? 0 : price * (minimum - attendees);

  let cardFee = 0;
  const rushFeeByAttendee = bookingInfo.rushFee !== null && bookingInfo.rushFee !== undefined ? bookingInfo.rushFee : RUSH_FEE;
  const rushFee = isRushDate ? attendees * rushFeeByAttendee : 0;
  const instructorFlatFee = includeInstructorFlatFee && bookingInfo.classVariant?.instructorFlatFee ? bookingInfo.classVariant.instructorFlatFee : 0;

  const totalDiscount = discount > 0 ? (withoutFee + totalTaxableAdditionalItems + addons + totalNoTaxableAdditionalItems) * discount : 0;
  const fee = (withoutFee + totalTaxableAdditionalItems + addons + totalNoTaxableAdditionalItems - totalDiscount) * bookingInfo.serviceFee;
  const totalDiscountTaxableItems = discount > 0 ? (withoutFee + totalTaxableAdditionalItems + addons) * discount : 0;
  const tax = (withoutFee + fee + rushFee + instructorFlatFee + addons + totalTaxableAdditionalItems - totalDiscountTaxableItems) * salesTax;
  let finalValue = withoutFee + totalTaxableAdditionalItems + totalNoTaxableAdditionalItems + addons + fee + rushFee + instructorFlatFee + tax - totalDiscount;

  if (isCardFeeIncluded && !bookingInfo.ccFeeExempt) {
    cardFee = finalValue * CREDIT_CARD_FEE;
    finalValue = finalValue + cardFee;
  }

  const initialDeposit = finalValue * DEPOSIT;

  return {
    withoutFee,
    underGroupFee,
    rushFee,
    fee,
    tax,
    addons,
    finalValue,
    initialDeposit,
    customDeposit,
    customAttendees,
    customPrice: price,
    totalTaxableAdditionalItems,
    totalNoTaxableAdditionalItems,
    cardFee,
    discount,
    totalDiscount
  };
};

const getTotalsUsingFilter = async (filters) => {
  const { data } = await apolloClient.query({
    query: queryGetTotalsUsingFilter,
    variables: {
      filterBy: getQueryFiltersFromFilterArray(filters)
    }
  });

  return data && data.totals;
};

const getAllDataToExport = async (filters, orFilters, sortInfo) => {
  const { data } = await apolloClient.query({
    query: queryGetBookingsWithCriteria,
    fetchPolicy: 'network-only',
    variables: {
      filterBy: filters,
      sortBy: sortInfo,
      filterByOr: orFilters,
      limit: -1,
      offset: -1
    }
  });

  if (!data?.getBookingsWithCriteria?.rows?.length) return [];

  const bookings = data.getBookingsWithCriteria.rows;
  const bookingsArray = [];
  const headers = [
    '_id',
    'createdAt',
    'updatedAt',
    'className',
    'attendees',
    'eventDateTime',
    'signUpDeadline',
    'classVariant',
    'groupEvent',
    'hasKit',
    'kitHasAlcohol',
    'customerName',
    'customerPhone',
    'customerEmail',
    'customerCompany',
    'eventCoordinatorName',
    'bookingStage',
    'closedReason',
    'capRegistration',
    'hasInternationalAttendees',
    'depositsPaid',
    'depositPaidDate',
    'finalPaid',
    'finalPaymentPaidDate',
    'isRush',
    'salesTax',
    'salesTaxState',
    'taxExempt',
    'discount',
    'taxAmount',
    'serviceFeeAmount',
    'cardFeeAmount',
    'totalInvoice',
    'balance',
    'customerTags',
    'gclid',
    'instantBooking',
    'utm_campaign',
    'utm_source',
    'utm_medium',
    'utm_content',
    'utm_term',
    'bookingTags',
    'Pre-vent Survey submitted',
    'Pre-vent Survey source',
    'distributorInvoiceStatus',
    'instructorInvoiceStatus',
    'totalDistributorInvoice',
    'totalInstructorInvoice'
  ];

  bookingsArray.push(headers);

  bookings.forEach((element) => {
    const row = [
      element._id,
      element.createdAt,
      element.updatedAt,
      element.className,
      element.attendees,
      element.eventDateTime,
      element.signUpDeadline,
      element.classVariant?.title,
      element.classVariant?.groupEvent,
      element.classVariant?.hasKit,
      element.classVariant?.kitHasAlcohol,
      element.customerName,
      element.customerPhone,
      element.customerEmail,
      element.customerCompany,
      element.eventCoordinatorName,
      element.bookingStage,
      element.closedReason,
      element.capRegistration,
      element.hasInternationalAttendees,
      element.depositsPaid,
      element.depositPaidDate,
      element.finalPaid,
      element.finalPaymentPaidDate,
      element.isRush,
      element.salesTax,
      element.salesTaxState,
      element.taxExempt,
      element.discount,
      element.taxAmount,
      element.serviceFeeAmount,
      element.cardFeeAmount,
      element.totalInvoice,
      element.balance,
      (isNotEmptyArray(element.customerTags) ? element.customerTags.join(", ") : ""),
      element.gclid,
      element.instantBooking,
      element.utm_campaign,
      element.utm_source,
      element.utm_medium,
      element.utm_content,
      element.utm_term,
      (isNotEmptyArray(element.bookingTags) ? element.bookingTags.join(", ") : ""),
      element.preEventSurvey?.submittedAt,
      element.preEventSurvey?.source,
      element.distributorInvoiceStatus,
      element.instructorInvoiceStatus,
      element.totalDistributorInvoice,
      element.totalInstructorInvoice
    ];
    bookingsArray.push(row);
  });

  return bookingsArray;
};

const getBookingAndCalendarEventById = async (bookingId) => {
  const { ...resultBooking } = await apolloClient.query({
    query: queryBookingAndCalendarEventById,
    variables: {
      bookingId
    }
  });

  if (!resultBooking?.data?.booking) return;

  const booking = resultBooking.data.booking;

  const { ...resultCustomer } = await apolloClient.query({
    query: queryCustomerById,
    variables: {
      customerId: booking.customerId
    }
  });

  return { ...booking, calendarEvent: resultBooking.data.calendarEvent, customer: resultCustomer?.data?.customer };
};

const closeBookingsWithReason = async (bookingsId, closedReason) => {
  const { data } = await apolloClient.mutate({
    mutation: mutationUpdateManyBookings,
    variables: {
      query: {
        _id_in: bookingsId
      },
      set: {
        updatedAt: new Date(),
        status: "closed",
        closedReason
      }
    }
  });
};

export { getBookingTotals, getTotalsUsingFilter, getBookingAndCalendarEventById, getAllDataToExport, closeBookingsWithReason };
