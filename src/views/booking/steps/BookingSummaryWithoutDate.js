import React from "react"
import {Badge, Card, CardBody, FormText, Media} from "reactstrap"
import moment from "moment"
import {Calendar} from "react-feather"
import Avatar from '@components/avatar'
import {toAmPm} from '../../../utility/Utils'

const BookingSummaryWithoutDate = (props) => {

    const {
        serviceFee, attendeesAdded, attendees, pricePerson, minimum, salesTax, calendarEvent, teamClass
    } = props

    const [totalWithoutFee, setTotalWithoutFee] = React.useState(0)
    const [totalUnderGroupFee, setTotalUnderGroupFee] = React.useState(0)
    const [totalTax, setTotalTax] = React.useState(0)
    const [totalServiceFee, setTotalServiceFee] = React.useState(0)
    const [total, setTotal] = React.useState(0)
    const [date, setDate] = React.useState(null)
    const [time, setTime] = React.useState(null)

    const getTotals = () => {

        const withoutFee = (attendees > minimum ? (pricePerson * attendees) : (pricePerson * minimum))
        const underGroupFee = (attendees > minimum ? 0 : pricePerson * (minimum - attendees))
        const fee = withoutFee * serviceFee
        const tax = (withoutFee + fee) * salesTax
        const finalValue = withoutFee + fee + tax

        setTotalTax(tax.toFixed(2))
        setTotalWithoutFee(withoutFee.toFixed(2))
        setTotalServiceFee(fee.toFixed(2))
        setTotalUnderGroupFee(underGroupFee.toFixed(2))
        setTotal(finalValue.toFixed(2))

    }

    React.useEffect(() => {

        getTotals()

    }, [serviceFee, attendees, pricePerson, minimum])

    React.useEffect(() => {
        //setDate([new Date(2021, 4, 10)])
        setDate(calendarEvent ? new Date(calendarEvent.year, calendarEvent.month - 1, calendarEvent.day) : null)
        setTime(calendarEvent ? `${toAmPm(calendarEvent.fromHour, calendarEvent.fromMinutes, teamClass && teamClass.timeZoneLabel)}` : null)

    }, [calendarEvent, teamClass])

    return <div className="py-3 sticky-top rounded">

        <Card className="border-0 shadow card-developer-meetup">
            <CardBody className="p-2">
                <div className="text-block pb-2">
                    <Media className="align-items-center">
                        <Media body>
                            <h6>
                                <a className="text-reset">
                                    {teamClass.title}
                                </a>
                            </h6>
                            <p className="text-muted text-sm mb-0">{teamClass.duration * 60} Minutes | {teamClass.hasKit ? "Kit included" : ""}</p>
                        </Media>
                    </Media>
                </div>
                {date && time && (<Media className="pb-1">
                    <Avatar color='light-primary' className='rounded mr-1' icon={<Calendar size={18} />} />
                    <Media body>
                        <h6 className='mb-0'>{` ${moment(date).format("LL")}`}</h6>
                        <small>{time} {calendarEvent && calendarEvent.status !== 'confirmed' ? <Badge color='warning'>To be confirmed</Badge>  : <Badge color='primary'>Confirmed</Badge>}</small>
                    </Media>
                </Media>)}
                {(!date || !time) && (<Media className="pb-1">

                    <Media body>
                        <h6 className='mb-0'><Avatar color='light-primary' className='rounded mr-1' icon={<Calendar size={18}/>}/> TBD</h6>
                    </Media>
                </Media>)}
                <div className="text-block pb-0">
                    <table className="w-100">
                        <tbody>
                        <tr>
                            <th className="font-weight-normal text-sm py-1">${pricePerson} x {attendees} attendees <small>({attendeesAdded} added)</small>
                                {attendees < minimum && (
                                    <FormText color="muted">
                                        Under 10 group fee
                                    </FormText>)}
                            </th>
                            <td className="text-right py-1 text-sm">${totalWithoutFee}</td>
                        </tr>
                        <tr>
                            <th className="font-weight-normal text-sm py-1">Booking fee
                                ({serviceFee * 100}%)
                            </th>
                            <td className="text-right py-1 text-sm">${totalServiceFee}</td>
                        </tr>
                        <tr>
                            <th className="font-weight-normal text-sm py-1">Sales Tax ({salesTax * 100}%)
                            </th>
                            <td className="text-right py-1 text-sm">${totalTax}</td>
                        </tr>
                        </tbody>
                        <tfoot>
                        <tr className="border-top">
                            <th className="pt-1 text-sm">Total</th>
                            <td className="font-weight-bold text-sm text-right pt-1">${total}</td>
                        </tr>
                        </tfoot>
                    </table>
                </div>
            </CardBody>

        </Card>
    </div>
}

export default BookingSummaryWithoutDate
