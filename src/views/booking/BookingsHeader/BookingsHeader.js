import React, { useState, useContext, useEffect } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  ButtonGroup,
  Input,
  Col,
  InputGroup,
  InputGroupAddon
} from 'reactstrap'
import { Share, Filter, FileText, Plus, List, Trello, Search } from 'react-feather'
import { FiltersContext } from '../../../context/FiltersContext/FiltersContext'
import ExportToExcel from '../../../components/ExportToExcel'
import { getCustomerPhone, getCustomerCompany, getCustomerEmail, getClassTitle, getCoordinatorName, getFormattedEventDate } from '../common'

function BookingsHeader({
  setShowFiltersModal,
  setSwitchView,
  switchView,
  showAddModal,
  setElementToAdd,
  bookings,
  defaultLimit,
  onChangeLimit,
  customers,
  coordinators,
  classes,
  calendarEvents,
  showLimit,
  showExport,
  showAdd,
  showFilter,
  showView,
  titleView
}) {
  const [searchValue, setSearchValue] = useState('')
  const [limit, setLimit] = useState(defaultLimit)
  const { textFilterContext, setTextFilterContext, classFilterContext, coordinatorFilterContext } = useContext(FiltersContext)
  const [attendeesExcelTable, setAttendeesExcelTable] = useState([])

  useEffect(() => {
    if (bookings) {
      const bookingsArray = []

      const headers = [
        'Updated',
        'BookingId',
        'Status',
        'Name',
        'Email',
        'Phone',
        'Company',
        'Coordinator Name',
        'ClassId',
        'Class Title',
        'Class Variants',
        'Price',
        'Group Size',
        'Sign Up Deadline',
        'Close Booking Reason',
        'Event Date'
      ]

      bookingsArray.push(headers)

      for (const i in bookings) {
        const bookingInfo = bookings[i]
        const row = [
          bookingInfo.updatedAt,
          bookingInfo._id,
          bookingInfo.status,
          bookingInfo.customerName,
          getCustomerEmail(bookingInfo.customerId, customers),
          getCustomerPhone(bookingInfo.customerId, customers),
          getCustomerCompany(bookingInfo.customerId, customers),
          getCoordinatorName(bookingInfo.eventCoordinatorId, coordinators),
          bookingInfo.teamClassId,
          getClassTitle(bookingInfo.teamClassId, classes),
          bookingInfo.classVariant && bookingInfo.classVariant.title,
          bookingInfo.classVariant && bookingInfo.classVariant.pricePerson + (bookingInfo.classVariant.groupEvent ? ' /Group' : ' /Person'),
          bookingInfo.attendees,
          bookingInfo.signUpDeadline,
          bookingInfo.closedReason,
          getFormattedEventDate(bookingInfo._id, calendarEvents)
        ]
        bookingsArray.push(row)
        console.log(row)
      }

      setAttendeesExcelTable(bookingsArray)
    }
  }, [bookings])

  return (
    <Card className="w-100  shadow-none bg-transparent m-0">
      <CardHeader>
        <Col md={4}>
          <CardTitle tag="h4" className="mr-4">
            {titleView}
            <small>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setShowFiltersModal(true)
                }}
              >
                {coordinatorFilterContext ? coordinatorFilterContext.label.join(', ') : 'All Coordinators'}
              </a>
            </small>
          </CardTitle>
        </Col>
        <Col className="mb-1 d-flex" lg="6" md="12">
          <InputGroup className="mr-2">
            <Input type="text" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
            <InputGroupAddon addonType="append">
              <Button
                color="primary"
                onClick={() => {
                  setTextFilterContext({ type: 'text', value: searchValue })
                }}
              >
                <Search size={12} />
              </Button>
            </InputGroupAddon>
          </InputGroup>

          <ButtonGroup>
            {showLimit && (
              <UncontrolledButtonDropdown>
                <DropdownToggle color="primary" caret outline title="Number of results">
                  {limit >= 20000 ? 'ALL' : limit}
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem
                    className="w-100"
                    onClick={(e) => {
                      setLimit(200)
                      onChangeLimit(200)
                    }}
                  >
                    <span className="align-right">200</span>
                  </DropdownItem>
                  <DropdownItem
                    className="w-100"
                    onClick={(e) => {
                      setLimit(400)
                      onChangeLimit(400)
                    }}
                  >
                    <span className="align-right">400</span>
                  </DropdownItem>
                  <DropdownItem
                    className="w-100"
                    onClick={(e) => {
                      setLimit(600)
                      onChangeLimit(600)
                    }}
                  >
                    <span className="align-right">600</span>
                  </DropdownItem>
                  <DropdownItem
                    className="w-100"
                    onClick={(e) => {
                      setLimit(1000)
                      onChangeLimit(1000)
                    }}
                  >
                    <span className="align-right">1000</span>
                  </DropdownItem>
                  <DropdownItem
                    className="w-100"
                    onClick={(e) => {
                      setLimit(2000)
                      onChangeLimit(2000)
                    }}
                  >
                    <span className="align-right">2000</span>
                  </DropdownItem>
                  <DropdownItem
                    className="w-100"
                    onClick={(e) => {
                      setLimit(20000)
                      onChangeLimit(20000)
                    }}
                  >
                    <span className="align-right">ALL</span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledButtonDropdown>
            )}

            {showExport && (
              <UncontrolledButtonDropdown>
                <DropdownToggle color="primary" caret outline title="Export">
                  <Share size={13} />
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem className="align-middle w-100">
                    <ExportToExcel
                      apiData={attendeesExcelTable}
                      fileName={'Bookings'}
                      title={
                        <h6>
                          <FileText size={13} />
                          {' Excel File'}
                        </h6>
                      }
                      smallText={<h6 className="small m-0 p-0">Download file with Bookings</h6>}
                    />
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledButtonDropdown>
            )}

            {showAdd && (
              <Button
                outline
                color="primary"
                onClick={(e) => {
                  const newElement = {
                    name: '',
                    email: '',
                    phone: '',
                    company: '',
                    attendees: ''
                  }
                  setElementToAdd(newElement)
                  showAddModal()
                }}
                title="Add Booking"
              >
                <Plus size={13} />
              </Button>
            )}
            {showFilter && (
              <Button
                outline={!(classFilterContext || coordinatorFilterContext)}
                color="primary"
                onClick={() => setShowFiltersModal(true)}
                title="Filters"
              >
                <Filter size={13} />
              </Button>
            )}
            {showView && (
              <Button.Ripple outline color="primary" onClick={() => setSwitchView()} title="Switch view">
                {!switchView ? <List size={13} /> : <Trello size={13} />}
              </Button.Ripple>
            )}
          </ButtonGroup>
        </Col>
      </CardHeader>
    </Card>
  )
}

export default BookingsHeader
