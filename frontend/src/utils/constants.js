export const container = (timeToLoad) => {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: timeToLoad,
      },
    },
  };
};

export const child = {
  hidden: {
    opacity: 0,
    y: "100%",
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
    },
  },
};
