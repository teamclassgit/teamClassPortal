// @packages
import { Client } from '@twilio/conversations';
import { isUserLoggedIn } from '@utils';
import { useQuery, useMutation } from '@apollo/client';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// @scripts
import mutationTokenConversations from '../../graphql/MutationTokenConversations';
import queryConversationsDetail from '../../graphql/QueryConversationsDetail';
import { getUserData } from '../../utility/Utils';
import { handlePromiseRejection } from '../../views/chat/helpers';
import { getConversationParticipants } from '../../views/chat/Apis';
import { addMessages, addNotifications, listConversations, updateUnreadMessages, updateParticipants } from '../../redux/actions/chat';

const useTwilioClient = () => {
  const [client, setClient] = useState(null);
  const [data, setData] = useState(null);
  const [infoDetails, setInfoDetails] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [isInfoReady, setIsInfoReady] = useState(false);
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userDataEmail, setUserDataEmail] = useState('');

  const [updateTokenConversations] = useMutation(mutationTokenConversations);

  const conversations = useSelector((state) => state.reducer.convo);

  const dispatch = useDispatch();

  localStorage.setItem('username', userDataEmail);
  localStorage.setItem('token', token);

  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setUserData(getUserData()?.customData);
      setUserDataEmail(getUserData()?.customData?.email);
    }
  }, []);

  useEffect(() => {
    if (token) {
      const cli = new Client(token);
      setClient(cli);
    }
  }, [token]);

  const updateToken = async () => {
    try {
      const newToken = await updateTokenConversations({
        variables: {
          identity: userDataEmail
        }
      });
      setToken(newToken?.data?.creatingAccessTokenTwilio?.token);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    updateToken();
  }, [client]);

  console.log({
    bookingIds: conversations?.map((convo) => convo?.friendlyName),
    userId: userData?._id,
    searchText: inputValue,
    limit: client?.connectionState === 'connecting' ? 0 : 50
  });

  useQuery(queryConversationsDetail, {
    fetchPolicy: 'no-cache',
    variables: {
      bookingIds: conversations?.map((convo) => convo?.friendlyName),
      userId: userData?._id,
      searchText: inputValue,
      limit: client?.connectionState === 'connecting' ? 0 : 50
    },
    onCompleted: (conversationDetails) => {
      setInfoDetails(conversationDetails?.getConversationsDetails);
    },
    pollInterval: 200000
  });

  const newConversation = (item) => conversations?.find((convo) => item?._id === convo?.channelState?.friendlyName || item?.customer?._id === convo?.channelState?.friendlyName);

  useEffect(() => {
    if (conversations !== undefined && conversations !== null) {
      const dataWithConversations = infoDetails?.map((item) => {
        const newConv = newConversation(item);
        if (newConv !== undefined) {
          return {
            ...item,
            ...newConv
          };
        } else {
          return item;
        }
      });
      const dataSorted = dataWithConversations?.sort((a, b) => {
        return (b.channelState?.lastMessage?.dateCreated || b.dateUpdated) - (a.channelState?.lastMessage?.dateCreated || a.dateUpdated);
      });
      setData(dataSorted);
      setTimeout(() => {
        setIsInfoReady(true);
      }, 6000);
    }
  }, [conversations, infoDetails]);

  useEffect(() => {
    if (client) {
      client.on('stateChanged', (state) => {
        if (state === 'initialized') {
          updateConversations(client);
          client.addListener('conversationAdded', async (conversation) => {
            handlePromiseRejection(async () => {
              if (conversation.status === 'joined') {
                const result = await getConversationParticipants();
                dispatch(updateParticipants(result, conversation.sid));
              }

              updateConvoList(client, conversation, listConversations, addMessages, updateUnreadMessages);
            }, addNotifications);
          });

          client.addListener('conversationUpdated', async ({ conversation }) => {
            handlePromiseRejection(
              () => updateConvoList(client, conversation, listConversations, addMessages, updateUnreadMessages),
              addNotifications
            );
          });
        }
      });

      client.addListener('tokenExpired', () => {
        updateToken();
      });

      client.addListener('tokenAboutToExpire', () => {
        updateToken();
      });

      return () => {
        client?.removeAllListeners();
      };
    }
  }, [client]);

  const updateConvoList = async (client, conversation, listConversations, addMessages, updateUnreadMessages) => {
    if (conversation.status === 'joined') {
      const messages = await conversation.getMessages();
      dispatch(addMessages(conversation.sid, messages.items));
    } else {
      dispatch(addMessages(conversation.sid, []));
    }

    loadUnreadMessagesCount(conversation, updateUnreadMessages);

    const subscribedConversations = await client.getSubscribedConversations();

    dispatch(listConversations(subscribedConversations.items));
  };

  const loadUnreadMessagesCount = async (convo, updateUnreadMessages) => {
    const count = await convo.getUnreadMessagesCount();
    dispatch(updateUnreadMessages(convo.sid, count ?? 0));
  };

  const updateConversations = async (client) => {
    if (client) {
      const conversations = await client?.getSubscribedConversations();
      dispatch(listConversations(conversations?.items ?? []));
    }
  };

  return {
    client,
    conversations,
    data,
    infoDetails,
    isInfoReady,
    inputValue,
    setInputValue,
    token,
    userData,
    userDataEmail
  };
};

export default useTwilioClient;
