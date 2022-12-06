// @packages
import { lazy } from "react";

// @constants
const TemplateTitle = "%s - TeamClass Ops Dashboard";
const DefaultRoute = "/pipeline";

// @routes
const Routes = [
  {
    path: "/calendar",
    component: lazy(() => import("../../views/Calendar"))
  },
  {
    path: "/bookings",
    component: lazy(() => import("../../views/BookingStage"))
  },
  {
    path: "/pipeline",
    component: lazy(() => import("../../views/booking/FunnelTable"))
  },
  {
    appLayout: true,
    className: "chat-application",
    component: lazy(() => import("../../views/chat")),
    path: "/chat"
  },
  {
    path: "/all-bookings",
    component: lazy(() => import("../../views/AllBookings"))
  },
  {
    path: "/booking/:id",
    component: lazy(() => import("../../views/booking"))
  },
  {
    path: "/general-inquiries",
    component: lazy(() => import("../../views/GeneralInquiries"))
  },
  {
    path: "/private-requests",
    component: lazy(() => import("../../views/PrivateRequests"))
  },
  {
    path: "/discount-codes",
    component: lazy(() => import("../../views/DiscountCodes"))
  },
  {
    path: "/gift-baskets",
    component: lazy(() => import("../../views/GiftBaskets"))
  },
  {
    path: "/listing-prices",
    component: lazy(() => import("../../views/ListingPrices"))
  },
  {
    path: "/late-requests",
    component: lazy(() => import("../../views/LateRequests"))
  },
  {
    path: "/login",
    component: lazy(() => import("../../views/Login")),
    layout: "BlankLayout",
    meta: {
      authRoute: true
    }
  },
  {
    path: "/error",
    component: lazy(() => import("../../views/Error")),
    layout: "BlankLayout"
  }
];

export { DefaultRoute, TemplateTitle, Routes };
