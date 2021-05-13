import React, {Fragment} from 'react'
import {AlertCircle, ArrowLeft} from 'react-feather'
import {Label, FormGroup, Row, Col, Form, Input, Button, Alert} from 'reactstrap'
import BookingSummaryWithoutDate from "./BookingSummaryWithoutDate"
import CardCongratulations from "./CardCongratulations"

const Confirmation = ({stepper, type, customer, booking}) => {
    return (
        <Fragment>
            <Row className='match-height pt-1'>
                <Col md='12' lg='12' sm='12'>
                    {customer && <CardCongratulations stepper={stepper} firstName={customer.name.split(" ")[0]} />}
                </Col>
            </Row>
        </Fragment>
    )
}

export default Confirmation
