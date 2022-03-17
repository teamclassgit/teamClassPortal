// @packages
import Proptypes from 'prop-types';
import React, { useState } from 'react';
import { MessageSquare } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from '@apollo/client';

// @scripts
import { updateCurrentConversation, informationId, listConversations } from '../../redux/actions/chat';
import mutationCreateTwilioConversation from '../../graphql/conversations/createConversation';
import { Spinner } from 'reactstrap';

const StartConversation = ({ client, info }) => {
  const dispatch = useDispatch();
  const [createConversation] = useMutation(mutationCreateTwilioConversation);
  const [inProcess, setInProcess] = useState(false);

  const id = useSelector((state) => state.reducer.information.info);
  const sid = useSelector((state) => state.reducer.sid.sid);

  const updateConversations = async () => {
    if (client) {
      const currentId = id;
      const currentSid = sid;
      const conversations = await client?.getSubscribedConversations();
      dispatch(listConversations(conversations?.items ?? []));
      dispatch(updateCurrentConversation(null));
      dispatch(informationId(null));
      setTimeout(() => {
        dispatch(updateCurrentConversation(currentSid));
        dispatch(informationId(currentId));
      }, 500);
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
