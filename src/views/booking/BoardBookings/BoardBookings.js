// ** React Imports
import React, { forwardRef, Fragment, useState } from 'react'
import AddNewBooking from '../AddNewBooking'
import {
  Card,
  CardBody,
  CardText,
  CardLink,
  CardFooter,
  CardHeader,
  CardTitle,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  Row,
  Col,
  Label,
  Input,
  Badge,
  Media
} from 'reactstrap'
import Avatar from '@components/avatar'
import { FileText, Plus, Share, Filter, Calendar, Edit2, ShoppingCart, Repeat } from 'react-feather'
import FiltersModal from './FiltersModal'
import Board from '@lourenci/react-kanban'
import '@lourenci/react-kanban/dist/styles.css'
import { toAmPm } from '../../../utility/Utils'
import moment from 'moment'
import './BoardBookings.scss'
import BookingSummaryWithoutDate from '../steps/BookingSummaryWithoutDate'

const BoardBookings = ({ bookings, customers, setCustomers, classes, calendarEvents }) => {
  const [loading, setLoading] = useState(false)
  const [filteredBookings, setFilteredBookings] = useState([])
  const [data, setData] = useState([])
  const [currentElement, setCurrentElement] = React.useState(null)
  const [modal, setModal] = useState(false)
  const [showFiltersModal, setShowFiltersModal] = useState(false)
  const [cardFlipped, setCardFlipped] = useState(null)

  React.useEffect(() => {
    setFilteredBookings(bookings)
  }, [bookings])

  React.useEffect(() => {
    setLoading(false)
    setData(filteredBookings)
  }, [filteredBookings])

  const handleFilterByClass = (classId) => {
    setLoading(true)
    const newBookings = bookings.filter(({ teamClassId }) => teamClassId === classId)
    setFilteredBookings(newBookings)
  }

  // ** Function to handle Modal toggle
  const handleModal = () => setModal(!modal)

  const getCustomerPhone = (customerId) => {
    const result = customers.filter((element) => element.id === customerId)
    return result && result.length > 0 ? result[0].phone : ''
  }

  const getCustomerCompany = (customerId) => {
    const result = customers.filter((element) => element.id === customerId)
    return result && result.length > 0 ? result[0].company : ''
  }

  const getCustomerEmail = (customerId) => {
    const result = customers.filter((element) => element.id === customerId)
    return result && result.length > 0 ? result[0].email : ''
  }

  const getClassTitle = (teamClassId) => {
    const result = classes.filter((element) => element.id === teamClassId)
    return result && result.length > 0 ? result[0].title : ''
  }

  const getFormattedEventDate = (bookingId) => {
    const result = calendarEvents.filter((element) => element.bookingId === bookingId)

    if (result && result.length > 0) {
      const calendarEvent = result[0]
      const date = new Date(calendarEvent.year, calendarEvent.month - 1, calendarEvent.day)
      const time = toAmPm(calendarEvent.fromHour, calendarEvent.fromMinutes, '')
      return `${moment(date).format('LL')} ${time}`
    }

    return ''
  }

  const bookingCards = filteredBookings.map(
    ({ id, teamClassId, customerId, customerName, attendees, classMinimum, pricePerson, serviceFee, salesTax, status, createdAt }) => {
      return {
        customerName,
        id,
        attendees,
        teamClassId,
        createdAt,
        status,
        classTitle: getClassTitle(teamClassId),
        scheduled: getFormattedEventDate(id),
        email: getCustomerEmail(customerId),
        phone: getCustomerPhone(customerId),
        company: getCustomerCompany(customerId),
        serviceFee,
        pricePerson,
        minimum: classMinimum,
        salesTax,
        attendeesAdded: 18, // ????
        additionals: 2, // ?????
        calendarEvent: calendarEvents.filter((element) => element.bookingId === id)[0],
        teamClass: classes.filter((element) => element.id === teamClassId)[0]
      }
    }
  )

  const getBoard = () => {
    return {
      columns: [
        {
          id: 1,
          title: 'Quote',
          cards: bookingCards.filter((element) => element.status.indexOf('quote') > -1)
        },
        {
          id: 2,
          title: 'Scheduled',
          cards: bookingCards.filter((element) => element.status.indexOf('scheduled') > -1)
        },
        {
          id: 3,
          title: 'Coordinating',
          cards: bookingCards.filter((element) => element.status.indexOf('coordinating') > -1)
        },
        {
          id: 4,
          title: 'Headcount',
          cards: bookingCards.filter((element) => element.status.indexOf('headcount') > -1)
        },
        {
          id: 5,
          title: 'Invoice sent',
          cards: bookingCards.filter((element) => element.status.indexOf('invoiced') > -1)
        },
        {
          id: 6,
          title: 'Invoice paid',
          cards: bookingCards.filter((element) => element.status.indexOf('confirmed') > -1)
        }
      ]
    }
  }

  const handleSearch = (e) => {
    setLoading(true)
    const value = e.target.value
    let updatedData = []
    if (value.length) {
      updatedData = bookings.filter((item) => {
        const startsWith =
          (item.customerName && item.customerName.toLowerCase().startsWith(value.toLowerCase())) ||
          (item.customerId && getCustomerEmail(item.customerId).toLowerCase().startsWith(value.toLowerCase())) ||
          (item.teamClassId && getClassTitle(item.teamClassId).toLowerCase().startsWith(value.toLowerCase()))

        const includes =
          (item.customerName && item.customerName.toLowerCase().includes(value.toLowerCase())) ||
          (item.customerId && getCustomerEmail(item.customerId).toLowerCase().includes(value.toLowerCase())) ||
          (item.teamClassId && getClassTitle(item.teamClassId).toLowerCase().includes(value.toLowerCase()))

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return null
      })
      setFilteredBookings(updatedData)
    } else {
      setFilteredBookings(bookings)
    }
  }

  // ** Converts table to CSV
  function convertArrayOfObjectsToCSV(array) {
    let result
    const columnDelimiter = ','
    const lineDelimiter = '\n'
    const keys = Object.keys(data[0])
    result = ''
    result += keys.join(columnDelimiter)
    result += lineDelimiter

    array.forEach((item) => {
      let ctr = 0
      keys.forEach((key) => {
        if (ctr > 0) result += columnDelimiter
        result += item[key]
        ctr++
      })
      result += lineDelimiter
    })

    return result
  }

  // ** Downloads CSV
  function downloadCSV(array) {
    const link = document.createElement('a')
    let csv = convertArrayOfObjectsToCSV(array)
    if (csv === null) return

    const filename = 'export.csv'

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`
    }

    link.setAttribute('href', encodeURI(csv))
    link.setAttribute('download', filename)
    link.click()
  }

  const handleFilterType = ({ type, value }) => {
    switch (type) {
      case 'class':
        handleFilterByClass(value)
        break
      default:
        break
    }
  }

  return (
    <>
      <Row>
        <Card className="w-100 bg-transparent shadow-none mb-0">
          <CardHeader className="flex-md-row flex-column align-md-items-center align-items-start border-bottom">
            <CardTitle tag="h4" className="mt-1 ">
              All Time Bookings
            </CardTitle>
            <div className="d-flex mt-md-0">
              <UncontrolledButtonDropdown>
                <DropdownToggle color="secondary" caret outline>
                  <Share size={15} />
                  <span className="align-middle ml-50">Export</span>
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem className="w-100" onClick={() => downloadCSV(data)}>
                    <FileText size={15} />
                    <span className="align-middle ml-50">CSV</span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledButtonDropdown>

              <Button
                className="ml-2"
                color="primary"
                onClick={(e) => {
                  const newElement = {
                    name: '',
                    email: '',
                    phone: '',
                    company: '',
                    attendees: ''
                  }
                  setCurrentElement(newElement)
                  handleModal()
                }}
              >
                <Plus size={15} />
                <span className="align-middle ml-50">Add Booking</span>
              </Button>

              <Button className="ml-0 btn-outline" color="" outline onClick={() => setShowFiltersModal(true)}>
                <Filter size={15} />
                <span className="align-middle ml-50">Filters</span>
              </Button>
            </div>
          </CardHeader>
        </Card>
      </Row>
      <Row className="justify-content-end mx-0">
        <Col className="d-flex align-items-center justify-content-end mt-1" md="6" sm="12">
          <Label className="mr-1" for="search-input">
            Search
          </Label>
          <Input
            className="dataTable-filter mb-50"
            type="text"
            bsSize="sm"
            id="search-input"
            // value={searchValue}
            onChange={handleSearch}
          />
        </Col>
      </Row>
      <Row>
        {!loading && filteredBookings.length ? (
          <Board
            allowRemoveLane
            allowRenameColumn
            allowRemoveCard
            initialBoard={getBoard()}
            // allowAddCard={{ on: 'top' }}
            onNewCardConfirm={(draftCard) => ({
              id: new Date().getTime(),
              ...draftCard
            })}
            renderCard={(
              {
                customerName,
                id,
                attendees,
                teamClassId,
                createdAt,
                status,
                classTitle,
                scheduled,
                email,
                phone,
                company,
                serviceFee,
                pricePerson,
                minimum,
                salesTax,
                attendeesAdded,
                additionals,
                calendarEvent,
                teamClass
              },
              { removeCard, dragging }
            ) => {
              return (
                <Card className="card-board">
                  {cardFlipped && cardFlipped === id ? (
                    <BookingSummaryWithoutDate
                      serviceFee={serviceFee}
                      attendeesAdded={attendeesAdded}
                      attendees={attendees}
                      pricePerson={pricePerson}
                      minimum={minimum}
                      salesTax={salesTax}
                      additionals={additionals}
                      calendarEvent={calendarEvent}
                      teamClass={teamClass}
                      bookingId={id}
                      flipCard={() => setCardFlipped(null)}
                    />
                  ) : (
                    <>
                      <CardBody>
                        <Button color="link" className="flip-button text-muted" onClick={() => setCardFlipped(id)}>
                          <Repeat size={14} />
                        </Button>
                        <CardText>
                          <strong className="text-dark">
                            {customerName}
                            <br />
                            <small className="text-muted">
                              {moment(createdAt).calendar(null, {
                                lastDay: '[Yesterday]',
                                sameDay: 'LT',
                                lastWeek: 'dddd',
                                sameElse: 'MMMM Do, YYYY'
                              })}
                            </small>
                          </strong>
                          <br />
                          <p className="mb-0 mt-1 text-truncate">{classTitle}</p>
                          <br />
                          <strong>{attendees} Attendees</strong>
                        </CardText>
                        {scheduled && (
                          <Media className="">
                            <Avatar color="light-primary" className="rounded mr-1" icon={<Calendar size={18} />} />
                            <Media body>
                              <h6 className="mb-0">{scheduled}</h6>
                              <small>{status === 'confirmed' ? 'Confirmed' : ''}</small>
                            </Media>
                          </Media>
                        )}
                      </CardBody>
                      <CardFooter className="card-board-footer">
                        <Button
                          color="link"
                          className="m-0 p-0"
                          onClick={() => {
                            const newElement = {
                              name: customerName,
                              email,
                              phone,
                              company,
                              class: teamClassId,
                              attendees,
                              editMode: true
                            }
                            setCurrentElement(newElement)
                            handleModal()
                          }}
                        >
                          <Avatar color="light-primary" className="rounded mr-1" icon={<Edit2 size={18} />} />
                          {/* <Edit2 size={18} /> */}
                        </Button>
                        <CardLink href={`/booking/${id}`} target={'blank'}>
                          <Avatar color="light-secondary" className="rounded mr-1" icon={<ShoppingCart size={18} />} />
                        </CardLink>
                      </CardFooter>
                    </>
                  )}
                </Card>
              )
            }}
          />
        ) : (
          ''
        )}
      </Row>
      <FiltersModal
        open={showFiltersModal}
        handleModal={() => setShowFiltersModal(!showFiltersModal)}
        classes={classes}
        onFilterUpdate={(data) => handleFilterType(data)}
      />
      <AddNewBooking
        open={modal}
        handleModal={handleModal}
        data={data}
        setData={setData}
        classes={classes}
        setCustomers={setCustomers}
        customers={customers}
        currentElement={currentElement}
        // editMode={currentElement.editMode}
      />
    </>
  )
}

export default BoardBookings
