import axios from "axios";
import React, { useState } from "react";
import { FaPaste } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const UrlShortner = () => {
  //State
  const [shortURL, setShortURL] = useState();
  const [inputValue, setInputValue] = useState();

  //RegEx for URL
  const checkUrlRegex = (url) => {
    const urlPattern =
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    return urlPattern.test(url);
  };

  //Checking the URL is in active
  const isActiveURL = async (url) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}proxy?url=${encodeURIComponent(
          url
        )}`
      );

      console.log(response);
      return response.status == 200;
    } catch (error) {
      console.log("Error Checking URL : ", error);
      return false;
    }
  };

  //Handle clipboard Paste
  const handleClipboardPaste = async () => {
    const text = await navigator.clipboard.readText();
    if (text) {
      setInputValue(text);
    } else {
      toast.error("Error Occured on pasting...", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  //Handle Submit
  const handleSubmit = async (url) => {
    console.log(url);
    const toastId = toast.loading("Generating Short URL...", {
      position: "top-right",
    });
    if (url.length == 0) {
      toast.update(toastId, {
        render: "Please Enter a URL",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      return;
    }
    const validUrl = checkUrlRegex(url);
    if (!validUrl) {
      toast.update(toastId, {
        render: "Provide a Valid URL. Starting with 'https://' ",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      return;
    }
    const urlActive = await isActiveURL(url);
    console.log("handle Click : ", urlActive);
    if (!urlActive) {
      toast.update(toastId, {
        render: "Provided URL is not working..",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      return;
    } else {
      toast.update(toastId, {
        render: "URL is Working",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };
  return (
    <>
      <ToastContainer />
      <div className="flex flex-col justify-center my-10 mx-5">
        <input
          className="border border-gray-300 px-4 py-3 lg:w-192 md:w-180 sm:w-120 w-96 rounded-xl my-8 focus:outline-none"
          type="text"
          placeholder="Enter a URL"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          required
        />
        <div className="flex justify-center">
          <button
            onClick={handleClipboardPaste}
            className="border border-gray-300 px-3 py-1 mx-3 rounded-lg active:scale-95"
          >
            <FaPaste className="text-xl" />
          </button>
          <button
            onClick={() => handleSubmit(inputValue)}
            className="border border-gray-300 px-3 py-1 mx-3 rounded-lg active:scale-90"
          >
            Generate URL
          </button>
        </div>
      </div>
    </>
  );
};
