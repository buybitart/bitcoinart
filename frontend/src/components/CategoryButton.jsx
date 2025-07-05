import React from "react";

const CategoryButton = ({
  data,
  index,
  setCurrentCategory,
  currentCategory,
}) => {
  const category = `${data} ${index}`;
  return (
    <button
      onClick={() => {
        if (currentCategory == category) return setCurrentCategory(null);
        return setCurrentCategory(category);
      }}
      className={`w-auto px-4 h-[35px] flex justify-center items-center rounded-full ${
        currentCategory == category
          ? "bg-[#FCCB00] text-[#241D00] hover:bg-[#D4A900] hover:text-[#1C1600]"
          : "bg-[#FFFFFF1A] text-[rgba(255,255,255,0.85)] hover:text-[rgba(255,255,255,1)] hover:bg-[#ffffff25]"
      } transition duration-[250ms] font-main font-[300] text-base capitalize`}
    >
      {category}
    </button>
  );
};

export default CategoryButton;
