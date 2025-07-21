import React, { useEffect, useMemo, useState, useCallback } from "react";
import Footer from "../components/Footer";
import CardProduct from "../components/CardProduct";
import useResponsive from "../hooks/useResponsive";
import { AnimatePresence } from "framer-motion";
import { useLenis } from "lenis/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Paginator from "../components/Paginator";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import SEO from "../utils/SEO";
import Filters from "../components/Filters";

const Shop = ({ setCart, cart }) => {
  const [shopSettings, setShopSettings] = useState({
    isAuction: true,
    isFiltersOpen: false,
    isSticky: false,
  });
  const [btcPrice, setBtcPrice] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [priceFilters, setPriceFilters] = useState({ min: 0, max: 0 });
  const [products, setProducts] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);

  const [searchParams] = useSearchParams();
  const priceType = searchParams.get("priceType") || "BTC";
  const { isMobile } = useResponsive();
  const lenis = useLenis();

  const fetchBTCPrice = useCallback(async () => {
    try {
      const { data } = await axios.get(import.meta.env.VITE_USDBTC_API);
      setBtcPrice(data.USD.sell);
    } catch (error) {
      console.error("Failed to fetch BTC price:", error);
    }
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [productsRes, auctionsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_DB_LINK}/api/products`),
        axios.get(`${import.meta.env.VITE_DB_LINK}/api/auctions`),
      ]);
      setProducts(productsRes.data || []);
      setAuctions(auctionsRes.data || []);
    } catch (error) {
      console.error("Failed to fetch products or auctions:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBTCPrice();
    fetchData();
  }, [fetchBTCPrice, fetchData]);

  const filterByPrice = useCallback(
    (product) => {
      const price =
        priceType === "BTC"
          ? product.currentPrice || product.minPrice || product.price
          : product.usdPrice;
      return (
        (!priceFilters.min || price >= priceFilters.min) &&
        (!priceFilters.max || price <= priceFilters.max)
      );
    },
    [priceFilters, priceType],
  );

  const onInputChange = (event) => {
    const { name, value } = event.target;
    const numericValue = Math.max(0, Number(value));
    setPriceFilters((prev) => ({
      ...prev,
      [name]: numericValue,
    }));
  };

  const combinedProducts = useMemo(() => {
    const formatProducts = (items, isAuction = false) =>
      items.map((item) => ({
        ...item,
        usdPrice:
          btcPrice *
          (isAuction ? item.currentPrice || item.minPrice : item.price),
      }));

    const allProducts = shopSettings.isAuction
      ? [...formatProducts(auctions, true), ...formatProducts(products)]
      : formatProducts(products);

    return priceFilters.min || priceFilters.max
      ? allProducts.filter(filterByPrice)
      : allProducts;
  }, [
    btcPrice,
    priceFilters,
    shopSettings.isAuction,
    products,
    auctions,
    filterByPrice,
  ]);

  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth;
      setItemsPerPage(
        width >= 1536 ? 12 : width >= 1280 ? 9 : width >= 640 ? 10 : 8,
      );
    };
    window.addEventListener("resize", updateItemsPerPage);
    updateItemsPerPage();
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      document.documentElement.style.overflow = shopSettings.isFiltersOpen
        ? "hidden"
        : "";
      shopSettings.isFiltersOpen ? lenis?.stop() : lenis?.start();
      ScrollTrigger.normalizeScroll(!shopSettings.isFiltersOpen);
    } else {
      document.documentElement.style.overflow = shopSettings.isFiltersOpen
        ? "hidden"
        : "";
    }
  }, [shopSettings.isFiltersOpen, isMobile, lenis]);

  useEffect(() => {
    const handleScroll = () =>
      setShopSettings((prev) => ({ ...prev, isSticky: window.scrollY > 60 }));
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleFilters = () =>
    setShopSettings((prev) => ({
      ...prev,
      isFiltersOpen: !prev.isFiltersOpen,
    }));

  const fadeVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  useEffect(() => {
    const getSettings = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_DB_LINK}/api/settings/shop`,
        );
        setSettings(data);
      } catch (error) {
        console.error("Failed to fetch website settings: ", error);
      }
    };
    getSettings();
  }, []);

  if (!settings)
    return (
      <>
        <SEO
          title="5KSANA | Shop Bitcoin Art & Crypto-Themed Creations & Auction"
          description="Shop Bitcoin-inspired art & fashion by 5KSANA—paintings, sculptures, embroidery & auctions. Celebrate crypto culture with unique, curated pieces."
          name="5KSANA | Shop Bitcoin Art & Crypto-Themed Creations & Auction"
          type="page"
          page="shop"
        />
        <div>Loading Shop...</div>
      </>
    );

  return (
    <>
      <SEO
        title="5KSANA | Shop Bitcoin Art & Crypto-Themed Creations & Auction"
        description="Shop Bitcoin-inspired art & fashion by 5KSANA—paintings, sculptures, embroidery & auctions. Celebrate crypto culture with unique, curated pieces."
        name="5KSANA | Shop Bitcoin Art & Crypto-Themed Creations & Auction"
        type="page"
        page="shop"
      />
      <section className="w-[100vw] h-full contShop">
        <div className="w-full h-full mt-[72px] px-[16px] pb-4 flex flex-col justify-end xl:px-[6.25rem] overflow-x-hidden">
          <div className="w-full flex justify-between items-center gap-2">
            <div className="w-full sm:h-[75px] h-[70px] relative border-[1px] rounded-xl border-[#ffffff10] bg-gradient-to-br from-[#ffffff10] to-[#ffffff05] flex justify-center items-center">
              <img
                src="/hearts.png"
                alt="hearts - support me"
                className="w-auto h-full sm:max-h-[60px] max-h-[50px]"
              />
              <img
                src="/bg-support.png"
                alt="bg - support me"
                className="w-auto h-full absolute object-cover z-[-1] opacity-25 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              />
            </div>
            <div className="w-full sm:h-[75px] h-[70px] relative border-[1px] rounded-xl border-[#ffffff10] bg-gradient-to-bl from-[#ffffff10] to-[#ffffff05] flex justify-center items-center">
              <Link
                to={"/support"}
                className="text-base bg-[#ffffff10] backdrop-blur-sm border-[1px] border-[#ffffff05] sm:px-6 px-3 sm:py-2.5 py-2 rounded-lg font-main shadow-lg"
              >
                Support Me
              </Link>
              <img
                src="/bg-support.png"
                alt="bg - support me"
                className="w-auto h-full absolute object-cover z-[-1] opacity-25 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              />
            </div>
          </div>
        </div>
        <div className="w-full h-full sticky top-[30px] px-[16px] xl:top-[52px] pb-4 flex flex-col justify-end xl:px-[6.25rem] overflow-x-hidden z-[2]">
          <div className="w-full h-auto relative flex justify-between items-end webkitBgBlurIos16 bg-gradient-to-t from-[#000000]/75 to-[#000] to-[85%] py-5 border-b-[1px] border-[#FFFFFF1A]">
            <h1 className="font-main font-[600] text-4xl leading-[100%] uppercase">
              {settings.sections[0].title}
            </h1>

            <div className="flex w-auto h-full items-center gap-6">
              <button
                aria-pressed={shopSettings.isAuction}
                onClick={() =>
                  setShopSettings((prev) => ({
                    ...prev,
                    isAuction: !shopSettings.isAuction,
                  }))
                }
                className={`${
                  shopSettings.isAuction
                    ? "bg-[#FCCB00] text-[#241D00] hover:bg-[#D4A900] hover:text-[#1C1600]"
                    : "bg-[#212121] text-[#fff] hover:bg-[#FFFFFF1A] hover:text-[rgba(255,255,255,0.85)]"
                } ${
                  isMobile ? "w-[43px]" : "w-[157px]"
                } flex items-center justify-center gap-[10px] rounded-xl h-[43px] font-main font-[500] text-base transition duration-[250ms]`}
              >
                <svg
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`${
                    shopSettings.isAuction ? "" : "invert brightness-0"
                  } transition duration-[250ms]`}
                >
                  <path
                    d="M12.0001 14.506L5.84411 21.733C5.64833 21.9609 5.40759 22.1459 5.13699 22.2764C4.86639 22.4069 4.57176 22.4801 4.27154 22.4915C3.97132 22.5028 3.672 22.4521 3.39231 22.3424C3.11263 22.2327 2.85861 22.0664 2.64617 21.8539C2.43374 21.6415 2.26746 21.3875 2.15775 21.1078C2.04805 20.8281 1.99729 20.5288 2.00864 20.2286C2.01999 19.9284 2.09322 19.6337 2.22373 19.3631C2.35425 19.0925 2.53924 18.8518 2.76711 18.656L9.99411 12.5M22.0001 12.405L15.9051 18.5M12.0951 2.5L6.00011 8.595M11.3331 3.262L6.76211 7.833C6.76211 7.833 9.04811 10.881 11.3331 13.167C13.6191 15.452 16.6671 17.738 16.6671 17.738L21.2381 13.167C21.2381 13.167 18.9521 10.119 16.6671 7.833C14.3811 5.548 11.3331 3.262 11.3331 3.262Z"
                    stroke="#241D00"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {isMobile ? null : "Auction"}
              </button>
              <button
                aria-pressed={toggleFilters}
                onClick={toggleFilters}
                className="w-auto flex items-center justify-center gap-1 rounded-xl h-[43px] font-main font-[400] text-base text-white hover:text-[rgba(255,255,255,0.85)] transition duration-[250ms] group"
              >
                Filters
                <svg
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                  className="group-hover:opacity-85 transition duration-[250ms]"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <mask
                    id="mask0_287_2280"
                    style={{ maskType: "alpha" }}
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="24"
                    height="25"
                  >
                    <rect y="0.5" width="24" height="24" fill="#D9D9D9" />
                  </mask>
                  <g mask="url(#mask0_287_2280)">
                    <path
                      d="M12 21.5C11.7167 21.5 11.4792 21.4042 11.2875 21.2125C11.0958 21.0208 11 20.7833 11 20.5V16.5C11 16.2167 11.0958 15.9792 11.2875 15.7875C11.4792 15.5958 11.7167 15.5 12 15.5C12.2833 15.5 12.5208 15.5958 12.7125 15.7875C12.9042 15.9792 13 16.2167 13 16.5V17.5H20C20.2833 17.5 20.5208 17.5958 20.7125 17.7875C20.9042 17.9792 21 18.2167 21 18.5C21 18.7833 20.9042 19.0208 20.7125 19.2125C20.5208 19.4042 20.2833 19.5 20 19.5H13V20.5C13 20.7833 12.9042 21.0208 12.7125 21.2125C12.5208 21.4042 12.2833 21.5 12 21.5ZM4 19.5C3.71667 19.5 3.47917 19.4042 3.2875 19.2125C3.09583 19.0208 3 18.7833 3 18.5C3 18.2167 3.09583 17.9792 3.2875 17.7875C3.47917 17.5958 3.71667 17.5 4 17.5H8C8.28333 17.5 8.52083 17.5958 8.7125 17.7875C8.90417 17.9792 9 18.2167 9 18.5C9 18.7833 8.90417 19.0208 8.7125 19.2125C8.52083 19.4042 8.28333 19.5 8 19.5H4ZM8 15.5C7.71667 15.5 7.47917 15.4042 7.2875 15.2125C7.09583 15.0208 7 14.7833 7 14.5V13.5H4C3.71667 13.5 3.47917 13.4042 3.2875 13.2125C3.09583 13.0208 3 12.7833 3 12.5C3 12.2167 3.09583 11.9792 3.2875 11.7875C3.47917 11.5958 3.71667 11.5 4 11.5H7V10.5C7 10.2167 7.09583 9.97917 7.2875 9.7875C7.47917 9.59583 7.71667 9.5 8 9.5C8.28333 9.5 8.52083 9.59583 8.7125 9.7875C8.90417 9.97917 9 10.2167 9 10.5V14.5C9 14.7833 8.90417 15.0208 8.7125 15.2125C8.52083 15.4042 8.28333 15.5 8 15.5ZM12 13.5C11.7167 13.5 11.4792 13.4042 11.2875 13.2125C11.0958 13.0208 11 12.7833 11 12.5C11 12.2167 11.0958 11.9792 11.2875 11.7875C11.4792 11.5958 11.7167 11.5 12 11.5H20C20.2833 11.5 20.5208 11.5958 20.7125 11.7875C20.9042 11.9792 21 12.2167 21 12.5C21 12.7833 20.9042 13.0208 20.7125 13.2125C20.5208 13.4042 20.2833 13.5 20 13.5H12ZM16 9.5C15.7167 9.5 15.4792 9.40417 15.2875 9.2125C15.0958 9.02083 15 8.78333 15 8.5V4.5C15 4.21667 15.0958 3.97917 15.2875 3.7875C15.4792 3.59583 15.7167 3.5 16 3.5C16.2833 3.5 16.5208 3.59583 16.7125 3.7875C16.9042 3.97917 17 4.21667 17 4.5V5.5H20C20.2833 5.5 20.5208 5.59583 20.7125 5.7875C20.9042 5.97917 21 6.21667 21 6.5C21 6.78333 20.9042 7.02083 20.7125 7.2125C20.5208 7.40417 20.2833 7.5 20 7.5H17V8.5C17 8.78333 16.9042 9.02083 16.7125 9.2125C16.5208 9.40417 16.2833 9.5 16 9.5ZM4 7.5C3.71667 7.5 3.47917 7.40417 3.2875 7.2125C3.09583 7.02083 3 6.78333 3 6.5C3 6.21667 3.09583 5.97917 3.2875 5.7875C3.47917 5.59583 3.71667 5.5 4 5.5H12C12.2833 5.5 12.5208 5.59583 12.7125 5.7875C12.9042 5.97917 13 6.21667 13 6.5C13 6.78333 12.9042 7.02083 12.7125 7.2125C12.5208 7.40417 12.2833 7.5 12 7.5H4Z"
                      fill="white"
                    />
                  </g>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {shopSettings.isFiltersOpen && (
            <Filters
              isSticky={shopSettings.isSticky}
              min={priceFilters.min}
              max={priceFilters.max}
              onInputChange={onInputChange}
              priceType={priceType}
            />
          )}
        </AnimatePresence>

        <Paginator
          data={combinedProducts}
          itemsPerPage={itemsPerPage}
          animationVariants={fadeVariants}
          className={`${
            combinedProducts.length
              ? "grid 2xl:grid-cols-4 xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5"
              : "flex"
          } w-full px-[16px] xl:px-[6.25rem] relative mt-[12px] mb-[47px]`}
        >
          {(paginatedData) =>
            paginatedData.length ? (
              paginatedData.map((product, index) => (
                <CardProduct
                  data={product}
                  key={product.id || index}
                  setCart={setCart}
                  cart={cart}
                  index={index}
                  priceType={priceType}
                  auction={shopSettings.isAuction && product?.endTime}
                />
              ))
            ) : priceFilters.min || priceFilters.max ? (
              <div className="min-h-[560px] w-full justify-center items-center flex flex-col gap-2">
                <img
                  src="/empty-box.svg"
                  alt="empty-box"
                  className="w-full h-full max-h-[170px] sm:max-h-[225px] object-contain invert opacity-40"
                />
                <p className="font-main sm:text-xl text-lg font-[300] opacity-40">
                  No products match your current filters.
                </p>
              </div>
            ) : (
              <div className="relative h-full flex flex-col w-full justify-center items-center gap-2">
                <img
                  src="/empty-box.svg"
                  alt="empty-box"
                  className="w-full h-full max-h-[170px] sm:max-h-[225px] object-contain invert opacity-40"
                />
                <p className="font-main sm:text-xl text-lg font-[300] opacity-40">
                  No items there yet :\
                </p>
              </div>
            )
          }
        </Paginator>

        <Footer />
      </section>
    </>
  );
};

export default Shop;
