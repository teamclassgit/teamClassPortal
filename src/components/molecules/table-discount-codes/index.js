// @packages
import Avatar from "@components/avatar";
import CardLink from "reactstrap/lib/CardLink";
import DataTable from "react-data-table-component";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import moment from "moment";
import { Card, CustomInput } from "reactstrap";
import { Edit2, ChevronDown } from "react-feather";
import { useMutation } from "@apollo/client";

// @scripts
import mutationUpdateDiscountCode from "@graphql/MutationUpdateDiscountCode";

// @styles
import "@molecules/table-discount-codes/TableBookings.scss";

const TableDiscountCodes = ({ 
  filteredData,
  userData,
  handleEditModal,
  setDiscountCodesInformation
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [updateDiscountCode] = useMutation(mutationUpdateDiscountCode, {});

  useEffect(() => {
    setCurrentPage(0);
  }, [filteredData]);

  const handleChangeValidCode = async (row) => {
    try {
      const updateInactiveCode = await updateDiscountCode({
        variables: {
          id: row._id,
          discountCode: row.discountCode,
          description: row.description,
          expirationDate: row.expirationDate,
          redemptions: row.redemptions,
          customerId: row.customerId,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
          type: row.type,
          discount: row.discount,
          maxDiscount: row.maxDiscount,
          active: false
        }
      });
      setDiscountCodesInformation([
        updateInactiveCode.data.updateOneDiscountCode,
        ...filteredData.filter((element) => element._id !== updateInactiveCode.data.updateOneDiscountCode._id)
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeInvalidCode = async (row) => {
    try {
      const updateActiveCode = await updateDiscountCode({
        variables: {
          id: row._id,
          discountCode: row.discountCode,
          description: row.description,
          expirationDate: row.expirationDate,
          redemptions: row.redemptions,
          customerId: row.customerId,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
          type: row.type,
          discount: row.discount,
          maxDiscount: row.maxDiscount,
          active: true
        }
      });
      setDiscountCodesInformation([
        updateActiveCode.data.updateOneDiscountCode,
        ...filteredData.filter((element) => element._id !== updateActiveCode.data.updateOneDiscountCode._id)
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      name: "Created",
      selector: "createdAt",
      sortable: true,
      maxWidth: "10%",
      cell: (row) => (
        <small>
          {moment(row.createdAt).calendar(null, {
            lastDay: "[Yesterday]",
            sameDay: "LT",
            lastWeek: "dddd",
            sameElse: "MMMM Do, YYYY"
          })}
        </small>
      )
    },
    {
      name: "Expiration",
      selector: "expirationDate",
      sortable: true,
      maxWidth: "16%",
      cell: (row) => (
        <small>
          {moment(row.expirationDate).calendar(null, {
            lastDay: "[Yesterday]",
            sameDay: "LT",
            lastWeek: "dddd",
            sameElse: "MMMM Do, YYYY"
          })}
        </small>
      )
    },
    {
      name: "Discount Code",
      selector: "discountCode",
      sortable: true,
      maxWidth: "18%",
      cell: (row) => (
        <small>
          <div className="d-flex align-items-center">
            <span className="d-block font-weight-bold">{row.discountCode}</span>
          </div>
        </small>
      )
    },
    {
      name: "Description",
      selector: "description",
      sortable: true,
      maxWidth: "16%",
      cell: (row) => (
        <small>
          <div className="d-flex align-items-center">
            <span className="d-block font-weight-bold">{row.description}</span>
          </div>
        </small>
      )
    },
    {
      name: "Redemptions",
      selector: "redemptions",
      sortable: true,
      maxWidth: "11%",
      cell: (row) => (
        <small>
          <span className="d-block font-weight-bold">{row.redemptions}</span>
        </small>
      )
    },
    {
      name: "Discount",
      selector: "discount",
      sortable: true,
      maxWidth:  "9%",
      cell: (row) => (
        <small>
          <span className="d-block font-weight-bold">{`${row.type === "Percentage" ? `${(row.discount)} %` : `${row.discount} $`}`}</span>
        </small>
      )
    },
    userData?.customData?.role === "Admin" && (
      {
        name: "Active",
        allowOverflow: true,
        maxWidth: "15%",
        cell: (row) => {
          return (
            <small>
              <div className="d-flex">
                <CardLink 
                  onClick={row.active ? () => handleChangeValidCode(row) : () => handleChangeInvalidCode(row)} 
                  target={"_blank"} title={"Enable/Disable"}
                >
                  <CustomInput
                    checked={row.active}
                    className="custom-control-secondary"
                    id={`customSwitch${row._id}`} 
                    label={row.active ? "Active" : "Inactive"}
                    name="enabled"
                    type="switch"
                  />
                </CardLink>
              </div>
            </small>
          );
        }
      }
    ),
    userData?.customData?.role === "Admin" && (
      {
        name: "Actions",
        allowOverflow: true,
        maxWidth: "15%",
        cell: (row) => {
          return (
            <small>
              <div className="d-flex">
                <CardLink onClick={() => {
                  handleEditModal({
                    currentActive: row.active,
                    currentCode: row.discountCode,
                    currentCodeId: row._id,
                    currentCreatedAt: row.createdAt,
                    currentCustomerId: row.customerId,
                    currentDescription: row.description,
                    currentDiscount: row.discount,
                    currentExpirationDate: row.expirationDate,
                    currentMaxDiscount: row.maxDiscount,
                    currentRedemption: row.redemptions,
                    currentType: row.type
                  });
                }} 
                target={"_blank"} title={"Edit"}>
                  <Avatar color="light-dark" size="sm" icon={<Edit2 size={18} />} />
                </CardLink>
              </div>
            </small>
          );
        }
      }
    )
  ];

  const handlePagination = (page) => {
    setCurrentPage(page.selected);
  };

  const CustomPagination = () => (
    <ReactPaginate
      activeClassName="active"
      breakClassName="page-item"
      breakLabel="..."
      breakLinkClassName="page-link"
      containerClassName="pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1"
      forcePage={currentPage}
      marginPagesDisplayed={2}
      nextClassName="page-item next"
      nextLabel=""
      nextLinkClassName="page-link"
      onPageChange={(page) => handlePagination(page)}
      pageClassName="page-item"
      pageCount={filteredData.length / 8 || 1}
      pageLinkClassName="page-link"
      pageRangeDisplayed={2}
      previousClassName="page-item prev"
      previousLabel=""
      previousLinkClassName="page-link"
    />
  );

  return (
    <Card>
      <DataTable
        className="react-dataTable"
        columns={columns}
        data={filteredData}
        defaultSortAsc={false}
        defaultSortField="createdAt"
        noHeader
        pagination
        paginationComponent={CustomPagination}
        paginationDefaultPage={currentPage + 1}
        paginationPerPage={8}
        sortIcon={<ChevronDown size={10} />}
      />
    </Card>
  );
};

export default TableDiscountCodes;

TableDiscountCodes.propTypes = {
  filteredData: PropTypes.array.isRequired,
  handleEditModal: PropTypes.func.isRequired,
  userData: PropTypes.object.isRequired,
  setDiscountCodesInformation: PropTypes.func.isRequired
};