// @packages
import { lazy } from 'react';

// @constants
const TemplateTitle = '%s - TeamClass Ops Dashboard';
const DefaultRoute = '/pipeline';

// @routes
const Routes = [
  {
    path: '/calendar',
    component: lazy(() => import('../../views/calendar/bookingCalendarList'))
  },
  {
    path: '/bookings',
    component: lazy(() => import('../../views/booking/BookingList'))
  },
  {
    path: '/pipeline',
    component: lazy(() => import('../../views/booking/FunnelTable'))
  },
  {
    path: '/allbookings',
    component: lazy(() => import('../../views/booking/AllBookingsTable'))
  },
  {
    path: '/booking/:id',
    component: lazy(() => import('../../views/booking'))
  },
  {
    path: '/generalInquiries',
    component: lazy(() => import('../../views/generalInquiries/GeneralInquiriesList'))
  },
  {
    path: '/privateRequests',
    component: lazy(() => import('../../views/privateRequests/PrivateRequestsList'))
  },
  {
    path: '/discountCodes',
    component: lazy(() => import('../../views/discountCodes/DiscountCodesList'))
  },
  {
    path: '/giftBaskets',
    component: lazy(() => import('../../views/giftBaskets/GiftBasketsList'))
  },
  {
    path: '/login',
    component: lazy(() => import('../../views/Login')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true
    }
  },
  {
    path: '/error',
    component: lazy(() => import('../../views/Error')),
    layout: 'BlankLayout'
  }
];

export { DefaultRoute, TemplateTitle, Routes };
