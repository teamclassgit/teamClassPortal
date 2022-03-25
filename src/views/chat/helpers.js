export const handlePromiseRejection = async (func, addNotifications) => {
  try {
    await func();
  } catch (e) {
    console.log(e);
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
        variant: "error"
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

export const getTypingMessage = (typingData) => (typingData.length > 1
  ? `${`${typingData.length  } participants are typing...`}`
  : `${`${typingData[0]  } is typing...`}`);

export const successNotification = ({
  message,
  addNotifications
}) => {
  if (!addNotifications) {
    return;
  }
  pushNotification(
    [
      {
        message,
        variant: "success"
      }
    ],
    addNotifications
  );
};
