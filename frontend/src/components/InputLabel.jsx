import React, { forwardRef } from "react";
import Input from "./Input";

const InputLabel = forwardRef(({id, label, placeholder, type, autocomplete, icon, defaultValue, onChange, name, register, ...rest}, ref) => {
  return (
    <div className="flex flex-col w-full h-auto gap-1.5 relative">
      <label
        htmlFor={id}
        className="text-white text-sm leading-[16.8px] font-main tracking-wide"
      >
        {label}
      </label>
      <Input
        id={id}
        placeholder={placeholder}
        type={type}
        autoComplete={autocomplete}
        defaultValue={defaultValue}
        onChange={onChange}
        name={name}
        ref={ref}
        {...register}
        {...rest}
        className="bg-[#212121] py-[10px] px-3 rounded-xl outline-none leading-[23px] border-[1px] border-[#ffffff05] tracking-wide transition-colors duration-[250ms] font-main placeholder-[#707070] focus:placeholder-[#ffffff00]"
      />
      {icon ? icon : <></>}
    </div>
  );
});

export default InputLabel;
