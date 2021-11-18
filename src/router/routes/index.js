import { lazy } from 'react';

// ** Document title
const TemplateTitle = '%s - TeamClass Ops Dashboard';

// ** Default Route
const DefaultRoute = '/bookings';

// ** Merge Routes
const Routes = [
  {
    path: '/bookings',
    component: lazy(() => import('../../views/booking/bookingList'))
  },
  {
    path: '/closedBookings',
    component: lazy(() => import('../../views/booking/BookingClosedList'))
  },
  {
    path: '/booking/:id',
    component: lazy(() => import('../../views/booking')),
    layout: 'VerticalLayoutNoMenu'
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
