// @packages
import Proptypes from 'prop-types';
import React, { useState } from 'react';
import { MessageSquare } from 'react-feather';
import { useDispatch } from 'react-redux';
import { useMutation } from '@apollo/client';

// @scripts
import mutationCreateTwilioConversation from '../../graphql/conversations/createConversation';
import { Spinner } from 'reactstrap';

const StartConversation = ({ client, info }) => {
  const dispatch = useDispatch();
  const [createConversation] = useMutation(mutationCreateTwilioConversation);
  const [inProcess, setInProcess] = useState(false);

  const onCreateNewConversation = async () => {
    if (client && info?._id) {
      setInProcess(true);
      const bookingId = info?._id;
      try {
        await createConversation({ variables: { bookingId } });
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
