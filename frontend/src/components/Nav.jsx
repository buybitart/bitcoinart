import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Modal from "./Modal";
import Cart from "./Cart";
import Auth from "./Auth";
import useResponsive from "../hooks/useResponsive";
import { observer } from "mobx-react-lite";
import { UserContext } from "../main";
import { GoShieldLock } from "react-icons/go";

const Nav = ({ cart, setCart }) => {
  const location = useLocation();
  const [isAdminPage, setIsAdminPage] = useState(false);
  const [isSolidBG, setIsSolidBG] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { userStore } = useContext(UserContext);

  const { isBigLaptop } = useResponsive();

  function popupCartOpen() {
    setIsCartOpen(true);
  }

  function popupCartClose() {
    setIsCartOpen(false);
  }

  function popupAuthOpen() {
    setIsAuthOpen(true);
  }

  function popupAuthClose() {
    setIsAuthOpen(false);
  }

  async function userLogout() {
    try {
      await userStore.logout();
    } catch (e) {
      console.log(e);
    }
  }

  function menuToggle() {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) document.documentElement.style.overflow = "hidden";
    else document.documentElement.style.overflow = "";
  }

  function menuClose() {
    setIsMenuOpen(false);
    document.documentElement.style.overflow = "";
  }

  useEffect(() => {
    if (isMenuOpen) setIsMenuOpen(false);
    if (
      location.pathname == "/shop" ||
      location.pathname.includes(`${import.meta.env.VITE_ADMIN_ROUTE}/`)
    )
      setIsSolidBG(true);
    else setIsSolidBG(false);

    if (
      location.pathname.includes(`${import.meta.env.VITE_ADMIN_ROUTE}/`) &&
      userStore?.user?.isAdmin
    )
      setIsAdminPage(true);
    else setIsAdminPage(false);
  }, [location]);

  const navClasses = [
    "navBar",
    "w-full",
    "fixed",
    "top-0",
    "left-0",
    "flex",
    "justify-between",
    "z-[1000]",
    isSolidBG
      ? "bg-black border-[#ffffff00]"
      : "webkitBgBlurIos16 border-[#FFFFFF1A]",
    "xl:h-[65px] h-[52px]",
    "border-b-[1px]",
    "px-[16px]",
    "py-[0.781rem]",
    "xl:px-[6.25rem]",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <nav className={navClasses}>
        <div className="logo w-auto h-full relative z-[2]">
          <Link to={"/"} onClick={isBigLaptop ? menuClose : null}>
            <img
              src="/logo.svg"
              alt=""
              className="h-[28px] w-auto xl:h-full"
              draggable={false}
            />
          </Link>
        </div>
        <div className="w-auto flex h-full items-center gap-[2.5rem] z-[2]">
          <div className="xl:flex h-auto w-auto items-center gap-6 font-main uppercase font-[500] hidden">
            {isAdminPage ? (
              <>
                <NavLink
                  to={`${import.meta.env.VITE_ADMIN_ROUTE}/items`}
                  className={({ isActive }) =>
                    `p-[0.625rem] hover:opacity-75 transition-opacity duration-[250ms] indicatorL ${
                      isActive ? "active" : ""
                    }`
                  }
                >
                  Items
                </NavLink>
                <NavLink
                  to={`${import.meta.env.VITE_ADMIN_ROUTE}/content`}
                  className={({ isActive }) =>
                    `p-[0.625rem] hover:opacity-75 transition-opacity duration-[250ms] indicatorL ${
                      isActive ? "active" : ""
                    }`
                  }
                >
                  Content
                </NavLink>
                <NavLink
                  to={`${import.meta.env.VITE_ADMIN_ROUTE}/notifications`}
                  className={({ isActive }) =>
                    `p-[0.625rem] hover:opacity-75 transition-opacity duration-[250ms] indicatorL ${
                      isActive ? "active" : ""
                    }`
                  }
                >
                  Notifications
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to={"/shop"}
                  className={({ isActive }) =>
                    `p-[0.625rem] hover:opacity-75 transition-opacity duration-[250ms] indicatorL ${
                      isActive ? "active" : ""
                    }`
                  }
                >
                  Shop
                </NavLink>
                <NavLink
                  to={"/gallery"}
                  className={({ isActive }) =>
                    `p-[0.625rem] hover:opacity-75 transition-opacity duration-[250ms] indicatorL ${
                      isActive ? "active" : ""
                    }`
                  }
                >
                  Bitcoin art gallery
                </NavLink>
                <NavLink
                  to={"/about"}
                  className={({ isActive }) =>
                    `p-[0.625rem] hover:opacity-75 transition-opacity duration-[250ms] indicatorL ${
                      isActive ? "active" : ""
                    }`
                  }
                >
                  About me
                </NavLink>
                <NavLink
                  to={"/proof"}
                  className={({ isActive }) =>
                    `p-[0.625rem] hover:opacity-75 transition-opacity duration-[250ms] indicatorL ${
                      isActive ? "active" : ""
                    }`
                  }
                >
                  Proof of Work
                </NavLink>
                <NavLink
                  to={"/exhibitions"}
                  className={({ isActive }) =>
                    `p-[0.625rem] hover:opacity-75 transition-opacity duration-[250ms] indicatorL ${
                      isActive ? "active" : ""
                    }`
                  }
                >
                  Exhibitions
                </NavLink>
                <NavLink
                  to={"/faq"}
                  className={({ isActive }) =>
                    `p-[0.625rem] hover:opacity-75 transition-opacity duration-[250ms] indicatorL ${
                      isActive ? "active" : ""
                    }`
                  }
                >
                  FAQ
                </NavLink>
              </>
            )}
          </div>

          {!isAdminPage && (
            <>
              {userStore.isAuth ? (
                <button
                  onClick={userLogout}
                  className="hidden xl:flex font-main rounded-[1.25rem] w-[107px] h-[40px] border-[#FCCB00] border-[1px] text-[#FCCB00] font-[600] items-center justify-center hover:border-[#D4A900] hover:text-[#D4A900] transition-colors duration-[250ms]"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={popupAuthOpen}
                  className="hidden xl:flex font-main rounded-[1.25rem] w-[107px] h-[40px] bg-[#FCCB00] text-[#522700] font-[600] items-center justify-center hover:bg-[#D4A900] hover:text-[#1C1600] transition-colors duration-[250ms]"
                >
                  Login
                </button>
              )}
            </>
          )}

          <div className="flex w-auto h-[24px] items-center gap-4">
            {!isAdminPage ? (
              <>
                <Link
                  to={"/search"}
                  className="w-auto h-auto relative bg-[#fff0] py-1 xl:px-2 px-1 rounded-full group hover:bg-[#212121] transition-colors duration-[250ms]"
                >
                  <svg
                    className="xl:w-[24px] relative top-[-1px] xl:h-[24px] w-[28px] h-[28px]"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.927 17.54L20.4001 20.9M19.2801 11.94C19.2801 16.2699 15.77 19.78 11.4401 19.78C7.11019 19.78 3.6001 16.2699 3.6001 11.94C3.6001 7.61006 7.11019 4.09998 11.4401 4.09998C15.77 4.09998 19.2801 7.61006 19.2801 11.94Z"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </Link>
                <button
                  className="w-auto h-auto relative bg-[#fff0] py-1 xl:px-2 px-1 rounded-full group hover:bg-[#212121] transition-colors duration-[250ms] flex justify-center items-center"
                  onClick={popupCartOpen}
                >
                  <svg
                    className="xl:w-[24px] relative top-[-1px] xl:h-[24px] w-[28px] h-[28px]"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.5999 8.84203C15.5999 10.8303 13.9881 12.442 11.9999 12.442C10.0117 12.442 8.3999 10.8303 8.3999 8.84203M4.72717 21.442H19.2726C20.5579 21.442 21.5999 20.4194 21.5999 19.158L20.109 5.842C20.109 4.58057 19.067 3.55798 17.7817 3.55798H5.92717C4.64186 3.55798 3.5999 4.58057 3.5999 5.842L2.3999 19.158C2.3999 20.4194 3.44186 21.442 4.72717 21.442Z"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <span
                    className={`absolute ${
                      cart.length
                        ? "scale-100 opacity-100 visible"
                        : "scale-0 opacity-0 invisible"
                    } transition-[transform,opacity,visibility] duration-[250ms] font-main text-[10px] leading-[100%] w-[14px] flex justify-center font-[600] items-center h-[14px] right-[1px] top-[-4px] text-[#522700] bg-[#FCCB00] rounded-full`}
                  >
                    {cart.length}
                  </span>
                </button>
                {userStore?.user?.isAdmin ? (
                  <Link
                    to={`${import.meta.env.VITE_ADMIN_ROUTE}/items`}
                    className="w-auto h-auto relative bg-[#fff0] py-1 xl:px-2 px-1 rounded-full group hover:bg-[#212121] transition-colors duration-[250ms]"
                  >
                    <GoShieldLock size={24} />
                  </Link>
                ) : (
                  <></>
                )}
                <button
                  className="w-auto h-auto relative bg-[#fff0] py-1 xl:px-2 px-1 rounded-full group transition-colors duration-[250ms] justify-center items-center xl:hidden flex"
                  onClick={menuToggle}
                >
                  <div className="xl:w-[24px] w-[28px] xl:h-[24px] h-[28px] relative flex flex-col justify-center items-center gap-1.5 top-[2px]">
                    <div
                      className={`w-full h-[1px] absolute left-1/2 -translate-x-[50%] transition-[top,transform] duration-500 bg-white ${
                        isMenuOpen ? "top-[12px] rotate-45" : "top-[6px]"
                      }`}
                    />
                    <div
                      className={`w-full h-[1px] absolute top-[12px] left-1/2  bg-white transition-[opacity,transform,visibility] duration-500 -translate-x-[50%] ${
                        isMenuOpen
                          ? "opacity-0 invisible -translate-x-[-350%]"
                          : "opacity-100 visible"
                      }`}
                    />
                    <div
                      className={`w-full h-[1px] absolute left-1/2 -translate-x-[50%] transition-[top,transform] duration-500 bg-white ${
                        isMenuOpen ? "top-[12px] -rotate-45" : "top-[18px]"
                      }`}
                    />
                  </div>
                </button>
              </>
            ) : (
              <>
                <Link
                  to={`/shop`}
                  className="w-auto h-auto relative bg-[#fff0] py-1 xl:px-2 px-1 rounded-full group hover:bg-[#212121] transition-colors duration-[250ms]"
                >
                  <svg
                    width="24"
                    height="25"
                    viewBox="0 0 24 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <mask
                      id="mask0_712_3637"
                      style={{ maskType: "alpha" }}
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="0"
                      width="24"
                      height="25"
                    >
                      <rect y="0.5" width="24" height="24" fill="#D9D9D9" />
                    </mask>
                    <g mask="url(#mask0_712_3637)">
                      <path
                        d="M5 21.5C4.45 21.5 3.97917 21.3042 3.5875 20.9125C3.19583 20.5208 3 20.05 3 19.5V5.5C3 4.95 3.19583 4.47917 3.5875 4.0875C3.97917 3.69583 4.45 3.5 5 3.5H12V5.5H5V19.5H12V21.5H5ZM16 17.5L14.625 16.05L17.175 13.5H9V11.5H17.175L14.625 8.95L16 7.5L21 12.5L16 17.5Z"
                        fill="#ffffffc1"
                      />
                    </g>
                  </svg>
                </Link>
                <button
                  className="w-auto h-auto relative bg-[#fff0] py-1 xl:px-2 px-1 rounded-full group transition-colors duration-[250ms] justify-center items-center xl:hidden flex"
                  onClick={menuToggle}
                >
                  <div className="xl:w-[24px] w-[28px] xl:h-[24px] h-[28px] relative flex flex-col justify-center items-center gap-1.5 top-[2px]">
                    <div
                      className={`w-full h-[1px] absolute left-1/2 -translate-x-[50%] transition-[top,transform] duration-500 bg-white ${
                        isMenuOpen ? "top-[12px] rotate-45" : "top-[6px]"
                      }`}
                    />
                    <div
                      className={`w-full h-[1px] absolute top-[12px] left-1/2  bg-white transition-[opacity,transform,visibility] duration-500 -translate-x-[50%] ${
                        isMenuOpen
                          ? "opacity-0 invisible -translate-x-[-350%]"
                          : "opacity-100 visible"
                      }`}
                    />
                    <div
                      className={`w-full h-[1px] absolute left-1/2 -translate-x-[50%] transition-[top,transform] duration-500 bg-white ${
                        isMenuOpen ? "top-[12px] -rotate-45" : "top-[18px]"
                      }`}
                    />
                  </div>
                </button>
              </>
            )}
          </div>
        </div>

        <div
          className={`w-full ${
            isAdminPage ? "h-[235px]" : "h-[455px]"
          } absolute left-0 bg-black border-b-[1px] border-b-[#ffffff1A] pt-[52px] flex flex-col gap-6 px-[16px] transition-[top,opacity,visibility] duration-700 ${
            isMenuOpen
              ? "top-0 opacity-100 visible pointer-events-auto"
              : "-top-[calc(310px+52px+10px)] opacity-0 invisible pointer-events-none"
          }`}
        >
          <div className="flex flex-col gap-3 w-full h-auto mt-[12px] relative font-main font-[400]">
            {isAdminPage ? (
              <>
                <NavLink
                  to={`${import.meta.env.VITE_ADMIN_ROUTE}/items`}
                  onClick={menuClose}
                  className={({ isActive }) =>
                    `p-[10px] indicatorR transition-colors duration-[250ms] rounded-lg ${
                      isActive ? "active bg-[#FFFFFF1A]" : ""
                    }`
                  }
                >
                  Items
                </NavLink>
                <NavLink
                  to={`${import.meta.env.VITE_ADMIN_ROUTE}/content`}
                  onClick={menuClose}
                  className={({ isActive }) =>
                    `p-[10px] indicatorR transition-colors duration-[250ms] rounded-lg ${
                      isActive ? "active bg-[#FFFFFF1A]" : ""
                    }`
                  }
                >
                  Content
                </NavLink>
                <NavLink
                  to={`${import.meta.env.VITE_ADMIN_ROUTE}/notifications`}
                  onClick={menuClose}
                  className={({ isActive }) =>
                    `p-[10px] indicatorR transition-colors duration-[250ms] rounded-lg ${
                      isActive ? "active bg-[#FFFFFF1A]" : ""
                    }`
                  }
                >
                  Notifications
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to={"/shop"}
                  onClick={menuClose}
                  className={({ isActive }) =>
                    `p-[10px] indicatorR transition-colors duration-[250ms] rounded-lg ${
                      isActive ? "active bg-[#FFFFFF1A]" : ""
                    }`
                  }
                >
                  Shop
                </NavLink>
                <NavLink
                  to={"/gallery"}
                  onClick={menuClose}
                  className={({ isActive }) =>
                    `p-[10px] indicatorR transition-colors duration-[250ms] rounded-lg ${
                      isActive ? "active bg-[#FFFFFF1A]" : ""
                    }`
                  }
                >
                  Bitcoin art gallery
                </NavLink>
                <NavLink
                  to={"/about"}
                  onClick={menuClose}
                  className={({ isActive }) =>
                    `p-[10px] indicatorR transition-colors duration-[250ms] rounded-lg ${
                      isActive ? "active bg-[#FFFFFF1A]" : ""
                    }`
                  }
                >
                  About me
                </NavLink>
                <NavLink
                  to={"/proof"}
                  onClick={menuClose}
                  className={({ isActive }) =>
                    `p-[10px] indicatorR transition-colors duration-[250ms] rounded-lg ${
                      isActive ? "active bg-[#FFFFFF1A]" : ""
                    }`
                  }
                >
                  Proof of Work
                </NavLink>
                <NavLink
                  to={"/exhibitions"}
                  onClick={menuClose}
                  className={({ isActive }) =>
                    `p-[10px] indicatorR transition-colors duration-[250ms] rounded-lg ${
                      isActive ? "active bg-[#FFFFFF1A]" : ""
                    }`
                  }
                >
                  Exhibitions
                </NavLink>
                <NavLink
                  to={"/faq"}
                  onClick={menuClose}
                  className={({ isActive }) =>
                    `p-[10px] indicatorR transition-colors duration-[250ms] rounded-lg ${
                      isActive ? "active bg-[#FFFFFF1A]" : ""
                    }`
                  }
                >
                  FAQ
                </NavLink>
              </>
            )}
          </div>
          {!isAdminPage && (
            <>
              {userStore.isAuth ? (
                <button
                  onClick={userLogout}
                  className="flex font-main rounded-[1.25rem] w-full h-[40px] border-[#FCCB00] border-[1px] text-[#FCCB00] font-[600] items-center justify-center hover:border-[#D4A900] hover:text-[#D4A900] transition-colors duration-[250ms]"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={popupAuthOpen}
                  className="flex font-main rounded-[1.25rem] w-full h-[40px] bg-[#FCCB00] text-[#522700] font-[600] items-center justify-center hover:bg-[#D4A900] hover:text-[#1C1600] transition-colors duration-[250ms]"
                >
                  Login
                </button>
              )}
            </>
          )}
        </div>
      </nav>

      <Modal isOpen={isCartOpen}>
        <Cart
          setIsCartOpen={setIsCartOpen}
          isCartOpen={isCartOpen}
          cart={cart}
          setCart={setCart}
          popupClose={popupCartClose}
          popupAuthOpen={popupAuthOpen}
        />
      </Modal>

      <Modal isOpen={isAuthOpen}>
        <Auth
          setIsAuthOpen={setIsAuthOpen}
          isAuthOpen={isAuthOpen}
          popupClose={popupAuthClose}
        />
      </Modal>
    </>
  );
};

export default observer(Nav);
