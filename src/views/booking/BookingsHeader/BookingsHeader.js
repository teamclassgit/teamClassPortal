import React from 'react'
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

function BookingsHeader({ setShowFiltersModal, setSwitchView, switchView, handleModal }) {
  return (
    <Card className="w-100  shadow-none bg-transparent mb-0">
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
            // value={searchValue}
            // onChange={handleSearch}
          />
          <ButtonGroup>
            <UncontrolledButtonDropdown>
              <DropdownToggle color="primary" caret outline>
                <Share size={13} />
                {/* <span className="align-middle ml-50">Export</span> */}
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem
                  className="w-100"
                  //   onClick={() => downloadCSV(data)}
                >
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
                //   setCurrentElement(newElement)
                handleModal()
              }}
            >
              <Plus size={13} />
              {/* <span className="align-middle ml-50">Add Booking</span> */}
            </Button>
            <Button
              outline
              //   className="ml-0 btn-outline"
              color="primary"
              //   outline
              onClick={() => setShowFiltersModal(true)}
            >
              <Filter size={13} />
              {/* <span className="align-middle ml-50">Filters</span> */}
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
