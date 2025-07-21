import React, { useEffect, useState } from "react";
import useResponsive from "../hooks/useResponsive";
import Footer from "../components/Footer";
import { getSettings } from "../utils";
import ImageLoader from "../components/ImageLoader";
import SEO from "../utils/SEO";

const Card = ({ data, index, isMobile }) => {
  let className = "flex flex-col gap-2 group";

  if (isMobile) {
    className += " col-span-1";
  } else {
    const row = Math.floor(index / 3);
    const pos = index % 3;

    const isOddRow = row % 2 === 0;
    const isEvenRow = !isOddRow;

    if ((isOddRow && pos === 0) || (isEvenRow && pos === 2)) {
      className += " col-span-2";
    } else {
      className += " col-span-1";
    }
  }

  return (
    <div className={className}>
      <div className="h-[353px] w-full rounded-xl overflow-hidden">
        <ImageLoader
          src={data.images[0].original}
          alt={data.title}
          className="w-full h-[353px] object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div>
        <h4 className="font-main text-xl line-clamp-2">{data.title}</h4>
        <span className="inline-flex gap-1">
          [{" "}
          <a
            href={data.additional}
            target="_blank"
            className="text-[#fccb00] underline opacity-60 font-[300] line-clamp-1 hover:opacity-100 transition-opacity duration-300"
          >
            {data.additional}
          </a>{" "}
          ]
        </span>
      </div>
    </div>
  );
};

const Exhibitions = () => {
  const { isMobile } = useResponsive();
  const [data, setData] = useState(null);

  useEffect(() => {
    getSettings("exhibitions", setData);
  }, []);

  if (!data)
    return (
      <>
        <SEO
          title="Exhibitions - Exclusive Art Shows by 5KSANA"
          description="Explore 5KSANA’s latest exhibitions featuring unique crypto-inspired art. Discover new collections, events, and dive into innovative design and fashion."
          name="Exhibitions - Exclusive Art Shows by 5KSANA"
          type="page"
          page="exhibitions"
        />
        <div>Loading Exhibitions...</div>
      </>
    );

  return (
    <>
      <SEO
        title="Exhibitions - Exclusive Art Shows by 5KSANA"
        description="Explore 5KSANA’s latest exhibitions featuring unique crypto-inspired art. Discover new collections, events, and dive into innovative design and fashion."
        name="Exhibitions - Exclusive Art Shows by 5KSANA"
        type="page"
        page="exhibitions"
      />
      <div className="w-[100vw] h-full">
        <div className="w-full h-full relative px-[16px] xl:px-[6.25rem] pb-20 top-[calc(52px+50px)] xl:top-[calc(65px+50px)] mx-auto">
          <div className="w-full h-auto flex flex-col lg:gap-8 sm:gap-6 gap-4 font-main relative sm:mb-20 mb-0 pb-20">
            <div className="flex flex-col gap-3 justify-center items-center">
              <h2 className="uppercase lg:text-6xl sm:text-4xl text-3xl font-[600] tracking-wide flex items-center sm:gap-4 gap-2">
                Exhibitions
              </h2>
            </div>

            <div
              className={`grid gap-4 w-full h-auto`}
              style={{
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : "repeat(4, minmax(0, 1fr))",
              }}
            >
              {data.sections.map((item, index) => (
                <Card
                  data={item}
                  key={index}
                  index={index}
                  isMobile={isMobile}
                />
              ))}
              <div className="bg-[#ffffff10] rounded-xl p-1 min-h-[353px] flex justify-center items-center sm:text-2xl text-lg tracking-wide col-span-1 sm:col-span-2">
                Coming soon...
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Exhibitions;
