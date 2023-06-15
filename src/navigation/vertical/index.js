import { BookOpen, Book, Briefcase, Calendar, Edit2, HelpCircle, Tag, Database, Filter, UserX, Users, Star, Mail } from "react-feather";
import IconStatus from "@atoms/icon-status";

export default [
  {
    id: "listBookings",
    title: "Funnel",
    icon: <Filter size={20} />,
    navLink: "/pipeline"
  },
  {
    id: "listBookingsAll",
    title: "All bookings",
    icon: <Database size={20} />,
    navLink: "/all-bookings"
  },
  {
    id: "checkout1",
    title: "Bookings board",
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
    title: "Large events",
    icon: <Book size={20} />,
    navLink: "/large-events"
  },
  {
    id: "checkout4",
    title: "General inquiries",
    icon: <HelpCircle size={20} />,
    navLink: "/general-inquiries"
  },
  {
    id: "checkout8",
    title: "Late requests",
    icon: <UserX size={20} />,
    navLink: "/late-requests"
  },
  {
    id: "reviews",
    title: "Reviews",
    icon: <Star size={20} />,
    navLink: "/reviews"
  },
  {
    id: "masterData",
    title: "Master data",
    icon: <Briefcase size={20} />,
    badge: "light-warning",
    children: [
      {
        id: "checkout7",
        title: "Listing prices",
        icon: <Edit2 size={20} />,
        navLink: "/listing-prices"
      },
      {
        id: "checkout5",
        title: "Discount codes",
        icon: <Tag size={20} />,
        navLink: "/discount-codes"
      },
      {
        id: "instructors",
        title: "Instructors",
        icon: <Users size={20} />,
        navLink: "/instructors"
      },
      {
        id: "coordinators",
        title: "Coordinators",
        icon: <Users size={20} />,
        navLink: "/coordinators"
      },
      {
        id: "distributors",
        title: "Distributors",
        icon: <Users size={20} />,
        navLink: "/distributors"
      }
    ]
  },
  {
    id: "emailsLog",
    title: "Emails Log",
    icon: <Mail size={20} />,
    navLink: "/email-log"
  },
  {
    id: "systemStatus",
    title: "System Status",
    icon: <IconStatus />,
    navLink: "/system-status"
  }
];
