import React, { Fragment, useState, useEffect, useContext } from 'react'
import DataTablePrivateRequest from './TablePrivateRequests'
import queryAllPrivateClassRequest from '../../graphql/QueryAllPrivateClassRequest'
import queryAllCoordinators from '../../graphql/QueryAllEventCoordinators'
import { useQuery } from '@apollo/client'
import { Col, Spinner } from 'reactstrap'
import BookingsHeader from '../booking/BookingsHeader/BookingsHeader'
import FiltersModal from '../booking/BoardBookings/FiltersModal'
import { FiltersContext } from '../../context/FiltersContext/FiltersContext'
import { getCoordinatorName } from '../booking/common'
import moment from 'moment'

const PrivateRequestsList = () => {
  const [privateClassRequestsFilter, setPrivateClassRequestsFilter] = useState({ status_in: 'closed' })
  const [privateClassRequests, setPrivateClassRequests] = useState([])
  const [filteredPrivateClassRequests, setFilteredPrivateClassRequests] = useState([])
  const [limit, setLimit] = useState(600)
  const [coordinators, setCoordinators] = useState([])
  const [showFiltersModal, setShowFiltersModal] = useState(false)
  const { coordinatorFilterContext, textFilterContext, dateFilterContext } = useContext(FiltersContext)

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
  }, [privateClassRequests])

  const { ...allCoordinatorResult } = useQuery(queryAllCoordinators, {
    fetchPolicy: 'no-cache',
    variables: {
      filter: privateClassRequestsFilter
    },
    pollInterval: 300000
  })

  useEffect(() => {
    if (allCoordinatorResult.data) setCoordinators(allCoordinatorResult.data.eventCoordinators)
  }, [allCoordinatorResult.data])

  const handleSearch = (value) => {
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

  // ** Function to handle Modal toggle
  return (
    <Fragment>
      <BookingsHeader
        setShowFiltersModal={(val) => setShowFiltersModal(val)}
        onChangeLimit={(newLimit) => {
          setLimit(newLimit)
        }}
        privateRequests={filteredPrivateClassRequests}
        coordinators={coordinators}
        defaultLimit={limit}
        showLimit={true}
        showExport={true}
        showAdd={false}
        showFilter={true}
        showView={false}
        titleView={'Private Requests '}
        isPrivateRequest={true}
      />
      {allPrivateRequests.loading || allCoordinatorResult.loading ? (
        <div>
          <Spinner className="mr-25" />
          <Spinner type="grow" />
        </div>
      ) : (
        <>
          <Col sm="12">
            {privateClassRequests && privateClassRequests.length > 0 && (
              <DataTablePrivateRequest filteredData={filteredPrivateClassRequests} coordinators={coordinators} />
            )}
          </Col>

          <FiltersModal
            open={showFiltersModal}
            handleModal={() => setShowFiltersModal(!showFiltersModal)}
            coordinators={coordinators}
            isFilterByClass={false}
            isFilterByCoordinator={true}
            isFilterByCreationDate={true}
          />
        </>
      )}
    </Fragment>
  )
}
export default PrivateRequestsList
