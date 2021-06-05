import React, {Fragment} from 'react'
import Avatar from '@components/avatar'
import NumberInput from '@components/number-input'
import * as Icon from 'react-feather'
import {Button, Card, Col, Form, Media, Row, Table} from 'reactstrap'

const SpecialRequests = ({stepper, type, teamClass, booking, setBookingAdditions}) => {

    const addons = [
        {
            name: "Expedited Shipping",
            description: "Get your kit in 2 business days",
            icon: Icon['Truck'],
            color: "light-primary",
            multipleUnits: false,
            unitPrice: 500,
            unit: "Class",
            order: 2
        },
        {
            name: "Additional Wine Bottle",
            description: "French wine bottle from Bordeus Region",
            icon: Icon['Gift'],
            color: "light-success",
            multipleUnits: true,
            unitPrice: 120.5,
            unit: "Attendee",
            order: 1
        }
    ]

    const [changesToSave, setChangesToSave] = React.useState(false)
    const [addOnsSelection, setAddOnsSelection] = React.useState(addons)

    const changeAddonSelection = (addon, quantity) => {
        const result = addOnsSelection.filter(element => element.name !== addon.name)
        const newAddon = addon
        newAddon.quantity = quantity
        result.push(newAddon)
        setAddOnsSelection(result)
        setChangesToSave(true)
        setBookingAdditions(addOnsSelection)
    }

    const getTotalItem = (item) => {

        if (!item || !booking) return 0
        if (item.unit === "Class") return (item.unitPrice * (item.quantity ? item.quantity : 0)).toFixed(2)
        if (item.unit === "Attendee") return (item.unitPrice * booking.attendees * (item.quantity ? item.quantity : 0)).toFixed(2)

    }

    return (
        <Fragment>
            <Row>
                <Col lg={12}>
                    <Card className='card-transaction'>
                        <Table responsive>
                            <thead>
                            <tr>
                                <th>
                                    <div align="left">Add-On</div>
                                </th>
                                <th>
                                    <div align="right">Price</div>
                                </th>
                                <th>
                                    <div align="center">Unit</div>
                                </th>
                                <th>
                                    <div align="right">Total</div>
                                </th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {addOnsSelection.sort((a, b) => a.order - b.order).map(item => (

                                <tr key={item.name}>
                                    <td>
                                        <div key={item.title} className='transaction-item'>
                                            <Media>
                                                <Avatar className='rounded' color={item.color}
                                                        icon={<item.icon size={18}/>}/>
                                                <Media body>
                                                    <h6 className='transaction-title'>{item.name}</h6>
                                                    <small>{item.description}</small>
                                                </Media>
                                            </Media>
                                        </div>
                                    </td>
                                    <td align="right">
                                        <div
                                            className={`font-weight-bolder ${item.down ? 'text-danger' : 'text-default'}`}>$ {item.unitPrice.toFixed(2)}</div>
                                    </td>
                                    <td align="center">
                                        <small>x {item.unit}</small>
                                    </td>
                                    <td align="right">
                                        <div
                                            className={`font-weight-bolder ${item.down ? 'text-danger' : 'text-default'}`}>$ {getTotalItem(item)}</div>
                                    </td>
                                    <td align="right">
                                        <NumberInput onChange={value => changeAddonSelection(item, value)} min={0}
                                                     max={item.multipleUnits ? 1000 : 1} value={0} size="sm"
                                                     className='w-50' id={`${item.name}quantity`}/>
                                    </td>

                                </tr>))}
                            </tbody>
                        </Table>
                    </Card>
                </Col>
            </Row>
            <div className='d-flex justify-content-between'>
                <Button.Ripple color='primary' className='btn-prev' onClick={() => stepper.previous()}>
                    <Icon.ArrowLeft size={14} className='align-middle mr-sm-25 mr-0'></Icon.ArrowLeft>
                    <span className='align-middle d-sm-inline-block d-none'>Previous</span>
                </Button.Ripple>
                <Button.Ripple disabled={!changesToSave} color='primary' className='btn-next'
                               onClick={() => stepper.next()}>
                    <span className='align-middle d-sm-inline-block d-none'>Next</span>
                    <Icon.ArrowRight size={14} className='align-middle ml-sm-25 ml-0'></Icon.ArrowRight>
                </Button.Ripple>
            </div>
        </Fragment>
    )
}

export default SpecialRequests
