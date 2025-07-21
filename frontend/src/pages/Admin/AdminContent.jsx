import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import InputLabel from "../../components/InputLabel";
import { createMarkup, removeHtmlTags } from "../../utils";
import Input from "../../components/Input";
import DropboxReplace from "../../components/DropboxReplace";
import Footer from "../../components/Footer";
import SlidingBullets from "../../components/SlidingBullets";
import useResponsive from "../../hooks/useResponsive";
import TextEditor from "../../components/TextEditor";
import { useSearchParams } from "react-router-dom";
import { FaAnglesDown } from "react-icons/fa6";
import ImageLoader from "../../components/ImageLoader";
import { Helmet } from "react-helmet-async";
import api from "../../http";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import Accordion from "../../components/Accordion";

const getCategoryKey = (category) => category.toLowerCase().replace(/ /g, "");

const ImageGrid = ({
  currentCategory,
  images,
  sectionIndex,
  setImages,
  onImageChange,
}) => {
  return (
    <div className="w-full flex gap-3 h-auto items-center">
      {images.map((image, index) => (
        <div key={index} className="w-[83px] sm:w-[110px] h-auto">
          <label htmlFor={`image-upload-${index}`}>
            <DropboxReplace
              setData={(newImage) =>
                onImageChange(
                  newImage,
                  index,
                  currentCategory === "exhibitions" ? sectionIndex : null,
                )
              }
              data={images}
              index={index}
            />
          </label>
        </div>
      ))}
    </div>
  );
};

const ListEditor = ({ list = [], onListChange, onAddItem, onRemoveItem }) => {
  return (
    <div className="flex flex-col gap-3 w-full h-auto">
      <span className="text-white text-sm font-main tracking-wide">List</span>
      <div className="flex flex-col gap-3">
        {list.map((item, index) => (
          <div key={index} className="flex gap-2.5">
            <div className="py-[10px] flex justify-center items-center font-main bg-[#212121] opacity-80 aspect-[1,1] w-[45px] rounded-xl border-[1px] border-[#ffffff05] tracking-wide">
              {index + 1}
            </div>
            <Input
              defaultValue={item}
              type="text"
              onChange={(e) => onListChange(index, e.target.value)}
              className="bg-[#212121] py-[10px] w-full px-3 rounded-xl outline-none border-[1px] border-[#ffffff05] font-main placeholder-[#707070] focus:placeholder-[#ffffff00] transition-colors duration-[250ms]"
            />
            <button
              type="button"
              className="bg-[#212121] flex justify-center items-center group w-[46px] rounded-xl border-[1px] border-[#ffffff05] font-main"
              onClick={() => onRemoveItem(index)}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6C4.71667 6 4.47917 5.90417 4.2875 5.7125C4.09583 5.52083 4 5.28333 4 5C4 4.71667 4.09583 4.47917 4.2875 4.2875C4.47917 4.09583 4.71667 4 5 4H9C9 3.71667 9.09583 3.47917 9.2875 3.2875C9.47917 3.09583 9.71667 3 10 3H14C14.2833 3 14.5208 3.09583 14.7125 3.2875C14.9042 3.47917 15 3.71667 15 4H19C19.2833 4 19.5208 4.09583 19.7125 4.2875C19.9042 4.47917 20 4.71667 20 5C20 5.28333 19.9042 5.52083 19.7125 5.7125C19.5208 5.90417 19.2833 6 19 6V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM10 17C10.2833 17 10.5208 16.9042 10.7125 16.7125C10.9042 16.5208 11 16.2833 11 16V9C11 8.71667 10.9042 8.47917 10.7125 8.2875C10.5208 8.09583 10.2833 8 10 8C9.71667 8 9.47917 8.09583 9.2875 8.2875C9.09583 8.47917 9 8.71667 9 9V16C9 16.2833 9.09583 16.5208 9.2875 16.7125C9.47917 16.9042 9.71667 17 10 17ZM14 17C14.2833 17 14.5208 16.9042 14.7125 16.7125C14.9042 16.5208 15 16.2833 15 16V9C15 8.71667 14.9042 8.47917 14.7125 8.2875C14.5208 8.09583 14.2833 8 14 8C13.7167 8 13.4792 8.09583 13.2875 8.2875C13.0958 8.47917 13 8.71667 13 9V16C13 16.2833 13.0958 16.5208 13.2875 16.7125C13.4792 16.9042 13.7167 17 14 17Z"
                  className="fill-[#A3A3A3] transition-colors duration-[250ms] group-hover:fill-red-500"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onAddItem}
        className="bg-[#FCCB00] text-[#241D00] hover:bg-[#D4A900] hover:text-[#1C1600] py-[8px] w-[185px]  px-2 rounded-3xl outline-none leading-[23px] border-[1px] border-[#ffffff05] tracking-wide transition-colors duration-[250ms] font-main font-[500] flex items-center justify-center gap-2"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <mask
            id="mask0_287_2685"
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="24"
            height="24"
          >
            <rect width="24" height="24" fill="#D9D9D9" />
          </mask>
          <g mask="url(#mask0_287_2685)">
            <path
              d="M12 21C11.7167 21 11.4792 20.9042 11.2875 20.7125C11.0958 20.5208 11 20.2833 11 20V13H4C3.71667 13 3.47917 12.9042 3.2875 12.7125C3.09583 12.5208 3 12.2833 3 12C3 11.7167 3.09583 11.4792 3.2875 11.2875C3.47917 11.0958 3.71667 11 4 11H11V4C11 3.71667 11.0958 3.47917 11.2875 3.2875C11.4792 3.09583 11.7167 3 12 3C12.2833 3 12.5208 3.09583 12.7125 3.2875C12.9042 3.47917 13 3.71667 13 4V11H20C20.2833 11 20.5208 11.0958 20.7125 11.2875C20.9042 11.4792 21 11.7167 21 12C21 12.2833 20.9042 12.5208 20.7125 12.7125C20.5208 12.9042 20.2833 13 20 13H13V20C13 20.2833 12.9042 20.5208 12.7125 20.7125C12.5208 20.9042 12.2833 21 12 21Z"
              fill="#241D00"
            />
          </g>
        </svg>
        Add new
      </button>
    </div>
  );
};

const renderSectionContent = (
  key,
  value,
  setImages,
  images,
  onInputChange,
  sectionIndex,
  control,
  onImageChange,
  currentCategory,
) => {
  const contentMap = {
    description: () => (
      <Controller
        name={`${getCategoryKey(
          currentCategory,
        )}.sections[${sectionIndex}].${key}`}
        control={control}
        defaultValue={value}
        render={({ field }) => (
          <TextEditor
            description={field.value}
            onChange={(newValue) => field.onChange(newValue)}
            placeholder={`Enter ${capitalizeFirstLetter(key)}`}
            notUpd={true}
          />
        )}
      />
    ),
    list: () => (
      <>
        {value.length ? (
          <ListEditor
            list={value}
            onListChange={(listIndex, newValue) => {
              const updatedList = [...value];
              updatedList[listIndex] = newValue;
              onInputChange(
                { target: { name: "list", value: updatedList } },
                sectionIndex,
                listIndex,
              );
            }}
            onAddItem={() => {
              const updatedList = [...value, ""];
              onInputChange(
                { target: { name: "list", value: updatedList } },
                sectionIndex,
              );
            }}
            onRemoveItem={(listIndex) => {
              const updatedList = value.filter(
                (_, index) => index !== listIndex,
              );
              onInputChange(
                { target: { name: "list", value: updatedList } },
                sectionIndex,
              );
            }}
          />
        ) : (
          <></>
        )}
      </>
    ),
    default: () => {
      if (key !== "id")
        return (
          <Controller
            name={`${getCategoryKey(
              currentCategory,
            )}.sections[${sectionIndex}].${key}`}
            control={control}
            defaultValue={value}
            render={({ field }) => (
              <InputLabel
                label={capitalizeFirstLetter(key)}
                defaultValue={removeHtmlTags(field.value)}
                name={key}
                onChange={(e) => field.onChange(e.target.value)}
              />
            )}
          />
        );
    },
    images: () => {
      if (
        (currentCategory.toLowerCase() === "about" && sectionIndex === 0) ||
        currentCategory.toLowerCase() === "exhibitions"
      ) {
        return (
          <ImageGrid
            currentCategory={currentCategory.toLowerCase()}
            sectionIndex={sectionIndex}
            images={
              currentCategory.toLowerCase() === "exhibitions"
                ? [images[sectionIndex]]
                : images
            }
            setImages={setImages}
            onImageChange={(newImage, index, sectionIndex) =>
              onImageChange(newImage, index, sectionIndex)
            }
          />
        );
      }
      return null;
    },
  };

  if (
    key === "images" &&
    !(
      (currentCategory.toLowerCase() === "about" && sectionIndex === 0) ||
      currentCategory.toLowerCase() === "exhibitions"
    )
  )
    return null;

  return contentMap[key]?.() || contentMap.default();
};

const SectionSetting = React.memo(
  ({
    section,
    index,
    setImages,
    images,
    onInputChange,
    control,
    onImageChange,
    currentCategory,
    realIndex,
    onRemove,
  }) => (
    <div className="w-full flex flex-col gap-6">
      <div className="flex w-full justify-between gap-3 items-center">
        <h3 className="font-main text-2xl text-white">
          {index + 1} section{" "}
          {currentCategory === "Privacy policy" &&
            index > 18 &&
            index <= 30 &&
            "(Table)"}
        </h3>
        {onRemove &&
          (currentCategory === "Proof of work" ||
            currentCategory === "Exhibitions") && (
            <button
              type="button"
              className="bg-[#212121] flex justify-center items-center group w-[32px] h-[32px] rounded-xl border-[1px] border-[#ffffff05] font-main"
              onClick={() => onRemove(index)}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6C4.71667 6 4.47917 5.90417 4.2875 5.7125C4.09583 5.52083 4 5.28333 4 5C4 4.71667 4.09583 4.47917 4.2875 4.2875C4.47917 4.09583 4.71667 4 5 4H9C9 3.71667 9.09583 3.47917 9.2875 3.2875C9.47917 3.09583 9.71667 3 10 3H14C14.2833 3 14.5208 3.09583 14.7125 3.2875C14.9042 3.47917 15 3.71667 15 4H19C19.2833 4 19.5208 4.09583 19.7125 4.2875C19.9042 4.47917 20 4.71667 20 5C20 5.28333 19.9042 5.52083 19.7125 5.7125C19.5208 5.90417 19.2833 6 19 6V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM10 17C10.2833 17 10.5208 16.9042 10.7125 16.7125C10.9042 16.5208 11 16.2833 11 16V9C11 8.71667 10.9042 8.47917 10.7125 8.2875C10.5208 8.09583 10.2833 8 10 8C9.71667 8 9.47917 8.09583 9.2875 8.2875C9.09583 8.47917 9 8.71667 9 9V16C9 16.2833 9.09583 16.5208 9.2875 16.7125C9.47917 16.9042 9.71667 17 10 17ZM14 17C14.2833 17 14.5208 16.9042 14.7125 16.7125C14.9042 16.5208 15 16.2833 15 16V9C15 8.71667 14.9042 8.47917 14.7125 8.2875C14.5208 8.09583 14.2833 8 14 8C13.7167 8 13.4792 8.09583 13.2875 8.2875C13.0958 8.47917 13 8.71667 13 9V16C13 16.2833 13.0958 16.5208 13.2875 16.7125C13.4792 16.9042 13.7167 17 14 17Z"
                  className="fill-[#A3A3A3] transition-colors duration-[250ms] group-hover:fill-red-500"
                />
              </svg>
            </button>
          )}
      </div>
      <div className="flex flex-col gap-6">
        {Object.entries(section).map(([key, value]) => (
          <React.Fragment key={key}>
            {renderSectionContent(
              key,
              value,
              setImages,
              images,
              onInputChange,
              index,
              control,
              onImageChange,
              currentCategory,
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  ),
);

const DefaultProofTemplate = ({ section }) => {
  if (section.description)
    return (
      <div className="w-full h-full flex flex-col gap-2 px-5 sm:px-10 sm:py-5 py-2.5 justify-center">
        <div
          className="flex flex-col gap-2 sm:text-sm text-xs"
          dangerouslySetInnerHTML={createMarkup(section.description)}
        />
      </div>
    );

  const videoId = section.additional.split("/embed/")[1];
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  return (
    <div className="w-full h-full flex flex-col gap-2 px-5 sm:px-10 sm:py-5 py-2.5 justify-center">
      {thumbnailUrl && (
        <div className="relative w-full h-auto flex justify-between gap-2">
          <div className="w-full h-auto sm:max-h-[250px] max-h-[130px] rounded-xl bg-[#ffffff1A] overflow-hidden">
            <ImageLoader
              src={thumbnailUrl}
              alt="proof-frame"
              containerStyles={`w-full h-full rounded-xl overflow-hidden`}
              className="object-cover object-center w-full h-full rounded-xl"
            />
          </div>
        </div>
      )}
      {section.title && (
        <h2 className="font-main uppercase sm:text-xl text-base font-[600] tracking-wide">
          {section.title}
        </h2>
      )}
    </div>
  );
};

const DefaultExTemplate = ({ section }) => {
  return (
    <div className="w-full h-full flex flex-col gap-2 px-5 sm:px-10 sm:py-5 py-2.5 justify-center sm:min-h-[381px] min-h-[230px]">
      <div className="max-w-[400px] mx-auto relative">
        {(section?.images[0]?.original || section?.images[0]?.src) && (
          <div className="relative w-full h-auto flex justify-between">
            <div className="w-full h-auto sm:max-h-[280px] max-h-[150px] rounded-xl bg-[#ffffff1A] overflow-hidden mb-2">
              <ImageLoader
                src={section.images[0].original || section.images[0].src}
                alt="ex-frame"
                containerStyles={`w-full h-full rounded-xl overflow-hidden`}
                className="object-cover object-center w-full h-full rounded-xl"
              />
            </div>
          </div>
        )}
        {section.title && (
          <h2 className="font-main uppercase sm:text-lg text-base font-[600] tracking-wide">
            {section.title}
          </h2>
        )}
        {section.additional && (
          <span className="inline-flex gap-1 font-main relative top-[-4px]">
            [{" "}
            <a
              href={section.additional}
              target="_blank"
              className="text-[#fccb00] underline opacity-60 font-[300] line-clamp-1 hover:opacity-100 transition-opacity duration-300"
            >
              {section.additional}
            </a>{" "}
            ]
          </span>
        )}
      </div>
    </div>
  );
};

const DefaultFAQTemplate = ({ section }) => {
  return (
    <div className="w-full h-full flex flex-col gap-2 px-5 sm:px-10 sm:py-5 py-2.5 justify-center">
      <div className="w-full h-auto">
        <Accordion
          title={section.title}
          id={`faqs-${section.title}`}
          active={true}
        >
          {section.description}
        </Accordion>
      </div>
    </div>
  );
};

const contentMapping = (
  section,
  isMobile,
  isSmallMobile,
  renderDefaultProof,
  renderDefaultEx,
  renderDefaultFAQ,
) => ({
  "main page": {
    0: () => (
      <div className="w-full h-full px-5 sm:px-10 relative flex flex-row justify-between items-center">
        <div className="w-full h-auto flex flex-col max-w-[50%]">
          <h1
            className={`font-main font-[700] 2xl:text-6xl xl:text-5xl sm:text-7xl ${
              isSmallMobile ? "text-3xl" : "text-4xl"
            } uppercase sm:tracking-wider text-left w-auto break-words`}
          >
            {section.title}
          </h1>
          <span
            dangerouslySetInnerHTML={createMarkup(section.description)}
            className={`sm:mt-3 mt-2 font-main font-[400] 2xl:text-lg xl:text-base sm:text-xl sm:max-w-max max-w-[90%] ${
              isSmallMobile ? "text-[10px]" : "text-xs"
            } uppercase break-words 2xl:leading-[115%] xl:leading-[110%] leading-[115%] tracking-wider text-left opacity-90`}
          />
          <button
            className={`font-main w-max max-w-max mx-0 text-center sm:text-[10px] uppercase ${
              isSmallMobile ? "text-[5px] px-1.5 mt-3" : "text-[7px] px-3 mt-4"
            } sm:mt-[22px] border-[1px] border-[#2c2c2e] py-1 sm:py-1.5 rounded-[1.8rem] font-[500] transition duration-[250ms] hover:text-[#522700] hover:bg-[#FCCB00] hover:border-[#FCCB00]`}
          >
            Browse Gallery
          </button>
          <button
            className={`2xl:w-[70px] xl:w-[60px] sm:w-[75px] ${
              isSmallMobile
                ? "w-[30px] h-[30px] mt-3"
                : "w-[50px] h-[50px] mt-5"
            } opacity-50 hover:opacity-70 transition-[opacity,left] duration-700 2xl:h-[70px] xl:h-[60px] sm:h-[75px] flex items-center justify-center relative rounded-full sm:mt-9 mx-0 group`}
          >
            <img
              src="/roundedScroll.svg"
              alt="roundedScroll"
              className="w-full h-auto absolute inset-0 object-contain pointer-events-none group-hover:rotate-[360deg] transition-transform duration-1000"
              draggable={false}
            />
            <img
              src="/down-arrow.svg"
              alt="down-arrow"
              className={`sm:w-[20px] sm:h-[20px] ${
                isSmallMobile ? "h-[10px] w-[10px]" : "h-[16px] w-[16px]"
              } object-contain group-hover:scale-110 transition-transform duration-700`}
              draggable={false}
            />
          </button>
        </div>
        <div className="w-full h-full relative flex justify-center items-center max-w-[50%]">
          <div
            className={`absolute sm:w-[15rem] sm:h-[15rem] w-[10rem] h-[10rem] bg-[#FFB82BB2] left-[50%] xl:left-[55%] top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full ${
              !isMobile ? "webkitBlurIos130" : "webkitBlurIos80"
            } pointer-events-none`}
          />
          <img
            src="/btcMain.png"
            className={`2xl:w-[11.5rem] 2xl:h-[11.5rem] xl:w-[10rem] xl:h-[10rem] sm:w-[11.5rem] sm:h-[11.5rem] ${
              isSmallMobile ? "w-[6rem] h-[6rem]" : "w-[8rem] h-[8rem]"
            }`}
            alt="btc"
            draggable={false}
          />
        </div>
      </div>
    ),
    1: () => (
      <div className="w-full h-full px-10 relative flex flex-row justify-center items-center">
        <h2
          dangerouslySetInnerHTML={createMarkup(section.title)}
          className={`font-extra w-auto text-center uppercase text-4xl sm:text-6xl leading-[100%] relative max-w-[100%] break-words`}
        />
      </div>
    ),
  },
  about: {
    0: () => (
      <div className="w-full h-full px-5 sm:px-10 sm:py-5 py-2.5 relative flex flex-col lg:gap-6 sm:gap-4 gap-2 justify-center">
        <h2 className="font-main uppercase sm:text-4xl text-2xl font-[600] tracking-wide">
          {section.title}
        </h2>
        <div className="relative w-full h-auto flex justify-between gap-2">
          {section.images.map((image, index) => (
            <div className="w-full h-auto" key={index}>
              <ImageLoader
                src={image.src || image.original}
                alt={image.name || `me-${index}`}
                className="w-full h-full object-cover rounded-none"
                containerStyles={`h-full`}
                draggable="false"
              />
            </div>
          ))}
        </div>
      </div>
    ),
    1: () => (
      <div className="w-full h-full flex flex-col lg:gap-6 sm:gap-4 gap-2 px-5 sm:px-10 sm:py-5 py-2.5 justify-center">
        <h2 className="font-main uppercase sm:text-4xl text-2xl font-[600] tracking-wide">
          {section.title}
        </h2>
        <p
          dangerouslySetInnerHTML={createMarkup(section.description)}
          className="text-[#CFCFCF] lg:font-[400] font-[300] lg:text-base sm:text-sm text-xs max-w-[90%]"
        />
      </div>
    ),
    2: () => (
      <div className="w-full h-full flex flex-col lg:gap-6 sm:gap-4 gap-2 px-5 sm:px-10 sm:py-5 py-2.5 justify-center">
        <h2 className="font-main uppercase sm:text-4xl text-2xl font-[600] tracking-wide">
          {section.title}
        </h2>
        <p
          dangerouslySetInnerHTML={createMarkup(section.description)}
          className="text-[#CFCFCF] lg:font-[400] font-[300] lg:text-base sm:text-sm text-xs max-w-[90%]"
        />
      </div>
    ),
    3: () => (
      <div className="w-full h-full flex flex-col lg:gap-6 sm:gap-4 gap-2 px-5 sm:px-10 sm:py-5 py-2.5 justify-center">
        <div className="flex lg:flex-row flex-col w-full h-auto justify-between lg:gap-5 gap-6 relative">
          <div className="w-full h-auto flex flex-col gap-3.5 font-main">
            <h2
              dangerouslySetInnerHTML={createMarkup(section.title)}
              className="font-main uppercase sm:text-4xl text-2xl font-[600] tracking-wide"
            />
            <div className="flex flex-col gap-1.5 w-auto h-auto text-[#CFCFCF] font-[300] lg:text-sm text-xs">
              {section.list.map((item, index) => (
                <p key={index}>{item}</p>
              ))}
            </div>
          </div>
          <div className="w-full h-auto flex flex-col justify-end">
            <p
              dangerouslySetInnerHTML={createMarkup(section.description)}
              className="text-[#CFCFCF] lg:font-[400] font-[300] lg:text-sm text-xs"
            />
          </div>
        </div>
      </div>
    ),
  },
  shop: {
    0: () => (
      <div className="w-full h-full flex flex-col lg:gap-6 sm:gap-4 gap-2 px-5 sm:px-10 sm:py-5 py-2.5 justify-center">
        <h2 className="font-main uppercase sm:text-4xl text-2xl font-[600] tracking-wide">
          {section.title}
        </h2>

        <div className="relative w-full h-auto flex flex-1 justify-between gap-4">
          {[{}, {}, {}].map((item, index) => (
            <div
              className="w-full h-full max-h-[330px] rounded-xl bg-[#ffffff1A]"
              key={index}
            ></div>
          ))}
        </div>
      </div>
    ),
  },
  "bitcoin art gallery": {
    0: () => (
      <div className="w-full h-full flex flex-col lg:gap-6 sm:gap-4 gap-2 px-5 sm:px-10 sm:py-5 py-2.5 justify-center">
        <div className="w-full h-auto flex justify-between items-center">
          <h2 className="font-main uppercase sm:text-4xl text-2xl font-[600] tracking-wide">
            {section.title}
          </h2>

          <div className="h-auto flex max-w-[350px] items-center gap-1.5 pointer-events-none select-none text-nowrap">
            <span
              dangerouslySetInnerHTML={createMarkup(section.description)}
              className={`font-main text-[#FCCB00] ${
                isSmallMobile ? "text-xs" : "text-sm"
              } sm:text-base font-[300] text-right text-wrap select-none`}
            />
            <FaAnglesDown size={14} className="text-[#FCCB00]" />
          </div>
        </div>

        <div className="relative w-full h-auto flex flex-1 justify-between gap-4">
          {[{}, {}, {}].map((item, index) => (
            <div
              className="w-full h-full max-h-[330px] rounded-xl bg-[#ffffff1A]"
              key={index}
            ></div>
          ))}
        </div>
      </div>
    ),
  },
  "proof of work": {
    default: renderDefaultProof,
  },
  exhibitions: {
    default: renderDefaultEx,
  },
  faq: {
    default: renderDefaultFAQ,
  },
  support: {
    0: () => (
      <div className="w-full h-full flex flex-col lg:gap-6 sm:gap-4 gap-2 px-5 sm:px-10 sm:py-5 py-2.5 justify-center font-main">
        <div className="flex flex-col gap-3 justify-center items-center">
          <h2 className="uppercase lg:text-4xl text-2xl font-[600] tracking-wide flex items-center sm:gap-4 gap-2">
            {section.title.split(" ")[0]}{" "}
            <ImageLoader
              src="https://i.ibb.co/JFpzcc5p/IMG-8594-scaled-1.jpg"
              alt="me"
              className="sm:h-[42px] h-[32px] sm:w-[52px] w-[32px] sm:rounded-xl rounded-lg object-cover"
              draggable={false}
            />{" "}
            {section.title.replace(section.title.split(" ")[0], "")}
          </h2>
          <h4
            className="text-[#CFCFCF] font-[300] lg:text-base sm:text-sm text-xs text-center mb-3"
            dangerouslySetInnerHTML={createMarkup(section.description)}
          />
        </div>
      </div>
    ),
    1: () => (
      <div className="w-full h-full flex flex-col lg:gap-6 sm:gap-4 gap-2 px-5 sm:px-10 sm:py-5 py-2.5 justify-center font-main">
        <a
          href={section.additional}
          className="lg:text-xl text-base text-center text-[#fccb00] underline font-[300] tracking-wide"
        >
          {section.title}
        </a>
        <span className="bg-[#202020] px-3 w-auto mx-auto py-1 sm:text-base text-xs rounded-xl border-[1px] border-[#ffffff07] text-white/70 font-[300]">
          Link{" "}
          {section.additional.includes("mailto:") ? "opens email app:" : "to:"}{" "}
          <a href={section.additional} className="text-white/90">
            {section.additional.replace("mailto:", "")}
          </a>
        </span>
      </div>
    ),
    2: () => (
      <div className="w-full h-full flex flex-col lg:gap-6 sm:gap-4 gap-2 px-5 sm:px-10 sm:py-5 py-2.5 justify-center text-center font-main">
        <div>
          <b className="text-lg sm:text-xl">{section.title}</b>
          <br />{" "}
          <p
            className="text-xs sm:text-sm"
            dangerouslySetInnerHTML={createMarkup(section.description)}
          />
        </div>
      </div>
    ),
    3: () => (
      <div className="w-full h-full flex flex-col lg:gap-6 sm:gap-4 gap-2 px-5 sm:px-10 sm:py-5 py-2.5 justify-center text-center font-main">
        <div>
          <b className="text-lg sm:text-xl">{section.title}</b>
          <br />{" "}
          <p
            className="text-xs sm:text-sm"
            dangerouslySetInnerHTML={createMarkup(section.description)}
          />
        </div>
      </div>
    ),
    4: () => (
      <div className="w-full h-full flex flex-col lg:gap-6 sm:gap-4 gap-2 px-5 sm:px-10 sm:py-5 py-2.5 justify-center text-center font-main">
        <div>
          {section.title && (
            <>
              <b className="text-lg sm:text-xl">{section.title}</b>
              <br />
            </>
          )}{" "}
          <p
            className="text-xs sm:text-sm"
            dangerouslySetInnerHTML={createMarkup(section.description)}
          />
        </div>
      </div>
    ),
  },
  elements: {
    0: () => (
      <div className="w-full h-full flex flex-col lg:gap-6 sm:gap-4 gap-2 px-5 sm:px-10 sm:py-5 py-2.5 justify-center">
        <div className="w-full z-[1] h-auto rounded-[20px] p-4 sm:p-8 bg-[#FFFFFF1A] border-[1px] border-[#212121] backdrop-blur-xl xl:flex-row flex-col flex justify-between">
          <div className="flex flex-col gap-6 sm:gap-[40px] w-full h-auto">
            <div className="flex flex-col sm:gap-4 gap-2.5 w-full xl:w-fit h-auto relative">
              <h4
                dangerouslySetInnerHTML={createMarkup(section.title)}
                className="font-main uppercase 2xl:text-3xl xl:text-xl sm:text-2xl text-xl font-[600] w-max tracking-wider"
              />
              <p
                dangerouslySetInnerHTML={createMarkup(section.description)}
                className="font-main font-[300] opacity-50 lg:max-w-[450px] w-auto text-xs sm:text-sm lg:text-base sm:tracking-wide"
              />
            </div>
            <a
              href={`mailto:info@buybitart.com`}
              className="relative w-auto h-auto flex gap-1"
            >
              <img
                src="/email.svg"
                alt="email"
                className="w-[24px] h-[24px] object-contain"
              />
              <span className="font-main font-[300] sm:text-sm text-xs underline underline-offset-1">
                info@buybitart.com
              </span>
            </a>
          </div>
        </div>
      </div>
    ),
  },
});

const ContentDisplay = ({ section, category, index }) => {
  const { isSmallMobile, isMobile } = useResponsive();

  const renderDefaultProof = useCallback(
    () => <DefaultProofTemplate section={section} />,
    [section],
  );

  const renderDefaultEx = useCallback(
    () => <DefaultExTemplate section={section} />,
    [section],
  );

  const renderDefaultFAQ = useCallback(
    () => <DefaultFAQTemplate section={section} />,
    [section],
  );

  const mappings = contentMapping(
    section,
    isMobile,
    isSmallMobile,
    renderDefaultProof,
    renderDefaultEx,
    renderDefaultFAQ,
  );
  const categoryContent = mappings[category.toLowerCase()];
  const renderContent =
    categoryContent?.[index] || categoryContent?.default || (() => null);

  return renderContent();
};

const AdminContent = () => {
  const { control, handleSubmit, setValue, reset, watch } = useForm();
  const [images, setImages] = useState([]);
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get("currentCategory") || "Main page";

  useEffect(() => {
    const fetchCategoryData = async () => {
      const categoryKey = getCategoryKey(currentCategory);

      try {
        const response = await api.get(`/settings/${categoryKey}`);
        const fetchedData = response.data;

        const sectionsWithIds = (fetchedData.sections || []).map((section) => ({
          ...section,
          images: section.images,
          id: uuidv4(),
        }));

        const finalData = {
          ...fetchedData,
          sections: sectionsWithIds,
        };

        reset({ [categoryKey]: finalData });

        const initialImages =
          currentCategory === "About"
            ? fetchedData.sections?.[0]?.images || []
            : currentCategory === "Exhibitions"
            ? fetchedData.sections
                ?.map((section) => section.images?.[0])
                .filter((image) => image) || []
            : [];
        setImages(initialImages);
      } catch (error) {
        console.error("Failed to fetch category data:", error);
      }
    };

    fetchCategoryData();
  }, [currentCategory, reset]);

  const handleImageChange = (updatedImages, index, sectionIndex) => {
    const categoryKey = getCategoryKey(currentCategory);
    const newImages = [...images];
    if (sectionIndex !== null && sectionIndex !== undefined) {
      newImages[sectionIndex] = updatedImages[index];
      setValue(
        `${categoryKey}.sections[${sectionIndex}].images`,
        updatedImages,
      );
    } else {
      newImages[index] = updatedImages[index];
      setValue(`${categoryKey}.sections[0].images`, newImages);
    }
    setImages(newImages);
  };

  const handleAddSection = () => {
    const categoryKey = getCategoryKey(currentCategory);
    const sections = formData[categoryKey]?.sections || [];

    let newSection = {};

    if (currentCategory === "Proof of work") {
      newSection = { id: uuidv4(), title: "", additional: "" };
      const mainSections = sections.slice(0, -1);
      const lastSection = sections[sections.length - 1];

      const updatedSections = [...mainSections, newSection, lastSection];

      setValue(`${categoryKey}.sections`, updatedSections);
    } else if (currentCategory === "Exhibitions") {
      newSection = { id: uuidv4(), title: "", additional: "", images: [] };
      const updatedSections = [...sections, newSection];

      setValue(`${categoryKey}.sections`, updatedSections);
    }
  };

  const handleRemoveSection = (index) => {
    const categoryKey = getCategoryKey(currentCategory);
    const sections = formData[categoryKey]?.sections || [];

    if (currentCategory === "Proof of work") {
      const mainSections = sections.slice(0, -1);
      const lastSection = sections[sections.length - 1];
      const updatedMain = mainSections.filter((_, i) => i !== index);
      setValue(`${categoryKey}.sections`, [...updatedMain, lastSection]);
    } else if (currentCategory === "Exhibitions") {
      const updatedSections = sections.filter((_, i) => i !== index);
      setValue(`${categoryKey}.sections`, updatedSections);

      setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    }
  };

  const onInputChange = useCallback(
    (event, sectionIndex, listIndex = null) => {
      const { name, value } = event.target;
      const categoryKey = getCategoryKey(currentCategory);

      if (name === "list")
        setValue(`${categoryKey}.sections[${sectionIndex}].list`, value);
      else setValue(`${categoryKey}.sections[${sectionIndex}].${name}`, value);
    },
    [currentCategory, setValue],
  );

  const formData = watch();

  const renderSections = () => {
    const categoryKey = getCategoryKey(currentCategory);
    const sections = formData[categoryKey]?.sections || [];

    const isProof = currentCategory === "Proof of work";
    const isExhibitions = currentCategory === "Exhibitions";

    const mainSections = isProof ? sections.slice(0, -1) : sections;
    const lastSection = isProof ? sections[sections.length - 1] : null;

    return (
      <div
        className={`w-full h-auto flex flex-col gap-11 ${
          currentCategory !== "Privacy policy" &&
          currentCategory !== "Policies" &&
          "xl:max-w-[calc(50%-75px)]"
        }`}
      >
        <AnimatePresence>
          {mainSections.map((section, index) => (
            <SectionSetting
              key={`section-${section.id}`}
              section={section}
              index={index}
              realIndex={index}
              setImages={setImages}
              images={images}
              onInputChange={onInputChange}
              control={control}
              onImageChange={handleImageChange}
              currentCategory={currentCategory}
              onRemove={() => handleRemoveSection(index)}
            />
          ))}
        </AnimatePresence>

        {(isProof || isExhibitions) && (
          <button
            type="button"
            onClick={handleAddSection}
            className="bg-[#FCCB00] text-[#241D00] hover:bg-[#D4A900] hover:text-[#1C1600] py-[8px] w-[185px] px-2 rounded-3xl outline-none border-[1px] border-[#ffffff05] font-main font-[500] flex items-center justify-center gap-2"
          >
            + New Section
          </button>
        )}

        {isProof && lastSection && (
          <SectionSetting
            section={lastSection}
            index={sections.length - 1}
            realIndex={sections.length - 1}
            setImages={setImages}
            images={images}
            onInputChange={onInputChange}
            control={control}
            onImageChange={handleImageChange}
            currentCategory={currentCategory}
            onRemove={null}
          />
        )}

        <button className="flex font-main shadow-xl z-[2] rounded-[1.25rem] sticky bottom-5 w-full h-[44px] bg-[#FCCB00] text-[#522700] font-[600] items-center justify-center hover:bg-[#D4A900] hover:text-[#1C1600] transition-colors duration-[250ms]">
          Save all changes
        </button>
      </div>
    );
  };

  const renderScreens = () => {
    const categoryKey = getCategoryKey(currentCategory);
    const sections = formData[categoryKey]?.sections || [];

    return (
      <div className="w-full h-auto flex flex-col gap-8 xl:max-w-[calc(50%-75px)]">
        {sections.map((section, index) => (
          <div
            key={index}
            className={`${
              (categoryKey === "about" && section.list.length) ||
              (categoryKey === "proofofwork" && section.description) ||
              categoryKey === "exhibitions" ||
              categoryKey === "faq"
                ? ""
                : "aspect-[16/9]"
            } rounded-3xl border-[1px] border-[#ffffff1A] overflow-hidden`}
          >
            <ContentDisplay
              section={section}
              category={currentCategory}
              index={index}
            />
          </div>
        ))}
      </div>
    );
  };

  const onSubmit = async (data) => {
    const categoryKey = getCategoryKey(currentCategory);
    const payload = { ...data[categoryKey] };

    try {
      payload.sections = payload.sections.map((section) => ({
        ...section,
        list: Array.isArray(section.list) ? section.list : [],
      }));

      const updatedImages = [...images];
      const newImages = updatedImages.filter((img) =>
        img?.src?.startsWith("data:image"),
      );

      if (newImages.length > 0) {
        const formDataImgUpload = new FormData();
        newImages.forEach((image) => {
          const base64Data = image.src.replace(/^data:image\/\w+;base64,/, "");
          formDataImgUpload.append("images", base64Data);
        });

        const { data: uploadedImages } = await toast.promise(
          api.post("/utils/upload-images", formDataImgUpload, {
            headers: { "Content-Type": "multipart/form-data" },
          }),
          {
            pending: "Uploading images...",
            success: "Images uploaded successfully!",
            error: "Failed to upload images",
          },
        );

        let uploadedIndex = 0;
        updatedImages.forEach((image, index) => {
          if (image?.src?.startsWith("data:image")) {
            updatedImages[index] = uploadedImages[uploadedIndex];
            uploadedIndex++;
          }
        });
      }

      if (currentCategory === "Exhibitions")
        payload.sections.map(
          (section, index) => (section.images = updatedImages[index]),
        );
      else payload.sections[0].images = updatedImages;

      await toast.promise(api.put(`/settings/${categoryKey}`, payload), {
        pending: `Updating ${currentCategory}...`,
        success: `${currentCategory} updated successfully!`,
        error: `Failed to update :/`,
      });
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin page | Content Editing</title>
      </Helmet>
      <div className="w-full h-full">
        <header className="mt-[calc(52px+40px)] xl:mt-[calc(65px+40px)] px-4 xl:px-[6.25rem] pb-14">
          <h2 className="font-main text-4xl font-semibold mb-3">
            Page content edit
          </h2>
          <nav className="sticky top-[52px] xl:top-[65px] bg-black z-[15] flex gap-3 py-3 w-full border-b border-[#FFFFFF1A]">
            <SlidingBullets
              data={[
                "Main page",
                "About",
                "Shop",
                "Bitcoin art gallery",
                "Proof of work",
                "Exhibitions",
                "FAQ",
                "Support",
                "Privacy policy",
                "Policies",
                "Elements",
              ]}
              state={currentCategory}
              className="w-full h-auto flex items-center !mx-0"
            />
          </nav>
          <AnimatePresence mode="wait">
            <form
              className="flex w-full h-auto"
              onSubmit={handleSubmit(onSubmit)}
            >
              <motion.div
                key={currentCategory}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full flex xl:flex-row flex-col 2xl:gap-[150px] lg:gap-[100px] gap-[45px] mt-5 min-h-[580px]"
              >
                {renderSections()}
                {currentCategory !== "Privacy policy" &&
                  currentCategory !== "Policies" &&
                  renderScreens()}
              </motion.div>
            </form>
          </AnimatePresence>
        </header>

        <Footer />
      </div>
    </>
  );
};

const capitalizeFirstLetter = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export default AdminContent;
