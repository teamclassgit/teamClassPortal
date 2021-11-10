import { Mail, Home, CheckCircle, Book, BookOpen } from 'react-feather'

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
    icon: <Book size={20} />,
    navLink: '/closedBookings'
  }
]
