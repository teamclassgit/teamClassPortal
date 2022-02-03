import { Archive, BookOpen, Book, Calendar, Gift, HelpCircle, Tag, Database, Activity, Filter } from 'react-feather';

export default [
  {
    id: 'listBookings',
    title: 'Funnel (Beta)',
    icon: <Filter size={20} />,
    navLink: '/pipeline'
  },
  {
    id: 'listBookingsAll',
    title: 'All Bookings (Beta)',
    icon: <Database size={20} />,
    navLink: '/allbookings'
  },
  {
    id: 'checkout1',
    title: 'In progress',
    icon: <BookOpen size={20} />,
    navLink: '/bookings'
  },
  {
    id: 'checkout0',
    title: 'Events calendar',
    icon: <Calendar size={20} />,
    navLink: '/calendar'
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
