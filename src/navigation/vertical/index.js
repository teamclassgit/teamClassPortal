import { Mail, Home, CheckCircle, Archive, BookOpen, Book, HelpCircle } from 'react-feather';

export default [
  {
    id: 'checkout',
    title: 'In progress',
    icon: <BookOpen size={20} />,
    navLink: '/bookings'
  },
  {
    id: 'checkout2',
    title: 'Closed',
    icon: <Archive size={20} />,
    navLink: '/closedBookings'
  },
  {
    id: 'checkout3',
    title: 'Private requests',
    icon: <Book size={20} />,
    navLink: '/privateRequests'
  },
  {
    id: 'checkout4',
    title: 'General Inquiries',
    icon: <HelpCircle size={20} />,
    navLink: '/generalInquiries'
  }
];
