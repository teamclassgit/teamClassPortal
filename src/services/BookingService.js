import moment from 'moment';
import queryGetTotalsUsingFilter from '../graphql/QueryTotalsBookingsUsingFilter';
import { CREDIT_CARD_FEE, DEPOSIT, RUSH_FEE, SALES_TAX, SERVICE_FEE } from '../utility/Constants';
import { apolloClient } from '../utility/RealmApolloClient';
import { getQueryFiltersFromFilterArray } from '../utility/Utils';
//get totals associated to a booking
const getBookingTotals = (bookingInfo, isRushDate, salesTax = SALES_TAX, isCardFeeIncluded = false, includeDiscount = false) => {
  const minimum = bookingInfo.classVariant ? bookingInfo.classVariant.minimum : bookingInfo.classMinimum;

  //pricePerson is currently in use for group based pricing too
  const price = bookingInfo.classVariant ? bookingInfo.classVariant.pricePerson : bookingInfo.pricePerson;

  const discount = includeDiscount ? bookingInfo.discount : 0;
  let totalTaxableAdditionalItems = 0;
  let totalNoTaxableAdditionalItems = 0;
  let customDeposit,
    customAttendees = undefined;

  if (bookingInfo.invoiceDetails && bookingInfo.invoiceDetails.length >= 2) {
    customDeposit = bookingInfo.invoiceDetails[0].unitPrice;
    customAttendees = bookingInfo.invoiceDetails[1].units;

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

  const totalDiscount = discount > 0 ? (withoutFee + totalTaxableAdditionalItems + addons + totalNoTaxableAdditionalItems) * discount : 0;
  const fee = (withoutFee + totalTaxableAdditionalItems + addons + totalNoTaxableAdditionalItems - totalDiscount) * SERVICE_FEE;
  const totalDiscountTaxableItems = discount > 0 ? (withoutFee + totalTaxableAdditionalItems + addons) * discount : 0;
  const tax = (withoutFee + fee + rushFee + addons + totalTaxableAdditionalItems - totalDiscountTaxableItems) * salesTax;
  let finalValue = withoutFee + totalTaxableAdditionalItems + totalNoTaxableAdditionalItems + fee + rushFee + addons + tax - totalDiscount;

  if (isCardFeeIncluded) {
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

export { getBookingTotals, getTotalsUsingFilter };
