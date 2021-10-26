import { lazy } from 'react'

// ** Document title
const TemplateTitle = '%s - TeamClass Ops Dashboard'

// ** Default Route
const DefaultRoute = '/bookings'

// ** Merge Routes
const Routes = [
  {
    path: '/bookings',
    component: lazy(() => import('../../views/booking/bookingList'))
  },
  {
    path: '/booking/:id',
    component: lazy(() => import('../../views/booking')),
    layout: 'VerticalLayoutNoMenu'
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
]

export { DefaultRoute, TemplateTitle, Routes }
