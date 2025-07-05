import React from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import Input from "./Input";
import { inputCSS } from "../utils";

const Filters = ({ isSticky, min, max, onInputChange, priceType }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <motion.div
      initial={{ opacity: 0, y: 25, visibility: "hidden" }}
      animate={{ opacity: 1, y: 0, visibility: "visible" }}
      exit={{ opacity: 0, y: 25, visibility: "hidden" }}
      transition={{ duration: 0.25 }}
      style={{ willChange: "opacity, visibility, transform" }}
      className={`w-full xl:max-w-[300px] max-w-[calc(100%-32px)] h-auto pb-5 shadow-xl flex flex-col gap-4 bg-[#000000] fixed z-[5] xl:right-[6.25rem] right-[16px] ${
        isSticky ? "top-[113px] sm:top-[135px]" : "top-[247px]"
      } border-[1px] border-t-0 border-[#ffffff10] rounded-b-xl p-4`}
    >
      <div className="flex flex-col gap-2 w-full h-auto">
        <div className="flex gap-1.5 justify-between items-center w-full h-auto">
          <h4 className="font-main text-lg font-[400] tracking-wide">Price</h4>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask
              id="mask0_853_6636"
              style={{ maskType: "luminance" }}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="24"
              height="24"
            >
              <path d="M0 0H24V24H0V0Z" fill="white" />
            </mask>
            <g mask="url(#mask0_853_6636)">
              <path
                d="M11.3851 15.275C12.4961 15.271 14.9251 15.262 14.8971 13.717C14.8701 12.137 12.5371 12.232 11.4001 12.279C11.2721 12.285 11.1614 12.2887 11.0681 12.29L11.1201 15.277C11.1961 15.275 11.2844 15.2744 11.3851 15.275ZM11.2671 10.922C12.1941 10.921 14.2171 10.919 14.1931 9.51403C14.1671 8.07703 12.2241 8.16203 11.2751 8.20403C11.1684 8.20936 11.0757 8.2127 10.9971 8.21403L11.0441 10.923L11.2671 10.922Z"
                fill="white"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.09616 23.641C15.5262 25.244 22.0382 21.331 23.6412 14.903C25.2442 8.47399 21.3302 1.96199 14.9002 0.359994C8.47416 -1.24401 1.96216 2.66999 0.360165 9.09999C-1.24284 15.528 2.67017 22.04 9.09717 23.642M13.3792 6.62199C15.1332 6.74599 16.5292 7.25999 16.7122 8.86399C16.8482 10.038 16.3682 10.753 15.5892 11.167C16.8892 11.455 17.7142 12.21 17.5842 13.938C17.4232 16.083 15.8362 16.686 13.5582 16.857L13.5962 19.107L12.2402 19.131L12.2012 16.911C11.8505 16.9177 11.4892 16.9203 11.1172 16.919L11.1572 19.149L9.80116 19.173L9.76116 16.919L9.37817 16.922C9.1835 16.922 8.98816 16.924 8.79216 16.928L7.02617 16.958L7.26717 15.334C7.26717 15.334 8.27116 15.332 8.25317 15.317C8.63717 15.309 8.73417 15.032 8.75517 14.858L8.69316 11.3L8.79016 11.298H8.83617C8.7884 11.2922 8.74027 11.2899 8.69217 11.291L8.64816 8.75099C8.59116 8.47699 8.40716 8.16099 7.85816 8.17099C7.87316 8.15099 6.87217 8.18799 6.87217 8.18799L6.84617 6.73999L8.71817 6.70799V6.71499C9.00016 6.70966 9.28783 6.70099 9.58117 6.68899L9.54317 4.45999L10.8992 4.43699L10.9372 6.62099C11.2992 6.60799 11.6632 6.59399 12.0202 6.58799L11.9822 4.41799L13.3392 4.39399L13.3792 6.62199Z"
                fill="white"
              />
            </g>
          </svg>
        </div>
        <div className="flex gap-3 items-center w-full justify-between">
          <Input
            className={inputCSS}
            placeholder="min."
            onChange={onInputChange}
            name={"min"}
            defaultValue={min ? min : ""}
            type="text"
          />
          -
          <Input
            className={inputCSS}
            placeholder="max."
            onChange={onInputChange}
            name={"max"}
            defaultValue={max ? max : ""}
            type="text"
          />
        </div>
      </div>

      <div className="w-full h-auto flex flex-col gap-2">
        {["BTC", "USD"].map((category) => (
          <label
            key={category}
            className="relative flex items-center cursor-pointer justify-between select-none"
          >
            <input
              defaultChecked={category === priceType}
              className="sr-only peer"
              name="futuristic-radio"
              type="radio"
              onChange={() => setSearchParams({ priceType: category })}
            />
            <span className="text-white font-main text-base tracking-wide font-[300]">
              {category}
            </span>
            <div className="w-4 h-4 relative left-[-4px] bg-transparent outline outline-1 outline-offset-2 outline-[#909090] rounded-full peer-checked:bg-white peer-checked:outline-[#909090] peer-hover:shadow-lg transition duration-300 ease-in-out" />
          </label>
        ))}
      </div>
    </motion.div>
  );
};

export default Filters;
