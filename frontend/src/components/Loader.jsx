import React from "react";
import { motion } from "framer-motion";

const Loader = ({customSize}) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 1, visibility: "visible" }}
        exit={{ opacity: 0, visibility: "hidden" }}
        transition={{ duration: 0.3 }}
        className={`${customSize ? customSize : 'w-[100vw] lg:w-[calc(100vw-14px)] h-[100svh] fixed inset-0 z-[9999]'} flex items-center justify-center bg-black`}
      >
        <div className="loader">
          <span className="hour" />
          <span className="min" />
          <span className="circel" />
        </div>
      </motion.div>
    </>
  );
};

export default Loader;
