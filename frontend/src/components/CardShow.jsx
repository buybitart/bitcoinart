import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useResponsive from "../hooks/useResponsive";
import { toast } from "react-toastify";
import PriceLabel from "./PriceLabel";
import ImageLoader from "./ImageLoader";

const CardShow = ({ data, setCart, cart }) => {
  const { isSmallMobile, isMobile } = useResponsive();
  const [isAdded, setIsAdded] = useState(
    Boolean(cart.find((item) => item.hash === data.hash)),
  );
  const shortName = data.hash.split("-");
  const capitalizeShortName = shortName
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  function addToCart() {
    setIsAdded(true);
    const exsistedOne = cart.find((item) => item.hash === data.hash);
    toast.success(`"${capitalizeShortName}" Added to cart`);
    if (exsistedOne)
      return setCart(
        cart.map((item) =>
          item.hash === data.hash
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    else return setCart((prev) => [...prev, { ...data, quantity: 1 }]);
  }

  useEffect(() => {
    setIsAdded(Boolean(cart.find((item) => item.hash === data.hash)));
  }, [cart]);

  return (
    <section className="w-auto xl:min-w-[634px] h-auto xl:h-[32.5rem] xl:flex-row flex-col flex xl:items-end xl:gap-6 gap-3">
      <div className="w-[316px] sm:w-[376px] h-full rounded-xl border-[1px] border-[#FFFFFF1A] p-3.5 relative overflow-hidden bg-[#00000027] hover:bg-[#ffffff10] transition-colors duration-300 backdrop-blur-3xl flex flex-col justify-between lg:gap-0 gap-3 z-[0]">
        <Link
          to={`/shop/${data.hash}`}
          className="flex flex-col relative gap-3"
        >
          <ImageLoader
            src={data.images[0].optimized}
            draggable={false}
            alt={data.title}
            className="z-[1] relative h-[23.313rem] w-auto object-cover object-center rounded-[10px]"
          />

          <div className="flex flex-col w-full h-auto z-[1] font-main font-[400] text-sm">
            <div className="w-full h-auto flex justify-between items-center">
              <span className="text-[#BCBCBC]">Delivery:</span>{" "}
              {<span className="text-white">{data.delivery}</span>}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#BCBCBC]">Size (cm):</span>{" "}
              {<span className="text-white">{data.dimensions}</span>}
            </div>
          </div>
        </Link>
        <div className="w-full h-auto flex justify-between items-center z-[1] relative mt-2">
          <PriceLabel IsCardHash={data.hash} price={data.price} />
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
            } xl:hidden flex items-center rounded-[20px] font-main uppercase font-[600] gap-2 text-sm transition-[color,transform,background-color,width] duration-[250ms] group border-[1px] border-[#2c2c2e]`}
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
        </div>
      </div>
      <div className="flex flex-col w-auto gap-6 xl:px-0 px-1.5">
        <Link
          to={`/shop/${data.hash}`}
          className="max-w-[376px] xl:max-w-[17.125rem] h-auto font-main text-xl xl:text-2xl uppercase font-[600]"
        >
          {data.title}
        </Link>
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
          } xl:flex hidden items-center rounded-[20px] font-main uppercase font-[600] gap-2 text-sm transition-[color,transform,background-color,width] duration-[250ms] group border-[1px] border-[#2c2c2e]`}
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
      </div>
    </section>
  );
};

export default CardShow;
