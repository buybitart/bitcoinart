import React, { useEffect, useState } from "react";
import Accordion from "../components/Accordion";
import Footer from "../components/Footer";
import { getSettings } from "../utils";

const FAQ = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    getSettings("faq", setData);
  }, []);

  if (!data) return <></>;

  return (
    <section className="w-[100vw] h-full">
      <div className="w-full h-full relative mt-[calc(52px+50px)] xl:mt-[calc(65px+50px)] px-[16px] xl:px-[6.25rem] mb-20">
        <div className="w-full h-auto flex flex-col lg:gap-8 sm:gap-6 gap-4 relative items-center">
          <h2 className="font-main uppercase lg:text-6xl sm:text-4xl text-3xl font-[600] tracking-wide">
            FAQ
          </h2>

          <div className="w-full h-full flex flex-col sm:gap-3 gap-2 sm:max-w-[85%]">
            {(data.sections || []).map((item, index) => (
              <Accordion
                key={index}
                title={item.title}
                id={`faqs-${index}`}
                active={index === 0 ? true : false}
              >
                {item.description}
              </Accordion>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </section>
  );
};

export default FAQ;
