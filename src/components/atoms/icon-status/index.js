import React, { useState} from "react";
import { Activity } from "react-feather";
import { useQuery } from "@apollo/client";
import querySystemStatus from "@graphql/QuerySystemStatus";

const IconStatus = (props) => {
  const [error, isError] = useState();
  const [warning, isWarning] = useState();
  const [successful, isSuccessful] = useState();
  const limit = 200;

  useQuery(querySystemStatus, {
    fetchPolicy: "cache-and-network",
    pollInterval: 100000,
    variables: {
      limit
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      if (data) {
        if (data?.getSystemStatus.status === "error") {
          isError(true);
          isWarning(false);
          isSuccessful(false);
        }
        if (data?.getSystemStatus.status === "warning") {
          isWarning(true);
          isError(false);
          isSuccessful(false);
        }
        if (data?.getSystemStatus.status === "successful") {
          isSuccessful(true);
          isWarning(false);
          isError(false);
        }
      }
    }
  });
  return (
    <div>
      {successful &&
        <Activity style={{ background: "#d0e8e0" }} size={20} />
      }
      {error &&
        <Activity style={{ background: "#f8d0e0" }} size={20} />
      }
      {warning &&
        <Activity style={{ background: "#fff4cc" }} size={20} />
      }
    </div>
  );
};

export default IconStatus;
