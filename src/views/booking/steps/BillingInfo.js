import React, { Fragment } from 'react';
import { Button, Col, Form, FormGroup, Input, Row } from 'reactstrap';
import '@styles/react/libs/react-select/_react-select.scss';
import Cleave from 'cleave.js/react';
import 'cleave.js/dist/addons/cleave-phone.us';
import { useMutation } from '@apollo/client';
import mutationUpdateQuote from '../../../graphql/MutationUpdateQuote';
import { isValidEmail } from '../../../utility/Utils';
import { BOOKING_CLOSED_STATUS } from '../../../utility/Constants';

const BillingInfo = ({ type, booking, customer, calendarEvent }) => {
  const [phone, setPhone] = React.useState('');
  const [name, setName] = React.useState('');
  const [company, setCompany] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [emailValid, setEmailValid] = React.useState(true);
  const [processing, setProcessing] = React.useState(false);
  const [updateBooking, { ...finalQuotaData }] = useMutation(mutationUpdateQuote, {});

  const emailValidation = (email) => {
    setEmailValid(isValidEmail(email));
  };

  const options = { phone: true, phoneRegionCode: 'US' };

  React.useEffect(() => {
    if (customer) {
      setName(customer.name);
      setEmail(customer.email);
      setPhone(customer.phone);
      setCompany(customer.company);
    }
  }, [customer]);

  const saveBooking = async () => {
    setProcessing(true);

    try {
      await updateBooking({
        variables: {
          bookingId: booking._id,
          customerId: booking.customerId,
          name,
          phone,
          email,
          company,
          updatedAt: new Date()
        }
      });

      console.log('booking updated');

      setProcessing(false);
    } catch (ex) {
      console.log(ex);
      setProcessing(false);
    }
  };

  return (
    <Fragment>
      <Form onSubmit={(e) => e.preventDefault()}>
        <Row>
          <Col lg={12}>
            <div className="content-header">
              <h5 className="mb-0">Personal Info</h5>
              <small>Enter your personal information</small>
            </div>
            <Row>
              <FormGroup tag={Col} md="6">
                <Input
                  type="text"
                  name="full-name"
                  id={`full-name-${type}`}
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormGroup>
              <FormGroup tag={Col} md="6">
                <Input
                  type="text"
                  name="company-name"
                  id={`company-name-${type}`}
                  placeholder="Company Name"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </FormGroup>
            </Row>
            <Row>
              <FormGroup tag={Col} md="6">
                <Input
                  type="email"
                  name={`email-${type}`}
                  id={`email-${type}`}
                  placeholder="Email"
                  aria-label="john.doe"
                  value={email}
                  invalid={!emailValid}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={(e) => {
                    emailValidation(e.target.value);
                  }}
                />
              </FormGroup>
              <FormGroup tag={Col} md="6">
                <Cleave
                  className="form-control"
                  placeholder="Phone Number"
                  options={options}
                  id={`phone-${type}`}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </FormGroup>
            </Row>
          </Col>
        </Row>
        {booking && booking.status !== BOOKING_CLOSED_STATUS && (
          <div className="d-flex justify-content-between">
            <span></span>
            <Button.Ripple
              color="primary"
              className="btn-submit"
              size="sm"
              onClick={() => saveBooking()}
              disabled={!phone || !name || !email || processing || !emailValid || !calendarEvent}
            >
              {processing ? `Saving...` : `Save`}
            </Button.Ripple>
          </div>
        )}
      </Form>
    </Fragment>
  );
};

export default BillingInfo;
