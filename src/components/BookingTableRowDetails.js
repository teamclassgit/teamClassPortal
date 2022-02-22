// @packages
import React from 'react';
import moment from 'moment';
import { Briefcase, Calendar, Mail, Phone } from 'react-feather';
import { Alert } from 'reactstrap';

// @scripts
import CopyClipboard from './CopyClipboard';
import { capitalizeString } from '../utility/Utils';

const RowDetails = ({ data }) => {
  const previousEventDays = moment(data.eventDateTime).diff(moment(), 'days');
  let alertMessage = '';
  let alertColor = '';

  if (data.depositsPaid && data.eventDateTime && !data.finalPaid) {
    if (previousEventDays < 0) {
      alertMessage = `Booking has not been paid and event was ${previousEventDays * -1} days ago.`;
      alertColor = 'danger';
    } else if (previousEventDays < 7 && previousEventDays >= 0) {
      alertMessage = `Booking has not been paid and event is in ${
        moment(data.eventDateTime).format('MM/DD/YYYY') === moment().format('MM/DD/YYYY') ? 0 : previousEventDays + 1
      } days.`;
      alertColor = 'warning';
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h4 className="mb-1">{capitalizeString(data.customerName)}</h4>
      <table>
        <tbody>
          <tr>
            <td>
              <Alert color={alertColor}>{alertMessage}</Alert>
            </td>
          </tr>

          <tr>
            <td>Phone</td>
            <td>
              <Phone size={16} /> {data.customerPhone} <CopyClipboard text={data.customerPhone} />
            </td>
          </tr>
          <tr>
            <td>Email</td>
            <td>
              <Mail size={16} /> {data.customerEmail} <CopyClipboard className="z-index-2" text={data.customerEmail} />
            </td>
          </tr>
          {data.customerCompany && (
            <tr>
              <td>Company</td>
              <td>
                <Briefcase size={16} /> {data.customerCompany}
              </td>
            </tr>
          )}
          <tr>
            <td>
              <strong>Booking ID</strong>
            </td>
            <td>{data._id}</td> <CopyClipboard className="z-index-2" text={data._id} />
          </tr>
          <tr>
            <td>Class:</td>
            <td>{data.className}</td>
          </tr>
          <tr>
            {data.classVariant && (
              <>
                <td>Option</td>
                <td>
                  {data.classVariant.title} {`$${data.classVariant.pricePerson}`} {data.classVariant.groupEvent ? '/group' : '/person'}
                </td>
              </>
            )}
          </tr>
          <tr>
            <td>Event Date</td>
            <td>
              <Calendar size={16} /> {data.eventDateTime ? moment(data.eventDateTime).format('LLL') : 'TBD'}
            </td>
          </tr>
          <tr>
            <td>Attendees</td>
            <td>{data.attendees}</td>
          </tr>
          <tr>
            <td>International attendees</td>
            <td>{data.hasInternationalAttendees ? 'Yes' : 'No'}</td>
          </tr>
          <tr>
            <td>Created</td>
            <td>{moment(data.createdAt).format('LL')}</td>
          </tr>
          <tr>
            <td>Updated</td>
            <td>{moment(data.updatedAt).format('LL')}</td>
          </tr>
          <tr>
            <td>Sign Up Date</td>
            <td>{data.signUpDeadline && moment(data.signUpDeadline).format('LL')}</td>
          </tr>
          <tr>
            <td>Conference Link</td>
            <td>
              {data?.joinInfo && data?.joinInfo?.joinUrl ? (
                <>
                  <a href={data?.joinInfo?.joinUrl} target={'_blank'} rel="noopener noreferrer" title={'Zoom link'}>
                    Link to the conference
                  </a>
                  {` (${data?.joinInfo?.password})`}
                  <CopyClipboard className="z-index-2" text={data?.joinInfo?.joinUrl} />
                </>
              ) : (
                <span>No link available</span>
              )}
            </td>
          </tr>
          <tr>
            <td>Shipping tracking link</td>
            <td>
              {data?.shippingTrackingLink ? (
                <>
                  <a href={data?.shippingTrackingLink} target={'_blank'} rel="noopener noreferrer" title={'Shipping tracking'}>
                    Link to shipping tracking document
                  </a>
                  <CopyClipboard className="z-index-2" text={data?.shippingTrackingLink} />
                </>
              ) : (
                <span>No link available</span>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default RowDetails;
