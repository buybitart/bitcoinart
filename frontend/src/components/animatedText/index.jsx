import React, { useState } from "react";
import { motion } from "framer-motion";
import useResponsive from "../../hooks/useResponsive";
import { container, child } from "../../utils/constants";

export const TitleAnimation = ({ children, className }) => {
  const { isBigLaptop, isMobile } = useResponsive();
  const timeToLoad = 0.35;
  const hLine = isMobile ? 1 : 0.8;

  const letters = children.split("").map((letter, index) => (
    <motion.span
      key={index}
      variants={child}
      className={`w-max inline-block ${
        index !== 0 && isBigLaptop ? "ml-[-22.96px]" : "ml-[-4px]"
      }`}
    >
      {letter}
    </motion.span>
  ));

  return (
    <motion.h1
      variants={container(timeToLoad)}
      initial="hidden"
      animate="visible"
      style={{ lineHeight: hLine }}
      className={`relative block w-max overflow-hidden whitespace-nowrap ${className}`}
    >
      {letters}
    </motion.h1>
  );
};

export const SubTitleAnimation = ({ children, className, type }) => {
  const { isBigLaptop, isMobile } = useResponsive();
  const [wordsJSX, setWordsJSX] = useState("");
  const words = children.split(" ");
  const timeToLoad = type == "bottom" ? 4.55 : 4.1;

  const showWords = () => {
    const arrWords = [];
    words.map((word, index) => {
      arrWords.push(
        <motion.span
          key={index}
          variants={child}
          className={`w-max ${
            index !== words.length - 1
              ? isBigLaptop
                ? "mr-[20px]"
                : isMobile
                ? "mr-[5px]"
                : "mr-[10px]"
              : ""
          } ${
            (word.toLowerCase() == "web3" || word.toLowerCase() == "system") &&
            "font-neueB"
          }`}
        >
          {word}
        </motion.span>
      );
    });

    setWordsJSX(arrWords);
  };

  if (!wordsJSX && words.length) {
    showWords();
  }

  return (
    <motion.h2
      variants={container(timeToLoad)}
      initial="hidden"
      animate="visible"
      style={{ lineHeight: 1.2 }}
      className={`relative block overflow-hidden whitespace-nowrap ${className}`}
    >
      {wordsJSX}
    </motion.h2>
  );
};

export const ImageAnimation = ({ images, type }) => {
  const { isDesktop, isMobile } = useResponsive();
  const [imagesJSX, setImagesJSX] = useState("");
  const timeToLoad = type == "first" ? 5.3 : 4.9;

  const showImages = () => {
    const arrImages = [];
    (images || []).map((image, index) => {
      arrImages.push(
        <motion.div
          key={index}
          variants={{
            visible: {
              opacity: 1,
              transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
              },
            },
            hidden: {
              opacity: 0,
              transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
              },
            },
          }}
          className={`${
            isDesktop
              ? "w-[90px] h-[90px] rounded-2xl"
              : isMobile
              ? "w-[40px] h-[40px] rounded-xl"
              : "w-[60px] h-[60px] rounded-2xl"
          } relative flex items-center justify-center overflow-hidden border-[1px] border-[#ffffff17]`}
        >
          <img
            src={image}
            alt=""
            className={`${
              isDesktop
                ? "w-[90px] h-[90px]"
                : isMobile
                ? "w-[40px] h-[40px]"
                : "w-[60px] h-[60px]"
            } object-cover`}
            width={90}
            height={90}
          />
        </motion.div>
      );
    });

    setImagesJSX(arrImages);
  };

  if (!imagesJSX && images.length) {
    showImages();
  }
  return (
    <motion.div
      variants={container(timeToLoad)}
      initial="hidden"
      animate="visible"
      className="flex items-center w-auto h-auto justify-center gap-2"
    >
      {imagesJSX}
    </motion.div>
  );
};

export const NavAnimation = ({ children, className }) => {
  return (
    <motion.nav
      initial={{
        opacity: 0,
        y: "-100%",
        transition: {
          type: "spring",
          damping: 12,
          stiffness: 100,
        },
      }}
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          type: "spring",
          damping: 12,
          stiffness: 100,
          delay: 5.8,
        },
      }}
      className={className}
    >
      {children}
    </motion.nav>
  );
};

export const ScrollDownAnimation = ({ children, className }) => {
  return (
    <motion.button
      initial={{
        opacity: 0,
        bottom: "-160px",
        transition: {
          type: "spring",
          damping: 12,
          stiffness: 100,
        },
      }}
      animate={{
        opacity: 1,
        bottom: "24px",
        transition: {
          type: "spring",
          damping: 12,
          stiffness: 100,
          delay: 6.1,
        },
      }}
      className={className}
    >
      {children}
    </motion.button>
  );
};
