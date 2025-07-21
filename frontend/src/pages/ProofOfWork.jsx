import React, { useEffect, useState } from "react";
import useResponsive from "../hooks/useResponsive";
import Footer from "../components/Footer";
import { createMarkup, getSettings } from "../utils";
import SEO from "../utils/SEO";

const Card = ({ data, isEven }) => {
  const { isMobile } = useResponsive();
  const [isLoaded, setIsLoaded] = useState(false);
  const randomMargin = Math.floor(Math.random() * 201);

  const videoId = data.additional.split("/embed/")[1];
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <section
      className={`lg:w-[40%] w-full h-auto max-h-[400px] sm:max-h-[400px] relative flex flex-col gap-2 ${
        !isMobile && isEven && "ml-auto"
      }`}
      style={{
        left: !isMobile && !isEven ? `${randomMargin}px` : "0px",
        right: !isMobile && isEven ? `${randomMargin}px` : "0px",
      }}
    >
      {!isLoaded ? (
        <div
          className="w-full h-[200px] sm:h-[260px] bg-black relative cursor-pointer rounded-xl overflow-hidden"
          onClick={() => setIsLoaded(true)}
        >
          <img
            src={thumbnailUrl}
            alt="Video Thumbnail"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <span className="text-white text-4xl">▶</span>
          </div>
        </div>
      ) : (
        <iframe
          loading="lazy"
          width={isMobile ? "" : "100%"}
          height={isMobile ? "200px" : 260}
          className={`${
            isMobile ? "w-full h-full min-h-[200px]" : ""
          } rounded-xl`}
          src={data.additional}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      )}
      <h4 className="font-main text-xl line-clamp-2">{data.title}</h4>
    </section>
  );
};

const ProofOfWork = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    getSettings("proofofwork", setData);
  }, []);

  if (!data)
    return (
      <>
        <SEO
          title="Proof of Work - Art Creation Process by 5KSANA"
          description="Watch “Proof of Work” by 5KSANA—a video series revealing the creative process behind Bitcoin-inspired paintings and embroidery. Explore crypto art in action."
          name="Proof of Work - Art Creation Process by 5KSANA"
          type="page"
          page="proof"
        />
        <div>Loading Proof...</div>
      </>
    );

  return (
    <>
      <SEO
        title={`Proof of Work - Art Creation Process by 5KSANA`}
        description="Watch “Proof of Work” by 5KSANA—a video series revealing the creative process behind Bitcoin-inspired paintings and embroidery. Explore crypto art in action."
        name="Proof of Work - Art Creation Process by 5KSANA"
        type="page"
        page="proof"
      />
      <section className="w-[100vw] h-full">
        <div className="w-full h-full relative px-[16px] xl:px-[6.25rem] sm:pb-20 pb-30 top-[calc(52px+50px)] xl:top-[calc(65px+50px)] max-w-[1500px] mx-auto sm:mb-28 mb-20">
          <div className="w-full h-auto flex flex-col lg:gap-8 sm:gap-6 gap-4 font-main relative pb-5">
            <div className="flex flex-col gap-3 justify-center items-center">
              <h1 className="uppercase lg:text-6xl sm:text-4xl text-3xl font-[600] tracking-wide flex items-center sm:gap-4 gap-2">
                Proof of Work
              </h1>
            </div>
          </div>

          <div className="w-full h-auto flex flex-col relative gap-4 my-8">
            {(data.sections.slice(0, -1) || []).map((item, index) => (
              <Card data={item} key={index} isEven={index % 2 == 0} />
            ))}
          </div>

          <div className="w-full h-auto relative flex flex-col gap-4 sm:pb-5 pb-10 sm:mt-20 mt-10 font-main">
            <div
              className="sm:text-base text-sm font-[300]"
              dangerouslySetInnerHTML={createMarkup(
                data.sections[data.sections.length - 1].description,
              )}
            />
          </div>
        </div>
        <Footer />
      </section>
    </>
  );
};

export default ProofOfWork;
