import {Fragment} from 'react'
import {Col, Row} from 'reactstrap'
import WizardClassBooking from './WizardClassBooking'
import {useParams} from "react-router-dom"

const DateSelection = () => {

    const {id} = useParams()

    return (
        <Fragment>
            <Row>
                <Col sm='12'>
                    <WizardClassBooking oneStepOnly={true} step={1} />
                </Col>
            </Row>
        </Fragment>
    )
}
export default DateSelection
