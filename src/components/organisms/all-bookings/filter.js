import { getUserData } from "@utility/Utils";

export const applyFilters = (filterValue, setFilterValue, setOrFilters) => {
  let currentFilters = [...filterValue];

  if (currentFilters && currentFilters.length === 0) {
    const userData = getUserData();
    let coordinatorFilterValue = "";

    if (userData && userData.customData && userData.customData.coordinatorId) {
      coordinatorFilterValue = userData.customData.email;
    }

    currentFilters = [
      { name: "createdAt", type: "date", operator: "inrange", value: undefined },
      { name: "updatedAt", type: "date", operator: "inrange", value: undefined },
      { name: "_id", type: "string", operator: "contains", value: "" },
      { name: "customerName", type: "string", operator: "contains", value: "" },
      { name: "bookingStage", type: "select", operator: "inlist", value: undefined },
      { name: "closedReason", type: "string", operator: "contains", value: "" },
      { name: "gclid", type: "string", operator: "contains", value: "" },
      { name: "customerEmail", type: "string", operator: "contains", value: "" },
      { name: "customerPhone", type: "string", operator: "contains", value: "" },
      { name: "customerCompany", type: "string", operator: "contains", value: "" },
      { name: "eventCoordinatorEmail", type: "select", operator: "inlist", value: coordinatorFilterValue ? [coordinatorFilterValue] : undefined },
      { name: "className", type: "select", operator: "inlist", value: undefined },
      { name: "attendees", type: "number", operator: "gte", value: undefined },
      { name: "registeredAttendees", type: "number", operator: "gte", value: undefined },
      { name: "taxAmount", type: "number", operator: "gte", value: undefined },
      { name: "serviceFeeAmount", type: "number", operator: "gte", value: undefined },
      { name: "cardFeeAmount", type: "number", operator: "gte", value: undefined },
      { name: "totalInvoice", type: "number", operator: "gte", value: undefined },
      { name: "depositsPaid", type: "number", operator: "gte", value: undefined },
      { name: "finalPaid", type: "number", operator: "gte", value: undefined },
      { name: "depositPaidDate", type: "date", operator: "inrange", value: undefined },
      { name: "finalPaymentPaidDate", type: "date", operator: "inrange", value: undefined },
      { name: "balance", type: "number", operator: "gte", value: undefined },
      { name: "eventDateTime", type: "date", operator: "inrange", value: undefined },
      { name: "signUpDeadline", type: "date", operator: "inrange", value: undefined },
      { name: "customerTags", type: "select", operator: "inlist", value: undefined },
      { name: "utm_campaign", type: "string", operator: "contains", value: "" },
      { name: "utm_source", type: "string", operator: "contains", value: "" },
      { name: "utm_medium", type: "string", operator: "contains", value: "" },
      { name: "utm_content", type: "string", operator: "contains", value: "" },
      { name: "utm_term", type: "string", operator: "contains", value: "" },
      { name: "bookingTags", type: "string", operator: "contains", value: "" },
      { name: "totalInstructorInvoice", type: "number", operator: "contains", value: "" },
      { name: "instructorInvoiceStatus", type: "string", operator: "contains", value: "" },
      { name: "totalDistributorInvoice", type: "number", operator: "contains", value: "" },
      { name: "distributorInvoiceStatus", type: "string", operator: "contains", value: "" },
      { name: "preEventSurvey.submittedAt", type: "date", operator: "inrange", value: undefined },
      { name: "preEventSurvey.source", type: "string", operator: "contains", value: "" },
      { name: "totalMembershipDiscount", type: "number", operator: "contains", value: "" },
      { name: "firstTouchChannel", type: "string", operator: "contains", value: "" }
    ];
  }

  setFilterValue(currentFilters);
  setOrFilters([]);
};