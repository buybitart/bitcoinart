import React, { useEffect, useState } from "react";
import { createMarkup } from "../utils";

const Accordion = ({ children, title, id, active = false }) => {
  const [accordionOpen, setAccordionOpen] = useState(false);

  useEffect(() => {
    setAccordionOpen(active);
  }, []);

  return (
    <div className="py-1.5 bg-[#212121] group px-4 rounded-xl border-[1px] border-[#ffffff05]">
      <h2>
        <button
          className="flex items-center justify-between w-full text-left font-main py-2"
          onClick={(e) => {
            e.preventDefault();
            setAccordionOpen(!accordionOpen);
          }}
          aria-expanded={accordionOpen}
          aria-controls={`accordion-text-${id}`}
        >
          <span className="font-semibold sm:text-xl text-lg tracking-wide uppercase">{title}</span>
          <svg
            className="fill-[#fccb00] group-hover:fill-[#cacaca] shrink-0 ml-8"
            width="16"
            height="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              y="7"
              width="16"
              height="2"
              rx="1"
              className={`ttransform origin-center transition duration-200 ease-out ${
                accordionOpen && "!rotate-180"
              }`}
            />
            <rect
              y="7"
              width="16"
              height="2"
              rx="1"
              className={`transform origin-center rotate-90 transition duration-200 ease-out ${
                accordionOpen && "!rotate-180"
              }`}
            />
          </svg>
        </button>
      </h2>
      <div
        id={`accordion-text-${id}`}
        role="region"
        aria-labelledby={`accordion-title-${id}`}
        className={`grid text-white/80 font-[300] overflow-hidden sm:text-base text-sm font-main mt-1 transition-all duration-300 ease-in-out ${
          accordionOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p
            className="pb-3"
            dangerouslySetInnerHTML={createMarkup(children)}
          />
        </div>
      </div>
    </div>
  );
};

export default Accordion;
