import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useMemo, useState, memo } from "react";
import { smoothScrollTo } from "../utils";
import { useLenis } from "lenis/react";
import useResponsive from "../hooks/useResponsive";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const Paginator = memo(
  ({ data, itemsPerPage, children, animationVariants, autoKey, className }) => {
    const [page, setPage] = useState(1);
    const { isMobile } = useResponsive();
    const lenis = useLenis();

    const paginatedData = useMemo(
      () => data.slice((page - 1) * itemsPerPage, page * itemsPerPage),
      [data, page, itemsPerPage],
    );

    const totalPages = Math.ceil(data.length / itemsPerPage);

    const handlePageChange = (newPage) => {
      setPage((prevPage) => Math.min(Math.max(1, newPage), totalPages));
    };

    useEffect(() => {
      const maxPages = Math.ceil(data.length / itemsPerPage);

      if (page > maxPages) {
        setPage(1);
      }

      if (!isMobile) ScrollTrigger.refresh();
    }, [itemsPerPage, page, data]);

    return (
      <>
        <AnimatePresence mode="wait">
          <motion.div
            key={autoKey || page}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout
            variants={animationVariants}
            transition={{ duration: 0.4 }}
            className={className}
          >
            {children(paginatedData)}
          </motion.div>
        </AnimatePresence>

        {!data.length ? (
          <></>
        ) : (
          <section className="w-full flex justify-center items-center h-auto px-[16px] xl:px-[6.25rem] mb-[53px]">
            <div className="w-auto h-[40px] flex items-center gap-2">
              <button
                onClick={() => {
                  handlePageChange(page - 1);
                  if (!isMobile) lenis?.scrollTo(0, { duration: 1 });
                  else smoothScrollTo(0, 1000);
                }}
                disabled={page === 1}
                className={`h-full flex items-center justify-center w-[40px] transition-colors duration-300 ${
                  page === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <img
                  src="/chevron_left.svg"
                  alt="chevron_left"
                  className="w-[24px] h-[24px] object-contain"
                />
              </button>

              <div className="w-auto h-full flex gap-2 items-center">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => {
                        handlePageChange(p);
                        if (!isMobile) lenis?.scrollTo(0, { duration: 1 });
                        else smoothScrollTo(0, 1000);
                      }}
                      className={`w-[40px] h-[40px] rounded-full transition-colors duration-300 flex items-center justify-center font-main font-[400] text-base ${
                        page === p
                          ? "bg-[#FCCB00] text-[#241D00]"
                          : "bg-[#FFFFFF1A] text-white"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}
              </div>

              <button
                onClick={() => {
                  handlePageChange(page + 1);
                  if (!isMobile) lenis?.scrollTo(0, { duration: 1 });
                  else smoothScrollTo(0, 1000);
                }}
                disabled={page === totalPages}
                className={`h-full flex items-center transition-colors duration-300 justify-center w-[40px] ${
                  page === totalPages ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <img
                  src="/chevron_right.svg"
                  alt="chevron_right"
                  className="w-[24px] h-[24px] object-contain"
                />
              </button>
            </div>
          </section>
        )}
      </>
    );
  },
);

export default Paginator;
