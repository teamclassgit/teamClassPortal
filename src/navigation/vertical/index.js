import { Archive, BookOpen, Book, Calendar, Gift, HelpCircle, Tag } from 'react-feather';

export default [
  {
    id: 'checkout0',
    title: 'Events calendar',
    icon: <Calendar size={20} />,
    navLink: '/calendar'
  },
  {
    id: 'checkout1',
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
    title: 'General inquiries',
    icon: <HelpCircle size={20} />,
    navLink: '/generalInquiries'
  },
  {
    id: 'checkout5',
    title: 'Discount codes',
    icon: <Tag size={20} />,
    navLink: '/discountCodes'
  },
  {
    id: 'checkout6',
    title: 'Gift Baskets',
    icon: <Gift size={20} />,
    navLink: '/giftBaskets'
  }
];
