// ** React Imports
import React, {Fragment, useState, forwardRef} from 'react'
// ** Add New Modal Component
import AddNewModal from './AddNewModal'
// ** Custom Components
import Avatar from '@components/avatar'
// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import {
    ChevronDown,
    Share,
    Grid,
    Plus,
    Download,
    Trash,
    Edit,
    AlertTriangle
} from 'react-feather'
import {
    Card,
    CardHeader,
    CardTitle,
    Button,
    UncontrolledButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Input,
    Label,
    Row,
    Col, Badge
} from 'reactstrap'
import UploadData from "./UploadData"

// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef(({onClick, ...rest}, ref) => (
    <div className='custom-control custom-checkbox'>
        <input type='checkbox' className='custom-control-input' ref={ref} {...rest} />
        <label className='custom-control-label' onClick={onClick}/>
    </div>
))

const DataTableAttendees = ({
                                hasKit,
                                currentBookingId,
                                attendees,
                                saveAttendee,
                                deleteAttendee,
                                updateAttendeesCount
                            }) => {

    // ** States
    const [currentElement, setCurrentElement] = useState(null)
    const [data, setData] = useState(attendees)
    const [modal, setModal] = useState(false)
    const [modalUpload, setModalUpload] = useState(false)
    const [currentPage, setCurrentPage] = useState(0)
    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])

    // ** Function to handle Modal toggle
    const handleModal = () => setModal(!modal)

    // ** Function to handle Modal toggle
    const handleModalUpload = () => setModalUpload(!modalUpload)

    // ** Vars
    const states = ['success', 'danger', 'warning', 'info', 'dark', 'primary', 'secondary']

    const status = {
        1: {title: 'Waiting', color: 'light-warning'},
        2: {title: 'Completed', color: 'light-success'}
    }

    const getStatus = (row) => {
        return row.addressLine1 && row.city && row.state && row.zip && row.country ? 2 : 1
    }

    // ** Table Common Column
    const columns = [
        {
            name: 'Name',
            selector: 'name',
            sortable: true,
            maxWidth: '250px',
            cell: row => (
                <div className='d-flex align-items-center'>
                    <Avatar color={`${status[getStatus(row)].color}`} content={row.name} initials/>
                    <div className='user-info text-truncate ml-1'>
                        <span className='d-block font-weight-bold text-truncate'>{row.name}</span>
                    </div>
                </div>
            )
        },
        {
            name: 'Email',
            selector: 'email',
            sortable: true,
            maxWidth: '250px'
        },
        {
            name: 'Shipping Address',
            selector: 'addressLine1',
            sortable: true,
            maxWidth: '300px',
            cell: row => {
                return (getStatus(row) === 2 &&
                    <div className='user-info text-truncate ml-1'>
                        <span className='d-block font-weight-bold text-truncate'>{`${row.addressLine1} ...`}</span>
                    </div>
                )
            }
        },
        {
            name: 'Status',
            selector: 'status',
            sortable: true,
            maxWidth: '50px',
            cell: row => {
                return (
                    <Badge color={status[getStatus(row)].color} pill>
                        {status[getStatus(row)].title}
                    </Badge>
                )
            }
        },
        {
            name: 'Actions',
            allowOverflow: true,
            maxWidth: '50px',
            cell: row => {
                return (
                    <div className='d-flex'>
                        <a onClick={e => {

                            deleteAttendee(row.id).then((result) => {
                                const newData = data.filter(element => element.id !== row.id)
                                setData(newData)
                                updateAttendeesCount(newData.length)
                            })

                        }} href="#" title="Remove from list">
                            <Trash size={15}/>
                        </a>
                        <a onClick={e => {
                            setCurrentElement(row)
                            handleModal()
                        }} href="#">
                            <Edit size={15} title="Edit"/>
                        </a>
                    </div>
                )
            }
        }
    ]

    // ** Function to handle filter
    const handleFilter = e => {
        const value = e.target.value
        let updatedData = []
        setSearchValue(value)

        if (value.length) {
            updatedData = data.filter(item => {
                const startsWith =
                    (item.name && item.name.toLowerCase().startsWith(value.toLowerCase())) ||
                    (item.phone && item.phone.toLowerCase().startsWith(value.toLowerCase())) ||
                    (item.email && item.email.toLowerCase().startsWith(value.toLowerCase())) ||
                    (item.dietaryRestrictions && item.dietaryRestrictions.toLowerCase().startsWith(value.toLowerCase())) ||
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
                    (item.dietaryRestrictions && item.dietaryRestrictions.toLowerCase().includes(value.toLowerCase())) ||
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
    const handlePagination = page => {
        setCurrentPage(page.selected)
    }

    // ** Custom Pagination
    const CustomPagination = () => (
        <ReactPaginate
            previousLabel=''
            nextLabel=''
            forcePage={currentPage}
            onPageChange={page => handlePagination(page)}
            pageCount={searchValue.length ? filteredData.length / 7 : data.length / 7 || 1}
            breakLabel='...'
            pageRangeDisplayed={2}
            marginPagesDisplayed={2}
            activeClassName='active'
            pageClassName='page-item'
            breakClassName='page-item'
            breakLinkClassName='page-link'
            nextLinkClassName='page-link'
            nextClassName='page-item next'
            previousClassName='page-item prev'
            previousLinkClassName='page-link'
            pageLinkClassName='page-link'
            breakClassName='page-item'
            breakLinkClassName='page-link'
            containerClassName='pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1'
        />
    )

    // ** Converts table to CSV
    function convertArrayOfObjectsToCSV(array) {
        let result

        const columnDelimiter = ','
        const lineDelimiter = '\n'
        const keys = Object.keys(data[0])

        result = ''
        result += keys.join(columnDelimiter)
        result += lineDelimiter

        array.forEach(item => {
            let ctr = 0
            keys.forEach(key => {
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

    // ** Downloads CSV
    function downloadTemplate() {
        const link = document.createElement('a')
        const filename = 'TeamClassAttendeesTemplate.xlsx'
        link.setAttribute('href', encodeURI(`/templates/${filename}`))
        link.setAttribute('download', filename)
        link.click()
    }

    return (
        <Fragment>
            <Card>
                <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
                    <CardTitle tag='h4'>Your list of attendees<br></br>{hasKit && (
                        <small><AlertTriangle size={15}/> This event includes delivery. We'll email your attendees to
                            collect
                            shipping information.</small>)}</CardTitle>

                    <div className='d-flex mt-md-0 mt-1'>
                        <UncontrolledButtonDropdown>
                            <DropdownToggle color='secondary' caret outline>
                                <Share size={15}/>
                                <span className='align-middle ml-50'>Bulk actions</span>
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem className='w-100'>
                                    <Download size={15}/>
                                    <span className='align-middle ml-50'
                                          onClick={downloadTemplate}>Download template<br></br><small>Use this template to build your list</small></span>
                                </DropdownItem>
                                <DropdownItem className='w-100'>
                                    <Grid size={15}/>
                                    <span onClick={handleModalUpload}
                                          className='align-middle ml-50'>Upload data<br></br><small>Excel file with your attendees</small></span>
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledButtonDropdown>
                        <Button className='ml-2' color='primary' onClick={e => {

                            const newElementTemplate = {
                                city: "",
                                phone: "",
                                bookingId: currentBookingId,
                                zip: "",
                                addressLine1: "",
                                addressLine2: "",
                                email: "",
                                country: "",
                                name: "",
                                state: "",
                                dietaryRestrictions: ""
                            }

                            setCurrentElement(newElementTemplate)
                            handleModal()
                        }}>
                            <Plus size={15}/>
                            <span className='align-middle ml-50'>Add Attendee</span>
                        </Button>
                    </div>
                </CardHeader>
                <Row className='justify-content-end mx-0'>
                    <Col className='d-flex align-items-center justify-content-end mt-1' md='6' sm='12'>
                        <Label className='mr-1' for='search-input'>
                            Search
                        </Label>
                        <Input
                            className='dataTable-filter mb-50'
                            type='text'
                            bsSize='sm'
                            id='search-input'
                            value={searchValue}
                            onChange={handleFilter}
                        />
                    </Col>
                </Row>
                <DataTable
                    noHeader
                    pagination
                    columns={columns}
                    paginationPerPage={7}
                    className='react-dataTable'
                    sortIcon={<ChevronDown size={10}/>}
                    paginationDefaultPage={currentPage + 1}
                    paginationComponent={CustomPagination}
                    data={searchValue.length ? filteredData : data}
                    selectableRowsComponent={BootstrapCheckbox}
                />
            </Card>
            <AddNewModal open={modal} handleModal={handleModal} currentBookingId={currentBookingId}
                         currentElement={currentElement} saveAttendee={saveAttendee} data={data} setData={setData} updateAttendeesCount={updateAttendeesCount}/>
            <UploadData open={modalUpload} handleModal={handleModalUpload} currentBookingId={currentBookingId}
                        saveAttendee={saveAttendee} data={data} setData={setData} updateAttendeesCount={updateAttendeesCount}/>
        </Fragment>
    )
}

export default DataTableAttendees
