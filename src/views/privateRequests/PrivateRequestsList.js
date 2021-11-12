import React, { Fragment, useState, useEffect, useContext } from 'react'
import queryAllPrivateClassRequest from '../../graphql/QueryAllPrivateClassRequest'
import DataTablePrivateRequest from './TablePrivateRequests'
import queryAllBookings from '../../graphql/QueryAllBookings'
import queryAllCalendarEvents from '../../graphql/QueryAllCalendarEvents'
import queryAllCustomers from '../../graphql/QueryAllCustomers'
import queryAllCoordinators from '../../graphql/QueryAllEventCoordinators'
import queryAllClasses from '../../graphql/QueryAllClasses'
import { useQuery } from '@apollo/client'
import { Col, Spinner } from 'reactstrap'
import BookingsHeader from '../booking/BookingsHeader/BookingsHeader'
import FiltersModal from '../booking/BoardBookings/FiltersModal'
import { FiltersContext } from '../../context/FiltersContext/FiltersContext'
import { getCustomerEmail, getClassTitle, getCoordinatorName } from '../booking/common'
import moment from 'moment'

const PrivateRequestsList = () => {
  const [genericFilter, setGenericFilter] = useState({})
  const [privateClassRequestsFilter, setPrivateClassRequestsFilter] = useState({ status_in: 'closed' })
  const [privateClassRequests, setPrivateClassRequests] = useState([])
  const [filteredPrivateClassRequests, setFilteredPrivateClassRequests] = useState([])
  const [limit, setLimit] = useState(600)
  const [customers, setCustomers] = useState([])
  const [coordinators, setCoordinators] = useState([])
  const [classes, setClasses] = useState([])
  const [calendarEvents, setCalendarEvents] = useState([])
  const [showFiltersModal, setShowFiltersModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [currentElement, setCurrentElement] = useState({})
  const [elementToAdd, setElementToAdd] = useState({})
  const { classFilterContext, coordinatorFilterContext, textFilterContext, dateFilterContext } = useContext(FiltersContext)
  const [filteredBookings, setFilteredBookings] = useState([])

  const { ...allPrivateRequests } = useQuery(queryAllPrivateClassRequest, {
    fetchPolicy: 'no-cache',
    variables: {
      filter: privateClassRequestsFilter
    },
    pollInterval: 300000
  })

  useEffect(() => {
    if (allPrivateRequests.data) {
      setPrivateClassRequests(allPrivateRequests.data.privateClassRequests)
    }
  }, [allPrivateRequests.data])

  useEffect(() => {
    handleSearch((textFilterContext && textFilterContext.value) || '')
    console.log('textFilterContext.value', textFilterContext && textFilterContext.value)
  }, [privateClassRequests])

  const { ...allCalendarEventsResults } = useQuery(queryAllCalendarEvents, {
    fetchPolicy: 'no-cache',
    variables: {
      filter: genericFilter
    },
    pollInterval: 300000
  })

  useEffect(() => {
    if (allCalendarEventsResults.data) setCalendarEvents(allCalendarEventsResults.data.calendarEvents)
  }, [allCalendarEventsResults.data])

  const { ...allCustomersResult } = useQuery(queryAllCustomers, {
    fetchPolicy: 'no-cache',
    variables: {
      filter: genericFilter
    },
    pollInterval: 300000
  })

  const { ...allCoordinatorResult } = useQuery(queryAllCoordinators, {
    fetchPolicy: 'no-cache',
    variables: {
      filter: genericFilter
    },
    pollInterval: 300000
  })

  useEffect(() => {
    if (allCustomersResult.data) setCustomers(allCustomersResult.data.customers)
  }, [allCustomersResult.data])

  useEffect(() => {
    if (allCoordinatorResult.data) setCoordinators(allCoordinatorResult.data.eventCoordinators)
  }, [allCoordinatorResult.data])

  const { ...allClasses } = useQuery(queryAllClasses, {
    fetchPolicy: 'no-cache',
    variables: {
      filter: genericFilter
    },
    pollInterval: 300000
  })

  useEffect(() => {
    if (allClasses.data) setClasses(allClasses.data.teamClasses)
  }, [allClasses.data])

  const handleModal = () => setShowAddModal(!showAddModal)

  const handleSearch = (value) => {
    console.log('value', value)
    if (value.length) {
      const updatedData = privateClassRequests.filter((item) => {
        const startsWith =
          (item.name && item.name.toLowerCase().startsWith(value.toLowerCase())) ||
          (item.email && item.email.toLowerCase().startsWith(value.toLowerCase())) ||
          (item.eventCoordinatorId && getCoordinatorName(item.eventCoordinatorId, coordinators).toLowerCase().startsWith(value.toLowerCase()))

        const includes =
          (item.name && item.name.toLowerCase().includes(value.toLowerCase())) ||
          (item.email && item.email.toLowerCase().includes(value.toLowerCase())) ||
          (item.eventCoordinatorId && getCoordinatorName(item.eventCoordinatorId, coordinators).toLowerCase().includes(value.toLowerCase()))

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return null
      })

      setFilteredPrivateClassRequests(updatedData)
      console.log('updatedData', updatedData)
    } else {
      setFilteredPrivateClassRequests(privateClassRequests)
    }
  }

  useEffect(() => {
    let query = {}

    if (coordinatorFilterContext) {
      query = { ...query, eventCoordinatorId_in: coordinatorFilterContext.value }
    }

    if (dateFilterContext) {
      query = {
        ...query,
        date_gte: moment(dateFilterContext.value[0]).format(),
        date_lte: moment(dateFilterContext.value[1]).add(23, 'hours').add(59, 'minutes').format()
      }
    }

    setPrivateClassRequestsFilter(query)
  }, [coordinatorFilterContext, dateFilterContext])

  useEffect(() => {
    handleSearch((textFilterContext && textFilterContext.value) || '')
  }, [textFilterContext])

  console.log('filteredPrivateClassRequests', filteredPrivateClassRequests)
  // ** Function to handle Modal toggle
  return (
    <Fragment>
      <BookingsHeader
        setShowFiltersModal={(val) => setShowFiltersModal(val)}
        showAddModal={() => handleModal()}
        setElementToAdd={(d) => setElementToAdd(d)}
        onChangeLimit={(newLimit) => {
          setLimit(newLimit)
        }}
        bookings={filteredBookings}
        privateRequests={filteredPrivateClassRequests}
        customers={customers}
        coordinators={coordinators}
        classes={classes}
        calendarEvents={calendarEvents}
        defaultLimit={limit}
        showLimit={true}
        showExport={true}
        showAdd={false}
        showFilter={true}
        showView={false}
        titleView={'Private Requests '}
        isPrivateRequest={true}
      />
      <>
        <Col sm="12">
          {privateClassRequests && privateClassRequests.length > 0 && (
            <DataTablePrivateRequest
              filteredData={filteredPrivateClassRequests}
              handleEditModal={(element) => {
                setCurrentElement(element)
                handleEditModal()
              }}
              coordinators={coordinators}
            />
          )}
        </Col>

        <FiltersModal
          open={showFiltersModal}
          handleModal={() => setShowFiltersModal(!showFiltersModal)}
          classes={classes}
          coordinators={coordinators}
          calendarEvents={calendarEvents}
          isFilterByClass={false}
          isFilterByCoordinator={true}
          isFilterByCreationDate={true}
        />
      </>
    </Fragment>
  )
}
export default PrivateRequestsList
