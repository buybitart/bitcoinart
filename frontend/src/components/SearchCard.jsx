import React from "react";
import { Link } from "react-router-dom";
import ImageLoader from "./ImageLoader";

const SearchCard = ({ data, type }) => {
  return (
    <Link
      to={`/${type}/${data.hash}`}
      className="w-full h-full flex flex-col p-2.5 gap-2.5 rounded-2xl group border-[1px] border-[#FFFFFF1A]"
    >
      <div className="w-full h-auto relative rounded-xl overflow-hidden">
        <ImageLoader
          src={data.images[0].optimized}
          alt={data.title}
          className="h-full w-full object-cover object-center rounded-xl pointer-events-none group-hover:scale-105 transition-[opacity,transform] duration-300"
        />
      </div>
      <h4 className="font-main font-[600] text-lg uppercase">{data.title}</h4>
    </Link>
  );
};

export default SearchCard;
