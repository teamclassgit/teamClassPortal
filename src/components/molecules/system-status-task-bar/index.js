// @packages
import React from "react";
import { Col, Row } from "reactstrap";
import PropTypes from "prop-types";

const StatusSystemTasksBar = ({
  titleView,
  titleBadge
}) => {

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
    </Row>
  );
};

export default StatusSystemTasksBar;

StatusSystemTasksBar.propTypes = {
  titleView: PropTypes.string.isRequired,
  titleBadge: PropTypes.string.isRequired
};

StatusSystemTasksBar.defaultProps = {
  fileExportedName: "Email Status",
  isSearchFilter: false
};
