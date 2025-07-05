import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Slider from "../components/Slider";
import Breadcamp from "../components/Breadcrumb";
import PriceLabel from "../components/PriceLabel";
import AddToCartButton from "../components/AddToCartButton";
import { toast } from "react-toastify";
import classNames from "classnames";
import useResponsive from "../hooks/useResponsive";
import CardRelated from "../components/CardRelated";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";
import { Swiper, SwiperSlide } from "swiper/react";
import { createMarkup, getPrice, inchesSize } from "../utils";
import SEO from "../utils/SEO";
import axios from "axios";
import Modal from "../components/Modal";
import TransformOriginal from "../components/TransformOriginal";
import Loader from "../components/Loader";

const Product = ({ cart, setCart }) => {
  const { hash } = useParams();
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const sliderContainerRef = useRef(null);
  const textContainerRef = useRef(null);
  const errorShownRef = useRef(false);

  const { isBigLaptop, isLaptop } = useResponsive();

  const [data, setData] = useState({});
  const [relatedData, setRelatedData] = useState([]);
  const [indexesRelated, setIndexesRelated] = useState([]);
  const [isSticky, setIsSticky] = useState(false);
  const [originalOpen, setOriginalOpen] = useState({
    state: false,
    index: null,
  });

  const capitalizeShortName = useMemo(() => {
    return data?.hash
      ? data.hash
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" ")
      : "";
  }, [data?.hash]);

  const isAddedToCart = useMemo(
    () => Boolean(cart.find((item) => item?.hash === data?.hash)),
    [cart, data?.hash]
  );

  const handleOpenOriginal = (index) => setOriginalOpen({ state: true, index });
  const handleCloseOriginal = () =>
    setOriginalOpen({ state: false, index: null });

  const generateRandomIndexes = (length) => {
    const indexes = new Set();
    while (indexes.size < 4 && indexes.size < length) {
      indexes.add(Math.floor(Math.random() * length));
    }
    return Array.from(indexes);
  };

  const addToCart = () => {
    toast.success(`"${capitalizeShortName}" Added to cart`);
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.hash === data.hash);
      return existingProduct
        ? prevCart.map((item) =>
            item.hash === data.hash
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...prevCart, { ...data, quantity: 1 }];
    });
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const [productResponse, relatedResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_DB_LINK}/api/products/${hash}`),
          axios.get(`${import.meta.env.VITE_DB_LINK}/api/products`),
        ]);

        setData(productResponse.data);
        setRelatedData(
          relatedResponse.data.filter((item) => item.hash !== hash)
        );
      } catch (error) {
        console.error("Failed to fetch product details:", error);
      }
    };
    fetchProductDetails();
  }, [hash]);

  useEffect(() => {
    if (relatedData.length)
      setIndexesRelated(generateRandomIndexes(relatedData.length));
  }, [relatedData]);

  useEffect(() => {
    if (
      sliderContainerRef.current &&
      textContainerRef.current &&
      !isBigLaptop
    ) {
      setIsSticky(
        sliderContainerRef.current.offsetHeight >
          textContainerRef.current.offsetHeight * 1.3
      );
    }
  }, [isBigLaptop, data]);

  if (!data?.title) {
    if (data === null && !errorShownRef.current) {
      toast.error("Page not Found");
      errorShownRef.current = true;
      navigate("/shop");
    }
    return (
      <>
        <SEO
          title={`Product - Unique Crypto Art & Fashion by 5KSANA`}
          description={`Discover Product, a one-of-a-kind creation by 5KSANA. This Bitcoin-inspired design embodies innovation and artistic excellence. Perfect for crypto enthusiasts and art collectors alike. Shop now and own a piece of blockchain-inspired creativity!`}
          name={`Product - Unique Crypto Art & Fashion by 5KSANA`}
          type="page"
          page={`shop/${hash}`}
        />
        <Loader />
        <div>Loading Product...</div>
      </>
    );
  }

  return (
    <>
      <SEO
        title={`${data.title} - Unique Crypto Art & Fashion by 5KSANA`}
        description={`Discover ${data.title}, a one-of-a-kind creation by 5KSANA. This Bitcoin-inspired design embodies innovation and artistic excellence. Perfect for crypto enthusiasts and art collectors alike. Shop now and own a piece of blockchain-inspired creativity!`}
        name={`${data.title} - Unique Crypto Art & Fashion by 5KSANA`}
        type="page"
        page={`shop/${hash}`}
      />
      <div className="w-[100vw] h-full">
        <div className="w-full h-full relative mt-[calc(52px+25px)] xl:mt-[calc(65px+25px)] px-[16px] xl:px-[6.25rem]">
          <div className="w-full h-full relative mt-[25px]">
            <Breadcamp />
            <div className="flex xl:flex-row flex-col w-full h-auto relative mt-[34px] xl:justify-between xl:items-start items-center 2xl:gap-[120px] gap-[60px]">
              <Slider
                data={data}
                sliderRef={sliderRef}
                sliderContainerRef={sliderContainerRef}
                handleOpenOriginal={handleOpenOriginal}
              />

              <div
                className={classNames("w-full h-max flex flex-col gap-8", {
                  "xl:sticky xl:top-[80px]": isSticky,
                })}
                ref={textContainerRef}
              >
                <h2 className="uppercase font-main font-[600] 2xl:text-6xl sm:text-5xl text-3xl text-white">
                  {data.title}
                </h2>
                <div className="w-full h-auto flex flex-col gap-6 relative">
                  <div
                    className="w-full h-auto flex flex-col gap-4 font-main font-[400] tracking-wide 2xl:text-lg text-base text-[#CFCFCF] 2xl:max-w-[90%] text-pretty pt-0.5 pb-4"
                    dangerouslySetInnerHTML={createMarkup(data.description)}
                  />
                  <div className="py-0.5 w-full flex gap-5">
                    <div className="flex flex-col max-w-[163px] font-[400] 2xl:text-base text-sm">
                      <span className="text-[#757181]">Dimension (cm):</span>
                      <span className="text-white">{data.dimensions}</span>
                    </div>
                    <div className="flex flex-col max-w-[163px] font-[400] 2xl:text-base text-sm">
                      <span className="text-[#757181]">
                        Dimension (inches):
                      </span>
                      <span className="text-white">
                        {inchesSize(data.dimensions)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <PriceLabel
                    price={getPrice(data?.price, 4, "BTC")}
                    difColor={"#FFFFFF26"}
                  />
                  <AddToCartButton
                    addToCart={addToCart}
                    isAdded={isAddedToCart}
                  />
                </div>
              </div>
            </div>

            <div className="w-full my-[90px] flex flex-col 2xl:gap-10 xl:gap-8 gap-4">
              <h2 className="font-main 2xl:text-5xl xl:text-4xl text-2xl font-[600] text-white uppercase tracking-wide">
                Related Products
              </h2>
              {!isLaptop ? (
                <div className="grid grid-cols-4 gap-7">
                  {indexesRelated.map((item, index) => (
                    <CardRelated key={index} data={relatedData[item]} />
                  ))}
                </div>
              ) : (
                <Swiper
                  slidesPerView="auto"
                  spaceBetween={20}
                  className="flex items-center !mx-0"
                >
                  {indexesRelated.map((item, index) => (
                    <SwiperSlide
                      className="sm:!w-[316px] !w-[276px] !h-auto"
                      key={index}
                    >
                      <CardRelated key={index} data={relatedData[item]} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>
          </div>
        </div>
        <ContactForm />
        <Footer />
      </div>

      <Modal isOpen={originalOpen.state} nopaddings>
        {data.images && originalOpen.state && (
          <TransformOriginal
            closeOriginal={handleCloseOriginal}
            src={data.images[originalOpen.index].original}
            alt={data.hash + "_" + originalOpen.index}
          />
        )}
      </Modal>
    </>
  );
};

export default Product;
