import {lazy} from 'react'

// ** Document title
const TemplateTitle = '%s - Vuexy React Admin Template'

// ** Default Route
const DefaultRoute = '/bookings'

// ** Merge Routes
const Routes = [
    {
        path: '/home',
        component: lazy(() => import('../../views/Home'))
    },
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

export {DefaultRoute, TemplateTitle, Routes}