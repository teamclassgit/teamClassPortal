// @packages
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { Spinner } from "reactstrap";
import InfiniteScroll from "react-infinite-scroll-component";

// @scripts
import MessageList from "./MessageList";
import { CONVERSATION_PAGE_SIZE } from "./Constants";
import { getMessages } from "./Apis";

// @styles
import styles from "./chatStyles/chatStyles.module.scss";

export async function loadMessages (
  conversation,
  currentMessages = [],
  addMessage
) {
  const convoSid = conversation.sid;
  if (!(convoSid in currentMessages)) {
    const paginator = await getMessages(conversation);
    const messages = paginator.items;
    addMessage(convoSid, messages);
  }
}

const MessagesBox = (props) => {
  const { messages, convo, loadingState, lastReadIndex, addMessage } = props;
  const [hasMore, setHasMore] = useState(
    messages?.length === CONVERSATION_PAGE_SIZE
  );
  const [loading, setLoading] = useState(false);
  const [height, setHeight] = useState(0);
  const [paginator, setPaginator] = useState(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (!messages && convo && !loadingState) {
      loadMessages(convo, messages, addMessage);
    }
  }, []);

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
      setHasMore(paginator.hasPrevPage);
      setPaginator(paginator);
    });
  }, [convo]);

  useEffect(() => {
    if (messages?.length && messages[messages.length - 1].index !== -1) {
      convo.updateLastReadMessageIndex(messages[messages.length - 1].index);
    }
  }, [messages, convo]);

  const lastConversationReadIndex = useMemo(
    () => (messages?.length &&
      messages[messages.length - 1].author !== localStorage.getItem("username")
      ? lastReadIndex
      : -1),
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
    addMessage(convo.sid, moreMessages);
  };

  return (
    <div
      key={convo.sid}
      id="scrollable"
      style={{
        display: "flex",
        flexDirection: "column-reverse",
        width: "100%",
        position: 'relative',
        overflow: "scroll",
        overflowX: "hidden",
        marginTop: 50,
        height: "100%"
      }}
    >
      <InfiniteScroll
        dataLength={messages?.length ?? 0}
        next={fetchMore}
        hasMore={!loading && hasMore}
        loader={
          <div className={styles.paginationSpinner}>
            <Spinner decorative={false} size={'12'} title="Loading" />
          </div>
        }
        scrollableTarget="scrollable"
        style={{
          display: "flex",
          overflow: "hidden",
          flexDirection: "column-reverse",
          height: "200%"
        }}
        inverse={true}
        scrollThreshold="20px"
      >
        <div ref={listRef} style={{ overflow: "scroll", overflowY: "hidden", height: '110%' }}>
          <MessageList
            messages={messages}
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
