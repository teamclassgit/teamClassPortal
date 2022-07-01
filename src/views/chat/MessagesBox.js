// @packages
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Spinner } from 'reactstrap';

// @scripts
import MessageList from './MessageList';
import { CONVERSATION_PAGE_SIZE } from './Constants';
import { getMessages } from './Apis';
import { useDispatch } from 'react-redux';

// @styles
import './MessagesBox.scss';
import { getUserData } from '../../utility/Utils';

export async function loadMessages (conversation, currentMessages = [], addMessage) {
  const convoSid = conversation?.sid;
  if (!(convoSid in currentMessages)) {
    const paginator = await getMessages(conversation);
    const messages = paginator?.items;
    addMessage(convoSid, messages);
  }
}

const MessagesBox = (props) => {
  const { messages, convo, loadingState, lastReadIndex, addMessage } = props;
  const [hasMore, setHasMore] = useState(messages?.length === CONVERSATION_PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [height, setHeight] = useState(0);
  const [paginator, setPaginator] = useState(null);
  const listRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!messages && convo && !loadingState) {
      loadMessages(convo, messages, addMessage);
    }
  }, [convo, messages, loadingState, addMessage]);

  useLayoutEffect(() => {
    const currentHeight = listRef.current?.clientHeight;
    if (currentHeight && currentHeight > height && loading) {
      setTimeout(() => {
        setHeight(currentHeight ?? 0);
        setLoading(false);
      }, 2000);
    }
  }, [listRef.current?.clientHeight]);

  useEffect(() => {
    getMessages(convo).then((paginator) => {
      setHasMore(paginator?.hasPrevPage);
      setPaginator(paginator);
    });
  }, [convo]);

  useEffect(() => {
    if (messages?.length && messages[messages.length - 1].index !== -1) {
      convo?.updateLastReadMessageIndex(messages[messages.length - 1].index);
    }
  }, [messages, convo]);

  const lastConversationReadIndex = useMemo(
    () => (messages?.length && messages[messages.length - 1].author !== getUserData()?.customData?.email ? lastReadIndex : -1),
    [lastReadIndex, messages]
  );

  const fetchMore = async () => {
    if (!paginator) {
      return;
    }

    const result = await paginator?.prevPage();
    if (!result) {
      return;
    }
    const moreMessages = result.items;

    setLoading(true);
    setPaginator(result);
    setHasMore(result.hasPrevPage);
    dispatch(addMessage(convo.sid, moreMessages));
  };

  return (
    <div className="messages-box" id="scrollable" key={convo.sid}>
      <InfiniteScroll
        className="scroll-container"
        dataLength={messages?.length ?? 0}
        hasMore={!loading && hasMore}
        inverse={true}
        loader={<Spinner size="12" title="Loading" />}
        next={fetchMore}
        scrollThreshold="20px"
        scrollableTarget="scrollable"
      >
        <div className="scroll-list" ref={listRef}>
          <MessageList
            userData={props.userData}
            messages={messages}
            status={props.status}
            conversation={convo}
            participants={props.participants}
            lastReadIndex={lastConversationReadIndex}
          />
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default MessagesBox;
