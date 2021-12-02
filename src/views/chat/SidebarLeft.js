// @packages
import Avatar from '@components/avatar';
import PerfectScrollbar from 'react-perfect-scrollbar';
import classnames from 'classnames';
import { X, Search } from 'react-feather';
import { formatDateToMonthShort } from '@utils';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import queryAllUsers from '../../graphql/QueryAllUsers';

// @scripts
import { selectChat } from '../../redux/actions/chat';
import { 
  CardText,
  InputGroup,
  InputGroupAddon,
  Input,
  InputGroupText,
  Badge,
  CustomInput,
  Button
} from 'reactstrap';

const SidebarLeft = ({
  handleSidebar,
  handleUserSidebarLeft,
  sidebar,
  userData,
  messageInfo,
  setMessageInfo,
  store,
  userSidebarLeft
}) => {
  const { chats, userProfile } = store;

  const dispatch = useDispatch();

  const [about, setAbout] = useState('');
  const [query, setQuery] = useState('');
  const [active, setActive] = useState({});
  const [status, setStatus] = useState('online');
  const [filteredChat, setFilteredChat] = useState([]);
  const [dataAllUsers, setDataAllUsers] = useState([]);

  const { ...allUsers } = useQuery(queryAllUsers, {
    fetchPolicy: 'no-cache',
    variables: {
      filter: store
    },
    pollInterval: 20000
  });

  useEffect(() => {
    if (allUsers.data) {
      setDataAllUsers(allUsers?.data?.userData.filter(user => user._id === messageInfo[0]?.fromId));
    }
  }, [allUsers.data]);

  useEffect(() => {
    setStatus(userData?.status);
  }, [userData]);

  const handleUserClick = (type, id) => {
    dispatch(selectChat(id));
    setActive({ type, id });
    if (sidebar === true) {
      handleSidebar();
    }
  };

  const renderChats = () => {
    if (messageInfo && messageInfo?.length) {
      if (query.length && !filteredChat.length) {
        return (
          <li className='no-results show'>
            <h6 className='mb-0'>No Chats Found</h6>
          </li>
        );
      } else {
        const arrToMap = query.length && filteredChat.length ? filteredChat : chats;

        return arrToMap.map(item => {
          const time = formatDateToMonthShort(item.chat.lastMessage ? item.chat.lastMessage.time : new Date());

          return (
            <li
              className={classnames({
                active: active.type === 'chat' && active.id === item.id
              })}
              key={item.id}
              onClick={() => handleUserClick('chat', item.id)}
            >
              <Avatar img={item.avatar} imgHeight='42' imgWidth='42' status={item.status} />
              <div className='chat-info flex-grow-1'>
                <h5 className='mb-0'>{item.fullName}</h5>
                <CardText className='text-truncate'>
                  {item.chat.lastMessage ? item.chat.lastMessage.message : chats[chats.length - 1].message}
                </CardText>
              </div>
              <div className='chat-meta text-nowrap'>
                <small className='float-right mb-25 chat-time ml-25'>{time}</small>
                {item.chat.unseenMsgs >= 1 ? (
                  <Badge className='float-right' color='danger' pill>
                    {item.chat.unseenMsgs}
                  </Badge>
                ) : null}
              </div>
            </li>
          );
        });
      }
    } else {
      return null;
    }
  };

  const handleFilter = e => {
    setQuery(e.target.value);
    const searchFilterFunction = contact => contact.fullName.toLowerCase().includes(e.target.value.toLowerCase());
    const filteredChatsArr = chats.filter(searchFilterFunction);
    setFilteredChat([...filteredChatsArr]);
  };

  return store && (
    <div className='sidebar-left'>
      <div className='sidebar'>
        <div
          className={classnames('chat-profile-sidebar', {
            show: userSidebarLeft
          })}
        >
          <header className='chat-profile-header'>
            <div className='close-icon' onClick={handleUserSidebarLeft}>
              <X size={14} />
            </div>
            <div className='header-profile-sidebar'>
              <Avatar className='box-shadow-1 avatar-border' img={userProfile.avatar} status={status} size='xl' />
              <h4 className='chat-user-name'>{userData?.name}</h4>
              <span className='user-post'>{userData?.role}</span>
            </div>
          </header>
          <PerfectScrollbar className='profile-sidebar-area' options={{ wheelPropagation: false }}>
            <h6 className='section-label mb-1'>About</h6>
            <div className='about-user'>
              <Input
                rows='5'
                defaultValue={userData?.description}
                type='textarea'
                onChange={e => setAbout(e.target.value)}
                className={classnames('char-textarea', {
                  'text-danger': about && about.length > 120
                })}
              />
              <small className='counter-value float-right'>
                <span className='char-count'>{userData?.description ? userData.description.length : 0}</span>/ 120
              </small>
            </div>
            <h6 className='section-label mb-1 mt-3'>Status</h6>
            <ul className='list-unstyled user-status'>
              <li className='pb-1'>
                <CustomInput
                  type='radio'
                  className='custom-control-primary'
                  id='online'
                  label='Online'
                  onChange={e => setStatus('online')}
                  checked={status === 'online'}
                />
              </li>
              <li className='pb-1'>
                <CustomInput
                  type='radio'
                  className='custom-control-danger'
                  id='busy'
                  label='Do Not Disturb'
                  onChange={e => setStatus('busy')}
                  checked={status === 'busy'}
                />
              </li>
              <li className='pb-1'>
                <CustomInput
                  type='radio'
                  className='custom-control-warning'
                  id='away'
                  label='Away'
                  onChange={e => setStatus('away')}
                  checked={status === 'away'}
                />
              </li>
              <li className='pb-1'>
                <CustomInput
                  type='radio'
                  className='custom-control-secondary'
                  id='offline'
                  label='Offline'
                  onChange={e => setStatus('offline')}
                  checked={status === 'offline'}
                />
              </li>
            </ul>
            <div className='mt-3'>
              <Button disabled color='primary'>Save</Button>
            </div>
          </PerfectScrollbar>
        </div>
        <div
          className={classnames('sidebar-content', {
            show: sidebar === true
          })}
        >
          <div className='sidebar-close-icon' onClick={handleSidebar}>
            <X size={14} />
          </div>
          <div className='chat-fixed-search'>
            <div className='d-flex align-items-center w-100'>
              <div className='sidebar-profile-toggle' onClick={handleUserSidebarLeft}>
                {Object.keys(userProfile).length ? (
                  <Avatar
                    className='avatar-border'
                    img={userProfile.avatar}
                    status={status}
                    imgHeight='42'
                    imgWidth='42'
                  />
                ) : null}
              </div>
              <InputGroup className='input-group-merge ml-1 w-100'>
                <InputGroupAddon addonType='prepend'>
                  <InputGroupText className='round'>
                    <Search className='text-muted' size={14} />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  value={query}
                  className='round'
                  placeholder='Search or start a new chat'
                  onChange={handleFilter}
                />
              </InputGroup>
            </div>
          </div>
          <PerfectScrollbar className='chat-user-list-wrapper list-group' options={{ wheelPropagation: false }}>
            <h4 className='chat-list-title'>Chats</h4>
            <ul className='chat-users-list chat-list media-list'>{renderChats()}</ul>
          </PerfectScrollbar>
        </div>
      </div>
    </div>
  );
};

export default SidebarLeft;
