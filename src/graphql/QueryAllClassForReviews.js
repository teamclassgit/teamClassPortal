import {gql} from "@apollo/client";

export default gql`
query GetClassesMinInfo($filter:TeamClassQueryInput!) {
  teamClasses(limit: 1000, query: $filter, sortBy: ORDER_ASC) {
      _id
      title
      category
      isActive
      order
  }
}`;
