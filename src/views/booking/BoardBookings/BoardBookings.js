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
  Input
} from 'reactstrap'
import { FileText, Plus, Share, Filter } from 'react-feather'
import FiltersModal from './FiltersModal'

import Board from '@lourenci/react-kanban'
import '@lourenci/react-kanban/dist/styles.css'
import { toAmPm } from '../../../utility/Utils'
import moment from 'moment'
import './BoardBookings.scss'

const BoardBookings = ({ bookings, customers, setCustomers, classes, calendarEvents }) => {
  const [filteredBookings, setFilteredBookings] = useState(bookings)
  const [data, setData] = useState(bookings)
  const [currentElement, setCurrentElement] = React.useState(null)
  const [modal, setModal] = useState(false)
  const [showFiltersModal, setShowFiltersModal] = useState(false)

  React.useEffect(() => {
    setData(filteredBookings)
  }, [filteredBookings])

  const handleFilterByClass = (classId) => {
    setFilteredBookings(filteredBookings.filter(({ teamClassId }) => teamClassId === classId))
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

  const bookingCards = filteredBookings.map(({ customerName, id, attendees, teamClassId, createdAt, status, customerId }) => {
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
      company: getCustomerCompany(customerId)
    }
  })

  const board = {
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

  const getClassesFilter = () => {
    return (
      <DropdownMenu className="class-filter-options-container">
        {classes.map(({ title }) => (
          <DropdownItem>
            <span>{title}</span>
          </DropdownItem>
        ))}
      </DropdownMenu>
    )
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
              {/* <UncontrolledButtonDropdown className="mr-2 position-relative">
                <DropdownToggle color="primary" caret outline>
                  <Search size={15} />
                  <span className="align-middle ml-50">Filter by class</span>
                </DropdownToggle>
                {getClassesFilter()}
              </UncontrolledButtonDropdown> */}

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
            // onChange={handleFilter}
          />
        </Col>
      </Row>
      <Row>
        <Board
          allowRemoveLane
          allowRenameColumn
          allowRemoveCard
          onLaneRemove={console.log}
          onCardRemove={console.log}
          onLaneRename={console.log}
          initialBoard={board}
          // allowAddCard={{ on: 'top' }}
          onNewCardConfirm={(draftCard) => ({
            id: new Date().getTime(),
            ...draftCard
          })}
          onCardNew={console.log}
          renderCard={(
            { customerName, createdAt, attendees, classTitle, scheduled, id, email, teamClassId, phone, company },
            { removeCard, dragging }
          ) => {
            return (
              <Card className="card-board">
                <CardBody>
                  <CardText>
                    <strong className="text-dark">
                      {customerName} -{' '}
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
                    <p className="mb-0 mt-1">{classTitle}</p>
                    <br />
                    <strong>{attendees} Attendees</strong>
                    <br />
                    {scheduled && (
                      <span className="text-dark mt-3">
                        Scheduled: <small className="text-dark">{scheduled}</small>
                      </span>
                    )}
                  </CardText>
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
                        attendees
                      }
                      setCurrentElement(newElement)
                      handleModal()
                    }}
                  >
                    Edit
                  </Button>
                  <CardLink href={`/booking/${id}`} target={'blank'}>
                    Checkout
                  </CardLink>
                </CardFooter>
              </Card>
            )
          }}
        />
      </Row>
      <FiltersModal
        open={showFiltersModal}
        handleModal={() => setShowFiltersModal(!showFiltersModal)}
        classes={classes}
        onFilterUpdate={(x) => console.log(x)}
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
      />
    </>
  )
}

export default BoardBookings
