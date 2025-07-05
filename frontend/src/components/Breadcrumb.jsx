import React from "react";
import { Link, useParams } from "react-router-dom";

const Breadcamp = ({ auction, difRoute }) => {
  const { hash } = useParams();
  return (
    <div className="w-auto h-auto flex items-center gap-2 font-main text-base leading-[19.2px] font-[400]">
      <Link
        to="/"
        className="text-[#AAAAAA] hover:text-[#fff] transition-colors duration-[250ms]"
      >
        Home
      </Link>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <mask
          id="mask0_552_744"
          style={{ maskType: "alpha" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_552_744)">
          <path
            d="M12.6 12L8 7.4L9.4 6L15.4 12L9.4 18L8 16.6L12.6 12Z"
            fill="#AAAAAA"
          />
        </g>
      </svg>
      {difRoute ? (
        <Link
          to={`/${difRoute.toLowerCase()}`}
          className="text-[#AAAAAA] hover:text-[#fff] transition-colors duration-[250ms]"
        >
          {difRoute}
        </Link>
      ) : (
        <Link
          to="/shop"
          className="text-[#AAAAAA] hover:text-[#fff] transition-colors duration-[250ms]"
        >
          Shop
        </Link>
      )}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <mask
          id="mask0_552_744"
          style={{ maskType: "alpha" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_552_744)">
          <path
            d="M12.6 12L8 7.4L9.4 6L15.4 12L9.4 18L8 16.6L12.6 12Z"
            fill="#AAAAAA"
          />
        </g>
      </svg>
      <span className="capitalize text-[#fff] line-clamp-1">
        {hash.split("-").join(" ")} {auction ? "(Auction)" : ""}
      </span>
    </div>
  );
};

export default Breadcamp;
