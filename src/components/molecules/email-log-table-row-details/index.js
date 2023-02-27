// @packages
import React from "react";
import moment from "moment";
import { Briefcase, Mail } from "react-feather";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import ReactDataGrid from "@inovua/reactdatagrid-enterprise";

// @scripts
import CopyClipboard from "@atoms/copy-clipboard";
import { capitalizeString } from "@utility/Utils";

const RowDetailsEmailLog = ({ data }) => {
  const skin = useSelector((state) => state.bookingsBackground);
  const gridStyleEmailTo = { minWidth: 550 };
  const columnsEmailTo = [
    { name: "name", header: "Name", type: "string", defaultWidth: 200, flex: 1 },
    { name: "email", header: "Email", type: "string", defaultWidth: 250, flex: 1 },
    { name: "type", header: "Type", type: "string", defaultWidth: 100, flex: 1 }
  ];
  const gridStyleMergeVariables = { minWidth: 800 };
  const columnsMergeVariables = [
    { name: "name", header: "Name", type: "string", defaultWidth: 150},
    { name: "content", header: "Email", type: "string", defaultWidth: 1000}
  ];

  return (
    <div style={{ padding: 20 }}>
      <h4 className="mb-1">{capitalizeString("Sent email data")}</h4>
      <table>
        <tbody>
          <tr>
            <td>Created</td>
            <td>{moment(data.createAt).format("LL")}</td>
          </tr>
          <tr>
            <td>
              <strong>Document ID</strong>
            </td>
            <td>
              {data.documentId} <CopyClipboard className="z-index-2" text={data.documentId} />
            </td>
          </tr>
          <tr>
            <td>Collection</td>
            <td>{data.collection}</td>
          </tr>
          <tr>
            <td>Subject</td>
            <td>{data.subject}</td>
          </tr>
          <tr>
            <td>Template Id</td>
            <td>{data.templateId}</td>
          </tr>
          <tr>
            <td>Name From</td>
            <td>{data.from.name}</td>
          </tr>
          <tr>
            <td>Email From</td>
            <td>
              <Mail size={16} /> {data.from.email} <CopyClipboard className="z-index-2" text={data.from.email} />
            </td>
          </tr>
          <tr>
            <td>Email To</td>
            <td><ReactDataGrid
                  idProperty="_idEmailTo"
                  columns={columnsEmailTo}
                  dataSource={data.to}
                  style={gridStyleEmailTo}
                  pagination
                  limit={50}
                  livePagination
                  showZebraRows={true}
                  theme={skin === "dark" ? "amber-dark" : "default-light"}
                  licenseKey={process.env.REACT_APP_DATAGRID_LICENSE}
                />
            </td>
          </tr>
          {data.log && (
            <tr>
              <td>Message Log</td>
              <td>
                <Briefcase size={16} /> {data.log}
              </td>
            </tr>
          )}
          <tr>
            <td>
              <strong>ID</strong>
            </td>
            <td>
              {data._id} <CopyClipboard className="z-index-2" text={data._id} />
            </td>
          </tr>
          <tr>
            <td>Function Name</td>
            <td>{data.functions}</td>
          </tr>
          <tr>
            <td>Sending Process</td>
            <td>{data.origin}</td>
          </tr>
          <tr>
            <td>Type</td>
            <td>{data.type}</td>
          </tr>
          <tr>
            <td>Trigger sent the email ?</td>
            <td>{data.isTask ? "TRUE" : "FALSE"}</td>
          </tr>
          <tr>
            <td>Merge Variables</td>
            <td><ReactDataGrid
                  idProperty="_idEmailTo"
                  columns={columnsMergeVariables}
                  dataSource={data.mergeVariables}
                  style={gridStyleMergeVariables}
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

RowDetailsEmailLog.propTypes = {
  data: PropTypes.object.isRequired
};

export default RowDetailsEmailLog;
