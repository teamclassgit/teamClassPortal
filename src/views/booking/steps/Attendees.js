import { Fragment } from "react";
import { Col, Form, Row } from "reactstrap";
import TableAttendees from "./TableAttendees";
import { useMutation } from "@apollo/client";
import mutationUpsertAttendee from "../../../graphql/MutationUpsertAttendee";
import mutationDeleteAttendee from "../../../graphql/MutationDeleteAttendee";

// @styles
import "@styles/react/libs/tables/react-dataTable-component.scss";

const Attendees = ({ stepper, type, teamClass, booking, attendees, setRealCountAttendees, customer }) => {
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
      console.log("Error creating attendee", result);
      return;
    }

    console.log("1. New attendee created: ", result.data.upsertOneAttendee._id);
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
              booking={booking}
              currentBookingId={booking && booking._id}
              attendees={attendees}
              saveAttendee={saveAttendee}
              deleteAttendee={deleteAttendee}
              updateAttendeesCount={updateAttendeesCount}
              teamClassInfo={teamClass}
              customer={customer}
            />
          </Col>
        </Row>
      </Form>
    </Fragment>
  );
};

export default Attendees;
