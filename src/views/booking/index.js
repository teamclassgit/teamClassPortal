import {Fragment} from 'react'
import {Row, Col, Breadcrumb, BreadcrumbItem} from 'reactstrap'
import WizardClassBooking from './WizardClassBooking'
import {useParams} from "react-router-dom"

const Booking = () => {


    const {id} = useParams()

    return (
        <Fragment>
            <div className='content-header row'>
                <div className='content-header-left col-md-9 col-12 mb-2'>
                    <div className='row breadcrumbs-top'>
                        <div className='col-12'>
                            <h2 className='content-header-title mb-0'>Checkout <small className="text-truncate">Booking {id}</small></h2>
                        </div>
                    </div>
                </div>
            </div>
            <Row>
                <Col sm='12'>
                    <WizardClassBooking/>
                </Col>
            </Row>
        </Fragment>
    )
}
export default Booking
