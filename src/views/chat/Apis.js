// @scripts
import { CONVERSATION_PAGE_SIZE } from "./Constants";
import { MessageStatus } from "../../redux/reducers/chat/messageListReducer";
import { getUserData } from "../../utility/Utils";

export const getConversationParticipants = async (conversation) => await conversation.getParticipants();

// @GetAddConversation
export async function addConversation (name, updateParticipants, client, dispatch) {
  if (name.length > 0 && client !== undefined) {
    try {
      const conversation = await client.createConversation({
        friendlyName: name
      });
      await conversation.join();
      addParticipant(conversation, client, dispatch);
      const participants = await getConversationParticipants(conversation);
      dispatch(updateParticipants(participants, conversation.sid));

      return conversation;
    } catch (e) {
      console.log(e);
      return Promise.reject("Error creating conversation");
    }
  }
  return Promise.reject("Error");
}

export const getFileUrl = async (media) => {
  return await media.getContentTemporaryUrl().then();
};

// @GetBlobFile
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
    return Promise.reject("Unexpected error");
  }
};

// @GetMessageStatus
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
      participant.identity === getUserData()?.customData?.email ||
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

// @GetMessages
export const getMessages = async (
  conversation
) => await conversation.getMessages(CONVERSATION_PAGE_SIZE);

// @AddParticipant
export async function addParticipant (
  name,
  proxyName,
  chatParticipant,
  convo
) {
  if (chatParticipant && name.length > 0 && convo !== undefined) {
    try {
      const result = await convo.add(name);
      console.log("success");
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
      console.log("success");
      return result;
    } catch (e) {
      console.log(e);
      return Promise.reject(e);
    }
  }
  return Promise.reject("Error");
}

// @RemoveParticipant
export const removeParticipant = async (
  conversation,
  participant
) => {
  try {
    await conversation.removeParticipant(participant);
    console.log("success");
  } catch (e) {
    console.log(e);
    return Promise.reject("Error");
  }
};