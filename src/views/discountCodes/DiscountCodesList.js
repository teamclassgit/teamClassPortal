// @packages
import moment from 'moment';
import { Col, Spinner } from 'reactstrap';
import { useQuery } from '@apollo/client';
import { useState, useEffect, useContext } from 'react';

// @scripts
import AddNewDiscountCode from './AddNewDiscountCode';
import BookingsHeader from '../booking/BookingsHeader/BookingsHeader';
import FiltersModal from '../booking/BoardBookings/FiltersModal';
import TableDiscountCodes from '../discountCodes/TableDiscountCodes';
import queryDiscountCodes from '../../graphql/QueryDiscountCodes';
import EditDiscountCodesModal from '../../components/EditDiscountCodesModal';
import { FiltersContext } from '../../context/FiltersContext/FiltersContext';

const DiscountCodesList = () => {
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [discountCodes, setDiscountCodes] = useState([]);
  const [discountCodesFilter, setDiscountCodesFilter] = useState({});
  const [editModal, setEditModal] = useState(false);
  const [elementToAdd, setElementToAdd] = useState({});
  const [filteredDiscountCodes, setFilteredDiscountCodes] = useState([]);
  const [limit, setLimit] = useState(600);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const { textFilterContext, dateFilterContext } = useContext(FiltersContext);
  const [currentElement, setCurrentElement] = useState({});

  const handleEditModal = () => setEditModal(!editModal);

  const { ...allDiscountCodes } = useQuery(queryDiscountCodes, {
    fetchPolicy: 'no-cache',
    variables: {
      filter: discountCodesFilter
    },
    pollInterval: 300000
  });

  useEffect(() => {
    if (allDiscountCodes.data) {
      setBookings(allDiscountCodes.data.discountCodes.map((element) => element));
    }
  }, [allDiscountCodes.data]);

  const handleModal = () => setShowAddModal(!showAddModal);

  useEffect(() => {
    if (allDiscountCodes.data) {
      setDiscountCodes(allDiscountCodes.data.discountCodes);
    }
  }, [allDiscountCodes.data]);

  const handleSearch = (value) => {
    if (value.length) {
      const updatedData = discountCodes.filter((item) => {
        const startsWith =
          (item.name && item.name.toLowerCase().startsWith(value.toLowerCase())) ||
          (item.email && item.email.toLowerCase().startsWith(value.toLowerCase()));

        const includes =
          (item.name && item.name.toLowerCase().includes(value.toLowerCase())) ||
          (item.email && item.email.toLowerCase().includes(value.toLowerCase()));

        return startsWith || includes;
      });

      setFilteredDiscountCodes(updatedData);
    } else {
      setFilteredDiscountCodes(discountCodes);
    }
  };

  useEffect(() => {
    let query = {};

    if (dateFilterContext) {
      query = {
        ...query,
        date_gte: moment(dateFilterContext.value[0]).format(),
        date_lte: moment(dateFilterContext.value[1]).add(23, 'hours').add(59, 'minutes').format()
      };
    }

    setDiscountCodesFilter(query);
  }, [dateFilterContext]);

  useEffect(() => {
    handleSearch((textFilterContext && textFilterContext.value) || '');
  }, [textFilterContext, discountCodes]);

  return (
    <>
      <BookingsHeader
        discountCodes={filteredDiscountCodes}
        showExport
        showAddModal={() => handleModal()}
        onChangeLimit={(newLimit) => setLimit(newLimit)}
        showAdd
        setElementToAdd={(d) => setElementToAdd(d)}
        noCoordinators
        defaultLimit={limit}
        showLimit
        isDiscountCodes
        titleView={'Discount Codes '}
      />
      {allDiscountCodes.loading ? (
        <div>
          <Spinner className="mr-25" />
          <Spinner type="grow" />
        </div>
      ) : (
        <>
          <Col sm="12">
            {filteredDiscountCodes && filteredDiscountCodes.length > 0 
              && 
              <TableDiscountCodes 
                filteredData={filteredDiscountCodes}
                bookings={bookings}
                setBookings={setBookings}
                handleEditModal={(element) => {
                  setCurrentElement(element);
                  handleEditModal();
                }}
              />
            }
          </Col>
          <FiltersModal
            open={showFiltersModal}
            handleModal={() => setShowFiltersModal(!showFiltersModal)}
            isFilterByClass={false}
            isFilterByCoordinator={false}
            isFilterByCreationDate={true}
          />
          <AddNewDiscountCode
            open={showAddModal}
            handleModal={handleModal}
            bookings={bookings}
            setCustomers={setCustomers}
            customers={customers}
            baseElement={elementToAdd}
            setBookings={setBookings}
          />
          <EditDiscountCodesModal
            open={editModal}
            handleModal={handleEditModal}
            currentElement={currentElement}
            bookings={bookings}
            setBookings={setBookings}
            setCustomers={setCustomers}
            handleClose={() => setCurrentElement({})}
            editMode={true}
          />
        </>
      )}
    </>
  );
};

export default DiscountCodesList;
