import React, { useEffect, useState } from "react";
import useResponsive from "../hooks/useResponsive";
import { useAnimate, usePresence } from "framer-motion";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ImageLoader from "./ImageLoader";
import { getPrice } from "../utils";

const CartItem = ({ data, cart, setCart, index, popupClose }) => {
  const [qty, setQty] = useState(data.quantity);
  const { isSmallMobile } = useResponsive();
  const [isPresent, safeToRemove] = usePresence();
  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (qty !== data.quantity) setQty(data.quantity);
  }, [data.quantity]);

  useEffect(() => {
    const curr = cart.findIndex((product) => data.hash === product.hash);
    const newVersion = {
      ...cart[curr],
      quantity: qty,
    };

    setCart(cart.map((item, index) => (index === curr ? newVersion : item)));
  }, [qty]);

  function removeFromCart() {
    setCart(cart.filter((item) => item.hash !== data.hash));
  }

  useEffect(() => {
    if (!isPresent) {
      const exitAnimation = async () => {
        await animate(
          scope.current,
          {
            opacity: 0,
            x: -24,
          },
          {
            delay: index * 0.15,
          }
        );
        safeToRemove();
      };

      exitAnimation();
    } else {
      const enterAnimation = async () => {
        await animate(
          scope.current,
          {
            opacity: [0, 1],
            x: [-24, 0],
          },
          {
            delay: index * 0.15,
          }
        );
      };

      enterAnimation();
    }
  }, [isPresent]);

  return (
    <motion.div
      ref={scope}
      layout
      className="w-full sm:h-[258px] h-auto flex sm:flex-row flex-col sm:gap-8 gap-3"
    >
      <div className="w-full h-auto flex sm:gap-8 gap-2">
        <Link to={`/shop/${data.hash}`} onClick={popupClose}>
          <ImageLoader
          containerStyles={`w-full h-full`}
            src={data.images[0].optimized}
            alt=""
            className={`sm:w-full w-auto sm:max-w-[225px] sm:h-full ${
              isSmallMobile
                ? "h-[120px] max-w-[100px]"
                : "h-[148px] max-w-[129px]"
            } object-cover rounded-xl`}
          />
        </Link>

        <div className="flex flex-col w-full sm:py-5 gap-8 h-full flex-1">
          <div className="w-full h-auto flex justify-between">
            <h3
              className={`font-main uppercase font-[500] ${
                isSmallMobile ? "text-sm" : "text-base"
              } sm:text-xl leading-6 sm:max-w-[75%] max-w-[85%] sm:tracking-wider text-pretty`}
            >
              {data.title}
            </h3>

            <button
              className="w-[24px] h-[24px] object-contain flex items-center justify-center relative top-0.5"
              onClick={removeFromCart}
            >
              <img
                src="/delete.svg"
                alt="delete"
                className="w-full h-full object-contain"
              />
            </button>
          </div>

          <div className="w-full h-auto flex flex-col gap-2 relative">
            <div className="flex items-center sm:justify-between w-full h-auto sm:gap-0 gap-2">
              <span
                className={`font-main font-[300] ${
                  isSmallMobile ? "text-xs" : "text-sm"
                } leading-4 text-[#BCBCBC]`}
              >
                Delivery:
              </span>
              <span
                className={`font-main font-[300] ${
                  isSmallMobile ? "text-sm" : "text-base"
                } leading-5`}
              >
                {data.delivery}
              </span>
            </div>

            <div className="flex items-center sm:justify-between w-full h-auto sm:gap-0 gap-2">
              <span
                className={`font-main font-[300] ${
                  isSmallMobile ? "text-xs" : "text-sm"
                } leading-4 text-[#BCBCBC]`}
              >
                Dimension (cm):
              </span>
              <span
                className={`font-main font-[300] ${
                  isSmallMobile ? "text-sm" : "text-base"
                } leading-5`}
              >
                {data.dimensions}
              </span>
            </div>
          </div>

          <div className="w-full h-auto justify-between items-center relative sm:flex hidden">
            <div className="w-full max-w-[171px] flex items-center gap-2">
              <button
                className="w-[40px] h-[40px] rounded-full flex items-center justify-center"
                onClick={() => {
                  if (qty <= 1) return removeFromCart();
                  setQty((prev) => prev - 1);
                }}
              >
                <img
                  src="/minus.svg"
                  alt="dec"
                  className="w-full h-full object-contain"
                  draggable="false"
                />
              </button>

              <div className="w-[67px] h-[40px] pointer-events-none flex items-center justify-center text-center border-[1px] border-[#fff] rounded-full">
                {qty}
              </div>

              <button
                className="w-[40px] h-[40px] rounded-full flex items-center justify-center border-[1px] border-[#fff]"
                onClick={() => setQty((prev) => prev + 1)}
              >
                <img
                  src="/plus.svg"
                  alt="dec"
                  className="w-[21px] h-[21px] object-contain"
                  draggable="false"
                />
              </button>
            </div>

            <div className="w-full max-w-[126px] h-auto flex p-1 items-center gap-2 font-main text-base leading-[19px] justify-end pr-0">
              <img
                src="/priceBTC.svg"
                alt="btc"
                className="w-[24px] h-[24px] object-contain"
                draggable="false"
              />
              <span>{getPrice(data.price, 4, "BTC")}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-auto justify-between items-center relative sm:hidden flex">
        <div className="w-full max-w-[171px] flex items-center gap-2">
          <button
            className="sm:w-[40px] w-[35px] sm:h-[40px] h-[35px] rounded-full flex items-center justify-center"
            onClick={() => {
              if (qty <= 1) return removeFromCart();
              setQty((prev) => prev - 1);
            }}
          >
            <img
              src="/minus.svg"
              alt="dec"
              className="w-full h-full object-contain"
              draggable="false"
            />
          </button>

          <div className="sm:w-[67px] w-[50px] sm:h-[40px] h-[35px] pointer-events-none flex items-center justify-center text-center border-[1px] border-[#fff] rounded-full">
            {data.quantity}
          </div>

          <button
            className="sm:w-[40px] w-[35px] sm:h-[40px] h-[35px] rounded-full flex items-center justify-center border-[1px] border-[#fff]"
            onClick={() => setQty((prev) => prev + 1)}
          >
            <img
              src="/plus.svg"
              alt="dec"
              className="w-[21px] h-[21px] object-contain"
              draggable="false"
            />
          </button>
        </div>

        <div className="w-full max-w-[126px] h-auto flex p-1 items-center gap-2 font-main text-base leading-[19px] justify-end pr-0">
          <img
            src="/priceBTC.svg"
            alt="btc"
            className="w-[24px] h-[24px] object-contain"
            draggable="false"
          />
          <span>{getPrice(data.price, 4, "BTC")}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;