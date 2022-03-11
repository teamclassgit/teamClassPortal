// @packages
import Proptypes from 'prop-types';
import React, { useState } from 'react';
import { MessageSquare } from 'react-feather';
import { useDispatch } from 'react-redux';
import { useMutation } from '@apollo/client';

// @scripts
import { addConversation, addParticipant } from './Apis';
import { updateCurrentConversation, informationId, updateParticipants, listConversations } from '../../redux/actions/chat';
import mutationCreateTwilioConversation from '../../graphql/conversations/createConversation';
import { Spinner } from 'reactstrap';

const StartConversation = ({ client, info }) => {
  const dispatch = useDispatch();
  const [createConversation] = useMutation(mutationCreateTwilioConversation);
  const [inProcess, setInProcess] = useState(false);

  const createUser = async (identity, convo) => {
    try {
      await createUserConversation({
        variables: {
          identity
        }
      });
      await participants(convo);
    } catch (error) {
      console.log(error);
    }
  };

  const participants = async (convo) => {
    const nameProxy = '';
    try {
      await addParticipant(info?.instructor?.email, nameProxy, true, convo);
    } catch (error) {
      console.log(error);
    }
  };

  const onSave = async () => {
    if (client && info) {
      try {
        const convo = await addConversation(info?._id, updateParticipants, client, dispatch);
        dispatch(updateCurrentConversation(convo?.sid));
        createUser(info?.instructor?.email, convo);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const updateConversations = async () => {
    if (client) {
      const conversations = await client?.getSubscribedConversations();
      dispatch(listConversations(conversations?.items ?? []));
      dispatch(updateCurrentConversation(null));
      dispatch(informationId(null));
    }
  };

  const onCreateNewConversation = async () => {
    if (client && info?._id) {
      setInProcess(true);
      const bookingId = info?._id;
      try {
        const result = await createConversation({ variables: { bookingId } });
        updateConversations();
      } catch (error) {
        console.log(error);
      }
      setInProcess(false);
    }
  };

  return (
    <div className="chat-app-window">
      <div className="start-chat-area">
        <div className="start-chat-icon mb-1">
          <MessageSquare />
        </div>
        {client && info?._id && !inProcess && (
          <div onClick={onCreateNewConversation}>
            <h4 className="sidebar-toggle start-chat-text">Start Conversation</h4>
          </div>
        )}
        {inProcess && <Spinner />}
      </div>
    </div>
  );
};

StartConversation.propTypes = {
  client: Proptypes.object,
  info: Proptypes.object
};

export default StartConversation;
