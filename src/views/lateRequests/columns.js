// @packages
import StringFilter from '@inovua/reactdatagrid-community/StringFilter';
import Avatar from '@components/avatar';
import { Badge } from 'reactstrap';

const cellSize = {
  minHeight: 50,
  display: 'flex',
  alignItems: 'center'
};

const columns = [
  {
    name: 'bookingId',
    header: 'Booking Id',
    type: 'string',
    defaultFlex: 2,
    filterEditor: StringFilter,
    render: ({value}) => (
      <span className="d-block font-weight-bold text-truncate">{value}</span>
    )
  },
  {
    name: 'status',
    header: 'Status',
    type: 'string',
    defaultWidth: 200,
    render : ({value, cellProps}) => (
      <span>
        <Badge color={
          cellProps.data?.status === "pending"
            ? "secondary"
              : cellProps.data?.status === "rejected"
                ? "danger"
                  : "primary"
        }
        className="py-1"
        style={{borderRadius: "10px"}}>
          {value}
        </Badge>
      </span>
    )
  },
  {
    name: 'name',
    header: 'Name',
    type: 'string',
    defaultFlex: 1,
    filterEditor: StringFilter,
    render: ({value}) => (
      <div className="d-flex align-items-center">
        <Avatar color={"light-success"} content={value} initials />
        <div className="user-info text-truncate ml-1">
          <span className="d-block font-weight-bold text-truncate">{value}</span>
        </div>
      </div>
    )
  },
  {
    name: 'phone',
    header: 'Phone',
    type: 'string',
    defaultFlex: 1,
    render: ({value}) => <span>{value}</span>
  },
  {
    name: 'email',
    header: 'Email',
    type: 'string',
    defaultFlex: 1,
    render: ({value}) => <span>{value}</span>
  },
  {
    name: 'address',
    header: 'Address',
    type: 'string',
    defaultFlex: 1,
    render: ({ cellProps }) => {
      return (
        <div style={{ color: "#868E96", fontWeight: "400", fontSize: "12px", lineHeight: "18px", ...cellSize }}>
          {cellProps?.data?.addressLine1 ? cellProps?.data?.addressLine1 : ""} {cellProps?.data?.addressLine2 ? cellProps?.data?.addressLine2 : ""} <br />
          {cellProps?.data?.city ? cellProps?.data?.city.concat(",") : ""} {cellProps?.data?.state ? cellProps?.data?.state : ""} {cellProps?.data?.country ? cellProps?.data?.country : ""}{" "} <br />
          {cellProps?.data?.zip ? cellProps?.data?.zip : ""}
        </div>
      );
    }
  }
];

export default columns;
