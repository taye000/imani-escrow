import React from "react";

const Loading = () => {
  return (
    <main>
      <div className="flex-col gap-4 w-full flex items-center justify-center">
        <div className="w-28 h-28 border-8 text-blue-800 text-4xl animate-spin border-gray-300 flex items-center justify-center border-t-blue-800 rounded-full">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            height="1em"
            width="1em"
            className="animate-ping"
          >
            <path d="/imanilogo.png"></path>
          </svg>
        </div>
      </div>
    </main>
  );
};

export default Loading;
