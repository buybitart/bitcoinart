import classNames from "classnames";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, FreeMode } from "swiper/modules";
import ReactPlayer from "react-player";
import ImageLoader from "./ImageLoader";
import usePreview from "../hooks/usePreview";
import { videoURL } from "../utils";
import { PiMagnifyingGlassPlus } from "react-icons/pi";

const Slider = ({
  data,
  sliderRef,
  sliderContainerRef,
  handleOpenOriginal,
}) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const mainSlider = useRef();

  const previewImage = usePreview(
    data?.video ? videoURL + "/" + data?.video : null,
  );

  const slides = useMemo(() => {
    const images = data.images || [];

    if (data.video)
      return [
        images[0],
        videoURL + "/" + data?.video,
        ...images.slice(1),
      ].filter(Boolean);

    return images;
  }, [data, previewImage]);

  const handlePrev = useCallback(() => {
    const swiperMain = mainSlider.current?.swiper;
    if (swiperMain) {
      swiperMain.slidePrev();
    }
  }, []);

  const handleNext = useCallback(() => {
    const swiperMain = mainSlider.current?.swiper;
    if (swiperMain) {
      swiperMain.slideNext();
    }
  }, []);

  const allowedVideoExtensions = [".mp4", ".mov", ".webm", ".avi", ".hevc"];

  return (
    <section
      className="w-full 2xl:max-w-[768px] max-w-[628px] 2xl:h-[622px] h-[522px] flex flex-col gap-6 items-center"
      ref={sliderContainerRef}
    >
      <Swiper
        spaceBetween={10}
        loop={true}
        ref={mainSlider}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Thumbs]}
        className="w-full max-w-[768px] h-[622px] relative rounded-[20px] overflow-hidden"
      >
        {(slides.length <= 4 ? [...slides, ...slides] : slides).map(
          (item, index) => (
            <SwiperSlide className="h-[427px] relative" key={index}>
              {typeof item === "string" &&
              allowedVideoExtensions.some((ext) =>
                item.toLowerCase().endsWith(ext),
              ) ? (
                <ReactPlayer
                  url={item}
                  playing={false}
                  width="100%"
                  height="100%"
                  className="w-full h-full object-cover"
                  controls
                  light={previewImage}
                />
              ) : (
                <>
                  <ImageLoader
                    src={item.optimized}
                    alt={`slide-${index}`}
                    containerStyles={"h-full"}
                    className="w-full h-full max-h-[527px] object-cover object-center"
                  />
                  <button
                    onClick={() =>
                      handleOpenOriginal(
                        data.images.findIndex(
                          (image) => image.optimized === item.optimized,
                        ),
                      )
                    }
                    className="absolute left-4 bottom-4 bg-[#000] flex items-center justify-center hover:bg-white group transition-colors duration-300 w-12 h-12 rounded-2xl"
                  >
                    <PiMagnifyingGlassPlus className="text-xl scale-x-[-1] group-hover:text-black group-hover:scale-x-[1] text-white transition-[color,transform] duration-300" />
                  </button>
                </>
              )}
            </SwiperSlide>
          ),
        )}
      </Swiper>
      <div className="flex w-full justify-center items-center gap-5">
        <button
          className={classNames(
            "w-[40px] h-[40px] transition-opacity duration-[350ms] flex justify-center items-center",
          )}
          onClick={handlePrev}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14 18L8 12L14 6L15.4 7.4L10.8 12L15.4 16.6L14 18Z"
              fill="white"
            />
          </svg>
        </button>
        <Swiper
          ref={sliderRef}
          onSwiper={setThumbsSwiper}
          loop={true}
          spaceBetween={20}
          slidesPerView={4}
          watchSlidesProgress
          modules={[FreeMode, Thumbs]}
          className="w-auto max-w-[344px] h-[71px] relative justify-center items-center flex thumbS !mx-0"
        >
          {(slides.length <= 4 ? [...slides, ...slides] : slides).map(
            (item, index) => (
              <SwiperSlide
                className="!w-[71px] !h-[71px] rounded-xl overflow-hidden cursor-pointer relative bg-[#FFFFFF1A]"
                key={index}
              >
                <ImageLoader
                  src={
                    typeof item === "string" &&
                    allowedVideoExtensions.some((ext) =>
                      item.toLowerCase().endsWith(ext),
                    )
                      ? previewImage
                      : item.optimized
                  }
                  className={`w-full h-full object-cover`}
                  containerStyles={"h-full"}
                  alt={`thumb-${index}`}
                  loading="lazy"
                />
                {typeof item === "string" &&
                allowedVideoExtensions.some((ext) =>
                  item.toLowerCase().endsWith(ext),
                ) ? (
                  <div className="w-[20px] h-[20px] flex items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 dropShadowCustom">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      version="1.1"
                      width="20"
                      height="20"
                      viewBox="0 0 256 256"
                    >
                      <g transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                        <path
                          d="M 81.73 50.284 c 4.068 -2.349 4.068 -8.22 0 -10.569 L 48.051 20.271 L 14.372 0.827 c -4.068 -2.349 -9.153 0.587 -9.153 5.284 V 45 v 38.889 c 0 4.697 5.085 7.633 9.153 5.284 l 33.679 -19.444 L 81.73 50.284 z"
                          style={{
                            fill: "rgb(255,255,255)",
                          }}
                          strokeLinecap="round"
                        />
                      </g>
                    </svg>
                  </div>
                ) : (
                  <></>
                )}
              </SwiperSlide>
            ),
          )}
        </Swiper>
        <button
          className={classNames(
            "w-[40px] h-[40px] transition-opacity duration-[350ms] flex justify-center items-center",
          )}
          onClick={handleNext}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.6 12L8 7.4L9.4 6L15.4 12L9.4 18L8 16.6L12.6 12Z"
              fill="white"
            />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default Slider;
