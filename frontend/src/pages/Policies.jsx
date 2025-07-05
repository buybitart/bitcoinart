import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { createMarkup, getSettings } from "../utils";
import { Helmet } from "react-helmet-async";

const Policies = () => {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState();

  useEffect(() => {
    getSettings("policies", setData);
  }, []);

  if (!data) return <></>;

  const sectionsWithoutId = data.sections;

  const sections = sectionsWithoutId.map((item, index) => ({
    ...item,
    id: `${item.title.toLowerCase().replace(/\s+/g, "-")}-${index}`,
  }));

  const section = searchParams.get("section") || sections[1].id;

  return (
    <>
      <Helmet>
        <title>Policies</title>
      </Helmet>
      <div className="w-[100vw] h-full">
        <div className="w-full h-full relative px-[16px] xl:px-[6.25rem] sm:pb-20 pb-30 top-[calc(52px+50px)] xl:top-[calc(65px+50px)] max-w-[1300px] mx-auto">
          <div className="w-full h-auto flex flex-col lg:gap-8 sm:gap-6 gap-4 font-main relative">
            <div className="flex flex-col gap-3 justify-center items-center">
              <h2 className="uppercase lg:text-6xl sm:text-4xl text-3xl font-[600] tracking-wide">
                {sections[0].title}
              </h2>
              <h4 className="text-[#CFCFCF] lg:font-[400] font-[300] lg:text-xl text-base mb-3">
                {sections[0].additional}
              </h4>
            </div>

            <div className="w-auto flex max-w-[738.2px] gap-2 bg-[#FFFFFF1A] backdrop-blur-md z-[2] p-2 sticky shadow-xl xl:top-[81px] top-[61px] rounded-xl h-[47px] font-main text-white text-base items-center mx-auto">
              {sections.slice(1).map((item) => (
                <Link
                  key={item.id}
                  to={`?${new URLSearchParams({ section: item.id })}`}
                  className={`w-full h-[31px] !leading-[31px] sm:text-base text-xs text-center transition-colors duration-300 line-clamp-1 ${
                    section === item.id && "bg-[#A2A2A24D]"
                  } rounded-[7px]`}
                >
                  {item.title}
                </Link>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {sections.slice(1).find((item) => item.id === section) && (
                <motion.div
                  key={section}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -25 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-3 mt-6"
                >
                  <h3 className="uppercase lg:text-4xl sm:text-3xl text-2xl font-[600] tracking-wide">
                    {sections.find((item) => item.id === section)?.title}
                  </h3>
                  <p
                    className="lg:font-[400] font-[300] text-base mt-4"
                    dangerouslySetInnerHTML={createMarkup(
                      sections.find((item) => item.id === section)?.description
                    )}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
};

export default Policies;
