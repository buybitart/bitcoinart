import React, { useEffect, useState } from "react";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";
import { createMarkup, getSettings } from "../utils";
import ImageLoader from "../components/ImageLoader";
import SEO from "../utils/SEO";

const About = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    getSettings("about", setSettings);
  }, []);

  if (!settings)
    return (
      <>
        <SEO
          title="5KSANA | About | Bitcoin Artist & Visionary Fashion Designer"
          description="Discover 5KSANA, a visionary Bitcoin artist fusing blockchain culture with unique art and fashion. Explore their journey, inspirations, and creations."
          name="5KSANA | About | Bitcoin Artist & Visionary Fashion Designer"
          type="page"
          page="about"
        />
        <div>Loading About...</div>
      </>
    );

  return (
    <>
      <SEO
        title="5KSANA | About | Bitcoin Artist & Visionary Fashion Designer"
        description="Discover 5KSANA, a visionary Bitcoin artist fusing blockchain culture with unique art and fashion. Explore their journey, inspirations, and creations."
        name="5KSANA | About | Bitcoin Artist & Visionary Fashion Designer"
        type="page"
        page="about"
      />
      <section className="w-[100vw] h-full">
        <div className="w-full h-full relative mt-[calc(52px+50px)] xl:mt-[calc(65px+50px)] px-[16px] xl:px-[6.25rem] sm:mb-10 mb-20">
          <div className="w-full h-auto flex flex-col lg:gap-8 sm:gap-6 gap-4 relative">
            <h1
              dangerouslySetInnerHTML={createMarkup(settings.sections[0].title)}
              className="font-main uppercase lg:text-6xl sm:text-4xl text-3xl font-[600] tracking-wide"
            />

            <div className="relative w-full h-auto flex justify-between gap-2">
              {settings.sections[0].images.map((image, index) => (
                <div className="w-full h-auto" key={index}>
                  <ImageLoader
                    src={image.original}
                    alt={`me-${index}`}
                    containerStyles={`h-full`}
                    className="w-full h-full object-cover"
                    draggable="false"
                  />
                </div>
              ))}
            </div>

            {/* bio */}
            <div className="w-full h-auto relative mt-[50px] flex flex-col lg:gap-[150px] gap-[100px] overflow-hidden">
              <div className="w-full h-auto flex lg:flex-row flex-col justify-between relative">
                <div className="flex flex-col lg:gap-8 sm:gap-6 gap-4 font-main w-full lg:max-w-[40%]">
                  <h3
                    dangerouslySetInnerHTML={createMarkup(
                      settings.sections[1].title,
                    )}
                    className="lg:text-6xl sm:text-4xl text-3xl font-[600] uppercase"
                  />
                  <p
                    dangerouslySetInnerHTML={createMarkup(
                      settings.sections[1].description,
                    )}
                    className="text-[#CFCFCF] lg:font-[400] font-[300] lg:text-xl text-base"
                  />
                </div>
                <div className="lg:w-full w-auto lg:h-[360px] h-auto flex items-center justify-center lg:relative absolute lg:bottom-0 -bottom-44 lg:right-0 -right-10">
                  <img
                    src="/cube@4x.svg"
                    alt="cube"
                    className="w-auto lg:h-[470px] h-[150px] lg:absolute lg:top-1/2 lg:-translate-x-[30%] lg:-translate-y-1/2 lg:left-1/2"
                    draggable="false"
                  />
                </div>
              </div>

              <div className="w-full h-auto flex lg:flex-row-reverse flex-col justify-between lg:gap-0 gap-12">
                <div className="flex flex-col gap-8 font-main w-full lg:max-w-[50%]">
                  <h3
                    dangerouslySetInnerHTML={createMarkup(
                      settings.sections[2].title,
                    )}
                    className="lg:text-6xl sm:text-4xl text-3xl font-[600] uppercase"
                  />
                  <p
                    dangerouslySetInnerHTML={createMarkup(
                      settings.sections[2].description,
                    )}
                    className="text-[#CFCFCF] lg:font-[400] font-[300] lg:text-xl text-base"
                  />
                </div>
                <div className="lg:w-full w-auto lg:h-[300px] h-[150px] flex lg:items-center lg:justify-center relative lg:ml-0 ml-10">
                  <img
                    src="/cylinder@4x.svg"
                    alt="cylinder"
                    className="w-auto lg:h-[360px] sm:h-[150px] h-[130px] object-contain relative lg:absolute lg:top-1/2 lg:-translate-x-[90%] lg:-translate-y-1/2 lg:left-1/2"
                    draggable="false"
                  />
                </div>
              </div>

              <div className="flex lg:flex-row flex-col w-full h-auto justify-between lg:gap-6 gap-12 relative">
                <div className="w-full h-auto flex flex-col gap-7 font-main">
                  <h2
                    dangerouslySetInnerHTML={createMarkup(
                      settings.sections[3].title,
                    )}
                    className="lg:text-6xl sm:text-4xl text-3xl uppercase font-[600] text-white"
                  />
                  <div className="flex flex-col gap-3 w-auto h-auto text-[#CFCFCF] font-[300] lg:text-xl text-base">
                    {settings.sections[3].list.map((item, index) => (
                      <p key={index}>{item}</p>
                    ))}
                  </div>
                </div>
                <div className="w-full h-auto flex flex-col justify-end">
                  <p
                    dangerouslySetInnerHTML={createMarkup(
                      settings.sections[3].description,
                    )}
                    className="text-[#cfcfcf] lg:max-w-[85%] lg:text-xl text-base"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <ContactForm />
        <Footer />
      </section>
    </>
  );
};

export default About;
