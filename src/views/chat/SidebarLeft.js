// @packages
import { useEffect, useMemo, useState } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from '@components/avatar';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import classnames from 'classnames';
import { X, Search } from 'react-feather';
import { debounce } from 'lodash';
import { InputGroup, InputGroupAddon, InputGroupText, Input, Spinner } from 'reactstrap';
import queryGetCustomersForChat from '../../graphql/QueryGetCustomersForChat';
import queryGetMostRecentInteractions from '../../graphql/conversations/QueryGetMostRecentInteractions';

// @scripts
import ConversationsList from './ConversationsList';
import SidebarInfo from './SidebarInfo';
import { informationId, updateCurrentConversation } from '../../redux/actions/chat';
// @styles
import './SidebarLeft.scss';
import { getUserData } from '../../utility/Utils';

const SidebarLeft = ({
  client,
  handleSidebar,
  handleUserSidebarLeft,
  setStatus,
  sidebar,
  status,
  userSidebarLeft,
  setSelectedBooking,
  selectedBooking
}) => {
  const userData = getUserData();

  const defaultFilter = [
    {
      name: 'closedReason',
      type: 'string',
      operator: 'neq',
      value: 'Duplicated'
    },
    {
      name: 'closedReason',
      type: 'string',
      operator: 'neq',
      value: 'Mistake'
    },
    {
      name: 'closedReason',
      type: 'string',
      operator: 'neq',
      value: 'Test'
    },
    {
      name: 'eventCoordinatorId',
      type: 'string',
      operator: 'contains',
      value: userData?.customData?.coordinatorId
    }
  ];

  const defaultSort = { dir: -1, id: 'updatedAt', name: 'updatedAt', type: 'date' };
  const limit = 30;

  const [customersData, setCustomersData] = useState([]);
  const [isInfoReady, setIsInfoReady] = useState(false);
  const [inputValue, setInputValue] = useState(null);
  const [mostRecentOnesFilter, setMostRecentOnesFilter] = useState(null);
  const [mainFilter, setMainFilter] = useState([...defaultFilter]);
  const conversations = useSelector((state) => state.reducer.convo);
  const dispatch = useDispatch();

  const { loadingMainData } = useQuery(queryGetMostRecentInteractions, {
    fetchPolicy: 'cache-and-network',
    pollInterval: 15000,
    variables: {
      coordinatorId: userData?.customData?.coordinatorId
    },
    onCompleted: (data) => {
      const filter =
        data?.getMostRecentInteractions?.length > 0
          ? {
              name: 'customerId',
              type: 'select',
              operator: 'inlist',
              valueList: data?.getMostRecentInteractions
            }
          : null;
      setMostRecentOnesFilter(filter);
      getData((filter && [filter]) || mainFilter, []);
    }
  });

  const [getCustomersForChat, { ...getCustomersForChatResult }] = useLazyQuery(queryGetCustomersForChat, {
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      const mostRecentCustomers = {};
      data.getBookingsWithCriteria.rows.forEach((element) => {
        mostRecentCustomers[element.customerId] = {
          _id: element.customerId,
          name: element.customerName,
          email: element.customerEmail,
          phone: element.customerPhone,
          company: element.customerCompany,
          updatedAt: element.updatedAt,
          bookingId: element._id
        };
      });

      const values = Object.values(mostRecentCustomers);
      const customers = values.map((customer) => {
        return {
          customer,
          convo: conversations.find((convo) => convo.friendlyName === customer._id)
        };
      });

      setCustomersData(customers);
    }
  });

  const getData = (filterBy, filterByOr) => {
    getCustomersForChat({
      variables: {
        filterBy,
        filterByOr,
        limit,
        offset: 0,
        sortBy: defaultSort
      }
    });
  };

  useEffect(() => {
    if (!customersData) return;

    const newCustomersData = customersData.map(({ customer, convo }) => {
      return {
        customer,
        convo: convo || conversations.find((convo) => convo.friendlyName === customer._id)
      };
    });
    setCustomersData(newCustomersData);
  }, [conversations]);

  useEffect(() => {
    setIsInfoReady(!loadingMainData && !getCustomersForChatResult?.loading);
  }, [getCustomersForChatResult?.loading, loadingMainData]);

  const changeHandler = (event) => {
    setInputValue(event.target.value);
    setSelectedBooking(null);
  };
  const debouncedChangeHandler = useMemo(() => debounce(changeHandler, 1000), []);

  useEffect(() => {
    return () => {
      debouncedChangeHandler.cancel();
    };
  }, []);

  useEffect(() => {
    dispatch(updateCurrentConversation(null));
    dispatch(informationId(null));

    if (!inputValue) getData((mostRecentOnesFilter && [mostRecentOnesFilter]) || mainFilter, []);
    else {
      getData(mainFilter, [
        {
          name: '_id',
          type: 'string',
          operator: 'eq',
          value: inputValue
        },
        {
          name: 'customerName',
          type: 'string',
          operator: 'contains',
          value: inputValue
        },
        {
          name: 'customerId',
          type: 'string',
          operator: 'contains',
          value: inputValue
        },
        {
          name: 'customerEmail',
          type: 'string',
          operator: 'contains',
          value: inputValue
        },
        {
          name: 'customerPhone',
          type: 'string',
          operator: 'contains',
          value: inputValue
        },
        {
          name: 'customerCompany',
          type: 'string',
          operator: 'contains',
          value: inputValue
        }
      ]);
    }
  }, [inputValue]);

  return (
    <div className="sidebar-left">
      <div className="sidebar">
        <div
          className={classnames('chat-profile-sidebar', {
            show: userSidebarLeft
          })}
        >
          <SidebarInfo handleUserSidebarLeft={handleUserSidebarLeft} setStatus={setStatus} status={status} userData={userData} />
        </div>
        <div
          className={classnames('sidebar-content', {
            show: sidebar === true
          })}
        >
          <div className="sidebar-close-icon" onClick={handleSidebar}>
            <X size={14} />
          </div>
          <div className="chat-fixed-title">
            <h4 className="conversations">Conversations</h4>
          </div>
          <div className="chat-fixed-search">
            <div className="d-flex align-items-center w-100">
              <div className="sidebar-profile-toggle" onClick={handleUserSidebarLeft}>
                <Avatar className="avatar-border" content={(userData && userData['name']) || 'Unknown'} initials status={status} />
              </div>
              <InputGroup className="input-group-merge ml-1 w-100">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText className="round">
                    <Search className="text-muted" size={14} />
                  </InputGroupText>
                </InputGroupAddon>
                <Input className="round" onChange={debouncedChangeHandler} placeholder="name, email, booking, etc." type="text" />
              </InputGroup>
            </div>
          </div>
          <PerfectScrollbar
            className="chat-user-list-wrapper list-group"
            options={{ wheelPropagation: false }}
            style={{ height: 'calc(100% - 110px)' }}
          >
            {!isInfoReady && <Spinner className="spinner" color="primary" />}
            <ConversationsList
              client={client}
              selectedBooking={selectedBooking}
              setSelectedBooking={setSelectedBooking}
              customersData={customersData}
            />
          </PerfectScrollbar>
        </div>
      </div>
    </div>
  );
};

SidebarLeft.propTypes = {
  handleSidebar: PropTypes.func,
  handleUserSidebarLeft: PropTypes.func,
  inputValue: PropTypes.string,
  setInputValue: PropTypes.func,
  setStatus: PropTypes.func,
  sidebar: PropTypes.bool,
  status: PropTypes.string,
  userSidebarLeft: PropTypes.bool
};

export default SidebarLeft;
