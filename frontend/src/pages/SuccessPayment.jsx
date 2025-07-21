import React, { useEffect } from "react";
import { IoBagCheck } from "react-icons/io5";
import { Link, useSearchParams } from "react-router-dom";
import { runFireworks } from "../utils";
import { Helmet } from "react-helmet-async";

const SuccessPayment = ({ setCart }) => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    setCart([]);
    runFireworks();
  }, []);

  return (
    <>
      <Helmet>
        <title>Successfull Payment - Thank You!</title>
      </Helmet>
      <section className="w-[100vw] h-full">
        <div className="w-full h-[100svh] relative px-[16px] xl:px-[6.25rem] flex items-center justify-center">
          <div className="flex flex-col w-full max-w-[1000px] bg-[#ffffff1A] h-auto justify-center items-center font-main z-[1] relative p-[50px] rounded-3xl text-center">
            <IoBagCheck className="text-[#34dd00] mb-2 text-[40px]" />
            <h2 className="font-main text-[17px] sm:text-[40px] font-[700] tracking-wide capitalize sm:leading-[54px]">
              Thank you for your order!
            </h2>
            <p className="text-sm sm:text-base font-main font-[400] tracking-wide opacity-80">
              Check your email inbox for the receipt. <br />{" "}
              <span>OrderId: {searchParams.get("orderId")}</span>
            </p>

            <div className="mt-[30px] mb-[10px] mx-[10px] relative text-sm sm:text-base opacity-80">
              If you have any questions, please email{" "}
              <a
                href={`mailto:info@buybitart.com`}
                target="_blank"
                className="font-main font-[400] tracking-wide ml-[5px] text-[#FCCB00]"
              >
                info@buybitart.com
              </a>
              .
            </div>
            <Link
              to="/shop"
              className="mt-[20px] flex font-main rounded-full w-full max-w-[330px] h-[47px] bg-[#FCCB00] text-[#522700] font-[600] items-center justify-center hover:bg-[#D4A900] hover:text-[#1C1600] transition-colors duration-[250ms]"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default SuccessPayment;
