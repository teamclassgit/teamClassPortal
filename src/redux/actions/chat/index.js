import axios from 'axios';

export const getUserProfile = () => {
  return dispatch => {
    return axios.get('/chat/users/profile-user').then(res => {
      return dispatch({
        type: 'GET_USER_PROFILE',
        userProfile: res.data
      });
    });
  };
};

export const getChatContacts = () => {
  return dispatch => {
    axios.get('/chat/chats-and-contacts').then(res => {
      dispatch({
        type: 'GET_CHAT_CONTACTS',
        data: res.data
      });
    });
  };
};

export const selectChat = id => {
  return dispatch => {
    axios.get('/chat/get-chat', { id }).then(res => {
      dispatch({ type: 'SELECT_CHAT', data: res.data });
      dispatch(getChatContacts());
    });
  };
};

export const sendMsg = obj => {
  return dispatch => {
    axios.post('/chat/send-msg', { obj }).then(res => {
      dispatch({ type: 'SEND_MSG', data: res.data });
      dispatch(selectChat(obj.contact.id));
    });
  };
};
