// @packages
import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, CardTitle, CardText, CardFooter, Col, Row } from "reactstrap";
import { DollarSign, TrendingUp } from "react-feather";
import Avatar from "@components/avatar";
import PropTypes from "prop-types";
import { getTotalsEmailsNotificationsDeliveredUsingFilter, getTotalsEmailsNotificationsErrorUsingFilter, getTotalsEmailsNotificationsRequestUsingFilter  } from "@services/EmailService";

// @styles
import "./email-log-table-status-card.scss";

const EmailLogTableStatusCards = ({ status, setStatus, filtersDelivered, filtersError, filtersRequest }) => {
  const [deliveredTotals, setDeliveredTotals] = useState({ count: 0, total: 0 });
  const [errorTotals, setErrorTotals] = useState({ count: 0, total: 0 });
  const [requestTotals, setRequestTotals] = useState({ count: 0, total: 0 });


  useEffect(() => {
    if (!filtersDelivered || filtersDelivered.length === 0) {
      return;
    }
    const getTotalsDelivered = async (filterByDelivered, setFunction) => {
      const selected = await getTotalsEmailsNotificationsDeliveredUsingFilter(filterByDelivered);
      setFunction(selected);
    };

    const getTotalsError = async (filterByError, setFunction) => {
      const selected = await getTotalsEmailsNotificationsErrorUsingFilter(filterByError);
      setFunction(selected);
    };

    const getTotalsRequest = async (filterByRequest, setFunction) => {
      const selected = await getTotalsEmailsNotificationsRequestUsingFilter(filterByRequest);
      setFunction(selected);
    };

    const currentFiltersDelivered = filtersDelivered.filter((filter) => filter.name !== "status");
    const currentFiltersError = filtersError.filter((filter) => filter.name !== "status");
    const currentFiltersRequest = filtersRequest.filter((filter) => filter.name !== "status");

    const deliveredFilters = [...currentFiltersDelivered];
    deliveredFilters.push({ name: "status", type: "string", operator: "eq", value: "sent" });
    getTotalsDelivered(deliveredFilters, setDeliveredTotals);

    const errorFilters = [...currentFiltersError];
    errorFilters.push({ name: "status", type: "string", operator: "eq", value: "error" });
    getTotalsError(errorFilters, setErrorTotals);

    const requestFilters = [...currentFiltersRequest];
    requestFilters.push({ name: "status", type: "string", operator: "eq", value: "scheduled" });
    getTotalsRequest(requestFilters, setRequestTotals);

  }, [filtersDelivered, filtersError, filtersRequest]);

  return (
    <Row className="d-flex justify-content-between mt-1">
      <Col md="6" xl="2">
        <Card className="">
          <CardBody className="pt-1 pb-1">
            <CardTitle className="text-center mb-0 ">
              <h6>Delivered</h6>
            </CardTitle>
            <CardText tag="div" className="email-log-table-status-card-content">
              <div className="d-flex justify-content-start align-items-center font-small-3">
                <div>
                  <Avatar color="light-primary" icon={<TrendingUp size={18} />} />
                </div>
                <div className="pl-1 m-0">
                  <div>
                    <strong>{deliveredTotals.count}</strong>
                  </div>
                  <div className="font-small-1">Emails</div>
                </div>
              </div>
            </CardText>
          </CardBody>
          <CardFooter className="pt-1 pb-1 d-flex justify-content-center">
            <Button
              color="primary"
              outline={!status || (status && status.value === "sent") ? false : true}
              className="btn-sm"
              onClick={(e) => {
                setStatus({ value: "sent", label: "Sent" });
              }}
            >
              Details
            </Button>
          </CardFooter>
        </Card>
      </Col>
      <Col md="6" xl="2">
        <Card>
          <CardBody className="pt-1 pb-1">
            <CardTitle className="text-center mb-0">
              <h6>Error </h6>
            </CardTitle>
            <CardText tag="div" className="email-log-table-status-card-content">
              <div className="d-flex justify-content-start align-items-center font-small-3 ">
                <div>
                  <Avatar color="light-primary" icon={<TrendingUp size={18} />} />
                </div>
                <div className="pl-1 m-0">
                  <div>
                    <strong>{errorTotals.count}</strong>
                  </div>
                  <div className="font-small-1">Emails</div>
                </div>
              </div>
            </CardText>
          </CardBody>
          <CardFooter className="pt-1 pb-1 d-flex justify-content-center">
            <Button
              color="primary"
              outline={!status || (status && status.value === "error") ? false : true}
              className=" m-0 btn-sm"
              onClick={(e) => {
                setStatus({ value: "error", label: "Error" });
              }}
            >
              Details
            </Button>
          </CardFooter>
        </Card>
      </Col>
      <Col md="6" xl="2">
        <Card>
          <CardBody className="pt-1 pb-1">
            <CardTitle className="text-center mb-0">
              <h6>Request</h6>
            </CardTitle>
            <CardText tag="div" className="email-log-table-status-card-content">
              <div className="d-flex justify-content-start align-items-center font-small-3 ">
                <div>
                  <Avatar color="light-primary" icon={<TrendingUp size={18} />} />
                </div>
                <div className="pl-1 m-0">
                  <div>
                    <strong>{requestTotals.count}</strong>
                  </div>
                  <div className="font-small-1">Emails</div>
                </div>
              </div>
            </CardText>
          </CardBody>
          <CardFooter className="pt-1 pb-1 d-flex justify-content-center">
            <Button
              color="primary"
              outline={!status || (status && status.value === "scheduled") ? false : true}
              className=" m-0 btn-sm"
              onClick={(e) => {
                setStatus({ value: "scheduled", label: "Request" });
              }}
            >
              Details
            </Button>
          </CardFooter>
        </Card>
      </Col>
    </Row>
  );
};

export default EmailLogTableStatusCards;

EmailLogTableStatusCards.propTypes = {
  filtersDelivered: PropTypes.array.isRequired,
  filtersError: PropTypes.array.isRequired,
  filtersRequest: PropTypes.array.isRequired,
  status: PropTypes.object.isRequired,
  setStatus: PropTypes.func.isRequired
};
