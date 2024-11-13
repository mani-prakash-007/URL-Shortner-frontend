import axios from "axios";

export const shortURLRequest = async (url) => {
  try {
    const shortUrlResponse = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}url/`,
      {
        url: url,
      }
    );
    return shortUrlResponse.data;
  } catch (error) {
    if (error.response.status == 409) {
      return error.response;
    }
    return error;
  }
};
