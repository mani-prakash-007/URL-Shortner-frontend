import axios from "axios";
import React, { useState } from "react";
import { FaCopy, FaPaste } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { shortURLRequest } from "../../../Utils/urlRequestUtil";

export const UrlShortner = () => {
  //State
  const [shortURL, setShortURL] = useState();
  const [inputValue, setInputValue] = useState();

  //RegEx for URL
  const checkUrlRegex = (url) => {
    const urlPattern =
      /^(https?:\/\/)([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    return urlPattern.test(url);
  };

  //Handle Clipboard Copy
  const handleClipBoardCopy = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL Copied to Clipboard...", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error("URL Copy Failed", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  //Handle inputBox Click
  const handleInputBoxClick = (url) => {
    window.open(url, "_blank");
  };

  //Checking the URL is in active
  const isActiveURL = async (url) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}proxy?url=${encodeURIComponent(
          url
        )}`
      );
      return response.status == 200;
    } catch (error) {
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
        render: "Provide a Valid URL. Starting with 'https://' or 'http://' ",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      return;
    }
    const urlActive = await isActiveURL(url);
    if (!urlActive) {
      toast.update(toastId, {
        render: "Provided URL is not working..",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      return;
    }
    //Post Req to short the given url.
    const shortUrlResponse = await shortURLRequest(url); //Utils Function
    if (shortUrlResponse.data) {
      toast.update(toastId, {
        render: "Short URL Generation Success..",
        type: "Success",
        isLoading: false,
        autoClose: 3000,
      });
    } else {
      toast.update(toastId, {
        render: `Something went wrong`,
        type: "warning",
        isLoading: false,
        autoClose: 3000,
      });
    }
    setShortURL(shortUrlResponse.data);
  };
  return (
    <>
      <ToastContainer stacked />
      <div className="flex flex-col justify-center my-10 mx-5">
        <input
          className="border border-gray-300 px-4 py-3 lg:w-192 md:w-180 sm:w-120 w-96 rounded-xl my-8 focus:outline-none"
          type="text"
          placeholder="Enter a URL"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          required
        />
        <div className="flex justify-center mb-10">
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
        {shortURL && (
          <div className="border border-gray-200 py-5 px-3">
            <label htmlFor="">Short URL</label>
            <div className="flex items-center mt-3 mb-8">
              <input
                type="text"
                id="shortURL"
                name="shortURL"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  handleInputBoxClick(
                    `${import.meta.env.VITE_API_BASE_URL}${
                      shortURL.details.shortURL
                    }`
                  )
                }
                className="border border-gray-300 px-4 py-3 lg:w-180 md:w-168 sm:w-108 w-80 focus:outline-none rounded-l-xl hover:bg-gray-300"
                value={`${import.meta.env.VITE_API_BASE_URL}${
                  shortURL.details.shortURL
                }`}
                readOnly
              />
              <button
                onClick={() =>
                  handleClipBoardCopy(
                    `${import.meta.env.VITE_API_BASE_URL}${
                      shortURL.details.shortURL
                    }`
                  )
                }
                className="border border-gray-300 px-4 py-3 text-2xl rounded-r-xl active:scale-90"
              >
                <FaCopy />
              </button>
            </div>
            <label htmlFor="">Original URL</label>
            <div className="flex items-center  mt-3 mb-8">
              <input
                type="text"
                id="originalURL"
                name="originalURL"
                className="border border-gray-300 px-4 py-3 lg:w-180 md:w-168 sm:w-108 w-80 focus:outline-none rounded-l-xl"
                value={`${shortURL.details.originalURL}`}
                disabled
              />
              <button
                onClick={() =>
                  handleClipBoardCopy(shortURL.details.originalURL)
                }
                className="border border-gray-300 px-4 py-3 text-2xl rounded-r-xl active:scale-90"
              >
                <FaCopy />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
