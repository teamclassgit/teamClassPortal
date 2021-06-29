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
  Col
} from 'reactstrap'
import { Share, FileText, Filter, Plus, List, Trello } from 'react-feather'
import { FiltersContext } from '../../../context/FiltersContext/FiltersContext'

function BookingsHeader({ setShowFiltersModal, setSwitchView, switchView, showAddModal, setCurrentElement, bookings, classes, customers }) {
  const [filteredData, setFilteredData] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const { classFilterContext, setClassFilterContext } = useContext(FiltersContext)

  useEffect(() => {
    // if (searchValue !== '') {
    setClassFilterContext({
      type: 'text',
      value: searchValue
    })
    // }
  }, [searchValue])

  useEffect(() => {
    setSearchValue('')
    setFilteredData(bookings)
  }, [bookings])

  const handleFilterByClass = (classId) => {
    const newBookings = bookings.filter(({ teamClassId }) => teamClassId === classId)
    setFilteredData(newBookings)
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

  useEffect(() => {
    if (classFilterContext) {
      handleFilterType(classFilterContext)
    }
  }, [classFilterContext])

  const getCustomerEmail = (customerId) => {
    const result = customers.filter((element) => element.id === customerId)
    return result && result.length > 0 ? result[0].email : ''
  }

  const getClassTitle = (teamClassId) => {
    const result = classes.filter((element) => element.id === teamClassId)
    return result && result.length > 0 ? result[0].title : ''
  }

  // ** Function to handle search
  const handleSearch = (value) => {
    let updatedData = []
    setSearchValue(value)
    if (value.length) {
      updatedData = filteredData.filter((item) => {
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
      setFilteredData(updatedData)
    }
  }

  // ** Converts table to CSV
  function convertArrayOfObjectsToCSV(array) {
    let result
    const columnDelimiter = ','
    const lineDelimiter = '\n'
    const keys = Object.keys(filteredData[0])
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

  return (
    <Card className="w-100  shadow-none bg-transparent m-0">
      <CardHeader>
        <Col md={4}>
          <CardTitle tag="h4" className="mr-4">
            All Time Bookings
          </CardTitle>
        </Col>
        <Col className="mb-1 d-flex" lg="6" md="12">
          <Input
            className="mr-2"
            type="text"
            id="search-input"
            placeholder="Search"
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <ButtonGroup>
            <UncontrolledButtonDropdown>
              <DropdownToggle color="primary" caret outline>
                <Share size={13} />
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem className="w-100" onClick={() => downloadCSV(filteredData)}>
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
            >
              <Plus size={13} />
            </Button>
            <Button outline color="primary" onClick={() => setShowFiltersModal(true)}>
              <Filter size={13} />
            </Button>
            <Button.Ripple outline color="primary" onClick={() => setSwitchView()}>
              {!switchView ? <List size={13} /> : <Trello size={13} />}
            </Button.Ripple>
          </ButtonGroup>
        </Col>
      </CardHeader>
    </Card>
  )
}

export default BookingsHeader
