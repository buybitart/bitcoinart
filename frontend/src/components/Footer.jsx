import { getYear } from "date-fns";
import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaXTwitter } from "react-icons/fa6";
import { FaTelegramPlane } from "react-icons/fa";

const Footer = () => {
  const currentYear = getYear(new Date());
  return (
    <>
      <footer className="w-full h-auto min-h-[202px] flex items-center justify-center px-[16px] xl:px-[6.25rem]">
        <div className="w-full h-auto min-h-[121px] flex justify-between md:flex-row flex-col md:gap-0 gap-8 md:my-0 my-16 flex-wrap">
          <div className="relative w-auto h-auto flex flex-col gap-4">
            <Link className="w-auto h-auto relative" to={"/"}>
              <img
                src="/logo.svg"
                alt=""
                className="w-[60px] h-[40px] object-contain"
              />
            </Link>
            <p className="font-main font-[300] text-sm">
              {currentYear} © 5Ksana
            </p>
            <div className="w-auto flex flex-col gap-1">
              <span className="font-main font-[300] text-sm opacity-70">Built with ♥ by <a href="https://studio.elevengen.com" target="_blank" className="text-[#fccb00]">11Gen</a></span>
              <span className="font-main font-[300] text-sm">Content Released under MIT license.</span>
            </div>
            <div className="w-auto flex items-center gap-1">
              <Link to={"/privacy"} className="font-main font-[300] text-sm">
                Privacy policy
              </Link>
              <div className="w-[1px] h-[50%] opacity-70 bg-white mx-0.5" />
              <Link to={"/policies"} className="font-main font-[300] text-sm">
                Policies
              </Link>
              <div className="w-[1px] h-[50%] opacity-70 bg-white mx-0.5" />
              <a href="https://github.com/11Gen/buybitart-server/tree/main" target="_blank" className="font-main font-[300] text-sm">
                Code
              </a>
            </div>
            <div className="flex w-auto h-auto gap-5">
              <a
                href="https://www.instagram.com/5ksana_handmade/"
                target="_blank"
              >
                <FaInstagram />
              </a>
              <a href="https://x.com/5Ksana" target="_blank">
                <FaXTwitter />
              </a>
              <a href="https://t.me/KSANA5" target="_blank">
                <FaTelegramPlane />
              </a>
            </div>
          </div>

          <div className="w-auto h-auto flex flex-col gap-3">
            <Link to={"/shop"} className="uppercase font-main font-[500]">
              Shop
            </Link>
            <Link to={"/gallery"} className="uppercase font-main font-[500]">
              Bitcoin art gallery
            </Link>
            <Link to={"/support"} className="uppercase font-main font-[500]">
              Support Me
            </Link>
            <Link to={"/about"} className="uppercase font-main font-[500]">
              About me
            </Link>
            <Link to={"/proof"} className="uppercase font-main font-[500]">
              Proof of Work
            </Link>
            <Link to={"/exhibitions"} className="uppercase font-main font-[500]">
              Exhibitions
            </Link>
            <Link to={"/faq"} className="uppercase font-main font-[500]">
              FAQ
            </Link>
          </div>

          <div className="w-auto h-auto flex flex-col gap-4 relative">
            <div className="flex flex-col w-auto h-auto gap-2">
              <h5 className="font-main font-[400]">Contact Information</h5>
              <a
                href={`mailto:info@buybitart.com`}
                className="relative w-auto h-auto flex gap-1 opacity-90"
              >
                <img
                  src="/email.svg"
                  alt=""
                  className="w-[24px] h-[24px] object-contain"
                />
                <span className="font-main font-[300] underline underline-offset-1">
                  info@buybitart.com
                </span>
              </a>
            </div>

            <div className="flex flex-col w-auto h-auto gap-2">
              <h5 className="font-main font-[400]">Payments</h5>
              <div className="flex gap-1 w-auto h-auto relative">
                <img
                  src="/Mastercard.svg"
                  alt=""
                  className="w-[40px] h-[27.43px]"
                />
                <img src="/Visa.svg" alt="" className="w-[40px] h-[27.43px]" />
                <img
                  src="/Bitcoin.svg"
                  alt=""
                  className="w-[40px] h-[27.43px]"
                />
                <img
                  src="/ApplePay.svg"
                  alt=""
                  className="w-[40px] h-[27.43px]"
                />
                <img
                  src="/tether.svg"
                  alt=""
                  className="w-[40px] h-[27.43px]"
                />
              </div>
            </div>
          </div>
        </div>
      </footer>

      <div className="w-full sm:h-[30px] sm:pb-0 pb-2 px-[16px] xl:px-[6.25rem] h-auto text-white/60 mt-6 font-main text-xs flex items-center justify-center">
        The service does not engage in cryptocurrency exchange, NFT sales,
        mining, or any other illegal activities (such as gambling, etc.). It
        offers the sale of original physical artworks focused on Bitcoin art,
        created by the artist Aksana Zasinet (artistic name: 5KSANA)
      </div>
    </>
  );
};

export default Footer;
