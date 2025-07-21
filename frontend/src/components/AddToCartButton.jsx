import React from "react";
import useResponsive from "../hooks/useResponsive";

const AddToCartButton = ({ addToCart, isAdded }) => {
  const { isSmallMobile, isMobile } = useResponsive();
  return (
    <button
      onClick={addToCart}
      className={`py-[3px] px-2 ${
        isAdded
          ? isSmallMobile
            ? "w-[60px]"
            : "w-[96px]"
          : isMobile
          ? isSmallMobile
            ? "w-[60px]"
            : "w-[145px]"
          : "w-[145px]"
      } ${
        isAdded
          ? "bg-[#FCCB00] text-[#241D00] hover:bg-[#D4A900] hover:text-[#1C1600] pointer-events-none"
          : "bg-white text-black hover:bg-[#fff0] hover:text-[#ffffff]"
      } flex items-center rounded-[20px] font-main uppercase font-[600] gap-[9.5px] text-sm transition-[color,transform,background-color,width] duration-[250ms] group border-[1px] border-[#2c2c2e]`}
    >
      <img
        src="/bag.svg"
        alt="bag"
        className={`w-[24px] h-[24px] object-contain invert ${
          isAdded ? "" : "group-hover:invert-0"
        } transition duration-[250ms]`}
      />
      {isAdded ? (
        isSmallMobile ? (
          <span className="leading-[100%] relative left-[-2px]">✔</span>
        ) : (
          <span className="tracking-wide">Added</span>
        )
      ) : isSmallMobile ? (
        <span className="text-2xl leading-[100%] relative top-[-1px] left-[-2.5px]">
          +
        </span>
      ) : (
        <span className="tracking-wide">Add to cart</span>
      )}
    </button>
  );
};

export default AddToCartButton;
