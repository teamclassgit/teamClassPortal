// @packages
import React, { useState, useContext, useMemo } from "react";
import { useSelector } from "react-redux";
// @scripts
import ConversationContainer from "./ConversationsContainer";
import SidebarLeft from "./SidebarLeft";
import SidebarRight from "./SidebarRight";
import { TwilioContext } from "../../context/TwilioContext/TwilioContext";
// @styles
import "@styles/base/pages/app-chat-list.scss";
import "@styles/base/pages/app-chat.scss";

const AppChat = () => {
  const [sidebar, setSidebar] = useState(false);
  const [status, setStatus] = useState("online");
  const [userSidebarLeft, setUserSidebarLeft] = useState(false);
  const { twilioClient } = useContext(TwilioContext);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const customer = useSelector((state) => state.reducer.information.info);
  const sid = useSelector((state) => state.reducer.sid.sid);
  const conversations = useSelector((state) => state.reducer.convo);
  const openedConversation = useMemo(() => conversations?.find((convo) => convo?.sid === sid), [conversations, sid]);

  const handleSidebar = () => setSidebar(!sidebar);
  const handleUserSidebarLeft = () => setUserSidebarLeft(!userSidebarLeft);

  if (twilioClient === null || twilioClient === undefined) {
    return null;
  }

  return (
    <>
      <SidebarLeft
        client={twilioClient}
        handleSidebar={handleSidebar}
        handleUserSidebarLeft={handleUserSidebarLeft}
        status={status}
        setStatus={setStatus}
        sidebar={sidebar}
        userSidebarLeft={userSidebarLeft}
        selectedBooking={selectedBooking}
        setSelectedBooking={setSelectedBooking}
      />
      <div className="content-right">
        <div className="content-wrapper">
          <div className="content-body">
            <ConversationContainer client={twilioClient} status={status} customer={customer} conversation={openedConversation} />
          </div>
        </div>
      </div>
    </>
  );
};

export default AppChat;
