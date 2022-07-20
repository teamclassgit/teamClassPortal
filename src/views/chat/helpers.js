export const handlePromiseRejection = async (func, addNotifications) => {
  if (!addNotifications) {
    return;
  }
  try {
    await func();
  } catch (e) {
    console.log(e, func);
    return Promise.reject('Unexpected error');
  }
};

export const unexpectedErrorNotification = (addNotifications) => {
  if (!addNotifications) {
    return;
  }
  pushNotification(
    [
      {
        message: 'Unexpected error',
        variant: 'error'
      }
    ],
    addNotifications
  );
};

export const pushNotification = (messages, func) => {
  if (func) {
    func(
      messages.map(({ variant, message }) => ({
        variant,
        message,
        id: new Date().getTime(),
        dismissAfter: 'never'
      }))
    );
  }
};

export const getTypingMessage = (typingData) => {
  return typingData.length > 1 ? `${`${typingData.length} participants are typing...`}` : `${`${typingData[0]} is typing...`}`;
};

export const successNotification = ({ message, addNotifications }) => {
  if (!addNotifications) {
    return;
  }
  pushNotification(
    [
      {
        message,
        variant: 'success'
      }
    ],
    addNotifications
  );
};
