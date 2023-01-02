// @packages
import React, { useState, useContext, useEffect } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardTitle,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  InputGroup,
  InputGroupAddon,
  UncontrolledButtonDropdown,
  Spinner
} from "reactstrap";
import { Share, Filter, FileText, Plus, List, Trello, Search } from "react-feather";
import PropTypes from "prop-types";

// @scripts
import ExportToExcel from "@molecules/export-to-excel";
import { FiltersContext } from "@context/FiltersContext/FiltersContext";
import { getCustomerEmail, getCoordinatorName } from "@utility/Common";
import ExportToExcelLegacy from "@molecules/export-to-excel-legacy";

const BookingsHeader = ({
  coordinators,
  userData,
  customers,
  defaultLimit,
  discountCodes,
  generalInquiries,
  isBooking,
  isClosedBookings,
  isDiscountCodes,
  isGeneralInquiries,
  isInProgressBookings,
  isPrivateRequest,
  noCoordinators,
  onChangeLimit,
  privateRequests,
  setElementToAdd,
  setShowFiltersModal,
  setSwitchView,
  showAdd,
  showAddModal,
  showExport,
  showFilter,
  showLimit,
  showView,
  switchView,
  titleView,
  getDataToExport
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [discountCodesExcelTable, setDiscountCodesExcelTable] = useState([]);
  const [generalInquiriesExcelTable, setGeneralInquiriesExcelTable] = useState([]);
  const [limit, setLimit] = useState(defaultLimit);
  const [privateRequestsExcelTable, setPrivateRequestsExcelTable] = useState([]);
  const [searchValue, setSearchValue] = useState(null);
  const { textFilterContext, setTextFilterContext, classFilterContext, coordinatorFilterContext } = useContext(FiltersContext);

  useEffect(() => {
    setTextFilterContext(null);
  }, [isInProgressBookings, isClosedBookings, isPrivateRequest, isGeneralInquiries, isDiscountCodes, isBooking]);

  useEffect(() => {
    if (privateRequests) {
      const privateClassRequestsArray = [];
      const headers = ["Created", "Name", "Email", "Phone", "Coordinator", "Attendees", "Date Option 1", "Event Type", "Time Frame"];

      privateClassRequestsArray.push(headers);

      for (const i in privateRequests) {
        const row = [
          privateRequests[i].date,
          privateRequests[i].name,
          privateRequests[i].email,
          privateRequests[i].phone,
          getCoordinatorName(privateRequests[i].eventCoordinatorId, coordinators),
          privateRequests[i].attendees,
          privateRequests[i].dateOption1,
          privateRequests[i].eventType,
          privateRequests[i].timeFrame
        ];

        privateClassRequestsArray.push(row);
      }
      setPrivateRequestsExcelTable(privateClassRequestsArray);
    }
  }, [privateRequests, coordinators]);

  useEffect(() => {
    if (generalInquiries) {
      const questionsArray = [];

      const headers = ["Created", "Name", "Email", "Phone", "Inquiry"];

      questionsArray.push(headers);

      for (const i in generalInquiries) {
        const row = [
          generalInquiries[i].date,
          generalInquiries[i].name,
          generalInquiries[i].email,
          generalInquiries[i].phone,
          generalInquiries[i].inquiry
        ];

        questionsArray.push(row);
      }
      setGeneralInquiriesExcelTable(questionsArray);
    }
  }, [generalInquiries]);

  const handleChange = (e) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    if (discountCodes) {
      const discountCodesArray = [];

      const headers = ["Created", "Expiration", "Discount Code", "Description", "Active", "Redemptions", "Discount"];

      discountCodesArray.push(headers);

      for (const i in discountCodes) {
        const row = [
          discountCodes[i].createdAt,
          discountCodes[i].expirationDate,
          discountCodes[i].discountCode,
          discountCodes[i].description,
          discountCodes[i].active,
          discountCodes[i].redemptions,
          discountCodes[i].discount
        ];

        discountCodesArray.push(row);
      }
      setDiscountCodesExcelTable(discountCodesArray);
    }
  }, [discountCodes]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setTextFilterContext({ type: "text", value: searchValue });
    }
  };

  return (
    <Card className="w-100 shadow-none bg-transparent m-0 p-0">
      <CardHeader>
        <Col md={4}>
          <CardTitle tag="h4" className="mr-4">
            {titleView}
            <small>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowFiltersModal(true);
                }}
              >
                {!noCoordinators && (coordinatorFilterContext ? coordinatorFilterContext.label.join(", ") : "All Coordinators")}
              </a>
            </small>
          </CardTitle>
        </Col>
        <Col className="mb-1 d-flex" lg="6" md="12">
          <InputGroup className="mr-2">
            <Input type="text" onKeyPress={handleKeyPress} value={searchValue} onChange={handleChange} />
            <InputGroupAddon addonType="append">
              <Button
                color="primary"
                onClick={() => {
                  setTextFilterContext({ type: "text", value: searchValue });
                }}
              >
                <Search size={12} />
              </Button>
            </InputGroupAddon>
          </InputGroup>

          <ButtonGroup>
            {showLimit && (
              <UncontrolledButtonDropdown>
                <DropdownToggle color="primary" caret outline title="Number of results">
                  {limit >= 20000 ? "ALL" : limit}
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem
                    className="w-100"
                    onClick={(e) => {
                      setLimit(200);
                      onChangeLimit(200);
                    }}
                  >
                    <span className="align-right">200</span>
                  </DropdownItem>
                  <DropdownItem
                    className="w-100"
                    onClick={(e) => {
                      setLimit(400);
                      onChangeLimit(400);
                    }}
                  >
                    <span className="align-right">400</span>
                  </DropdownItem>
                  <DropdownItem
                    className="w-100"
                    onClick={(e) => {
                      setLimit(600);
                      onChangeLimit(600);
                    }}
                  >
                    <span className="align-right">600</span>
                  </DropdownItem>
                  <DropdownItem
                    className="w-100"
                    onClick={(e) => {
                      setLimit(1000);
                      onChangeLimit(1000);
                    }}
                  >
                    <span className="align-right">1000</span>
                  </DropdownItem>
                  <DropdownItem
                    className="w-100"
                    onClick={(e) => {
                      setLimit(2000);
                      onChangeLimit(2000);
                    }}
                  >
                    <span className="align-right">2000</span>
                  </DropdownItem>
                  <DropdownItem
                    className="w-100"
                    onClick={(e) => {
                      setLimit(20000);
                      onChangeLimit(20000);
                    }}
                  >
                    <span className="align-right">ALL</span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledButtonDropdown>
            )}
            {showExport && isBooking && (
              <UncontrolledButtonDropdown>
                {!isExporting && (
                  <>
                    <DropdownToggle color="primary" caret outline title="Export">
                      <Share size={13} />
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem className="align-middle w-100">
                        <ExportToExcel
                          apiDataFunc={async () => {
                            return await getDataToExport();
                          }}
                          fileName={"Bookings"}
                          setIsExporting={setIsExporting}
                        />
                      </DropdownItem>
                    </DropdownMenu>
                  </>
                )}
                {isExporting && (
                  <DropdownToggle color="primary" caret outline title="Exporting..." disabled={true}>
                    <Spinner size="sm" />
                  </DropdownToggle>
                )}
              </UncontrolledButtonDropdown>
            )}
            {showExport && !isBooking && (
              <UncontrolledButtonDropdown>
                <DropdownToggle color="primary" caret outline title="Export">
                  <Share size={13} />
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem className="align-middle w-100">
                    {isPrivateRequest ? (
                      <ExportToExcelLegacy
                        apiData={privateRequestsExcelTable}
                        fileName={"Private Class Requests"}
                        title={
                          <h6>
                            <FileText size={13} />
                            {" Excel File"}
                          </h6>
                        }
                        smallText={<h6 className="small m-0 p-0">Download file with Private Requests</h6>}
                      />
                    ) : isGeneralInquiries ? (
                      <ExportToExcelLegacy
                        apiData={generalInquiriesExcelTable}
                        fileName={"General Inquires"}
                        title={
                          <h6>
                            <FileText size={13} />
                            {" Excel File"}
                          </h6>
                        }
                        smallText={<h6 className="small m-0 p-0">Download file with General Inquiries</h6>}
                      />
                    ) : isDiscountCodes && (
                      <ExportToExcelLegacy
                        apiData={discountCodesExcelTable}
                        fileName={"Discount Codes"}
                        title={
                          <h6>
                            <FileText size={13} />
                            {" Excel File"}
                          </h6>
                        }
                        smallText={<h6 className="small m-0 p-0">Download file with Discount Codes</h6>}
                      />
                    )}
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledButtonDropdown>
            )}
            {showAdd && isBooking && (
              <Button
                outline
                color="primary"
                onClick={(e) => {
                  const newElement = {
                    name: "",
                    email: "",
                    phone: "",
                    company: "",
                    attendees: ""
                  };
                  setElementToAdd(newElement);
                  showAddModal();
                }}
                title="Add Booking"
              >
                <Plus size={13} />
              </Button>
            )}
            {showAdd && isDiscountCodes && userData?.customData?.role === "Admin" && (
              <Button
                outline
                color="primary"
                onClick={(e) => {
                  const newElement = {
                    customerId: "",
                    code: "",
                    description: "",
                    redemption: "",
                    discount: "",
                    maxDiscount: "",
                    expirationDate: "",
                    type: ""
                  };
                  setElementToAdd(newElement);
                  showAddModal();
                }}
                title="Add Discount"
              >
                <Plus size={13} />
              </Button>
            )}
            {showFilter && (
              <Button
                outline={!(classFilterContext || coordinatorFilterContext)}
                color="primary"
                onClick={() => setShowFiltersModal(true)}
                title="Filters"
              >
                <Filter size={13} />
              </Button>
            )}
            {showView && (
              <Button.Ripple outline color="primary" onClick={() => setSwitchView()} title="Switch view">
                {!switchView ? <List size={13} /> : <Trello size={13} />}
              </Button.Ripple>
            )}
          </ButtonGroup>
        </Col>
      </CardHeader>
    </Card>
  );
};

export default BookingsHeader;

BookingsHeader.propTypes = {
  classes: PropTypes.array.isRequired,
  coordinators: PropTypes.array.isRequired,
  customers: PropTypes.array.isRequired,
  defaultLimit: PropTypes.number.isRequired,
  generalInquiries: PropTypes.array,
  isClosedBookings: PropTypes.bool,
  isGeneralInquiries: PropTypes.bool,
  isInProgressBookings: PropTypes.bool.isRequired,
  isDiscountCodes: PropTypes.bool,
  isPrivateRequests: PropTypes.bool,
  userData: PropTypes.object,
  onChangeLimit: PropTypes.func.isRequired,
  privateRequests: PropTypes.array,
  setElementToAdd: PropTypes.func.isRequired,
  setShowFiltersModal: PropTypes.func.isRequired,
  setSwitchView: PropTypes.func,
  showAdd: PropTypes.bool.isRequired,
  showAddModal: PropTypes.func.isRequired,
  showExport: PropTypes.bool.isRequired,
  showFilter: PropTypes.bool.isRequired,
  showLimit: PropTypes.bool.isRequired,
  showView: PropTypes.bool.isRequired,
  switchView: PropTypes.bool,
  titleView: PropTypes.string.isRequired,
  getDataToExport: PropTypes.func.isRequired
};
