// @packages
import Proptypes from 'prop-types';
import React, { useState } from 'react';
import { MessageSquare } from 'react-feather';
import { useDispatch } from 'react-redux';
import { useMutation } from '@apollo/client';
import { informationId, updateCurrentConversation } from '../../redux/actions/chat';
// @scripts
import mutationCreateTwilioConversation from '../../graphql/conversations/MutationCreateConversation';
import { Spinner } from 'reactstrap';

const StartConversation = ({ client, customer }) => {
  const dispatch = useDispatch();
  const [createConversation] = useMutation(mutationCreateTwilioConversation);
  const [inProcess, setInProcess] = useState(false);

  const onCreateNewConversation = async () => {
    if (client && customer) {
      setInProcess(true);
      try {
        await createConversation({ variables: { bookingId: customer.bookingId } });
        dispatch(updateCurrentConversation(null));
        dispatch(informationId(null));
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
        {client && customer && !inProcess && (
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
  customerId: Proptypes.string
};

export default StartConversation;
