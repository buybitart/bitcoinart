import React from "react";

const Toggle = ({id, label, checked, onChange, bolder, secondary, defaultChecked}) => {
  return (
    <label htmlFor={id} className="w-full h-auto flex gap-2 items-center">
      <label className="text-base relative inline-block w-full max-w-[44px] h-[26px]">
        <input
          type="checkbox"
          className="opacity-0 w-0 h-0 inpCheckSwitch"
          defaultChecked={defaultChecked}
          checked={checked}
          id={id}
          onChange={onChange}
        />
        <span className="sliderSwitch border-[1px] border-[#212121] absolute inset-0 cursor-pointer bg-[#212121] transition-colors duration-300 rounded-full"></span>
      </label>
      <span className={`${secondary ? "text-white/75" : "text-white"} ${bolder ? 'font-[600]' : ''}`}>{label}</span>
    </label>
  );
};

export default Toggle;
