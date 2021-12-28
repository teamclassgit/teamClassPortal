// @packages
import axios from "axios";

// @scripts
import {
  CONVERSATION_MESSAGES,
  CONVERSATION_PAGE_SIZE,
  PARTICIPANT_MESSAGES,
  UNEXPECTED_ERROR_MESSAGE
} from "./Constants";
import { MessageStatus } from '../../redux/reducers/chat/messageListReducer';

export const getToken = async (username, password) => {
  const requestAddress = process.env.REACT_APP_ACCESS_TOKEN_SERVICE_URL;

  try {
    const response = await axios.get(requestAddress, {
      params: { identity: username, password }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error?.response?.status === 401) {
      return Promise.reject(error);
    }

    return Promise.reject(`ERROR received from ${requestAddress}: ${error}\n`);
  }
};

export const getConversationParticipants = async (conversation) => await conversation.getParticipants();

export async function addConversation (name, updateParticipants, client, dispatch) {
  if (name.length > 0 && client !== undefined) {
    try {
      const conversation = await client.createConversation({
        friendlyName: name
      });
      await conversation.join();

      const participants = await getConversationParticipants(conversation);
      dispatch(updateParticipants(participants, conversation.sid));

      return conversation;
    } catch (e) {
      console.log(e);
      return Promise.reject('Error creating conversation');
    }
  }
  return Promise.reject('Error');
}

export const getFileUrl = async (media) => {
  return await media.getContentTemporaryUrl().then();
};

export const getBlobFile = async (
  media,
  addNotifications
) => {
  try {
    const url = await getFileUrl(media);
    const response = await fetch(url);
    return response.blob();
  } catch (e) {
    console.log(e);
    return Promise.reject('Unexpected error');
  }
};

export async function getMessageStatus (
  conversation,
  message,
  channelParticipants
) {
  const statuses = {
    [MessageStatus.Delivered]: 0,
    [MessageStatus.Read]: 0,
    [MessageStatus.Failed]: 0,
    [MessageStatus.Sending]: 0
  };

  if (message.index === -1) {
    return Promise.resolve({
      ...statuses,
      [MessageStatus.Sending]: 1
    });
  }

  channelParticipants.forEach((participant) => {
    if (
      participant.identity === localStorage.getItem("username") ||
      participant.type !== "chat"
    ) {
      return;
    }

    if (
      participant.lastReadMessageIndex &&
      participant.lastReadMessageIndex >= message.index
    ) {
      statuses[MessageStatus.Read] += 1;
    } else if (participant.lastReadMessageIndex !== -1) {
      statuses[MessageStatus.Delivered] += 1;
    }
  });

  if (message.aggregatedDeliveryReceipt) {
    const receipts = await message.getDetailedDeliveryReceipts();
    receipts.forEach((receipt) => {
      if (receipt.status === "read") {
        statuses[MessageStatus.Read] += 1;
      }

      if (receipt.status === "delivered") {
        statuses[MessageStatus.Delivered] += 1;
      }

      if (receipt.status === "failed" || receipt.status === "undelivered") {
        statuses[MessageStatus.Failed] += 1;
      }

      if (receipt.status === "sent" || receipt.status === "queued") {
        statuses[MessageStatus.Sending] += 1;
      }
    });
  }

  return statuses;
}

export const getMessages = async (
  conversation
) => await conversation.getMessages(CONVERSATION_PAGE_SIZE);

export async function addParticipant (
  name,
  proxyName,
  chatParticipant,
  convo
) {
  if (chatParticipant && name.length > 0 && convo !== undefined) {
    try {
      const result = await convo.add(name);
      console.log('success');
      return result;
    } catch (e) {
      return Promise.reject(e);
    }
  }
  if (
    !chatParticipant &&
    name.length > 0 &&
    proxyName.length > 0 &&
    convo !== undefined
  ) {
    try {
      const result = await convo.addNonChatParticipant(proxyName, name, {
        friendlyName: name
      });
      successNotification({
        message: 'Participant added'
      });

      return result;
    } catch (e) {
      console.log(e);

      return Promise.reject(e);
    }
  }
  return Promise.reject('Error');
}

export const removeParticipant = async (
  conversation,
  participant
) => {
  console.log(participant);
  console.log(conversation);
  try {
    await conversation.removeParticipant(participant);
    console.log('success');
  } catch (e) {
    console.log(e);
    return Promise.reject('Error');
  }
};