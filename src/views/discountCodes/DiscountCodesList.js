// @packages
import moment from 'moment';
import { Col, Spinner } from 'reactstrap';
import { isUserLoggedIn, getUserData } from '@utils';
import { useQuery } from '@apollo/client';
import { useState, useEffect, useContext } from 'react';

// @scripts
import AddNewDiscountCode from './AddNewDiscountCode';
import BookingsHeader from '../booking/BookingsHeader/BookingsHeader';
import EditDiscountCodesModal from '../../components/EditDiscountCodesModal';
import TableDiscountCodes from '../discountCodes/TableDiscountCodes';
import queryAllCustomers from '../../graphql/QueryAllCustomers';
import queryDiscountCodes from '../../graphql/QueryDiscountCodes';
import { FiltersContext } from '../../context/FiltersContext/FiltersContext';

const DiscountCodesList = () => {
  const [currentElement, setCurrentElement] = useState({});
  const [customers, setCustomers] = useState([]);
  const [discountCodesFilter, setDiscountCodesFilter] = useState({});
  const [discountCodesInformation, setDiscountCodesInformation] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [elementToAdd, setElementToAdd] = useState({});
  const [filteredDiscountCodes, setFilteredDiscountCodes] = useState([]);
  const [limit, setLimit] = useState(600);
  const [showAddModal, setShowAddModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const { textFilterContext, dateFilterContext } = useContext(FiltersContext);

  const handleEditModal = () => setEditModal(!editModal);
  const handleModal = () => setShowAddModal(!showAddModal);

  const { ...allDiscountCodes } = useQuery(queryDiscountCodes, {
    fetchPolicy: 'no-cache',
    variables: {
      filter: discountCodesFilter
    },
    pollInterval: 300000
  });

  const { ...allCustomersResult } = useQuery(queryAllCustomers, {
    fetchPolicy: 'no-cache',
    variables: {
      filter: discountCodesFilter
    },
    pollInterval: 200000
  });

  useEffect(() => {
    if (allCustomersResult.data) setCustomers(allCustomersResult.data.customers);
  }, [allCustomersResult.data]);

  useEffect(() => {
    if (allDiscountCodes.data) {
      setDiscountCodesInformation(allDiscountCodes.data.discountCodes.map((element) => element));
    }
  }, [allDiscountCodes.data]);

  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setUserData(getUserData());
    }
  }, []);

  const handleSearch = (value) => {
    if (value.length) {
      const updatedData = discountCodesInformation.filter((item) => {
        const startsWith =
          (item.discountCode && item.discountCode.toLowerCase().startsWith(value.toLowerCase())) ||
          (item.description && item.description.toLowerCase().startsWith(value.toLowerCase()));
    
        const includes =
          (item.discountCode && item.discountCode.toLowerCase().includes(value.toLowerCase())) ||
          (item.description && item.description.toLowerCase().includes(value.toLowerCase()));

        return startsWith || includes;
      });
      setFilteredDiscountCodes(updatedData);
    } else {
      setFilteredDiscountCodes(discountCodesInformation);
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
  }, [textFilterContext, discountCodesInformation]);

  return (
    <>
      <BookingsHeader
        userData={userData}
        defaultLimit={limit}
        discountCodes={filteredDiscountCodes}
        isDiscountCodes
        noCoordinators
        onChangeLimit={(newLimit) => setLimit(newLimit)}
        setElementToAdd={(d) => setElementToAdd(d)}
        showAdd
        showAddModal={() => handleModal()}
        showExport
        showLimit
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
                userData={userData}
                filteredData={filteredDiscountCodes}
                setDiscountCodesInformation={setDiscountCodesInformation}
                handleEditModal={(element) => {
                  setCurrentElement(element);
                  handleEditModal();
                }}
              />
            }
          </Col>
          <AddNewDiscountCode
            baseElement={elementToAdd}
            customers={customers}
            discountCodesInformation={discountCodesInformation}
            handleModal={handleModal}
            open={showAddModal}
            setDiscountCodesInformation={setDiscountCodesInformation}
          />
          <EditDiscountCodesModal
            currentElement={currentElement}
            customers={customers}
            discountCodesInformation={discountCodesInformation}
            editMode
            handleClose={() => setCurrentElement({})}
            handleModal={handleEditModal}
            open={editModal}
            setDiscountCodesInformation={setDiscountCodesInformation}
          />
        </>
      )}
    </>
  );
};

export default DiscountCodesList;
