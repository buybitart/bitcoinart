import React from "react";
import { Link } from "react-router-dom";
import ImageLoader from "./ImageLoader";

const GalleryCard = ({ data }) => {
  return (
    <Link
      to={`/gallery/${data.hash}`}
      className="2xl:w-[390px] xl:w-[346px] w-full h-max flex flex-col gap-4 group"
    >
      <ImageLoader
        src={data.images[0].optimized}
        alt={data.title}
        className="w-full h-auto object-cover rounded-xl"
        draggable="false"
      />
      <div className="flex items-center w-full h-auto relative justify-between">
        <h4 className="max-w-[75%] font-main text-lg font-[500] leading-[21.6px] text-white uppercase line-clamp-2">
          {data.title}
        </h4>
        <button className="w-[33px] h-[33px] rounded-full group-hover:bg-[#fff] flex justify-center items-center transition-colors duration-300">
          <svg
            width="33"
            height="33"
            viewBox="0 0 33 33"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.99">
              <rect
                x="0.948742"
                y="1.20509"
                width="31.2353"
                height="31.2353"
                rx="15.6177"
                stroke="white"
                strokeWidth="0.764671"
              />
              <path
                d="M18.4084 11.47L23.5062 16.8227M23.5062 16.8227L18.4084 22.1754M23.5062 16.8227L11.2715 16.8227"
                className="stroke-white group-hover:stroke-black transition-colors duration-300"
                strokeWidth="1.14701"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </svg>
        </button>
      </div>
    </Link>
  );
};

export default GalleryCard;
