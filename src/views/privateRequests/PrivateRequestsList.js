// @packages
import React, { useState, useEffect, useContext } from 'react';
import moment from 'moment';
import { Col, Spinner } from 'reactstrap';
import { useQuery } from '@apollo/client';

// @scripts
import BookingsHeader from '../booking/BookingsHeader/BookingsHeader';
import DataTablePrivateRequest from './TablePrivateRequests';
import FiltersModal from '../booking/BoardBookings/FiltersModal';
import queryAllCoordinators from '../../graphql/QueryAllEventCoordinators';
import queryAllPrivateClassRequest from '../../graphql/QueryAllPrivateClassRequest';
import { FiltersContext } from '../../context/FiltersContext/FiltersContext';
import { getCoordinatorName } from '../booking/common';

const PrivateRequestsList = () => {
  const [coordinators, setCoordinators] = useState([]);
  const [filteredPrivateClassRequests, setFilteredPrivateClassRequests] = useState([]);
  const [limit, setLimit] = useState(200);
  const [privateClassRequests, setPrivateClassRequests] = useState([]);
  const [privateClassRequestsFilter, setPrivateClassRequestsFilter] = useState({ status_in: 'closed' });
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const { coordinatorFilterContext, textFilterContext, dateFilterContext } = useContext(FiltersContext);

  const { ...allPrivateRequests } = useQuery(queryAllPrivateClassRequest, {
    fetchPolicy: 'no-cache',
    variables: {
      filter: privateClassRequestsFilter,
      limit
    },
    pollInterval: 300000,
    onCompleted: (data) => {
      if (data) setPrivateClassRequests(data.privateClassRequests);
    }
  });

  const { ...allCoordinatorResult } = useQuery(queryAllCoordinators, {
    variables: {
      filter: {}
    },
    onCompleted: (data) => {
      if (data) setCoordinators(data.eventCoordinators);
    },
    pollInterval: 200000
  });

  const handleSearch = (value) => {
    if (value.length) {
      const updatedData = privateClassRequests.filter((item) => {
        const startsWith =
          (item.name && item.name.toLowerCase().startsWith(value.toLowerCase())) ||
          (item.email && item.email.toLowerCase().startsWith(value.toLowerCase())) ||
          (item.eventType && item.eventType.toLowerCase().startsWith(value.toLowerCase())) ||
          (item.timeFrame && item.timeFrame.toLowerCase().startsWith(value.toLowerCase())) ||
          (item.eventCoordinatorId && getCoordinatorName(item.eventCoordinatorId, coordinators).toLowerCase().startsWith(value.toLowerCase()));

        const includes =
          (item.name && item.name.toLowerCase().includes(value.toLowerCase())) ||
          (item.email && item.email.toLowerCase().includes(value.toLowerCase())) ||
          (item.eventType && item.eventType.toLowerCase().includes(value.toLowerCase())) ||
          (item.timeFrame && item.timeFrame.toLowerCase().includes(value.toLowerCase())) ||
          (item.eventCoordinatorId && getCoordinatorName(item.eventCoordinatorId, coordinators).toLowerCase().includes(value.toLowerCase()));

        return startsWith || includes;
      });
      setFilteredPrivateClassRequests(updatedData);
    } else {
      setFilteredPrivateClassRequests(privateClassRequests);
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

    setPrivateClassRequestsFilter(query);
  }, [coordinatorFilterContext, dateFilterContext]);

  useEffect(() => {
    handleSearch((textFilterContext && textFilterContext.value) || '');
  }, [textFilterContext]);

  useEffect(() => {
    handleSearch((textFilterContext && textFilterContext.value) || '');
  }, [privateClassRequests]);

  return (
    <>
      <BookingsHeader
        coordinators={coordinators}
        defaultLimit={limit}
        isPrivateRequest={true}
        onChangeLimit={(newLimit) => {
          setLimit(newLimit);
        }}
        privateRequests={filteredPrivateClassRequests}
        setShowFiltersModal={(val) => setShowFiltersModal(val)}
        showAdd={false}
        showExport={true}
        showFilter={true}
        showLimit={true}
        showView={false}
        titleView={'Private Requests '}
      />
      {allPrivateRequests.loading || allCoordinatorResult.loading ? (
        <>
          <Spinner className="mr-25" />
          <Spinner type="grow" />
        </>
      ) : (
        <>
          <Col sm="12">
            {privateClassRequests && privateClassRequests.length > 0 && (
              <DataTablePrivateRequest 
                filteredData={filteredPrivateClassRequests} 
                coordinators={coordinators} 
              />
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
    </>
  );
};

export default PrivateRequestsList;

