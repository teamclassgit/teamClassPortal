// @packages
import Avatar from '@components/avatar';
import PerfectScrollbar from 'react-perfect-scrollbar';
import classnames from 'classnames';
import { X, Search } from 'react-feather';
import { formatDateToMonthShort } from '@utils';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { 
  Badge,
  Button,
  CardText,
  CustomInput,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from 'reactstrap';

// @scripts
import { selectChat } from '../../redux/actions/chat';
import mutationUpdateAllUsers from '../../graphql/MutationUpdateAllUsers';

// @styles
import styles from './SidebarLeft.module.scss';

const SidebarLeft = ({
  handleSidebar,
  handleUserSidebarLeft,
  messageInfo,
  sidebar,
  store,
  userData,
  userSidebarLeft
}) => {
  const { chats } = store;
  const dispatch = useDispatch();

  const [about, setAbout] = useState('');
  const [active, setActive] = useState({});
  const [filteredChat, setFilteredChat] = useState([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('online');
  const [updateAllUsers] = useMutation(mutationUpdateAllUsers, {});

  const allUsers = async () => {
    try {
      await updateAllUsers({
        variables: {
          description: about,
          email: userData.email,
          id: userData._id,
          name: userData.name,
          role: userData.role,
          status
        }
      });
    } catch (ex) {
      console.log(ex);
    }
  };

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
          return (
            <li
              className={classnames({
                active: active.type === 'chat' && active.id === item.id
              })}
              key={item.id}
              onClick={() => handleUserClick('chat', item.id)}
            >
              <ul>
                <div className={styles.container}>
                  <h6 className={styles.h6}>Booking: </h6>
                  <h6>1229291</h6>
                </div>
                <div className={styles.container}>
                  <h6 className={styles.h6}>Customer: </h6>
                  <h6>12292912</h6>
                </div>
                <div className={styles.container}>
                  <h6 className={styles.h6}>Class: </h6>
                  <h6>1229291212</h6>
                </div>
                <div className={styles.container}>
                  <h6 className={styles.h6}>Event Date: </h6>
                  <h6>1229291212811</h6>
                </div>
              </ul>
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
              <Avatar
                size= 'xl'
                className='avatar-border'
                color={`light-dark`} 
                content={(userData && userData['name']) || 'Uknown'} 
                initials
                status={status}
              />
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
                <span className='char-count'>{userData?.description ? userData?.description?.length : 0}</span>/ 120
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
              <Button 
                disabled={
                  about.length === userData?.description?.length || 
                  status === userData?.status
                }
                color='primary' 
                onClick={allUsers}
              >
                Save
              </Button>
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
                <Avatar
                  className='avatar-border'
                  color={`light-dark`} 
                  content={(userData && userData['name']) || 'Uknown'} 
                  initials
                  status={status}
                />
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
