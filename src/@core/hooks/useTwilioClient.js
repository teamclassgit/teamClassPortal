// @packages
import { Client, Conversation } from '@twilio/conversations';
import { isUserLoggedIn } from '@utils';
import { useQuery, useMutation } from '@apollo/client';
import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// @scripts
import mutationTokenConversations from '../../graphql/MutationTokenConversations';
import queryAllBookings from '../../graphql/QueryGetBookingsWithCriteria';
import { getUserData } from '../../utility/Utils';
import { handlePromiseRejection } from '../../views/chat/helpers';
import { getConversationParticipants } from '../../views/chat/Apis';
import {
  addMessages,
  addNotifications,
  endTyping,
  informationId,
  listConversations,
  addConversation,
  removeConversation,
  removeMessages,
  startTyping,
  updateCurrentConversation,
  updateLoadingState,
  updateParticipants,
  updateUnreadMessages
} from '../../redux/actions/chat';

const useTwilioClient = () => {
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
      value: getUserData()?.customData?.coordinatorId
    }
  ];

  const defaultSort = { dir: -1, id: 'updatedAt', name: 'updatedAt', type: 'date' };

  const [conversationsClient, setConversationsClient] = useState(null);
  const [data, setData] = useState(null);
  const [infoDetails, setInfoDetails] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [isInfoReady, setIsInfoReady] = useState(false);
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userDataEmail, setUserDataEmail] = useState('');
  const [mainFilter, setMainFilter] = useState([...defaultFilter]);
  const [searchFilter, setSearchFilter] = useState([]);
  const [limit, setLimit] = useState(30);
  const [updateTokenConversations] = useMutation(mutationTokenConversations);
  const conversations = useSelector((state) => state.reducer.convo);
  const dispatch = useDispatch();

  useQuery(queryAllBookings, {
    fetchPolicy: 'cache-and-network',
    pollInterval: 120000,
    variables: {
      filterBy: mainFilter,
      filterByOr: searchFilter,
      limit,
      offset: 0,
      sortBy: defaultSort
    },
    onCompleted: (data) => {
      console.log(data);
      if (data) setInfoDetails(
          data.getBookingsWithCriteria.rows.map((element) => {
            return {
              _id: element._id,
              createdAt: element.createdAt,
              status: element.status,
              customer: {
                _id: element.customerId,
                name: element.customerName,
                email: element.customerEmail,
                phone: element.customerPhone,
                company: element.customerCompany
              },
              classTitle: element.className,
              classOption: element.classVariant.title,
              attendees: element.attendees,
              coordinator: {
                name: element.eventCoordinatorName,
                email: element.eventCoordinatorName
              },
              instructor: {
                name: element.instructorName
              },
              eventDateTime: element.eventDateTime,
              timezone: element.timezone,
              timezoneLabel: element.timezoneLabel,
              updatedAt: element.updatedAt
            };
          })
        );
    }
  });

  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setUserData(getUserData()?.customData);
      setUserDataEmail(getUserData()?.customData?.email);
      localStorage.setItem('username', getUserData()?.customData?.email);
      updateToken();
    }
  }, []);

  const updateToken = async () => {
    try {
      const tokenInfo = await updateTokenConversations({
        variables: {
          identity: getUserData()?.customData?.email
        }
      });

      const newToken = tokenInfo?.data?.creatingAccessTokenTwilio?.token;

      if (newToken) {
        if (conversationsClient) conversationsClient.updateToken(newToken);
        else {
          const clientOptions = {}; //{ logLevel: 'debug' };
          const newClient = new Client(newToken, clientOptions);
          newClient.onWithReplay('stateChanged', (state) => {
            console.log(state);
            //dispatch(updateLoadingState(true));

            if (state === 'initialized') {
              //dispatch(updateLoadingState(false));

              newClient.addListener('conversationRemoved', (conversation) => {
                dispatch(updateCurrentConversation(''));
                dispatch(informationId(''));
                handlePromiseRejection(() => {
                  dispatch(removeConversation(conversation.sid));
                  dispatch(updateParticipants([], conversation.sid));
                }, dispatch(addNotifications));
              });

              newClient.addListener('conversationUpdated', async ({ conversation }) => {
                handlePromiseRejection(
                  () => updateConvoList(newClient, conversation, listConversations, addMessages, updateUnreadMessages),
                  addNotifications
                );
              });

              newClient.addListener('messageAdded', (event) => {
                addMessage(event, addMessages, updateUnreadMessages);
              });

              newClient.addListener('participantLeft', (participant) => {
                handlePromiseRejection(() => handleParticipantsUpdate(participant, updateParticipants), addNotifications);
              });

              newClient.addListener('participantUpdated', (event) => {
                handlePromiseRejection(() => handleParticipantsUpdate(event.participant, updateParticipants), addNotifications);
              });

              newClient.addListener('participantJoined', (participant) => {
                handlePromiseRejection(() => handleParticipantsUpdate(participant, updateParticipants), addNotifications);
              });

              newClient.addListener('messageUpdated', ({ message }) => {
                handlePromiseRejection(
                  () => updateConvoList(newClient, message.conversation, listConversations, addMessages, updateUnreadMessages),
                  addNotifications
                );
              });

              newClient.addListener('messageRemoved', (message) => {
                handlePromiseRejection(() => removeMessagesUpdate(message.conversation.sid, message, dispatch, removeMessages), addNotifications);
              });

              newClient.addListener('tokenExpired', () => {
                updateToken();
              });

              newClient.addListener('tokenAboutToExpire', () => {
                updateToken();
              });

              newClient.addListener('conversationAdded', async (conversation) => {
                conversation.addListener('typingStarted', (participant) => {
                  handlePromiseRejection(() => updateTypingIndicator(participant, conversation.sid, startTyping), addNotifications);
                });

                conversation.addListener('typingEnded', (participant) => {
                  handlePromiseRejection(() => updateTypingIndicator(participant, conversation.sid, endTyping), addNotifications);
                });

                handlePromiseRejection(async () => {
                  if (conversation.status === 'joined') {
                    const result = await getConversationParticipants();
                    dispatch(updateParticipants(result, conversation.sid));
                  }

                  updateConvoList(newClient, conversation, listConversations, addMessages, updateUnreadMessages);
                }, dispatch(addNotifications));
              });
            }
            if (state === 'failed') {
              dispatch(updateLoadingState(false));
            }
          });

          setConversationsClient(newClient);
        }
        setToken(newToken);
        localStorage.setItem('token', token);
      } else console.log("Token can't be created/updated ", error);
    } catch (error) {
      console.log("Token can't be created/updated ", error);
    }
  };

  const newConversation = (item) => conversations?.find((convo) => item?._id === convo?.channelState?.friendlyName || item?.customer?._id === convo?.channelState?.friendlyName);

  const updateConvoList = async (client, conversation, listConversations, addMessages, updateUnreadMessages) => {
    if (!client) return;

    const messages = await conversation.getMessages(1);
    dispatch(addMessages(conversation.sid, messages?.items || []));

    loadUnreadMessagesCount(conversation, updateUnreadMessages);

    dispatch(addConversation(conversation));
  };

  const updateTypingIndicator = (participant, sid, callback) => {
    const {
      attributes: { friendlyName },
      identity
    } = participant;
    if (identity === localStorage.getItem('username')) {
      return;
    }
    callback(sid, identity || friendlyName || '');
  };

  const removeMessagesUpdate = (convo, messages, dispatch, removeMessages) => {
    dispatch(removeMessages(convo, [messages]));
  };

  const loadUnreadMessagesCount = async (convo, updateUnreadMessages) => {
    const count = await convo.getUnreadMessagesCount();
    dispatch(updateUnreadMessages(convo.sid, count ?? 0));
  };

  const addMessage = async (message, addMessages, updateUnreadMessages) => {
    handlePromiseRejection(() => {
      if (sidRef.current === message?.conversation?.sid) {
        message?.conversation?.updateLastReadMessageIndex(message?.index);
      }
      dispatch(addMessages(message?.conversation?.sid, [message]));
      loadUnreadMessagesCount(message?.conversation, updateUnreadMessages);
    }, dispatch(addNotifications));
  };

  const handleParticipantsUpdate = async (participant, updateParticipants) => {
    const result = await getConversationParticipants(participant.conversation);
    dispatch(updateParticipants(result, participant.conversation.sid));
  };

  useEffect(() => {
    if (conversations !== undefined && conversations !== null) {
      setTimeout(() => {
        setIsInfoReady(false);
      }, 2000);

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
      }, 2000);
    }
  }, [infoDetails, conversations]);

  useEffect(() => {
    if (!inputValue) setSearchFilter([]);
    else setSearchFilter([
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
  }, [inputValue]);

  return useMemo(() => {
    if (userData?.coordinatorId) {
      return {
        client: conversationsClient,
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
    } else return {};
  }, [userData, conversationsClient, data, token]);
};

export default useTwilioClient;
