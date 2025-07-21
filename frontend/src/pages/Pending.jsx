import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiUrl } from "../http";
import { LuLoaderCircle } from "react-icons/lu";
import { Helmet } from "react-helmet-async";

const Pending = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/payment/status/${searchParams.get("orderId")}`,
        );

        if (response.data.status === "completed")
          navigate(`/success?orderId=${searchParams.get("orderId")}`);
        else if (response.data.status === "canceled")
          navigate(`/error?orderId=${searchParams.get("orderId")}`);
      } catch (error) {
        console.error("Error checking payment status:", error);
        navigate(`/error?orderId=${searchParams.get("orderId")}`);
      }
    };

    const interval = setInterval(checkPaymentStatus, 5000);
    return () => clearInterval(interval);
  }, [searchParams]);

  return (
    <>
      <Helmet>
        <title>Pending Payment...</title>
      </Helmet>
      <section className="w-[100vw] h-full">
        <div className="w-full h-[100svh] relative px-[16px] xl:px-[6.25rem] flex items-center justify-center">
          <div className="flex flex-col w-full max-w-[1000px] bg-[#ffffff1A] h-auto justify-center items-center font-main z-[1] relative p-[50px] rounded-3xl text-center">
            <LuLoaderCircle className="text-white opacity-60 animate-spin mb-2 text-[40px]" />
            <h2 className="font-main text-[17px] sm:text-[40px] font-[700] tracking-wide capitalize sm:leading-[54px]">
              Processing your order...
            </h2>
            <p className="text-sm sm:text-base font-main font-[400] tracking-wide opacity-80">
              Waiting for payment confirmation...
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
            <button className="mt-[20px] flex sm:flex-row flex-col sm:text-center text-left font-main rounded-xl sm:text-base text-sm w-auto max-w-[530px] px-5 sm:py-0 py-2 h-auto sm:h-[47px] bg-[#fcca0017] border-[1px] border-[#fcca0017] sm:items-center justify-center transition-colors duration-[250ms]">
              <span className="text-white font-[600] tracking-wider">
                OrderId:
              </span>
              <span className="sm:ml-1 text-[#fcca00] font-[300]">
                {searchParams.get("orderId")}
              </span>
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Pending;
