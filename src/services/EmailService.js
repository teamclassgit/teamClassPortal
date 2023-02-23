import moment from "moment";
import queryGetTotalsEmailsNotificationsDeliveredUsingFilter from "../graphql/QueryTotalsEmailsNotificationsDeliveredUsingFilter";
import queryGetTotalsEmailsNotificationsErrorUsingFilter from "../graphql/QueryTotalsEmailsNotificationsErrorUsingFilter";
import queryGetTotalsEmailsNotificationsRequestUsingFilter from "../graphql/QueryTotalsEmailsNotificationsRequestUsingFilter";
import { apolloClient } from "../utility/RealmApolloClient";
import { getQueryFiltersFromFilterArray, isNotEmptyArray } from "../utility/Utils";


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

export { getTotalsEmailsNotificationsDeliveredUsingFilter, getTotalsEmailsNotificationsErrorUsingFilter, getTotalsEmailsNotificationsRequestUsingFilter };
