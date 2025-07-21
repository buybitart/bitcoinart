import React from "react";
import { IoCheckmarkSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const SuccessPopup = () => {
  const navigate = useNavigate();

  const handleClick = () =>
    navigate(window.location.pathname, { replace: true });

  return (
    <section className="w-full max-w-[383px] h-full max-h-[260px] rounded-[32px] p-8 flex flex-col gap-10 bg-[#171717]">
      <div className="w-full h-auto flex flex-col gap-3 items-center relative">
        <button
          onClick={handleClick}
          className="w-[24px] h-[24px] absolute right-0 top-0 flex items-center justify-center group"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="group-hover:rotate-45 transition-transform duration-300"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.9998 13.4L7.0998 18.3C6.91647 18.4834 6.68314 18.575 6.3998 18.575C6.11647 18.575 5.88314 18.4834 5.6998 18.3C5.51647 18.1167 5.4248 17.8834 5.4248 17.6C5.4248 17.3167 5.51647 17.0834 5.6998 16.9L10.5998 12L5.6998 7.10005C5.51647 6.91672 5.4248 6.68338 5.4248 6.40005C5.4248 6.11672 5.51647 5.88338 5.6998 5.70005C5.88314 5.51672 6.11647 5.42505 6.3998 5.42505C6.68314 5.42505 6.91647 5.51672 7.0998 5.70005L11.9998 10.6L16.8998 5.70005C17.0831 5.51672 17.3165 5.42505 17.5998 5.42505C17.8831 5.42505 18.1165 5.51672 18.2998 5.70005C18.4831 5.88338 18.5748 6.11672 18.5748 6.40005C18.5748 6.68338 18.4831 6.91672 18.2998 7.10005L13.3998 12L18.2998 16.9C18.4831 17.0834 18.5748 17.3167 18.5748 17.6C18.5748 17.8834 18.4831 18.1167 18.2998 18.3C18.1165 18.4834 17.8831 18.575 17.5998 18.575C17.3165 18.575 17.0831 18.4834 16.8998 18.3L11.9998 13.4Z"
              className="fill-[#858585] group-hover:fill-white transition-colors duration-300"
            />
          </svg>
        </button>
        <div className="relative w-auto h-auto">
          <svg
            width="33"
            height="32"
            viewBox="0 0 33 32"
            fill="none"
            className="relative"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="0.5" width="32" height="32" rx="6" fill="#e8ffe0" />
          </svg>
          <IoCheckmarkSharp className="text-[#34dd00] text-lg absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <h2 className="font-main text-2xl leading-[28.8px] text-white tracking-wide font-[600] text-center">
          Your account activated!
        </h2>
        <p className="text-center font-main font-[300] text-sm leading-[16.8px] text-[#A2A2A2]">
          Thank you! Your account was activated successfully. Now you can bid on
          auctions.
        </p>
      </div>

      <div className="w-full h-auto flex flex-col gap-4 relative">
        <button
          onClick={handleClick}
          className="bg-[#ffffff] hover:opacity-85 transition-opacity duration-300 h-[40px] rounded-[20px] py-[10px] px-6 font-main text-black text-base leading-[19.2px] tracking-wide font-[500]"
        >
          Cancel
        </button>
      </div>
    </section>
  );
};

export default SuccessPopup;
