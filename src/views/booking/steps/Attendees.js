import { Fragment } from 'react';
import { ArrowLeft, ArrowRight } from 'react-feather';
import { Button, Col, Form, Row } from 'reactstrap';
import TableAttendees from './TableAttendees';
import { useMutation } from '@apollo/client';
import mutationUpsertAttendee from '../../../graphql/MutationUpsertAttendee';
import mutationDeleteAttendee from '../../../graphql/MutationDeleteAttendee';

// @styles
import '@styles/react/libs/tables/react-dataTable-component.scss';

const Attendees = ({ stepper, type, teamClass, booking, attendees, setRealCountAttendees }) => {
  const [upsertAttendee] = useMutation(mutationUpsertAttendee, {});
  const [removeAttendee] = useMutation(mutationDeleteAttendee, {});

  const updateAttendeesCount = (newCount) => {
    setRealCountAttendees(newCount);
  };

  const saveAttendee = async (attendee) => {
    const result = await upsertAttendee({
      variables: attendee
    });

    if (!result || !result.data || !result.data.upsertOneAttendee) {
      console.log('Error creating attendee', result);
      return;
    }

    console.log('1. New attendee created: ', result.data.upsertOneAttendee._id);
    return result.data.upsertOneAttendee;
  };

  const deleteAttendee = async (attendeeId) => {
    const result = await removeAttendee({
      variables: {
        id: attendeeId
      }
    });

    return !result || !result.data || !result.data.deleteOneAttendee ? false : true;
  };

  return (
    <Fragment>
      <Form onSubmit={(e) => e.preventDefault()}>
        <Row>
          <Col sm="12">
            <TableAttendees
              hasKit={teamClass && teamClass.hasKit}
              currentBookingId={booking && booking._id}
              attendees={attendees}
              saveAttendee={saveAttendee}
              deleteAttendee={deleteAttendee}
              updateAttendeesCount={updateAttendeesCount}
              teamClassInfo={teamClass}
            />
          </Col>
        </Row>
        <Row></Row>
        <div className="d-flex justify-content-between">
          <Button.Ripple color="primary" className="btn-prev" onClick={() => stepper.previous()}>
            <ArrowLeft size={14} className="align-middle mr-sm-25 mr-0"></ArrowLeft>
            <span className="align-middle d-sm-inline-block d-none">Previous</span>
          </Button.Ripple>
          <Button.Ripple color="primary" className="btn-next" onClick={() => stepper.next()}>
            <span className="align-middle d-sm-inline-block d-none">Next</span>
            <ArrowRight size={14} className="align-middle ml-sm-25 ml-0"></ArrowRight>
          </Button.Ripple>
        </div>
      </Form>
    </Fragment>
  );
};

export default Attendees;
