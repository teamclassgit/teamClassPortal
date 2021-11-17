// ** React Imports
import React, { forwardRef, Fragment, useState } from 'react'
// ** Add New Modal Component
import AddNewAttendee from './AddNewAttendee'
import UploadData from './UploadData'
// ** Custom Components
import Avatar from '@components/avatar'
// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'

import { ChevronDown, Download, Edit, FileText, Grid, Plus, Share, Trash, X } from 'react-feather'

import {
  Badge,
  Button,
  Card,
  CardHeader,
  CardTitle,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalFooter,
  Row,
  UncontrolledButtonDropdown
} from 'reactstrap'
import ExportToExcel from '../../../components/ExportToExcel'

// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef(({ onClick, ...rest }, ref) => (
  <div className="custom-control custom-checkbox">
    <input type="checkbox" className="custom-control-input" ref={ref} {...rest} />
    <label className="custom-control-label" onClick={onClick} />
  </div>
))

const DataTableAttendees = ({ hasKit, currentBookingId, attendees, saveAttendee, deleteAttendee, updateAttendeesCount, teamClassInfo }) => {
  // ** States
  const [currentElement, setCurrentElement] = useState(null)
  const [data, setData] = useState(attendees)
  const [modal, setModal] = useState(false)
  const [modalUpload, setModalUpload] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [mode, setMode] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const [elementToDelete, setElementToDelete] = useState(null)
  const [attendeesExcelTable, setAttendeesExcelTable] = useState([])
  const [excelHeadersTemplate, setExcelHeadersTemplate] = useState([])

  // ** Function to handle Modal toggle
  const handleModal = () => setModal(!modal)

  // ** Function to handle Modal toggle
  const handleModalUpload = () => setModalUpload(!modalUpload)

  React.useEffect(() => {
    setData(attendees)
  }, [attendees])

  // ** Vars
  const states = ['success', 'danger', 'warning', 'info', 'dark', 'primary', 'secondary']

  const status = {
    1: { title: 'Waiting', color: 'light-warning' },
    2: { title: 'Completed', color: 'light-success' }
  }

  const getStatus = (row) => {
    return row.addressLine1 && row.city && row.state && row.zip && row.country ? 2 : 1
  }

  // ** Custom close btn
  const CloseBtn = <X className="cursor-pointer" size={15} onClick={() => setDeleteModal(!deleteModal)} />

  // ** Table Common Column
  const columns = [
    {
      name: 'Name',
      selector: 'name',
      sortable: true,
      maxWidth: '260px',
      cell: (row) => (
        <div className="d-flex align-items-center">
          <Avatar color={`${status[getStatus(row)].color}`} content={row.name} initials />
          <div className="user-info text-truncate ml-1">
            <span className="d-block font-weight-bold text-truncate">{row.name}</span>
          </div>
        </div>
      )
    },
    {
      name: 'Phone',
      selector: 'phone',
      sortable: true,
      maxWidth: '150px'
    },
    {
      name: 'Email',
      selector: 'email',
      sortable: true,
      maxWidth: '220px'
    },
    {
      name: 'Address',
      selector: 'addressLine1',
      sortable: true,
      maxWidth: '250px'
    },

    {
      name: 'Actions',
      allowOverflow: true,
      maxWidth: '40px',
      cell: (row) => {
        return (
          <div className="d-flex ">
            <a
              className="mr-2"
              onClick={(e) => {
                e.preventDefault()
                setElementToDelete(row)
                setDeleteModal(!deleteModal)
              }}
              href="#"
              title="Remove from list"
            >
              <Trash size={18} />
            </a>
            <a
              onClick={(e) => {
                setCurrentElement(row)
                handleModal()
                setMode('edit')
              }}
              href="#"
              title="Edit attendee"
            >
              <Edit size={18} title="Edit" />
            </a>
          </div>
        )
      }
    }
  ]

  React.useEffect(() => {
    if (attendees && teamClassInfo) {
      const attendeesArray = []

      const headers = ['Name', 'Email', 'Phone', 'AddressLine1', 'AddressLine2', 'City', 'State', 'Zip', 'Country']

      for (const dynamicField in teamClassInfo.registrationFields) {
        headers.push(teamClassInfo.registrationFields[dynamicField].label)
      }
      setExcelHeadersTemplate([headers])

      attendeesArray.push(headers)

      for (const i in attendees) {
        const attendeeInfo = attendees[i]
        const row = [
          attendeeInfo.name,
          attendeeInfo.email,
          attendeeInfo.phone,
          attendeeInfo.addressLine1,
          attendeeInfo.addressLine2,
          attendeeInfo.city,
          attendeeInfo.state,
          attendeeInfo.zip,
          attendeeInfo.country
        ]

        for (const dynamicField in attendeeInfo.additionalFields) {
          row.push(attendeeInfo.additionalFields[dynamicField].value)
        }

        attendeesArray.push(row)
      }

      setAttendeesExcelTable(attendeesArray)
    }
  }, [attendees, teamClassInfo])

  // ** Function to handle filter
  const handleFilter = (e) => {
    const value = e.target.value
    let updatedData = []
    setSearchValue(value)

    if (value.length) {
      updatedData = data.filter((item) => {
        const startsWith =
          (item.name && item.name.toLowerCase().startsWith(value.toLowerCase())) ||
          (item.phone && item.phone.toLowerCase().startsWith(value.toLowerCase())) ||
          (item.email && item.email.toLowerCase().startsWith(value.toLowerCase())) ||
          (item.address1 && item.address1.toLowerCase().startsWith(value.toLowerCase())) ||
          (item.address2 && item.address2.toLowerCase().startsWith(value.toLowerCase())) ||
          (item.city && item.city.toLowerCase().startsWith(value.toLowerCase())) ||
          (item.state && item.state.toLowerCase().startsWith(value.toLowerCase())) ||
          (item.zip && item.zip.toLowerCase().startsWith(value.toLowerCase())) ||
          (item.country && item.country.toLowerCase().startsWith(value.toLowerCase()))

        const includes =
          (item.name && item.name.toLowerCase().includes(value.toLowerCase())) ||
          (item.phone && item.phone.toLowerCase().includes(value.toLowerCase())) ||
          (item.email && item.email.toLowerCase().includes(value.toLowerCase())) ||
          (item.address1 && item.address1.toLowerCase().includes(value.toLowerCase())) ||
          (item.address2 && item.address2.toLowerCase().includes(value.toLowerCase())) ||
          (item.city && item.city.toLowerCase().includes(value.toLowerCase())) ||
          (item.state && item.state.toLowerCase().includes(value.toLowerCase())) ||
          (item.zip && item.zip.toLowerCase().includes(value.toLowerCase())) ||
          (item.country && item.country.toLowerCase().includes(value.toLowerCase()))

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return null
      })
      setFilteredData(updatedData)
      setSearchValue(value)
    }
  }

  // ** Function to handle Pagination
  const handlePagination = (page) => {
    setCurrentPage(page.selected)
  }

  // ** Custom Pagination
  const CustomPagination = () => (
    <ReactPaginate
      previousLabel=""
      nextLabel=""
      forcePage={currentPage}
      onPageChange={(page) => handlePagination(page)}
      pageCount={searchValue.length ? filteredData.length / 7 : data.length / 7 || 1}
      breakLabel="..."
      pageRangeDisplayed={2}
      marginPagesDisplayed={2}
      activeClassName="active"
      pageClassName="page-item"
      breakClassName="page-item"
      breakLinkClassName="page-link"
      nextLinkClassName="page-link"
      nextClassName="page-item next"
      previousClassName="page-item prev"
      previousLinkClassName="page-link"
      pageLinkClassName="page-link"
      breakClassName="page-item"
      breakLinkClassName="page-link"
      containerClassName="pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1"
    />
  )

  return (
    <Fragment>
      <Card>
        <CardHeader tag="h4" className="border-bottom ">
          <div className="d-flex flex-column bd-highlight">
            <p className="bd-highlight mb-0">Your list of attendees</p>
            <p className="bd-highlight">
              {hasKit && (
                <small>
                  {` Attendees registered: `}
                  <Badge color="primary"> {`${data.length}`}</Badge>
                </small>
              )}
            </p>
          </div>
          <CardTitle className="d-flex justify-content-end">
            <div className="d-flex justify-content-end">
              <div>
                <UncontrolledButtonDropdown>
                  <DropdownToggle color="secondary" caret outline>
                    <Share size={15} />
                    <span className="align-middle ml-50">Bulk actions</span>
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem className="align-middle w-100">
                      <ExportToExcel
                        apiData={excelHeadersTemplate}
                        fileName={'Template'}
                        title={
                          <h6>
                            <FileText size={13} />
                            {'  Download template'}
                          </h6>
                        }
                        smallText={<h6 className="small m-0 p-0">Use this template to build your list</h6>}
                      />
                    </DropdownItem>
                    <DropdownItem className="w-100" onClick={handleModalUpload}>
                      <Grid size={15} />
                      <span className="align-middle ml-50">
                        Upload data<br></br>
                        <small>Excel file with your attendees</small>
                      </span>
                    </DropdownItem>
                    <DropdownItem className="align-middle w-100">
                      <ExportToExcel
                        apiData={attendeesExcelTable}
                        fileName={'SignUpStatus'}
                        title={
                          <h6>
                            <FileText size={13} />
                            {'   Excel File'}
                          </h6>
                        }
                        smallText={<h6 className="small m-0 p-0">Download excel file with attendees</h6>}
                      />
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledButtonDropdown>
              </div>
              <div className>
                <Button
                  className="ml-2"
                  color="primary"
                  onClick={(e) => {
                    setMode('new')
                    const newElementTemplate = {
                      city: '',
                      phone: '',
                      bookingId: currentBookingId,
                      zip: '',
                      addressLine1: '',
                      addressLine2: '',
                      email: '',
                      country: '',
                      name: '',
                      state: '',
                      dinamycValues: []
                    }
                    setCurrentElement(newElementTemplate)
                    handleModal()
                  }}
                >
                  <Plus size={15} />
                  <span className="align-middle ml-50">Add Attendee</span>
                </Button>
              </div>
            </div>
          </CardTitle>
        </CardHeader>

        <Row className="justify-content-end mx-0">
          <Col className="d-flex align-items-center justify-content-end mt-1 mb-1" md="6" sm="12">
            <Label className="mr-1" for="search-input">
              Search
            </Label>
            <Input className="dataTable-filter mb-50" type="text" bsSize="sm" id="search-input" value={searchValue} onChange={handleFilter} />
          </Col>
        </Row>
        <DataTable
          noHeader
          pagination
          columns={columns}
          paginationPerPage={7}
          className="react-dataTable"
          sortIcon={<ChevronDown size={10} />}
          paginationDefaultPage={currentPage + 1}
          paginationComponent={CustomPagination}
          data={searchValue.length ? filteredData : data}
          selectableRowsComponent={BootstrapCheckbox}
        />
      </Card>
      <AddNewAttendee
        open={modal}
        handleModal={handleModal}
        currentBookingId={currentBookingId}
        currentElement={currentElement}
        saveAttendee={saveAttendee}
        data={data}
        setData={setData}
        updateAttendeesCount={updateAttendeesCount}
        mode={mode}
        teamClassInfo={teamClassInfo}
        hasKit={hasKit}
      />
      <UploadData
        open={modalUpload}
        handleModal={handleModalUpload}
        currentBookingId={currentBookingId}
        saveAttendee={saveAttendee}
        data={data}
        setData={setData}
        updateAttendeesCount={updateAttendeesCount}
        teamClassInfo={teamClassInfo}
      />
      <Modal isOpen={deleteModal} toggle={() => setDeleteModal(!deleteModal)} backdrop={false} className="modal-dialog-centered border-0">
        <ModalHeader toggle={() => setDeleteModal(!deleteModal)} close={CloseBtn}>
          Are you sure to delete {elementToDelete && elementToDelete.name}'s registration?
        </ModalHeader>
        <ModalFooter className="justify-content-center">
          <Button
            color="secondary"
            onClick={(e) => {
              e.preventDefault()
              setElementToDelete(null)
              setDeleteModal(!deleteModal)
            }}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={async (e) => {
              e.preventDefault()
              if (!elementToDelete) return
              const result = await deleteAttendee(elementToDelete._id)
              if (result) {
                const newData = data.filter((element) => element._id !== elementToDelete._id)
                setData(newData)
                updateAttendeesCount(newData.length)
                setDeleteModal(!deleteModal)
              }
            }}
          >
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    </Fragment>
  )
}

export default DataTableAttendees
