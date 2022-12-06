import { BookOpen, Book, Calendar, Edit2, Gift, HelpCircle, Tag, Database, Filter, Inbox, User } from "react-feather";

export default [
  {
    id: "listBookings",
    title: "Funnel (Beta)",
    icon: <Filter size={20} />,
    navLink: "/pipeline"
  },
  {
    id: "listBookingsAll",
    title: "All Bookings (Beta)",
    icon: <Database size={20} />,
    navLink: "/all-bookings"
  },
  {
    id: "checkout1",
    title: "In progress",
    icon: <BookOpen size={20} />,
    navLink: "/bookings"
  },
  {
    id: "checkout0",
    title: "Events calendar",
    icon: <Calendar size={20} />,
    navLink: "/calendar"
  },
  {
    id: "checkout3",
    title: "Private requests",
    icon: <Book size={20} />,
    navLink: "/private-requests"
  },
  {
    id: "checkout4",
    title: "General inquiries",
    icon: <HelpCircle size={20} />,
    navLink: "/general-inquiries"
  },
  {
    id: "checkout5",
    title: "Discount codes",
    icon: <Tag size={20} />,
    navLink: "/discount-codes"
  },
  {
    id: "checkout6",
    title: "Gift Baskets",
    icon: <Gift size={20} />,
    navLink: "/gift-baskets"
  },
  {
    id: "checkout7",
    title: "Listing Prices",
    icon: <Edit2 size={20} />,
    navLink: "/listing-prices"
  },
  {
    id: "checkout8",
    title: "Late requests",
    icon: <User size={20} />,
    navLink: "/late-requests"
  }
];
