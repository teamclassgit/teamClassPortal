import { Mail, Home, CheckCircle, BookOpen } from 'react-feather'

export default [
  {
    id: 'checkout',
    title: 'In progress',
    icon: <BookOpen size={20} />,
    navLink: '/bookings'
  },
  {
    id: 'checkout',
    title: 'Closed',
    icon: <BookOpen size={20} />,
    navLink: '/closedBookings'
  }
]
