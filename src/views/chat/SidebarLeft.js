// @packages
import Avatar from '@components/avatar';
import PerfectScrollbar from 'react-perfect-scrollbar';
import classnames from 'classnames';
import { X } from 'react-feather';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { 
  Button
} from 'reactstrap';

// @scripts
import ConversationTitleModal from "./ConversationTitleModal";
import ConversationsList from './ConversationsList';
import queryConversationsDetail from '../../graphql/QueryConversationsDetail';
import { addConversation } from "./Apis";
import SidebarInfo from './SidebarInfo';
import {
  updateCurrentConversation,
  addNotifications,
  updateParticipants
} from '../../redux/actions/chat';

const SidebarLeft = ({
  client,
  handleSidebar,
  handleUserSidebarLeft,
  sidebar,
  userData,
  userSidebarLeft
}) => {
  const [info, setInfo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState('online');

  const dispatch = useDispatch();

  const handleOpen = () => setIsModalOpen(true);

  const { ...allConversationsDetail } = useQuery(queryConversationsDetail, {
    fetchPolicy: 'no-cache',
    variables: {
      bookingId: '1'
    },
    pollInterval: 5000
  });

  useEffect(() => {
    if (allConversationsDetail.data) {
      setInfo(allConversationsDetail.data);
    }
  }, [allConversationsDetail.data]);

  useEffect(() => {
    setStatus(userData?.status);
  }, [userData]);

  return (
    <div className='sidebar-left'>
      <div className='sidebar'>
        <div
          className={classnames('chat-profile-sidebar', {
            show: userSidebarLeft
          })}
        >
          <SidebarInfo 
            handleUserSidebarLeft={handleUserSidebarLeft}
            userData={userData}
            status={status}
            setStatus={setStatus}
          />
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
                  content={(userData && userData['name']) || 'Uknown'} 
                  initials
                  status={status}
                />
              </div>
            </div>
          </div>
          <PerfectScrollbar className='chat-user-list-wrapper list-group' options={{ wheelPropagation: false }}>
            <h4 className='chat-list-title'>Chats</h4>
            <ConversationsList />
            <div className='button-fixed'>
              <Button
                className='btn btn-primary btn-block'
                color='primary' 
                onClick={handleOpen}
              >
                Create New Conversation
              </Button>
            </div>
            <ConversationTitleModal
              title=""
              type="new"
              isModalOpen={isModalOpen}
              onCancel={() => {
                setIsModalOpen(false);
              }}
              onSave={async (title) => {
                const convo = await addConversation(
                  title,
                  updateParticipants,
                  addNotifications,
                  client
                );
                setIsModalOpen(false);
                dispatch(updateCurrentConversation(convo.sid));
              }}
            />
          </PerfectScrollbar>
        </div>
      </div>
    </div>
  );
};

export default SidebarLeft;
