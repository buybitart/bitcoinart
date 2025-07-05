import React, { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      type,
      placeholder,
      className,
      id,
      autocomplete,
      defaultValue,
      onChange,
      name,
      ...rest
    },
    ref
  ) => {
    return (
      <>
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          name={name}
          className={className}
          id={id}
          autoComplete={autocomplete}
          onChange={onChange}
          defaultValue={defaultValue}
          {...rest}
        />
      </>
    );
  }
);

export default Input;
