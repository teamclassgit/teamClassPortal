// @packages
import React from 'react';
import { Button, Card, CardBody, CardTitle, CardText, CardFooter, Col, Row } from 'reactstrap';
import { DollarSign, TrendingUp } from 'react-feather';
import Avatar from '@components/avatar';

const BookingsTableStatusCards = ({ setStatus }) => {
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
                    <strong>459</strong>
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
                    <strong>$153,596.36</strong>
                  </div>
                  <div className="font-small-1">Total</div>
                </div>
              </div>
            </CardText>
          </CardBody>
          <CardFooter className="pt-1 pb-1 d-flex justify-content-center">
            <Button
              color="primary"
              outline
              className="  btn-sm"
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
                    <strong>459</strong>
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
                    <strong>$153,596.36</strong>
                  </div>
                  <div className="font-small-1">Total</div>
                </div>
              </div>
            </CardText>
          </CardBody>
          <CardFooter className="pt-1 pb-1 d-flex justify-content-center">
            <Button
              color="primary"
              outline
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
                    <strong>459</strong>
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
                    <strong>$153,596.36</strong>
                  </div>
                  <div className="font-small-1">Total</div>
                </div>
              </div>
            </CardText>
          </CardBody>
          <CardFooter className="pt-1 pb-1 d-flex justify-content-center">
            <Button
              color="primary"
              outline
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
                    <strong>459</strong>
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
                    <strong>$153,596.36</strong>
                  </div>
                  <div className="font-small-1">Total</div>
                </div>
              </div>
            </CardText>
          </CardBody>
          <CardFooter className="pt-1 pb-1 d-flex justify-content-center">
            <Button
              color="primary"
              outline
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
                    <strong>459</strong>
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
                    <strong>$153,596.36</strong>
                  </div>
                  <div className="font-small-1">Total</div>
                </div>
              </div>
            </CardText>
          </CardBody>
          <CardFooter className="pt-1 pb-1 d-flex justify-content-center">
            <Button
              color="primary"
              outline
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
                    <strong>459</strong>
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
                    <strong>$153,596.36</strong>
                  </div>
                  <div className="font-small-1">Total</div>
                </div>
              </div>
            </CardText>
          </CardBody>
          <CardFooter className="pt-1 pb-1 d-flex justify-content-center">
            <Button
              color="primary"
              outline
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
