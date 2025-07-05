import React from "react";
import { Link } from "react-router-dom";

const PriceLabel = ({
  IsCardHash,
  price,
  difColor,
  auction,
  admRes,
  priceType,
  smaller
}) => {
  if (IsCardHash)
    return (
      <Link
        to={auction ? `/auction/${IsCardHash}` : `/shop/${IsCardHash}`}
        className={`flex w-max ${
          admRes ? "h-[28px] sm:h-[32px]" : "h-[32px]"
        } rounded-[20px] p-1 pr-2.5 gap-1 items-center z-[1] relative ${
          difColor ? "" : "bg-[#2c2c2e]"
        }`}
        style={difColor ? { backgroundColor: difColor } : null}
      >
        {priceType === "BTC" ? (
          <img
            src={"/btcIcon.png"}
            alt="icon Btc"
            className={
              admRes
                ? "w-[20px] h-[20px] sm:w-[24px] sm:h-[24px]"
                : "w-[24px] h-[24px]"
            }
          />
        ) : priceType === "USD" ? (
          <img
            src={"/usdIcon.png"}
            alt="icon Usd"
            className={
              admRes
                ? "w-[20px] h-[20px] sm:w-[24px] sm:h-[24px]"
                : "w-[24px] h-[24px]"
            }
          />
        ) : (
          <img
            src={"/btcIcon.png"}
            alt="icon Btc"
            className={
              admRes
                ? "w-[20px] h-[20px] sm:w-[24px] sm:h-[24px]"
                : "w-[24px] h-[24px]"
            }
          />
        )}
        <span className="font-main font-[400]">{price}</span>
      </Link>
    );
  else
    return (
      <div
        className={`flex w-max ${
          admRes ? "h-[25px] sm:h-[32px]" : "h-[32px]"
        } rounded-[20px] p-1 pr-2.5 gap-1 items-center z-[1] relative ${
          difColor ? "" : "bg-[#2c2c2e]"
        }`}
        style={difColor ? { backgroundColor: difColor } : null}
      >
        {priceType === "BTC" ? (
          <img
            src={"/btcIcon.png"}
            alt="icon Btc"
            className={
              admRes
                ? "w-[20px] h-[20px] sm:w-[24px] sm:h-[24px]"
                : "w-[24px] h-[24px]"
            }
          />
        ) : priceType === "USD" ? (
          <img
            src={"/usdIcon.png"}
            alt="icon Usd"
            className={
              admRes
                ? "w-[20px] h-[20px] sm:w-[24px] sm:h-[24px]"
                : "w-[24px] h-[24px]"
            }
          />
        ) : (
          <img
            src={"/btcIcon.png"}
            alt="icon Btc"
            className={
              admRes
                ? "w-[20px] h-[20px] sm:w-[24px] sm:h-[24px]"
                : "w-[24px] h-[24px]"
            }
          />
        )}
        <span
          className={`font-main font-[400] ${
            admRes ? "text-sm sm:text-base" : "text-base"
          }`}
        >
          {price}
        </span>
      </div>
    );
};

export default PriceLabel;
