import React, { Fragment, useState, useEffect, useContext } from 'react'
import DataTableGeneralInquiries from './TableGeneralInquiries'
import queryAllQuestions from '../../graphql/QueryAllQuestions'
import { useQuery } from '@apollo/client'
import { Col, Spinner } from 'reactstrap'
import BookingsHeader from '../booking/BookingsHeader/BookingsHeader'
import FiltersModal from '../booking/BoardBookings/FiltersModal'
import { FiltersContext } from '../../context/FiltersContext/FiltersContext'
import moment from 'moment'

const GeneralInquiresList = () => {
  const [generalInquiriesFilter, setGeneralInquiriesFilter] = useState({})
  const [generalInquiries, setGeneralInquiries] = useState([])
  const [filteredGeneralInquiries, setFilteredGeneralInquiries] = useState([])
  const [limit, setLimit] = useState(600)
  const [showFiltersModal, setShowFiltersModal] = useState(false)
  const { textFilterContext, dateFilterContext } = useContext(FiltersContext)

  const { ...allQuestions } = useQuery(queryAllQuestions, {
    fetchPolicy: 'no-cache',
    variables: {
      filter: generalInquiriesFilter
    },
    pollInterval: 300000
  })

  useEffect(() => {
    if (allQuestions.data) {
      setGeneralInquiries(allQuestions.data.questions)
    }
  }, [allQuestions.data])

  useEffect(() => {
    handleSearch((textFilterContext && textFilterContext.value) || '')
  }, [generalInquiries])

  const handleSearch = (value) => {
    if (value.length) {
      const updatedData = generalInquiries.filter((item) => {
        const startsWith =
          (item.name && item.name.toLowerCase().startsWith(value.toLowerCase())) ||
          (item.email && item.email.toLowerCase().startsWith(value.toLowerCase()))

        const includes =
          (item.name && item.name.toLowerCase().includes(value.toLowerCase())) ||
          (item.email && item.email.toLowerCase().includes(value.toLowerCase()))

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return null
      })

      setFilteredGeneralInquiries(updatedData)
    } else {
      setFilteredGeneralInquiries(generalInquiries)
    }
  }

  useEffect(() => {
    let query = {}

    if (dateFilterContext) {
      query = {
        ...query,
        date_gte: moment(dateFilterContext.value[0]).format(),
        date_lte: moment(dateFilterContext.value[1]).add(23, 'hours').add(59, 'minutes').format()
      }
    }

    setGeneralInquiriesFilter(query)
  }, [dateFilterContext])

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
        generalInquiries={filteredGeneralInquiries}
        defaultLimit={limit}
        showLimit={true}
        showExport={true}
        showAdd={false}
        showFilter={true}
        showView={false}
        isGeneralInquiries={true}
        titleView={'General Inquiries '}
      />
      {allQuestions.loading ? (
        <div>
          <Spinner className="mr-25" />
          <Spinner type="grow" />
        </div>
      ) : (
        <>
          <Col sm="12">
            {generalInquiries && generalInquiries.length > 0 && <DataTableGeneralInquiries filteredData={filteredGeneralInquiries} />}
          </Col>

          <FiltersModal
            open={showFiltersModal}
            handleModal={() => setShowFiltersModal(!showFiltersModal)}
            isFilterByClass={false}
            isFilterByCoordinator={false}
            isFilterByCreationDate={true}
          />
        </>
      )}
    </Fragment>
  )
}
export default GeneralInquiresList
