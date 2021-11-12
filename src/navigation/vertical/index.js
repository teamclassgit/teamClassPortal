import { Mail, Home, CheckCircle, Archive, BookOpen } from 'react-feather'

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
    icon: <Archive size={20} />,
    navLink: '/closedBookings'
  }
]
