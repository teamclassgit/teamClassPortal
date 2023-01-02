// @packages
import React, { useState } from "react";
import { Button, ButtonGroup, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, InputGroup, InputGroupAddon, Row, Spinner, UncontrolledButtonDropdown } from "reactstrap";
import { Share, Plus, Search } from "react-feather";
import PropTypes from "prop-types";
import ExportToExcel from "@molecules/export-to-excel";

const TasksBar = ({
  titleView,
  titleBadge,
  setElementToAdd,
  showAddModal,
  getDataToExport,
  fileExportedName,
  buttonTitle,
  isSearchFilter,
  searchValue,
  setSearchValue
}) => {
  const [isExporting, setIsExporting] = useState(false);

  return (
    <Row>
      <Col md={6} lg={6}>
        <h4>
          {titleView}
          {" "}
          <small>
            <a href="#">{titleBadge}</a>
          </small>
        </h4>
      </Col>
      <Col className="mb-1 d-flex justify-content-end" lg={6} md={12}>
        {isSearchFilter && (
          <InputGroup className="mr-2">
            <Input
              type="text"
              id="searchValue"
              name="searchValue"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <InputGroupAddon addonType="append">
              <Button color="primary">
                <Search size={12} />
              </Button>
            </InputGroupAddon>
          </InputGroup>
        )}

        <ButtonGroup>
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
                      fileName={fileExportedName}
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
            title={buttonTitle}
          >
            <Plus size={13} />
          </Button>
        </ButtonGroup>
      </Col>
    </Row>
  );
};

export default TasksBar;

TasksBar.propTypes = {
  titleView: PropTypes.string.isRequired,
  titleBadge: PropTypes.string.isRequired,
  setElementToAdd: PropTypes.func.isRequired,
  showAddModal: PropTypes.func.isRequired,
  getDataToExport: PropTypes.func.isRequired,
  fileExportedName: PropTypes.string,
  buttonTitle: PropTypes.string
};

TasksBar.defaultProps = {
  fileExportedName: "Bookings",
  buttonTitle: "Add Booking",
  isSearchFilter: false
};
