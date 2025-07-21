import React, { useEffect, useRef, useState } from "react";
import Breadcamp from "../components/Breadcrumb";
import Slider from "../components/Slider";
import classNames from "classnames";
import { createMarkup } from "../utils";
import CardRelated from "../components/CardRelated";
import { Swiper, SwiperSlide } from "swiper/react";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";
import { useNavigate, useParams } from "react-router-dom";
import useResponsive from "../hooks/useResponsive";
import SEO from "../utils/SEO";
import axios from "axios";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import TransformOriginal from "../components/TransformOriginal";

const GalleryProduct = () => {
  const { hash } = useParams();
  const sliderRef = useRef(null);
  const sliderContainerRef = useRef(null);
  const textContainerRef = useRef(null);
  const errorShownRef = useRef(false);
  const [data, setData] = useState({});
  const [relatedData, setRelatedData] = useState([]);
  const [originalOpen, setOriginalOpen] = useState({
    state: false,
    index: null,
  });

  const { isBigLaptop, isLaptop } = useResponsive();

  const [indexesRelated, setIndexesRelated] = useState([]);
  const [isSticky, setIsSticky] = useState(false);

  const navigate = useNavigate();

  const handleOpenOriginal = (index) => {
    setOriginalOpen({
      state: true,
      index: index,
    });
  };

  const handleCloseOriginal = () => {
    setOriginalOpen({
      state: false,
      index: originalOpen.index,
    });
  };

  useEffect(() => {
    if (
      sliderContainerRef.current &&
      textContainerRef.current &&
      !isBigLaptop
    ) {
      const isSliderTaller =
        sliderContainerRef.current.offsetHeight >
        textContainerRef.current.offsetHeight * 1.3;
      setIsSticky(isSliderTaller);
    }
  }, [isBigLaptop, data]);

  useEffect(() => {
    async function fetchProductDetails() {
      try {
        const galleryProductResponse = await axios.get(
          `${import.meta.env.VITE_DB_LINK}/api/gallery-products/${hash}`,
        );
        const relatedGalleryResponse = await axios.get(
          `${import.meta.env.VITE_DB_LINK}/api/gallery-products`,
        );
        setData(galleryProductResponse.data);
        setRelatedData(
          relatedGalleryResponse.data.filter((item) => item.hash !== hash),
        );
      } catch (error) {
        console.error("Failed to fetch product details:", error);
      }
    }
    fetchProductDetails();
  }, [hash]);

  useEffect(() => {
    const generateRandomIndexes = () => {
      const indexes = new Set();
      while (indexes.size < 4 && indexes.size < relatedData.length) {
        indexes.add(Math.floor(Math.random() * relatedData.length));
      }
      return Array.from(indexes);
    };

    if (relatedData.length > 0) {
      setIndexesRelated(generateRandomIndexes());
    }
  }, [relatedData]);

  if (!data?.title) {
    if (data === null && !errorShownRef.current) {
      toast.error("Page not Found");
      errorShownRef.current = true;
      navigate("/shop");
    }
    return (
      <>
        <SEO
          title="Gallery Product - Bitcoin-Inspired Masterpiece by 5KSANA"
          description="Explore Gallery Product by 5KSANA—Bitcoin-inspired art blending blockchain culture with creative vision. Discover exclusive crypto masterpieces today."
          name="Gallery Product - Bitcoin-Inspired Masterpiece by 5KSANA"
          type="page"
          page={`gallery/${hash}`}
        />
        <Loader />
        <div>Loading Gallery Product...</div>
      </>
    );
  }

  return (
    <>
      <SEO
        title={`${data.title} - Bitcoin-Inspired Masterpiece by 5KSANA`}
        description="Explore Gallery Product by 5KSANA—Bitcoin-inspired art blending blockchain culture with creative vision. Discover exclusive crypto masterpieces today."
        name={`${data.title} - Bitcoin-Inspired Masterpiece by 5KSANA`}
        type="page"
        page={`gallery/${hash}`}
      />
      <section className="w-[100vw] h-full">
        <div className="w-full h-full relative mt-[calc(52px+25px)] xl:mt-[calc(65px+25px)] px-[16px] xl:px-[6.25rem]">
          <div className="w-full h-full relative mt-[25px]">
            <Breadcamp difRoute="Gallery" />

            {/* Product Section */}
            <div className="flex xl:flex-row flex-col w-full h-auto relative mt-[34px] xl:justify-between xl:items-start items-center 2xl:gap-[120px] gap-[60px]">
              <Slider
                data={data}
                sliderRef={sliderRef}
                sliderContainerRef={sliderContainerRef}
                handleOpenOriginal={handleOpenOriginal}
              />

              {/* Product Details */}
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
                    className="w-full h-auto flex flex-col gap-4 relative font-main font-[400] tracking-wide 2xl:text-lg text-base text-[#CFCFCF] 2xl:max-w-[90%] text-pretty pt-0.5 pb-4"
                    dangerouslySetInnerHTML={createMarkup(data.description)}
                  />
                </div>
              </div>
            </div>

            {/* Related Products Section */}
            <div className="w-full h-auto relative my-[90px] flex flex-col 2xl:gap-10 xl:gap-8 gap-4 overflow-hidden">
              <h2 className="font-main 2xl:text-5xl xl:text-4xl text-2xl font-[600] leading-[43.2px] text-white uppercase tracking-wide">
                Related Arts
              </h2>

              {!isLaptop ? (
                <div className="w-full h-auto grid grid-cols-4 gap-7">
                  {(indexesRelated || []).map((index) => (
                    <CardRelated
                      fixHeight
                      difRoute="gallery"
                      noPrice
                      key={index}
                      data={relatedData[index]}
                    />
                  ))}
                </div>
              ) : (
                <Swiper
                  slidesPerView="auto"
                  spaceBetween={20}
                  className="w-full h-auto flex items-center !mx-0"
                >
                  {(indexesRelated || []).map((index) => (
                    <SwiperSlide
                      className="sm:!w-[316px] !w-[276px] !h-auto"
                      key={index}
                    >
                      <CardRelated
                        fixHeight
                        difRoute="gallery"
                        noPrice
                        data={relatedData[index]}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>
          </div>
        </div>
        <ContactForm />
        <Footer />
      </section>

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

export default GalleryProduct;
