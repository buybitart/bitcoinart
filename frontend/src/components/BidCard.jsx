import React from "react";
import { formatInstagramDate, getPrice } from "../utils";
import { FaCrown } from "react-icons/fa";

const BidCard = ({ data, username, index, isFullyDisabled }) => {
  const timeAgo = formatInstagramDate(data.date);
  const isCurrent = data.user.name === username;
  return (
    <div className="w-full h-[50px] flex items-center justify-between relative font-main bg-[#212121] rounded-xl py-[10px] px-3">
      <div className="flex w-auto h-auto gap-1.5">
        <div className={`font-[300] text-white/75 leading-[19.2px] text-base`}>
          <span className={`${isCurrent && "text-yellow-400/75"}`}>
            {data.user.name}
          </span>{" "}
          •
        </div>
        <span className="font-[400] text-white leading-[19.2px] text-base">
          {getPrice(data.amount, 4, "BTC")}
        </span>
        {(index === 0 && isFullyDisabled) && (
          <span className="font-[300] text-yellow-400/75 leading-[19.2px] text-sm ml-1 flex items-center justify-center">
            <FaCrown />
          </span>
        )}
      </div>
      <span className="text-[#707070] font-[300] text-base leading-[19.2px] line-clamp-1 sm:max-w-none max-w-[85.15px]">
        {timeAgo}
      </span>
    </div>
  );
};

export default BidCard;
