import { getYear } from "date-fns";
import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaXTwitter } from "react-icons/fa6";
import { FaTelegramPlane } from "react-icons/fa";

const Footer = () => {
  const currentYear = getYear(new Date());

  return (
    <>
      <footer className="w-full h-auto flex flex-col items-center justify-center px-4 xl:px-24 mt-16">
        <div className="w-full flex flex-wrap justify-between gap-10 xl:gap-0">

          {/* Логотип и подписи */}
          <div className="flex flex-col gap-4">
            <Link to="/">
              <img
                src="/logo.svg"
                alt="Logo"
                className="w-[60px] h-[40px] object-contain"
              />
            </Link>
            <p className="font-main font-[300] text-sm">
              {currentYear} © 5Ksana
                     </p>
            <div className="flex flex-col gap-1">
              <span className="font-main font-[300] text-sm opacity-70">
                Built with ♥
              </span>
              <span className="font-main font-[300] text-sm">
                Content Released under MIT license.
              </span>
              <span className="font-main font-[300] text-sm">
                This website does not use cookies nor collect personal data.
              </span>
            </div>
            <div className="flex gap-1 mt-2 flex-wrap">
              <Link to="/privacy" className="font-main font-[300] text-sm">Privacy policy</Link>
              <span className="text-sm opacity-70">|</span>
              <Link to="/policies" className="font-main font-[300] text-sm">Policies</Link>
              <span className="text-sm opacity-70">|</span>
              <a
                href="https://github.com/buybitart/bitcoinart"
                target="_blank"
                rel="noopener noreferrer"
                className="font-main font-[300] text-sm"
              >
                GitHub
              </a>
            </div>
            <div className="flex gap-5 mt-3">
              <a href="https://www.instagram.com/5ksana_handmade/" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
              <a href="https://x.com/5Ksana" target="_blank" rel="noopener noreferrer">
                <FaXTwitter />
              </a>
              <a href="https://t.me/KSANA5" target="_blank" rel="noopener noreferrer">
                <FaTelegramPlane />
              </a>
            </div>
          </div>

          {/* Меню */}
          <div className="flex flex-col gap-3">
            <Link to="/shop" className="uppercase font-main font-[500]">Shop</Link>
            <Link to="/gallery" className="uppercase font-main font-[500]">Bitcoin art gallery</Link>
            <Link to="/support" className="uppercase font-main font-[500]">Support Me</Link>
            <Link to="/about" className="uppercase font-main font-[500]">About me</Link>
            <Link to="/proof" className="uppercase font-main font-[500]">Proof of Work</Link>
            <Link to="/exhibitions" className="uppercase font-main font-[500]">Exhibitions</Link>
            <Link to="/faq" className="uppercase font-main font-[500]">FAQ</Link>
          </div>

          {/* Контакты и платежи */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h5 className="font-main font-[400]">Contact Information</h5>
              <a href="mailto:info@buybitart.com" className="flex items-center gap-1">
                <img src="/email.svg" alt="email" className="w-6 h-6 object-contain" />
                <span className="font-main font-[300] underline">info@buybitart.com</span>
              </a>
            </div>

            <div className="flex flex-col gap-2">
              <h5 className="font-main font-[400]">Payments</h5>
              <div className="flex gap-1">
                <img src="/Mastercard.svg" alt="Mastercard" className="w-10 h-[27px]" />
                <img src="/Visa.svg" alt="Visa" className="w-10 h-[27px]" />
                <img src="/Bitcoin.svg" alt="Bitcoin" className="w-10 h-[27px]" />
                <img src="/ApplePay.svg" alt="ApplePay" className="w-10 h-[27px]" />
                <img src="/tether.svg" alt="Tether" className="w-10 h-[27px]" />
              </div>
            </div>
          </div>
        </div>

        {/* Подвал с юридической информацией */}
        <div className="w-full text-white/60 text-xs font-main mt-6 text-center px-4 sm:px-0">
          The service does not engage in cryptocurrency exchange, NFT sales,
          mining, or any other illegal activities (such as gambling, etc.). It
          offers the sale of original physical artworks focused on Bitcoin art,
          created by the artist Aksana Zasinet (artistic name: 5KSANA)
        </div>
      </footer>
    </>
  );
};

export default Footer;
