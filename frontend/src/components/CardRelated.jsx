import React from "react";
import { Link } from "react-router-dom";
import PriceLabel from "./PriceLabel";
import ImageLoader from "./ImageLoader";
import { getPrice } from "../utils";

const CardRelated = ({ data, noPrice, fixHeight, difRoute }) => {
  return (
    <Link
      to={difRoute ? `/${difRoute}/${data.hash}` : `/shop/${data.hash}`}
      className={`w-full h-full rounded-2xl relative overflow-hidden border-[1px] border-[#FFFFFF1A] flex flex-col ${
        fixHeight ? "" : "justify-between"
      } gap-4 bg-[#00000027] backdrop-blur-3xl transiton-[transform] duration-300 sm:p-5 p-3.5`}
    >
      <ImageLoader
        src={data.images[0].optimized}
        alt=""
        className={`w-full object-cover rounded-xl ${
          fixHeight ? "h-full max-h-[255px]" : "h-auto max-h-[355px]"
        }`}
        draggable="false"
      />
      <h2
        className={`font-main font-[600] 2xl:text-xl text-base text-white text-pretty uppercase mb-1 flex ${
          fixHeight ? "" : "flex-1"
        }`}
      >
        {data.title}
      </h2>
      {noPrice ? <></> : <PriceLabel price={getPrice(data.price, 4, "BTC")} />}
    </Link>
  );
};

export default CardRelated;
