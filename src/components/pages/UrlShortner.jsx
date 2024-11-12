import React, { useState } from "react";
import { FaPaste } from "react-icons/fa";
import { ToastContainer } from "react-toastify";

export const UrlShortner = () => {
  //State
  const [originalURL, setOriginalURL] = useState();
  return (
    <div className="flex flex-col justify-center my-10 mx-5">
      <ToastContainer />
      <input
        className="border border-gray-300 px-4 py-3 lg:w-192 md:w-180 sm:w-120 w-96 rounded-xl my-8 focus:outline-none"
        type="text"
        required
      />
      <div className="flex justify-center">
        <button className="border border-gray-300 px-3 py-1 mx-3 rounded-lg active:scale-95">
          <FaPaste className="text-xl" />
        </button>
        <button className="border border-gray-300 px-3 py-1 mx-3 rounded-lg active:scale-90">
          Generate URL
        </button>
      </div>
    </div>
  );
};
