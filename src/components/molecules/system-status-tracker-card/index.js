// @packages
import React, { useEffect, useState } from "react";
import { Alert, Button, Card, CardBody, CardTitle, CardText, CardFooter, Col, Row } from "reactstrap";
import { DollarSign, TrendingUp } from "react-feather";
import { useQuery } from "@apollo/client";
import { Icon } from "@iconify/react";
import { BsFillCircleFill } from "react-icons/bs";
import Avatar from "@components/avatar";
import PropTypes from "prop-types";
import querySystemStatus from "@graphql/QuerySystemStatus";

// @styles
import "./booking-tracker-status-card.scss";

const SystemStatusTrackerCards = ({ typeCard, setTypeCard}) => {
  const [errorListing, isErrorListing] = useState();
  const [warningListing, isWarningListing] = useState();
  const [successfulListing, isSuccessfulListing] = useState();
  const [errorBookingFull, isErrorBookingFull] = useState();
  const [warningBookingFull, isWarningBookingFull] = useState();
  const [successfulBookingFull, isSuccessfulBookingFull] = useState();
  const [errorEmail, isErrorEmail] = useState();
  const [warningEmail, isWarningEmail] = useState();
  const [successfulEmail, isSuccessfulEmail] = useState();
  const limit = 200;
  useEffect(() => {

  });

  useQuery(querySystemStatus, {
    fetchPolicy: "cache-and-network",
    pollInterval: 100000,
    variables: {
      limit
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      if (data) {
        if (data?.getSystemStatus.resultBookingFull.status === "error") {
          isErrorBookingFull(true);
          isWarningBookingFull(false);
          isSuccessfulBookingFull(false);
        }
        if (data?.getSystemStatus.resultBookingFull.status === "warning") {
          isWarningBookingFull(true);
          isErrorBookingFull(false);
          isSuccessfulBookingFull(false);
        }
        if (data?.getSystemStatus.resultBookingFull.status === "successful") {
          isSuccessfulBookingFull(true);
          isWarningBookingFull(false);
          isErrorBookingFull(false);
        }
        if (data?.getSystemStatus.resultListing.status === "warning") {
          isWarningListing(true);
          isErrorListing(false);
          isSuccessfulListing(false);
        }
        if (data?.getSystemStatus.resultListing.status === "error") {
          isErrorListing(true);
          isSuccessfulListing(false);
          isWarningListing(false);
        }
        if (data?.getSystemStatus.resultListing.status === "successful") {
          isSuccessfulListing(true);
          isErrorListing(false);
          isWarningListing(false);
        }
        if (data?.getSystemStatus.resultBooking.status === "successful") {
          isSuccessfulEmail(true);
          isWarningEmail(false);
          isErrorEmail(false);
        }
        if (data?.getSystemStatus.resultBooking.status === "warning") {
          isWarningEmail(true);
          isErrorEmail(false);
          isSuccessfulEmail(false);
        }
        if (data?.getSystemStatus.resultBooking.status === "error") {
          isErrorEmail(true);
          isWarningEmail(false);
          isSuccessfulEmail(false);
        }
      }
    }
  });

  return (
    <Row className="d-flex justify-content-start mt-1">
      <Col md="6" xl="2">
        <Card className="">
          <CardBody className="pt-1 pb-1">
            <CardTitle className="text-center mb-0 ">
              <h6>Emails Status</h6>
            </CardTitle>
            <CardText tag="div" className="booking-tracker-status-card-content">
              <div className="d-flex justify-content-center align-items-center font-small-3">
                <div>
                  {errorEmail &&
                    <Icon className="error-icon" fontSize={40} icon="ion:ellipse-sharp" />
                  }
                  {warningEmail &&
                    <Icon className="warning-icon" fontSize={40} icon="ion:ellipse-sharp" />
                  }
                  {successfulEmail &&
                    <Icon className="successful-icon" fontSize={40} icon="ion:ellipse-sharp" />
                  }
                </div>
              </div>
            </CardText>
          </CardBody>
          <CardFooter className="pt-1 pb-1 d-flex justify-content-center">
            <Button
              color="primary"
              outline={!typeCard || (typeCard && typeCard.value === "email") ? false : true}
              className="btn-sm"
              onClick={(e) => {
                setTypeCard({ value: "email", label: "Email Status" });
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
              <h6>Catalog Status </h6>
            </CardTitle>
            <CardText tag="div" className="booking-tracker-status-card-content">
              <div className="d-flex justify-content-center align-items-center font-small-3 ">
                <div>
                  {errorListing &&
                    <Icon className="error-icon" fontSize={40} icon="ion:ellipse-sharp" />
                  }
                  {warningListing &&
                    <Icon className="warning-icon" fontSize={40} icon="ion:ellipse-sharp" />
                  }
                  {successfulListing &&
                    <Icon className="successful-icon" fontSize={40} icon="ion:ellipse-sharp" />
                  }
                </div>
              </div>
            </CardText>
          </CardBody>
          <CardFooter className="pt-1 pb-1 d-flex justify-content-center">
            <Button
              color="primary"
              outline={!typeCard || (typeCard && typeCard.value === "catalog") ? false : true}
              className=" m-0 btn-sm"
              onClick={(e) => {
                setTypeCard({ value: "catalog", label: "Catalog Status" });
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
              <h6>Bookings Status</h6>
            </CardTitle>
            <CardText tag="div" className="booking-tracker-status-card-content">
              <div className="d-flex justify-content-center align-items-center font-small-3 ">
                <div>
                  {errorBookingFull &&
                    <Icon className="error-icon" fontSize={40} icon="ion:ellipse-sharp" />
                  }
                  {warningBookingFull &&
                    <Icon className="warning-icon" fontSize={40} icon="ion:ellipse-sharp" />
                  }
                  {successfulBookingFull &&
                    <Icon className="successful-icon" fontSize={40} icon="ion:ellipse-sharp" />
                  }
                </div>
              </div>
            </CardText>
          </CardBody>
          <CardFooter className="pt-1 pb-1 d-flex justify-content-center">
            <Button
              color="primary"
              outline={!typeCard || (typeCard && typeCard.value === "bookingFull") ? false : true}
              className=" m-0 btn-sm"
              onClick={(e) => {
                e.preventDefault();
                setTypeCard({ value: "bookingFull", label: "Bookings Status" });
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

export default SystemStatusTrackerCards;

SystemStatusTrackerCards.propTypes = {
  typeCard: PropTypes.object.isRequired,
  setTypeCard: PropTypes.func.isRequired
};
