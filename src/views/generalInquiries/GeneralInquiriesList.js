// @packages
import moment from 'moment';
import { Col, Spinner } from 'reactstrap';
import { useQuery } from '@apollo/client';
import { useState, useEffect, useContext } from 'react';

// @scripts
import BookingsHeader from '../booking/BookingsHeader/BookingsHeader';
import DataTableGeneralInquiries from './TableGeneralInquiries';
import FiltersModal from '../booking/BoardBookings/FiltersModal';
import queryAllQuestions from '../../graphql/QueryAllQuestions';
import queryAllCoordinators from '../../graphql/QueryAllEventCoordinators';
import { FiltersContext } from '../../context/FiltersContext/FiltersContext';

const GeneralInquiresList = () => {
  const [filteredGeneralInquiries, setFilteredGeneralInquiries] = useState([]);
  const [generalInquiries, setGeneralInquiries] = useState([]);
  const [generalInquiriesFilter, setGeneralInquiriesFilter] = useState({});
  const [limit, setLimit] = useState(200);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const { textFilterContext, dateFilterContext, coordinatorFilterContext } = useContext(FiltersContext);
  const [coordinators, setCoordinators] = useState([]);

  const { ...allQuestions } = useQuery(queryAllQuestions, {
    fetchPolicy: "cache-and-network",
    variables: {
      filter: generalInquiriesFilter,
      limit
    },
    pollInterval: 300000
  });

  useQuery(queryAllCoordinators, {
    variables: {
      filter: {}
    },
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      if (data?.eventCoordinators) {
        setCoordinators(data.eventCoordinators);
      }
    }
  });

  useEffect(() => {
    if (allQuestions.data) {
      setGeneralInquiries(allQuestions.data.questions);
    }
  }, [allQuestions.data]);

  const handleSearch = (value) => {
    if (value.length) {
      const updatedData = generalInquiries.filter((item) => {
        const startsWith =
          (item.name && item.name.toLowerCase().startsWith(value.toLowerCase())) ||
          (item.email && item.email.toLowerCase().startsWith(value.toLowerCase()));

        const includes =
          (item.name && item.name.toLowerCase().includes(value.toLowerCase())) ||
          (item.email && item.email.toLowerCase().includes(value.toLowerCase()));

        return startsWith || includes;
      });

      setFilteredGeneralInquiries(updatedData);
    } else {
      setFilteredGeneralInquiries(generalInquiries);
    }
  };

  useEffect(() => {
    let query = {};

    if (coordinatorFilterContext) {
      query = { ...query, eventCoordinatorId_in: coordinatorFilterContext.value };
    }

    if (dateFilterContext) {
      query = {
        ...query,
        date_gte: moment(dateFilterContext.value[0]).format(),
        date_lte: moment(dateFilterContext.value[1]).add(23, 'hours').add(59, 'minutes').format()
      };
    }

    setGeneralInquiriesFilter(query);
  }, [dateFilterContext, coordinatorFilterContext]);

  useEffect(() => {
    handleSearch((textFilterContext && textFilterContext.value) || '');
  }, [textFilterContext]);

  useEffect(() => {
    handleSearch((textFilterContext && textFilterContext.value) || '');
  }, [generalInquiries]);

  return (
    <>
      <BookingsHeader
        setShowFiltersModal={(val) => setShowFiltersModal(val)}
        onChangeLimit={(newLimit) => {
          setLimit(newLimit);
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
            {generalInquiries && generalInquiries.length > 0 && (
              <DataTableGeneralInquiries
              filteredData={filteredGeneralInquiries}
              coordinators={coordinators}/>
            )}
          </Col>
          <FiltersModal
            open={showFiltersModal}
            handleModal={() => setShowFiltersModal(!showFiltersModal)}
            isFilterByClass={false}
            coordinators={coordinators}
            isFilterByCoordinator={true}
            isFilterByCreationDate={true}
          />
        </>
      )}
    </>
  );
};

export default GeneralInquiresList;
