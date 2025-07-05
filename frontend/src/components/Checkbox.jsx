import React, { forwardRef } from "react";
import styled from "styled-components";

const Checkbox = forwardRef(({...rest}, ref) => {
  return (
    <StyledWrapper>
      <div className="flex gap-[10px] idk w-[19px] h-[19px] justify-center items-center">
        <input
          type="checkbox"
          id="checkPrivacy"
          className="absolute opacity-0 cursor-pointer h-0 w-0"
          ref={ref}
          {...rest}
        />
        <div className="checkmark" />
      </div>
    </StyledWrapper>
  );
});

const StyledWrapper = styled.div`
  .checkmark {
    position: relative;
    box-shadow: #707070 0px 0px 0px 1px;
    flex-shrink: 0;
    height: 15px;
    width: 15px;
    margin-top: -1px;
    transition: all 0.2s ease 0s;
    cursor: pointer;
    padding: 0px;
    box-sizing: border-box;
  }

  .idk input:checked ~ .checkmark {
    box-shadow: #fccb00 0px 0px 0px 1px;
    background-color: #fccb00;
    height: 15px;
    margin-top: -1px;
    width: 15px;
    flex-shrink: 0;
    transition: all 0.2s ease 0s;
    cursor: pointer;
    padding: 0px;
    box-sizing: border-box;
  }

  .checkmark:after {
    content: "";
    position: absolute;
    top: 49%;
    left: 50%;
    transfrom: translate(-50%, -50%);
    display: none;
  }

  .idk input:checked ~ .checkmark:after {
    display: block;
  }

  /* Style the checkmark/indicator */
  .idk .checkmark:after {
    left: 0.3em;
    top: 0.2em;
    width: 0.3em;
    height: 0.5em;
    border: solid black;
    border-width: 0 0.15em 0.15em 0;
    transform: rotate(45deg);
    transition: all 500ms ease-in-out;
  }
`;

export default Checkbox;
