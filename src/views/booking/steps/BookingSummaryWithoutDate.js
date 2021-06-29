import React from 'react'
import {Badge, Card, CardBody, FormText, Media, Button} from 'reactstrap'
import moment from 'moment'
import {Calendar, Repeat} from 'react-feather'
import Avatar from '@components/avatar'
import {toAmPm} from '../../../utility/Utils'

const BookingSummaryWithoutDate = ({
                                       classRushFee,
                                       serviceFee,
                                       attendeesAdded,
                                       attendees,
                                       pricePerson,
                                       minimum,
                                       salesTax,
                                       additionals,
                                       calendarEvent,
                                       teamClass,
                                       bookingId,
                                       flipCard
                                   }) => {

    const [totalWithoutFee, setTotalWithoutFee] = React.useState(0)
    const [totalUnderGroupFee, setTotalUnderGroupFee] = React.useState(0)
    const [totalRushFee, setTotalTotalRushFee] = React.useState(0)
    const [totalTax, setTotalTax] = React.useState(0)
    const [totalServiceFee, setTotalServiceFee] = React.useState(0)
    const [total, setTotal] = React.useState(0)
    const [date, setDate] = React.useState(null)
    const [time, setTime] = React.useState(null)

    const getTotals = () => {

        const withoutFee = attendees > minimum ? pricePerson * attendees : pricePerson * minimum
        const underGroupFee = attendees > minimum ? 0 : pricePerson * (minimum - attendees)
        const rushFee = calendarEvent && calendarEvent.rushFee ? withoutFee * classRushFee : 0
        const fee = withoutFee * serviceFee
        const tax = (withoutFee + fee + additionals + rushFee) * salesTax
        const finalValue = withoutFee + additionals + fee + rushFee + tax

        setTotalTax(tax.toFixed(2))
        setTotalWithoutFee(withoutFee.toFixed(2))
        setTotalServiceFee(fee.toFixed(2))
        setTotalTotalRushFee(rushFee.toFixed(2))
        setTotalUnderGroupFee(underGroupFee.toFixed(2))
        setTotal(finalValue.toFixed(2))
    }

    React.useEffect(() => {
        getTotals()
    }, [serviceFee, attendees, pricePerson, minimum, additionals])

    React.useEffect(() => {
        //setDate([new Date(2021, 4, 10)])
        setDate(calendarEvent ? new Date(calendarEvent.year, calendarEvent.month - 1, calendarEvent.day) : null)
        setTime(calendarEvent ? `${toAmPm(calendarEvent.fromHour, calendarEvent.fromMinutes, teamClass && teamClass.timeZoneLabel)}` : null)
    }, [calendarEvent, teamClass])

    return (
        <div className={`sticky-top rounded ${!flipCard ? 'py-3' : ''}`}>
            <Card className="border-0 shadow card-developer-meetup">
                <CardBody className="p-2">
                    {flipCard && (
                        <Button color="link" className="flip-button text-muted" onClick={() => flipCard()}>
                            <Repeat size={14}/>
                        </Button>
                    )}
                    <div className="text-block pb-2">
                        <Media className="align-items-center">
                            <Media body>
                                <h6>
                                    <p className="text-reset">
                                        # <small className="text-truncated text-muted text-sm mb-0">{bookingId}</small>
                                    </p>
                                    <a className="text-reset">{teamClass.title}</a>
                                </h6>
                                <p className="text-muted text-sm mb-0">
                                    {teamClass.duration * 60} Minutes | {teamClass.hasKit ? 'Kit included' : ''}
                                </p>
                            </Media>
                        </Media>
                    </div>
                    {date && time && (
                        <Media className="pb-1">
                            <Avatar color="light-primary" className="rounded mr-1" icon={<Calendar size={18}/>}/>
                            <Media body>
                                <h6 className="mb-0">{` ${moment(date).format('LL')}`}</h6>
                                <small>
                                    {time}{' '}
                                    {calendarEvent && calendarEvent.status !== 'confirmed' ? (
                                        <Badge color="warning">To be confirmed</Badge>
                                    ) : (
                                        <Badge color="primary">Confirmed</Badge>
                                    )}
                                </small>
                            </Media>
                        </Media>
                    )}
                    {(!date || !time) && (
                        <Media className="pb-1">
                            <Media body>
                                <h6 className="mb-0">
                                    <Avatar color="light-primary" className="rounded mr-1"
                                            icon={<Calendar size={18}/>}/> TBD
                                </h6>
                            </Media>
                        </Media>
                    )}
                    <div className="text-block pb-0">
                        <table className="w-100">
                            <tbody>
                            <tr>
                                <th className="font-weight-normal text-sm pb-1">
                                    ${pricePerson} x {attendees} attendees <small>({attendeesAdded} added)</small>
                                    {attendees < minimum && <FormText color="muted">Under 10 group fee</FormText>}
                                </th>
                                <td className="text-right pb-1 text-sm">${totalWithoutFee}</td>
                            </tr>
                            <tr>
                                <th className="font-weight-normal text-sm pb-1 ">Add-ons</th>
                                <td className="text-right text-sm pb-1 ">${additionals.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <th className="font-weight-normal text-sm pb-1">Booking fee ({serviceFee * 100}%)</th>
                                <td className="text-right text-sm pb-1">${totalServiceFee}</td>
                            </tr>
                            {calendarEvent && calendarEvent.rushFee &&
                            <tr>
                                <th className="font-weight-normal text-sm pb-1">Rush fee
                                    ({classRushFee * 100}%)
                                </th>
                                <td className="text-right pb-1 text-sm">${totalRushFee}</td>
                            </tr>
                            }
                            <tr>
                                <th className="font-weight-normal text-sm pb-1">Sales Tax ({salesTax * 100}%)</th>
                                <td className="text-right pb-1 text-sm">${totalTax}</td>
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
    )
}

export default BookingSummaryWithoutDate
