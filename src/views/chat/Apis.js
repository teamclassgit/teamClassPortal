import axios from "axios";

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