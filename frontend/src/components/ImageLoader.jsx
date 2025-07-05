import React, { useState } from "react";
import { motion } from "framer-motion";

const ImageLoader = ({ src, alt, className, containerStyles, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative ${containerStyles ? containerStyles : ''}`}>
      {!isLoaded && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className={`!absolute inset-0 bg-[#353535] animate-pulse rounded-xl ${className}`}
        ></motion.div>
      )}

      <motion.img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className={`${isLoaded ? "opacity-100" : "opacity-0"} ${className}`}
        {...props}
      />
    </div>
  );
};

export default ImageLoader;
