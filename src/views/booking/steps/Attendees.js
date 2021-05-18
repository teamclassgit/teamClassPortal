import {Fragment} from 'react'
import {ArrowLeft, ArrowRight} from 'react-feather'
import {Button, Col, Form, Row} from 'reactstrap'
import TableAttendees from "./TableAttendees"
import {useMutation} from "@apollo/client"
import mutationCreateAttendee from "../../../graphql/MutationCreateAttendee"
import mutationUpdateAttendee from "../../../graphql/MutationUpdateAttendee"
import mutationDeleteAttendee from "../../../graphql/MutationDeleteAttendee"
// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'

const Attendees = ({stepper, type, teamClass, booking, attendees, setRealCountAttendees}) => {

    const [createAttendee] = useMutation(mutationCreateAttendee, {})
    const [updateAttendee] = useMutation(mutationUpdateAttendee, {})
    const [removeAttendee] = useMutation(mutationDeleteAttendee, {})


    const updateAttendeesCount = (newCount) => {
        setRealCountAttendees(newCount)
    }

    const saveAttendee = async (attendee) => {

        if (attendee.id) {

            const resultUpdate = await updateAttendee(
                {
                    variables: attendee
                }
            )

            if (!resultUpdate || !resultUpdate.data || !resultUpdate.data.updateAttendee) {
                console.log("Error updating attendee", resultUpdate)
                return
            }

            console.log("1. attendee updated:", resultUpdate.data.updateAttendee.id)
            return resultUpdate.data.updateAttendee

        } else {

            const resultCreate = await createAttendee(
                {
                    variables: attendee
                }
            )

            if (!resultCreate || !resultCreate.data ||
                !resultCreate.data.createAttendee || !resultCreate.data.createAttendee.id) {
                console.log("Error creating attendee", resultCreate)
                return
            }

            console.log("1. New attendee created: ", resultCreate.data.createAttendee.id)
            return resultCreate.data.createAttendee
        }

    }

    const deleteAttendee = async (attendeeId) => {
        await removeAttendee(
            {
                variables: {
                    id: attendeeId
                }
            }
        )
    }

    return (
        <Fragment>
            <Form onSubmit={e => e.preventDefault()}>
                <Row>
                    <Col sm='12'>
                        <TableAttendees hasKit={teamClass && teamClass.hasKit} currentBookingId={booking && booking.id}
                                        attendees={attendees} saveAttendee={saveAttendee}
                                        deleteAttendee={deleteAttendee} updateAttendeesCount={updateAttendeesCount}/>
                    </Col>
                </Row>
                <Row>
                </Row>
                <div className='d-flex justify-content-between'>
                    <Button.Ripple color='primary' className='btn-prev' onClick={() => stepper.previous()}>
                        <ArrowLeft size={14} className='align-middle mr-sm-25 mr-0'></ArrowLeft>
                        <span className='align-middle d-sm-inline-block d-none'>Previous</span>
                    </Button.Ripple>
                    <Button.Ripple color='primary' className='btn-next' onClick={() => stepper.next()}>
                        <span className='align-middle d-sm-inline-block d-none'>Next</span>
                        <ArrowRight size={14} className='align-middle ml-sm-25 ml-0'></ArrowRight>
                    </Button.Ripple>
                </div>
            </Form>
        </Fragment>
    )
}

export default Attendees
