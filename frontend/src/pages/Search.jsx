import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchInput } from "../components/SearchInput";
import useResponsive from "../hooks/useResponsive";
import SearchCard from "../components/SearchCard";
import { MdArrowBack } from "react-icons/md";
import SEO from "../utils/SEO";
import axios from "axios";

const Search = () => {
  const [searchText, setSearchText] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const { isMobile } = useResponsive();

  const placeholders = [
    "Search for Bitcoin-inspired paintings.",
    "Discover crypto-themed sculptures.",
    "Find unique embroidered Bitcoin art.",
    "Explore wooden crypto art boxes.",
    "Looking for creations by 5ksana?",
  ];

  const clearAll = () => {
    setIsSubmitted(false);
    setSearchText("");
    setSearchResults(null);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!searchText.trim()) {
      setSearchResults(null);
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_DB_LINK}/api/search`,
        {
          params: { query: searchText },
        },
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults(null);
    }
  };

  const renderResultsSection = (title, data, type) => {
    if (!data.length) return null;

    return (
      <div className="w-full h-auto flex flex-col gap-4">
        <h3 className="text-2xl sm:text-3xl text-white font-main font-[500] uppercase tracking-wide">
          {title}
        </h3>
        <div className="w-full h-auto grid 2xl:grid-cols-4 xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
          {data.map((item, index) => (
            <SearchCard data={item} key={index} type={type} />
          ))}
        </div>
      </div>
    );
  };

  const noResults =
    !searchResults?.products.data.length &&
    !searchResults?.productsAuction.data.length &&
    !searchResults?.productsGallery.data.length;

  const fadeInOutVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  };

  const moveVariants = {
    initial: { top: "50%" },
    searching: { top: isMobile ? 130 : 170 },
  };

  return (
    <>
      <SEO
        title="5KSANA | Search | Discover Bitcoin Art, Crypto Creations & More"
        description="Search 5KSANA for Bitcoin-inspired art, crypto sculptures, auctions, and gallery pieces. Discover unique creations blending blockchain and creativity."
        name="5KSANA | Search | Discover Bitcoin Art, Crypto Creations & More"
        type="page"
        page="search"
      />
      <div className="w-screen h-full">
        <div className="w-full min-h-[100svh] h-full relative px-4 xl:px-[6.25rem] flex flex-col justify-center items-center">
          {/* Header Section */}
          <motion.div
            variants={moveVariants}
            animate={searchResults ? "searching" : "initial"}
            transition={{
              duration: 0.4,
              ease: "easeInOut",
            }}
            className="w-full h-auto absolute -translate-y-1/2 -translate-x-1/2 left-1/2 flex flex-col items-center px-4 xl:px-[6.25rem]"
          >
            {isSubmitted ? (
              <motion.button
                onClick={clearAll}
                initial={{ opacity: 0, visibility: "hidden" }}
                animate={{ opacity: 1, visibility: "visible" }}
                exit={{ opacity: 0, visibility: "hidden" }}
                transition={{ duration: 0.3, delay: 0.65 }}
                className={`absolute w-6 h-6 flex items-center justify-center ${
                  isMobile ? "top-[6px]" : "top-[12px]"
                } left-[16px] xl:left-[6.25rem]`}
              >
                <MdArrowBack size={24} />
              </motion.button>
            ) : (
              <></>
            )}
            <AnimatePresence mode="wait">
              <motion.h2
                key={searchResults ? "results" : "search"}
                variants={fadeInOutVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                }}
                className="mb-6 sm:mb-12 text-3xl text-center sm:text-5xl text-white font-main font-[300] tracking-wide break-words"
              >
                {searchResults
                  ? `Results for "${searchText}"`
                  : "Search For Anything"}
              </motion.h2>
            </AnimatePresence>
            {!searchResults && (
              <SearchInput
                placeholders={placeholders}
                onChange={(e) => setSearchText(e.target.value)}
                onSubmit={handleSearch}
              />
            )}
          </motion.div>

          {/* Results Section */}
          {searchResults && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{
                duration: 0.5,
                delay: 0.35,
                ease: "easeInOut",
              }}
              className={`w-full h-full flex flex-col gap-8 p-4 pb-14 ${
                noResults ? "" : "mt-[140px] sm:mt-[180px]"
              }`}
            >
              {noResults ? (
                <div className="flex flex-col justify-center items-center gap-2">
                  <img
                    src="/empty-box.svg"
                    alt="No results"
                    className="w-full max-h-[225px] object-contain invert opacity-40"
                  />
                  <p className="font-main sm:text-xl text-lg font-[300] opacity-40">
                    No results were found :\
                  </p>
                </div>
              ) : (
                <>
                  {renderResultsSection(
                    searchResults.products.title,
                    searchResults.products.data,
                    "shop",
                  )}
                  {renderResultsSection(
                    searchResults.productsAuction.title,
                    searchResults.productsAuction.data,
                    "auction",
                  )}
                  {renderResultsSection(
                    searchResults.productsGallery.title,
                    searchResults.productsGallery.data,
                    "gallery",
                  )}
                </>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default Search;
