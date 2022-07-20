// @packages
import React, { useEffect, useState } from 'react';
import { Button, Card, CardBody, CardTitle, CardText, CardFooter, Col, Row } from 'reactstrap';
import { DollarSign, TrendingUp } from 'react-feather';
import Avatar from '@components/avatar';
import PropTypes from 'prop-types';
import { getTotalsUsingFilter } from '../../services/BookingService';

const BookingsTableStatusCards = ({ status, setStatus, filters }) => {
  const [quoteTotals, setQuoteTotals] = useState({ count: 0, total: 0 });
  const [requestedTotals, setRequestedTotals] = useState({ count: 0, total: 0 });
  const [rejectedTotals, setRejectedTotals] = useState({ count: 0, total: 0 });
  const [acceptedTotals, setAcceptedTotals] = useState({ count: 0, total: 0 });
  const [depositTotals, setDepositTotals] = useState({ count: 0, total: 0 });
  const [finalTotals, setFinalTotals] = useState({ count: 0, total: 0 });

  useEffect(() => {
    if (!filters || filters.length === 0) return;

    const getTotals = async (filterBy, setFunction) => {
      const selected = await getTotalsUsingFilter(filterBy);
      setFunction(selected);
    };

    const currentFilters = filters.filter((filter) => filter.name !== 'status' && filter.name !== 'eventDateTimeStatus');

    const quoteFilters = [...currentFilters];
    quoteFilters.push({ name: 'status', type: 'string', operator: 'contains', value: 'quote' });
    getTotals(quoteFilters, setQuoteTotals);

    const requestedFilters = [...currentFilters];
    requestedFilters.push({ name: 'status', type: 'string', operator: 'contains', value: 'date-requested' });
    requestedFilters.push({ name: 'eventDateTimeStatus', type: 'string', operator: 'contains', value: 'reserved' });
    getTotals(requestedFilters, setRequestedTotals);

    const rejectedFilters = [...currentFilters];
    rejectedFilters.push({ name: 'status', type: 'string', operator: 'contains', value: 'date-requested' });
    rejectedFilters.push({ name: 'eventDateTimeStatus', type: 'string', operator: 'contains', value: 'rejected' });
    getTotals(rejectedFilters, setRejectedTotals);

    const acceptedFilters = [...currentFilters];
    acceptedFilters.push({ name: 'status', type: 'string', operator: 'contains', value: 'date-requested' });
    acceptedFilters.push({ name: 'eventDateTimeStatus', type: 'string', operator: 'contains', value: 'confirmed' });
    getTotals(acceptedFilters, setAcceptedTotals);

    const depositFilters = [...currentFilters];
    depositFilters.push({ name: 'status', type: 'string', operator: 'contains', value: 'confirmed' });
    getTotals(depositFilters, setDepositTotals);

    const paidFilters = [...currentFilters];
    paidFilters.push({ name: 'status', type: 'string', operator: 'contains', value: 'paid' });
    getTotals(paidFilters, setFinalTotals);
  }, [filters]);

  return (
    <Row className="d-flex justify-content-between mt-1">
      <Col md="6" xl="2">
        <Card className="">
          <CardBody className="pt-1 pb-1">
            <CardTitle className="text-center mb-0 ">
              <h6>Quote</h6>
            </CardTitle>
            <CardText>
              <div className="d-flex justify-content-start d-flex align-items-center font-small-3 ">
                <div>
                  <Avatar color="light-primary" icon={<TrendingUp size={18} />} />
                </div>
                <div className="pl-1 m-0">
                  <div>
                    <strong>{quoteTotals.count}</strong>
                  </div>
                  <div className="font-small-1">Events</div>
                </div>
              </div>
              <div className="d-flex justify-content-start d-flex align-items-center font-small-3">
                <div>
                  <Avatar className="" color="light-primary" icon={<DollarSign size={18} />} />
                </div>
                <div className="pl-1 m-0">
                  <div>
                    <strong>${quoteTotals.total.toFixed(2)}</strong>
                  </div>
                  <div className="font-small-1">Total</div>
                </div>
              </div>
            </CardText>
          </CardBody>
          <CardFooter className="pt-1 pb-1 d-flex justify-content-center">
            <Button
              color="primary"
              outline={!status || (status && status.value === 'quote') ? false : true}
              className="btn-sm"
              onClick={(e) => {
                setStatus({ value: 'quote', label: 'Quote' });
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
              <h6>Requested </h6>
            </CardTitle>
            <CardText>
              <div className="d-flex justify-content-start d-flex align-items-center font-small-3 ">
                <div>
                  <Avatar color="light-primary" icon={<TrendingUp size={18} />} />
                </div>
                <div className="pl-1 m-0">
                  <div>
                    <strong>{requestedTotals.count}</strong>
                  </div>
                  <div className="font-small-1">Events</div>
                </div>
              </div>
              <div className="d-flex justify-content-start d-flex align-items-center font-small-3">
                <div>
                  <Avatar className="" color="light-primary" icon={<DollarSign size={18} />} />
                </div>
                <div className="pl-1 m-0">
                  <div>
                    <strong>${requestedTotals.total.toFixed(2)}</strong>
                  </div>
                  <div className="font-small-1">Total</div>
                </div>
              </div>
            </CardText>
          </CardBody>
          <CardFooter className="pt-1 pb-1 d-flex justify-content-center">
            <Button
              color="primary"
              outline={!status || (status && status.value === 'date-requested' && status.calendarEventStatus === 'reserved') ? false : true}
              className=" m-0 btn-sm"
              onClick={(e) => {
                setStatus({ value: 'date-requested', label: 'Requested', calendarEventStatus: 'reserved' });
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
              <h6>Rejected</h6>
            </CardTitle>
            <CardText>
              <div className="d-flex justify-content-start d-flex align-items-center font-small-3 ">
                <div>
                  <Avatar color="light-primary" icon={<TrendingUp size={18} />} />
                </div>
                <div className="pl-1 m-0">
                  <div>
                    <strong>{rejectedTotals.count}</strong>
                  </div>
                  <div className="font-small-1">Events</div>
                </div>
              </div>
              <div className="d-flex justify-content-start d-flex align-items-center font-small-3">
                <div>
                  <Avatar className="" color="light-primary" icon={<DollarSign size={18} />} />
                </div>
                <div className="pl-1 m-0">
                  <div>
                    <strong>${rejectedTotals.total.toFixed(2)}</strong>
                  </div>
                  <div className="font-small-1">Total</div>
                </div>
              </div>
            </CardText>
          </CardBody>
          <CardFooter className="pt-1 pb-1 d-flex justify-content-center">
            <Button
              color="primary"
              outline={!status || (status && status.value === 'date-requested' && status.calendarEventStatus === 'rejected') ? false : true}
              className=" m-0 btn-sm"
              onClick={(e) => {
                e.preventDefault();
                setStatus({ value: 'date-requested', label: 'Rejected', calendarEventStatus: 'rejected' });
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
              <h6>Accepted</h6>
            </CardTitle>
            <CardText>
              <div className="d-flex justify-content-start d-flex align-items-center font-small-3 ">
                <div>
                  <Avatar color="light-primary" icon={<TrendingUp size={18} />} />
                </div>
                <div className="pl-1 m-0">
                  <div>
                    <strong>{acceptedTotals.count}</strong>
                  </div>
                  <div className="font-small-1">Events</div>
                </div>
              </div>
              <div className="d-flex justify-content-start d-flex align-items-center font-small-3">
                <div>
                  <Avatar className="" color="light-primary" icon={<DollarSign size={18} />} />
                </div>
                <div className="pl-1 m-0">
                  <div>
                    <strong>${acceptedTotals.total.toFixed(2)}</strong>
                  </div>
                  <div className="font-small-1">Total</div>
                </div>
              </div>
            </CardText>
          </CardBody>
          <CardFooter className="pt-1 pb-1 d-flex justify-content-center">
            <Button
              color="primary"
              outline={!status || (status && status.value === 'date-requested' && status.calendarEventStatus === 'confirmed') ? false : true}
              className=" m-0 btn-sm"
              onClick={(e) => {
                e.preventDefault();
                setStatus({ value: 'date-requested', label: 'Accepted', calendarEventStatus: 'confirmed' });
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
              <h6>Deposit paid</h6>
            </CardTitle>
            <CardText>
              <div className="d-flex justify-content-start d-flex align-items-center font-small-3 ">
                <div>
                  <Avatar color="light-primary" icon={<TrendingUp size={18} />} />
                </div>
                <div className="pl-1 m-0">
                  <div>
                    <strong>{depositTotals.count}</strong>
                  </div>
                  <div className="font-small-1">Events</div>
                </div>
              </div>
              <div className="d-flex justify-content-start d-flex align-items-center font-small-3">
                <div>
                  <Avatar className="" color="light-primary" icon={<DollarSign size={18} />} />
                </div>
                <div className="pl-1 m-0">
                  <div>
                    <strong>${depositTotals.total.toFixed(2)}</strong>
                  </div>
                  <div className="font-small-1">Total</div>
                </div>
              </div>
            </CardText>
          </CardBody>
          <CardFooter className="pt-1 pb-1 d-flex justify-content-center">
            <Button
              color="primary"
              outline={!status || (status && status.value === 'confirmed') ? false : true}
              className=" m-0 btn-sm"
              onClick={(e) => {
                e.preventDefault();
                setStatus({ value: 'confirmed', label: 'Deposit Paid' });
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
              <h6>Paid</h6>
            </CardTitle>
            <CardText>
              <div className="d-flex justify-content-start d-flex align-items-center font-small-3 ">
                <div>
                  <Avatar color="light-primary" icon={<TrendingUp size={18} />} />
                </div>
                <div className="pl-1 m-0">
                  <div>
                    <strong>{finalTotals.count}</strong>
                  </div>
                  <div className="font-small-1">Events</div>
                </div>
              </div>
              <div className="d-flex justify-content-start d-flex align-items-center font-small-3">
                <div>
                  <Avatar className="" color="light-primary" icon={<DollarSign size={18} />} />
                </div>
                <div className="pl-1 m-0">
                  <div>
                    <strong>${finalTotals.total.toFixed(2)}</strong>
                  </div>
                  <div className="font-small-1">Total</div>
                </div>
              </div>
            </CardText>
          </CardBody>
          <CardFooter className="pt-1 pb-1 d-flex justify-content-center">
            <Button
              color="primary"
              outline={!status || (status && status.value === 'paid') ? false : true}
              className=" m-0 btn-sm"
              onClick={(e) => {
                e.preventDefault();
                setStatus({ value: 'paid', label: 'Paid' });
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

export default BookingsTableStatusCards;

BookingsTableStatusCards.propTypes = {
  filters: PropTypes.array.isRequired,
  status: PropTypes.object.isRequired,
  setStatus: PropTypes.func.isRequired
};
