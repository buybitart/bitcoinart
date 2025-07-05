import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import useResponsive from "../hooks/useResponsive";

const Modal = ({ children, isOpen, nopaddings }) => {
  const lenis = useLenis();
  const { isMobile } = useResponsive();

  useEffect(() => {
    if (!isMobile) {
      if (isOpen) {
        document.documentElement.style.overflow = "hidden";
        lenis?.stop();
        ScrollTrigger.normalizeScroll(false);
      } else {
        lenis?.start();
        document.documentElement.style.overflow = "";
        ScrollTrigger.normalizeScroll(true);
      }

      return () => {
        lenis?.start();
        ScrollTrigger.normalizeScroll(true);
      };
    } else {
      if (isOpen) document.documentElement.style.overflow = "hidden";
      else document.documentElement.style.overflow = "";

      return () => (document.documentElement.style.overflow = "");
    }
  }, [isOpen, isMobile]);

  const appearVariants = {
    initial: { opacity: 0, visibility: "hidden" },
    appear: { opacity: 1, visibility: "visible" },
    hide: { opacity: 0, visibility: "hidden" },
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="modal"
            variants={appearVariants}
            initial="initial"
            animate="appear"
            exit="hide"
            transition={{ duration: 0.3 }}
            style={{ willChange: "opacity, visibility" }}
            className={`w-full h-full fixed inset-0 backdrop-blur-lg bg-[#00000080] flex justify-center items-center ${nopaddings ? "" : "px-[16px] xl:px-[6.25rem]"} z-[100000]`}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Modal;
