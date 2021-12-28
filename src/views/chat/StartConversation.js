// @packages
import React from 'react';
import classnames from 'classnames';
import { MessageSquare } from "react-feather";
import { useDispatch } from 'react-redux';

// @scripts
import { addConversation } from './Apis';
import {
  updateCurrentConversation,
  updateParticipants
} from '../../redux/actions/chat';

const StartConversation = ({
  client,
  info
}) => {
  const dispatch = useDispatch();

  const onSave = async () => {
    const convo = await addConversation(
      info?._id,
      updateParticipants,
      client,
      dispatch
    );
    dispatch(updateCurrentConversation(convo?.sid));
  };

  return (
    <div className="chat-app-window">
      <div className={classnames('start-chat-area')}>
        <div className="start-chat-icon mb-1" >
          <MessageSquare />
        </div>
        <div onClick={onSave}>
          <h4 className='sidebar-toggle start-chat-text'>Start Conversation</h4>
        </div>
      </div>
    </div>
  );

};

export default StartConversation;