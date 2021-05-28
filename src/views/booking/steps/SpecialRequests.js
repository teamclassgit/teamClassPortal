import {Fragment} from 'react'
import {ArrowLeft, ArrowRight} from 'react-feather'
import {Button, Col, Form, Row} from 'reactstrap'

const SpecialRequests = ({stepper, type, teamClass, booking}) => {

    return (
        <Fragment>
            <Form onSubmit={e => e.preventDefault()}>
                <Row>
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

export default SpecialRequests
