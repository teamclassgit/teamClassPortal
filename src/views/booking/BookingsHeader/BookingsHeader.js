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
import { Share, FileText, Filter, Plus, List, Trello, Search } from 'react-feather'
import { FiltersContext } from '../../../context/FiltersContext/FiltersContext'

function BookingsHeader({ setShowFiltersModal, setSwitchView, switchView, showAddModal, setCurrentElement, bookings, defaultLimit, onChangeLimit }) {
  const [searchValue, setSearchValue] = useState('')
  const [limit, setLimit] = useState(defaultLimit)
  const { textFilterContext, setTextFilterContext, classFilterContext, coordinatorFilterContext } = useContext(FiltersContext)

  // ** Converts table to CSV
  function convertArrayOfObjectsToCSV(array) {
    let result
    const columnDelimiter = ','
    const lineDelimiter = '\n'
    const keys = Object.keys(array[0])
    result = ''
    result += keys.join(columnDelimiter)
    result += lineDelimiter

    array.forEach((item) => {
      let ctr = 0
      keys.forEach((key) => {
        if (ctr > 0) result += columnDelimiter
        result += item[key] || ''
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

  return (
    <Card className="w-100  shadow-none bg-transparent m-0">
      <CardHeader>
        <Col md={4}>
          <CardTitle tag="h4" className="mr-4">
            Bookings{' '}
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
            <UncontrolledButtonDropdown>
              <DropdownToggle color="primary" caret outline title="Export">
                <Share size={13} />
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem className="w-100" onClick={() => downloadCSV(bookings)}>
                  <FileText size={13} />
                  <span className="align-middle ml-50">CSV</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledButtonDropdown>
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
                setCurrentElement(newElement)
                showAddModal()
              }}
              title="Add Booking"
            >
              <Plus size={13} />
            </Button>
            <Button
              outline={!(classFilterContext || coordinatorFilterContext)}
              color="primary"
              onClick={() => setShowFiltersModal(true)}
              title="Filters"
            >
              <Filter size={13} />
            </Button>
            <Button.Ripple outline color="primary" onClick={() => setSwitchView()} title="Switch view">
              {!switchView ? <List size={13} /> : <Trello size={13} />}
            </Button.Ripple>
          </ButtonGroup>
        </Col>
      </CardHeader>
    </Card>
  )
}

export default BookingsHeader
