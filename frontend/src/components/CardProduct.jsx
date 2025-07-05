import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useResponsive from "../hooks/useResponsive";
import { toast } from "react-toastify";
import PriceLabel from "./PriceLabel";
import AddToCartButton from "./AddToCartButton";
import { MdArrowOutward } from "react-icons/md";
import { getPrice } from "../utils";
import ImageLoader from "./ImageLoader";
import Duration from "../utils/Duration";

const CardProduct = ({ data, setCart, cart, auction, priceType }) => {
  const { isSmallMobile } = useResponsive();
  const [isAdded, setIsAdded] = useState(cart.find((item) => item.hash === data.hash));
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
            : item
        )
      );
    else return setCart((prev) => [...prev, { ...data, quantity: 1 }]);
  }

  useEffect(() => {
    setIsAdded(Boolean(cart.find((item) => item.hash === data.hash)));
  }, [cart, auction]);

  return (
    <>
      <div className="w-full h-full rounded-xl p-3.5 relative overflow-hidden border-[1px] border-[#FFFFFF1A] hover:bg-[#ffffff10] transition-colors duration-300 flex flex-col justify-between gap-3 bg-[#00000027] backdrop-blur-3xl">
        <Link
          to={auction ? `/auction/${data.hash}` : `/shop/${data.hash}`}
          className="flex flex-col relative gap-3"
        >
          {auction ? (
            <>
              <div className="w-[28px] h-[28px] absolute bg-[#000000] flex items-center justify-center z-[2] left-2.5 top-2.5 rounded-full p-1 border-[1px] border-[#000000]">
                <svg
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`invert brightness-0 transition duration-[250ms] relative left-[1px] top-[-1px]`}
                >
                  <path
                    d="M12.0001 14.506L5.84411 21.733C5.64833 21.9609 5.40759 22.1459 5.13699 22.2764C4.86639 22.4069 4.57176 22.4801 4.27154 22.4915C3.97132 22.5028 3.672 22.4521 3.39231 22.3424C3.11263 22.2327 2.85861 22.0664 2.64617 21.8539C2.43374 21.6415 2.26746 21.3875 2.15775 21.1078C2.04805 20.8281 1.99729 20.5288 2.00864 20.2286C2.01999 19.9284 2.09322 19.6337 2.22373 19.3631C2.35425 19.0925 2.53924 18.8518 2.76711 18.656L9.99411 12.5M22.0001 12.405L15.9051 18.5M12.0951 2.5L6.00011 8.595M11.3331 3.262L6.76211 7.833C6.76211 7.833 9.04811 10.881 11.3331 13.167C13.6191 15.452 16.6671 17.738 16.6671 17.738L21.2381 13.167C21.2381 13.167 18.9521 10.119 16.6671 7.833C14.3811 5.548 11.3331 3.262 11.3331 3.262Z"
                    stroke="#241D00"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="w-auto text-[12px] font-main font-[300] h-[24px] absolute bg-[#000000] flex items-center tracking-wide justify-center z-[2] right-2.5 top-2.5 leading-[100%] rounded-full px-2.5 border-[1px] border-[#000000]">
                <Duration endTime={data.endTime} />
              </div>
            </>
          ) : (
            <></>
          )}
          <ImageLoader
            src={data.images[0].optimized}
            alt={data.title}
            draggable={false}
            className="z-[1] relative h-[23.313rem] w-full object-cover object-center rounded-md"
          />

          <h2 className="z-[1] font-main font-[600] text-lg uppercase">
            {data.title}
          </h2>
        </Link>

        <div className="w-full h-auto flex justify-between items-center z-[1] relative mt-2">
          <PriceLabel
            auction
            priceType={priceType}
            IsCardHash={data.hash}
            price={
              priceType === "BTC"
                ? auction
                  ? data.currentPrice !== 0
                    ? getPrice(data.currentPrice, 4, priceType)
                    : getPrice(data.minPrice, 4, priceType)
                  : getPrice(data.price, 4, priceType)
                : priceType === "USD"
                ? getPrice(data.usdPrice, 2, priceType)
                : null
            }
          />
          {auction ? (
            <Link
              to={`/auction/${data.hash}`}
              className="flex items-center justify-center py-[3px] px-2 h-[32px] pr-2.5 bg-white text-black hover:bg-[#fff0] hover:text-[#ffffff] rounded-[20px] font-main uppercase font-[600] gap-2 text-sm transition-[color,transform,background-color,width] duration-[250ms] group border-[1px] border-[#2c2c2e]"
            >
              <MdArrowOutward className="text-lg" />{" "}
              {isSmallMobile ? "" : "Place bid"}
            </Link>
          ) : (
            <AddToCartButton addToCart={addToCart} isAdded={isAdded} />
          )}
        </div>
      </div>
    </>
  );
};

export default CardProduct;
