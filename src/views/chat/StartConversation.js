// @packages
import Proptypes from 'prop-types';
import React from 'react';
import { MessageSquare } from "react-feather";
import { useDispatch } from 'react-redux';
import { useMutation } from '@apollo/client';

// @scripts
import { addConversation, addParticipant } from './Apis';
import { updateCurrentConversation, updateParticipants } from '../../redux/actions/chat';
import mutationCreateUserConversations from '../../graphql/MutationCreateUserConversations';

const StartConversation = ({ client, info }) => {
  const dispatch = useDispatch();

  const [createUserConversation] = useMutation(mutationCreateUserConversations);

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
      await addParticipant(
        info?.instructor?.email,
        nameProxy,
        true,
        convo
      );
    } catch (error) {
      console.log(error);
    }
  };

  const onSave = async () => {
    if (client && info) {
      try {
        const convo = await addConversation(
          info?._id,
          updateParticipants,
          client,
          dispatch
        );
        dispatch(updateCurrentConversation(convo?.sid));
        createUser(info?.instructor?.email, convo);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="chat-app-window">
      <div className="start-chat-area">
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

StartConversation.propTypes = {
  client: Proptypes.object,
  info: Proptypes.object
};

export default StartConversation;