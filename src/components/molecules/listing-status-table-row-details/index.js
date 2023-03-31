// @packages
import React from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import ReactDataGrid from "@inovua/reactdatagrid-enterprise";

// @scripts
import { capitalizeString } from "@utility/Utils";

const RowDetailsListingStatus = ({ data }) => {
  const skin = useSelector((state) => state.bookingsBackground);
  const gridStyleListingError = { minWidth: 800 };
  const columnsListingError = [
    { name: "_id", header: "ID", type: "string", defaultWidth: 300 },
    { name: "pathListing", header: "Listing Path", type: "string", defaultWidth: 1200 }
  ];

  return (
    <div style={{ padding: 20 }}>
      <h4 className="mb-1">{capitalizeString("Listing Status Details")}</h4>
      <table>
        <tbody>
          <tr>
            <td>
              <strong>Created: </strong>
            </td>
            <td>{moment(data.createdAt).format("LL")}</td>
          </tr>
          <tr>
            <td>
              <strong>Listing Number: </strong>
            </td>
            <td>
              {data.numlisting}
            </td>
          </tr>
          <tr>
            <td>
              <strong>Number Open Listing: </strong>
            </td>
            <td>{data.numlistingOpened}</td>
          </tr>
          <tr>
            <td>
              <strong>Number Error Listing: </strong></td>
            <td>{data.numListingError}</td>
          </tr>
          <tr>
            <td>
              <strong>Listing Error: </strong>
            </td>
            <td><ReactDataGrid
              idProperty="_idListingError"
              columns={columnsListingError}
              dataSource={data.listingIdWithError}
              style={gridStyleListingError}
              pagination
              limit={50}
              livePagination
              showZebraRows={true}
              theme={skin === "dark" ? "amber-dark" : "default-light"}
              licenseKey={process.env.REACT_APP_DATAGRID_LICENSE}
            />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

RowDetailsListingStatus.propTypes = {
  data: PropTypes.object.isRequired
};

export default RowDetailsListingStatus;
