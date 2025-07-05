import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";

const SlidingBullets = ({
  data,
  className,
  spaceBetween,
  state,
}) => {
  return (
    <Swiper
      slidesPerView={"auto"}
      spaceBetween={spaceBetween || 8}
      className={className}
    >
      {(data || []).map((item, index) => (
        <SwiperSlide className={`!w-auto !flex-shrink-0 mr-2`} key={index}>
          {item ? (
            <Link
              to={`?${new URLSearchParams({ currentCategory: item })}`}
              replace
              className={`w-auto px-4 h-[35px] flex justify-center items-center rounded-full ${
                state == item
                  ? "bg-[#FCCB00] text-[#241D00] hover:bg-[#D4A900] hover:text-[#1C1600]"
                  : "bg-[#FFFFFF1A] text-[rgba(255,255,255,0.85)] hover:text-[rgba(255,255,255,1)] hover:bg-[#ffffff25]"
              } transition duration-[250ms] font-main font-[300] text-base capitalize`}
            >
              {item}
            </Link>
          ) : (
            <div className="w-[110px] h-[35px] opacity-0 pointer-events-none"></div>
          )}
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SlidingBullets;
