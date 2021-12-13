export const handlePromiseRejection = async (func, addNotifications) => {
  if (!addNotifications) {
    return;
  }
  try {
    await func();
  } catch {
    unexpectedErrorNotification(addNotifications);
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
