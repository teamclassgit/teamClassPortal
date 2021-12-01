// @packages
import classnames from 'classnames';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// @scripts
import Chat from './Chat';
import Sidebar from './SidebarLeft';
import UserProfileSidebar from './UserProfileSidebar';
import { useQuery } from '@apollo/client';
import { getUserData } from '../../utility/Utils';
import { getUserProfile, getChatContacts } from '../../redux/actions/chat';
import { isUserLoggedIn } from '@utils';
import queryAllMessageInteraction from '../../graphql/QueryAllMessageInteraction';

import '@styles/base/pages/app-chat.scss';
import '@styles/base/pages/app-chat-list.scss';

const AppChat = () => {
  const dispatch = useDispatch();
  const store = useSelector(state => state.chat);
  const [userData, setUserData] = useState(null);
  const [messageInfo, setMessageInfo] = useState([]);

  const { ...allMessageInteractionResults } = useQuery(queryAllMessageInteraction, {
    fetchPolicy: 'no-cache',
    variables: {
      filter: store
    },
    pollInterval: 5000
  });

  useEffect(() => {
    if (allMessageInteractionResults.data) {
      setMessageInfo(allMessageInteractionResults.data.messageInteractions.filter((message) => message.toId === userData?._id));
    }
  }, [allMessageInteractionResults.data]);

  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setUserData(getUserData()?.customData);
    }
  }, []);

  const [user, setUser] = useState({});
  const [sidebar, setSidebar] = useState(false);
  const [userSidebarRight, setUserSidebarRight] = useState(false);
  const [userSidebarLeft, setUserSidebarLeft] = useState(false);

  const handleSidebar = () => setSidebar(!sidebar);
  const handleUserSidebarLeft = () => setUserSidebarLeft(!userSidebarLeft);
  const handleUserSidebarRight = () => setUserSidebarRight(!userSidebarRight);
  const handleOverlayClick = () => {
    setSidebar(false);
    setUserSidebarRight(false);
    setUserSidebarLeft(false);
  };

  const handleUser = obj => setUser(obj);

  useEffect(() => {
    dispatch(getChatContacts());
    dispatch(getUserProfile());
  }, [dispatch]);

  return (
    <>
      <Sidebar
        store={store}
        userData={userData}
        sidebar={sidebar}
        messageInfo={messageInfo}
        setMessageInfo={setMessageInfo}
        handleSidebar={handleSidebar}
        userSidebarLeft={userSidebarLeft}
        handleUserSidebarLeft={handleUserSidebarLeft}
      />
      <div className='content-right'>
        <div className='content-wrapper'>
          <div className='content-body'>
            <div
              className={classnames('body-content-overlay', {
                show: userSidebarRight === true || sidebar === true || userSidebarLeft === true
              })}
              onClick={handleOverlayClick}
            ></div>
            <Chat
              store={store}
              handleUser={handleUser}
              handleSidebar={handleSidebar}
              userSidebarLeft={userSidebarLeft}
              handleUserSidebarRight={handleUserSidebarRight}
            />
            <UserProfileSidebar
              user={user}
              userSidebarRight={userSidebarRight}
              handleUserSidebarRight={handleUserSidebarRight}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AppChat;
