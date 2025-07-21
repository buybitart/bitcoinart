import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import BTCPayForm from "../components/BTCPayForm";
import ImageLoader from "../components/ImageLoader";
import { createMarkup, getSettings } from "../utils";
import SEO from "../utils/SEO";

const SupportMe = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    getSettings("support", setData);
  }, []);

  if (!data) return <></>;

  const realData = data.sections;

  return (
    <>
      <SEO
        title="Support Me - Empower the Creative Vision of 5KSANA"
        description="Support my crypto art journey! Help create exclusive Bitcoin-inspired pieces and bring blockchain culture to life. Join the movement and make a difference."
        name="Support Me - Empower the Creative Vision of 5KSANA"
        type="page"
        page="support"
      />

      <section className="w-[100vw] h-full">
        <div className="w-full h-full relative px-[16px] xl:px-[6.25rem] sm:pb-20 pb-30 top-[calc(52px+50px)] xl:top-[calc(65px+50px)] max-w-[1300px] mx-auto sm:mb-28 mb-20">
          <div className="w-full h-auto flex flex-col lg:gap-8 sm:gap-6 gap-4 font-main relative">
            <div className="flex flex-col gap-3 justify-center items-center">
              <h2 className="uppercase lg:text-6xl sm:text-4xl text-3xl font-[600] tracking-wide flex items-center sm:gap-4 gap-2">
                {realData[0].title.split(" ")[0]}{" "}
                <ImageLoader
                  src="https://i.ibb.co/JFpzcc5p/IMG-8594-scaled-1.jpg"
                  alt="me"
                  className="sm:h-[52px] h-[32px] sm:w-[62px] w-[42px] sm:rounded-xl rounded-lg object-cover"
                  draggable={false}
                />{" "}
                {realData[0].title.replace(realData[0].title.split(" ")[0], "")}
              </h2>
              <h4
                className="text-[#CFCFCF] lg:font-[400] font-[300] lg:text-xl text-base text-center mb-3"
                dangerouslySetInnerHTML={createMarkup(realData[0].description)}
              />
            </div>
            <div className="w-full max-w-[400px] h-[220px] mx-auto my-4 rounded-xl flex justify-center items-center bg-[#ffffff10] border-[1px] border-[#ffffff07]">
              <BTCPayForm />
            </div>
            <div className="h-auto w-full flex flex-col mx-auto my-4 justify-center items-center">
              <a
                href={realData[1].additional}
                className="lg:text-xl text-base text-center text-[#fccb00] underline font-[300] tracking-wide"
              >
                {realData[1].title}
              </a>
            </div>
            <div className="h-auto text-[#CFCFCF] w-full flex flex-col lg:text-xl text-base mx-auto my-4 text-center justify-center items-center gap-5">
              {realData.map((item, index) => {
                if (index === 0 || index === 1) return;
                return (
                  <p>
                    {item.title && (
                      <>
                        <b>{item.title}</b>
                        <br />
                      </>
                    )}{" "}
                    <p
                      dangerouslySetInnerHTML={createMarkup(item.description)}
                    />
                  </p>
                );
              })}
            </div>
          </div>
        </div>
        <Footer />
      </section>
    </>
  );
};

export default SupportMe;
