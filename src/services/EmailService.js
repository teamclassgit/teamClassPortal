import moment from "moment";
import queryGetTotalsEmailsNotificationsDeliveredUsingFilter from "../graphql/QueryTotalsEmailsNotificationsDeliveredUsingFilter";
import queryGetTotalsEmailsNotificationsErrorUsingFilter from "../graphql/QueryTotalsEmailsNotificationsErrorUsingFilter";
import queryGetTotalsEmailsNotificationsRequestUsingFilter from "../graphql/QueryTotalsEmailsNotificationsRequestUsingFilter";
import queryGetTotalsBookingStatusUsingFilter from "../graphql/QueryTotalsBookingStatusUsingFilter";
import queryEmailsNotificationsDeliveredWithCriteria from "@graphql/QueryEmailsNotificationsDeliveredWithCriteria";
import queryEmailsNotificationsErrorWithCriteria from "@graphql/QueryEmailsNotificationsErrorWithCriteria";
import queryEmailsNotificationsRequestWithCriteria from "@graphql/QueryEmailsNotificationsRequestWithCriteria";

import { apolloClient } from "../utility/RealmApolloClient";
import { getQueryFiltersFromFilterArray, isNotEmptyArray } from "../utility/Utils";
import MutationUpdateSystemStatus from "../graphql/MutationUpdateSystemStatus";


const getTotalsBookingStatusUsingFilter = async (filters) => {
  const { data } = await apolloClient.query({
    query: queryGetTotalsBookingStatusUsingFilter,
    variables: {
      filterBy: getQueryFiltersFromFilterArray(filters)
    }
  });

  return data && data.totals;
};

const getTotalsEmailsNotificationsDeliveredUsingFilter = async (filters) => {
  const { data } = await apolloClient.query({
    query: queryGetTotalsEmailsNotificationsDeliveredUsingFilter,
    variables: {
      filterBy: getQueryFiltersFromFilterArray(filters)
    }
  });

  return data && data.totals;
};

const getTotalsEmailsNotificationsErrorUsingFilter = async (filters) => {
  const { data } = await apolloClient.query({
    query: queryGetTotalsEmailsNotificationsErrorUsingFilter,
    variables: {
      filterBy: getQueryFiltersFromFilterArray(filters)
    }
  });

  return data && data.totals;
};

const getTotalsEmailsNotificationsRequestUsingFilter = async (filters) => {
  const { data } = await apolloClient.query({
    query: queryGetTotalsEmailsNotificationsRequestUsingFilter,
    variables: {
      filterBy: getQueryFiltersFromFilterArray(filters)
    }
  });

  return data && data.totals;
};

const getAllDataToExportEmailLog = async (filters, orFilters, sortInfo, status) => {
  let emails;
  if (status.value === "sent") {
    const { data } = await apolloClient.query({
      query: queryEmailsNotificationsDeliveredWithCriteria,
      fetchPolicy: "network-only",
      variables: {
        filterBy: filters,
        sortBy: sortInfo,
        filterByOr: orFilters,
        limit: -1,
        offset: -1
      }
    });
    if (!data?.getEmailsNotificationsDeliveredWithCriteria?.rows?.length) return [];
    emails = data.getEmailsNotificationsDeliveredWithCriteria.rows;
  }
  if (status.value === "error") {
    const { data } = await apolloClient.query({
      query: queryEmailsNotificationsErrorWithCriteria,
      fetchPolicy: "network-only",
      variables: {
        filterBy: filters,
        sortBy: sortInfo,
        filterByOr: orFilters,
        limit: -1,
        offset: -1
      }
    });
    if (!data?.getEmailsNotificationsErrorWithCriteria?.rows?.length) return [];
    emails = data.getEmailsNotificationsErrorWithCriteria.rows;
  }
  if (status.value === "scheduled") {
    const { data } = await apolloClient.query({
      query: queryEmailsNotificationsRequestWithCriteria,
      fetchPolicy: "network-only",
      variables: {
        filterBy: filters,
        sortBy: sortInfo,
        filterByOr: orFilters,
        limit: -1,
        offset: -1
      }
    });
    if (!data?.getEmailsNotificationsRequestWithCriteria?.rows?.length) return [];
    emails = data.getEmailsNotificationsRequestWithCriteria.rows;
  }

  const bookingsArray = [];
  const headers = [
    "_id",
    "createAt",
    "documentId",
    "collection",
    "subject",
    "fromName",
    "fromEmail",
    "to",
    "templateId",
    "functions",
    "status",
    "log",
    "mergeVariables",
    "origin",
    "type",
    "isTask"
  ];

  bookingsArray.push(headers);

  emails.forEach((element) => {
    const row = [
      element._id,
      element.createAt,
      element.documentId,
      element.collection,
      element.subject,
      element.from?.name,
      element.from?.email,
      (isNotEmptyArray(element.to) ? JSON.stringify(element.to) : ""),
      element.templateId,
      element.functions,
      element.status,
      element.log,
      (isNotEmptyArray(element.mergeVariables) ? JSON.stringify(element.mergeVariables) : ""),
      element.origin,
      element.type,
      element.isTask ? "true" : "false"
    ];
    bookingsArray.push(row);
  });

  return bookingsArray;
};

const verifySentEmailSystemStatus = async (documentsId, isVerified) => {
  const { data } = await apolloClient.mutate({
    mutation: MutationUpdateSystemStatus, 
    variables: {
      input: { 
        documentsId,
        isVerified
      }
    }
  });
};


export { getTotalsBookingStatusUsingFilter, getTotalsEmailsNotificationsDeliveredUsingFilter, getTotalsEmailsNotificationsErrorUsingFilter, getTotalsEmailsNotificationsRequestUsingFilter, getAllDataToExportEmailLog, verifySentEmailSystemStatus };
