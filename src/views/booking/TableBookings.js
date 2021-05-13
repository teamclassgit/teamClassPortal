// ** React Imports
import React, {Fragment, useState, forwardRef} from 'react'
// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import Avatar from '@components/avatar'
import moment from 'moment'
import {toAmPm} from '../../utility/Utils'

import {
    ChevronDown,
    Share,
    Printer,
    FileText,
    File,
    Grid,
    Copy,
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

// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef(({onClick, ...rest}, ref) => (
    <div className='custom-control custom-checkbox'>
        <input type='checkbox' className='custom-control-input' ref={ref} {...rest} />
        <label className='custom-control-label' onClick={onClick}/>
    </div>
))

const DataTableBookings = ({data, customers, classes, calendarEvents}) => {

    // ** States
    const [currentPage, setCurrentPage] = useState(0)
    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])

    // ** Vars
    const states = ['success', 'danger', 'warning', 'info', 'dark', 'primary', 'secondary']

    const status = {
        quote: {title: 'quote', color: 'light-danger'},
        'quote-a': {title: 'quote', color: 'light-danger'},
        'quote-b': {title: 'quote', color: 'light-danger'},
        scheduled: {title: 'scheduled', color: 'light-warning'},
        confirmed: {title: 'confirmed', color: 'light-success'},
        draft: {title: 'quote', color: 'light-danger'},
        canceled: {title: 'canceled', color: 'light-danger'}
    }

    const getCustomerEmail = (customerId) => {

        const result = customers.filter(element => element.id === customerId)
        return result && result.length > 0 ? result[0].email : ''
    }

    const getClassTitle = (teamClassId) => {

        const result = classes.filter(element => element.id === teamClassId)
        return result && result.length > 0 ? result[0].title : ''
    }

    const getFormattedEventDate = (bookingId) => {

        const result = calendarEvents.filter(element => element.bookingId === bookingId)

        if (result && result.length > 0) {
            console.log("find one")
            const calendarEvent = result[0]
            const date = new Date(calendarEvent.year, calendarEvent.month - 1, calendarEvent.day)
            const time = toAmPm(calendarEvent.fromHour, calendarEvent.fromMinutes, '')
            return `${moment(date).format("LL")} ${time}`
        }

        return ''
    }

    // ** Table Common Column
    const columns = [
        {
            name: 'Created',
            selector: 'createdAt',
            sortable: true,
            maxWidth: '120px',
            cell: row => (
                <div className='d-flex align-items-center'>
                <span className='d-block font-weight-bold text-truncate'>
                    {moment(row.createdAt).calendar(null, {
                        lastDay: '[Yesterday]',
                        sameDay: 'LT',
                        lastWeek: 'dddd',
                        sameElse: 'MMMM Do, YYYY'
                    })}
                        </span>
                </div>
            )
        },
        {
            name: 'Customer',
            selector: 'customerName',
            sortable: true,
            maxWidth: '200px',
            cell: row => (
                <div className='d-flex align-items-center'>
                    <Avatar color={`${status[row.status].color}`} content={row.customerName} initials/>
                    <div className='user-info text-truncate ml-1'>
                        <span className='d-block font-weight-bold text-truncate'>{row.customerName}</span>
                    </div>
                </div>
            )
        },
        {
            name: 'Email',
            selector: 'customer.email',
            sortable: true,
            maxWidth: '280px',
            cell: row => (<div className='user-info text-truncate ml-1'>
                <span className='d-block font-weight-bold text-truncate'>{getCustomerEmail(row.customerId)}</span>
            </div>)
        },
        {
            name: 'Class',
            selector: 'teamClassId',
            sortable: true,
            maxWidth: '200px',
            cell: row => (<div className='user-info text-truncate ml-1'>
                <span className='d-block font-weight-bold text-truncate'>{getClassTitle(row.teamClassId)}</span>
            </div>)
        },
        {
            name: 'Attendees',
            selector: 'attendees',
            sortable: true,
            maxWidth: '50px'
        },
        {
            name: 'Event Date',
            selector: 'id',
            sortable: true,
            maxWidth: '180px',
            cell: row => (<div className='user-info text-truncate ml-1'>
                <span className='d-block font-weight-bold text-truncate'>{getFormattedEventDate(row.id)}</span>
            </div>)
        },
        {
            name: 'Status',
            selector: 'status',
            sortable: true,
            maxWidth: '50px',
            cell: row => {
                return (
                    <Badge color={status[row.status] && status[row.status].color} pill>
                        {status[row.status] ? status[row.status].title : row.status}
                    </Badge>
                )
            }
        },
        {
            name: 'Actions',
            allowOverflow: true,
            maxWidth: '20px',
            cell: row => {
                return (
                    <div className='d-flex'>
                        <a href={`/booking/${row.id}`} target={"blank"}>
                            Checkout
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

    return (
        <Fragment>
            <Card>
                <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
                    <CardTitle tag='h4'>All Time Bookings</CardTitle>

                    <div className='d-flex mt-md-0 mt-1'>
                        <UncontrolledButtonDropdown>
                            <DropdownToggle color='secondary' caret outline>
                                <Share size={15}/>
                                <span className='align-middle ml-50'>Export</span>
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem className='w-100'>
                                    <Printer size={15}/>
                                    <span className='align-middle ml-50'>Print</span>
                                </DropdownItem>
                                <DropdownItem className='w-100' onClick={() => downloadCSV(data)}>
                                    <FileText size={15}/>
                                    <span className='align-middle ml-50'>CSV</span>
                                </DropdownItem>
                                <DropdownItem className='w-100'>
                                    <Grid size={15}/>
                                    <span className='align-middle ml-50'>Excel</span>
                                </DropdownItem>
                                <DropdownItem className='w-100'>
                                    <File size={15}/>
                                    <span className='align-middle ml-50'>PDF</span>
                                </DropdownItem>
                                <DropdownItem className='w-100'>
                                    <Copy size={15}/>
                                    <span className='align-middle ml-50'>Copy</span>
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledButtonDropdown>
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
                    defaultSortField={"createdAt"}
                    defaultSortAsc={false}
                    paginationPerPage={7}
                    className='react-dataTable'
                    sortIcon={<ChevronDown size={10}/>}
                    paginationDefaultPage={currentPage + 1}
                    paginationComponent={CustomPagination}
                    data={searchValue.length ? filteredData : data}
                />
            </Card>
        </Fragment>
    )
}

export default DataTableBookings
