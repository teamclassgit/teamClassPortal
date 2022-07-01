// @packages
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @scripts
import ConversationContainer from './ConversationsContainer';
import SidebarLeft from './SidebarLeft';
import SidebarRight from './SidebarRight';
import useTwilioClient from '../../@core/hooks/useTwilioClient';
import { informationId, updateCurrentConversation } from '../../redux/actions/chat';
// @styles
import '@styles/base/pages/app-chat-list.scss';
import '@styles/base/pages/app-chat.scss';

const AppChat = () => {
  const [sidebar, setSidebar] = useState(false);
  const [status, setStatus] = useState('online');
  const [userSidebarLeft, setUserSidebarLeft] = useState(false);
  const { client, data, inputValue, setInputValue, isInfoReady, userData } = useTwilioClient();
  const [selectedBooking, setSelectedBooking] = useState(null);

  const id = useSelector((state) => state.reducer.information.info);
  const sid = useSelector((state) => state.reducer.sid.sid);
  const conversations = useSelector((state) => state.reducer.convo);
  const sidRef = useRef('');
  const IdRef = useRef('');
  sidRef.current = sid;
  IdRef.current = id;

  const dispatch = useDispatch();
  const handleSidebar = () => setSidebar(!sidebar);
  const handleUserSidebarLeft = () => setUserSidebarLeft(!userSidebarLeft);

  useEffect(() => {
    dispatch(updateCurrentConversation(null));
    dispatch(informationId(null));
  }, [inputValue]);

  const openedConversation = useMemo(() => conversations?.find((convo) => convo?.sid === sid), [conversations, sid]);
  const openedConversationInfo = useMemo(() => data?.find((convo) => convo?.sid === sid), [data, sid]);
  const openedNotConversations = useMemo(() => data?.find((convo) => convo?._id === id), [data, id]);

  if (client === null || client === undefined) {
    return null;
  }

  return (
    <>
      <SidebarLeft
        handleSidebar={handleSidebar}
        handleUserSidebarLeft={handleUserSidebarLeft}
        isInfoReady={isInfoReady}
        status={status}
        setStatus={setStatus}
        setInputValue={setInputValue}
        sidebar={sidebar}
        userData={userData}
        userSidebarLeft={userSidebarLeft}
        selectedBooking={selectedBooking}
        setSelectedBooking={setSelectedBooking}
      />
      <div className="content-right">
        <div className="content-wrapper">
          <div className="content-body">
            <ConversationContainer
              client={client}
              userData={userData}
              status={status}
              conversation={openedConversation}
              info={data}
              id={selectedBooking}
              openedConversationInfo={openedConversationInfo}
              openedNotConversations={openedNotConversations}
            />
          </div>
        </div>
      </div>
      {/*selectedBooking && client && <SidebarRight client={client} id={selectedBooking} />*/}
    </>
  );
};

export default AppChat;
