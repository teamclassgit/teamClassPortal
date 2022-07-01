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
  /*  const defaultFilter = [
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

  const defaultSort = { dir: -1, id: 'updatedAt', name: 'updatedAt', type: 'date' }; */

  const [client, setClient] = useState(null);
  const [data, setData] = useState(null);
  //const [infoDetails, setInfoDetails] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [isInfoReady, setIsInfoReady] = useState(true);
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  //const [mainFilter, setMainFilter] = useState([...defaultFilter]);
  //const [searchFilter, setSearchFilter] = useState([]);
  //const [limit, setLimit] = useState(30);
  const [updateTokenConversations] = useMutation(mutationTokenConversations);
  const conversations = useSelector((state) => state.reducer.convo);
  const dispatch = useDispatch();

  /*  useQuery(queryAllBookings, {
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
  });*/

  useEffect(() => {
    setUserData(getUserData()?.customData);
    updateToken();
    return () => {
      client?.removeAllListeners();
    };
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
        if (client) client.updateToken(newToken);
        else {
          const clientOptions = { logLevel: 'debug' };
          const client = new Client(newToken, clientOptions);
          setClient(client);

          client.on('stateChanged', (state) => {
            console.log(state);
          });
          //dispatch(updateLoadingState(true));
          client.on('conversationAdded', async (conversation) => {
            conversation.on('typingStarted', (participant) => {
              handlePromiseRejection(() => updateTypingIndicator(participant, conversation.sid, startTyping), addNotifications);
            });

            conversation.on('typingEnded', (participant) => {
              handlePromiseRejection(() => updateTypingIndicator(participant, conversation.sid, endTyping), addNotifications);
            });

            handlePromiseRejection(async () => {
              if (conversation.status === 'joined') {
                const result = await getConversationParticipants();
                dispatch(updateParticipants(result, conversation.sid));
              }

              updateConvoList(client, conversation, listConversations, addMessages, updateUnreadMessages);
            }, dispatch(addNotifications));
          });

          client.on('conversationRemoved', (conversation) => {
            dispatch(updateCurrentConversation(''));
            dispatch(informationId(''));
            handlePromiseRejection(() => {
              dispatch(removeConversation(conversation.sid));
              dispatch(updateParticipants([], conversation.sid));
            }, dispatch(addNotifications));
          });

          client.on('conversationUpdated', async ({ conversation }) => {
            handlePromiseRejection(
              () => updateConvoList(client, conversation, listConversations, addMessages, updateUnreadMessages),
              addNotifications
            );
          });

          client.on('messageAdded', (event) => {
            addMessage(event, addMessages, updateUnreadMessages);
          });

          client.on('participantLeft', (participant) => {
            handlePromiseRejection(() => handleParticipantsUpdate(participant, updateParticipants), addNotifications);
          });

          client.on('participantUpdated', (event) => {
            handlePromiseRejection(() => handleParticipantsUpdate(event.participant, updateParticipants), addNotifications);
          });

          client.on('participantJoined', (participant) => {
            handlePromiseRejection(() => handleParticipantsUpdate(participant, updateParticipants), addNotifications);
          });

          client.on('messageUpdated', ({ message }) => {
            handlePromiseRejection(
              () => updateConvoList(client, message.conversation, listConversations, addMessages, updateUnreadMessages),
              addNotifications
            );
          });

          client.on('messageRemoved', (message) => {
            handlePromiseRejection(() => removeMessagesUpdate(message.conversation.sid, message, dispatch, removeMessages), addNotifications);
          });

          client.on('tokenExpired', () => {
            updateToken();
          });

          client.on('tokenAboutToExpire', () => {
            updateToken();
          });

          /*    if (state === 'initialized') {
            }
            if (state === 'failed') {
            }
          }); */

          dispatch(updateLoadingState(false));
        }
        setToken(newToken);
        //localStorage.setItem('token', token);
      } else console.log("Token can't be created/updated ", error);
    } catch (error) {
      console.log("Token can't be created/updated ", error);
    }
  };

  const updateConvoList = async (client, conversation, listConversations, addMessages, updateUnreadMessages) => {
    if (!client) return;

    const messages = await conversation.getMessages(1);
    dispatch(addMessages(conversation.sid, messages?.items || []));

    loadUnreadMessagesCount(conversation, updateUnreadMessages);

    //dispatch(addConversation(conversation));

    const subscribedConversations = await client.getSubscribedConversations();
    dispatch(listConversations(subscribedConversations.items));
  };

  const updateTypingIndicator = (participant, sid, callback) => {
    const {
      attributes: { friendlyName },
      identity
    } = participant;
    if (identity === getUserData()?.customData?.email) {
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

  /* useEffect(() => {
    if (infoDetails) {
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
  }, [infoDetails]);*/

  /*  useEffect(() => {
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
  }, [inputValue]); */

  return {
    client,
    data,
    isInfoReady,
    inputValue,
    setInputValue,
    userData
  };
};

export default useTwilioClient;
