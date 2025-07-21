import React, { useEffect, useState } from "react";
import { createMarkup, getSettings } from "../utils";
import { Helmet } from "react-helmet-async";

const Table = ({ columns, data }) => {
  return (
    <section className="overflow-hidden">
      <table className="min-w-full bg-[#212121] border border-[#ffffff15] rounded-xl overflow-hidden">
        <thead className="bg-[#1A1A1A]">
          <tr>
            {columns.map((column, index) => (
              <th
                key={`column.accessor-${index}`}
                className="py-2 px-4 border-b border-[#ffffff15] text-left text-white/80"
              >
                {column.Header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="even:bg-[#1A1A1A]">
              {columns.map((column) => {
                if (column.accessor === "example")
                  return (
                    <td
                      key={column.accessor}
                      className="py-2 px-4 border-b border-[#ffffff15] text-white/90"
                      dangerouslySetInnerHTML={createMarkup(
                        row[column.accessor],
                      )}
                    />
                  );
                else
                  return (
                    <td
                      key={column.accessor}
                      className="py-2 px-4 border-b border-[#ffffff15] text-white/90"
                    >
                      {row[column.accessor]}
                    </td>
                  );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

const Privacy = () => {
  const [data, setData] = useState();

  useEffect(() => {
    getSettings("privacypolicy", setData);
  }, []);

  if (!data) return <></>;

  const realData = data.sections;

  const columns = [
    { Header: "Category", accessor: "category" },
    { Header: "Examples", accessor: "example" },
    { Header: "Collected", accessor: "collected" },
  ];

  const dataTable = [];

  realData.slice(19, 19 + 12).forEach((item) => {
    const dataToPush = {
      category: item.title,
      example: item.description,
      collected: item.additional,
    };

    dataTable.push(dataToPush);
  });

  return (
    <>
      <Helmet>
        <title>Privacy Policy</title>
      </Helmet>
      <section className="w-[100vw] h-full">
        <div className="w-full h-full relative mt-[calc(52px+50px)] xl:mt-[calc(65px+50px)] px-[16px] xl:px-[6.25rem] sm:mb-10 mb-20">
          <div className="w-full h-auto flex flex-col lg:gap-8 sm:gap-6 gap-4 relative font-main">
            <div className="flex flex-col gap-3">
              <h2 className="uppercase lg:text-6xl sm:text-4xl text-3xl font-[600] tracking-wide">
                {realData[0].title}
              </h2>
              <h4 className="text-[#CFCFCF] lg:font-[400] font-[300] lg:text-xl text-base">
                {realData[0].additional}
              </h4>
            </div>

            <div className="flex flex-col gap-3">
              <div
                dangerouslySetInnerHTML={createMarkup(realData[0].description)}
              />
            </div>

            <div className="flex flex-col gap-3 mt-4">
              <h3 className="uppercase lg:text-4xl sm:text-3xl text-2xl font-[600] tracking-wide">
                {realData[1].title}
              </h3>
              <h4 className="text-[#CFCFCF] lg:font-[400] font-[300] lg:text-lg italic text-base">
                {realData[1].additional}
              </h4>
            </div>

            <div className="flex flex-col gap-3">
              <div
                dangerouslySetInnerHTML={createMarkup(realData[1].description)}
                className="flex flex-col gap-3"
              />
            </div>

            {/* table */}
            <div className="flex flex-col gap-3 mt-8 max-w-[700px] rounded-xl w-full h-auto bg-[#212121] border-[#ffffff10] p-4 border-[1px]">
              <h3 className="uppercase lg:text-4xl sm:text-3xl text-2xl font-[600] tracking-wide">
                TABLE OF CONTENTS
              </h3>

              <ol className="mt-2 flex flex-col gap-1 ml-4">
                <li>
                  <a href="#info_collect" className="underline">
                    WHAT INFORMATION DO WE COLLECT?
                  </a>
                </li>
                <li>
                  <a href="#info_process" className="underline">
                    HOW DO WE PROCESS YOUR INFORMATION?
                  </a>
                </li>
                <li>
                  <a href="#personal_bases" className="underline">
                    WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR PERSONAL
                    INFORMATION?
                  </a>
                </li>
                <li>
                  <a href="#personal_share" className="underline">
                    WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?
                  </a>
                </li>
                <li>
                  <a href="#cookies" className="underline">
                    DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?
                  </a>
                </li>
                <li>
                  <a href="#logins" className="underline">
                    HOW DO WE HANDLE YOUR SOCIAL LOGINS?
                  </a>
                </li>
                <li>
                  <a href="#info_keep" className="underline">
                    HOW LONG DO WE KEEP YOUR INFORMATION?
                  </a>
                </li>
                <li>
                  <a href="#info_safe" className="underline">
                    HOW DO WE KEEP YOUR INFORMATION SAFE?
                  </a>
                </li>
                <li>
                  <a href="#info_minors" className="underline">
                    DO WE COLLECT INFORMATION FROM MINORS?
                  </a>
                </li>
                <li>
                  <a href="#privacy_rights" className="underline">
                    WHAT ARE YOUR PRIVACY RIGHTS?
                  </a>
                </li>
                <li>
                  <a href="#controls" className="underline">
                    CONTROLS FOR DO-NOT-TRACK FEATURES
                  </a>
                </li>
                <li>
                  <a href="#usa_rights" className="underline">
                    DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?
                  </a>
                </li>
                <li>
                  <a href="#other_rights" className="underline">
                    DO OTHER REGIONS HAVE SPECIFIC PRIVACY RIGHTS?
                  </a>
                </li>
                <li>
                  <a href="#updates" className="underline">
                    DO WE MAKE UPDATES TO THIS NOTICE?
                  </a>
                </li>
                <li>
                  <a href="#contact" className="underline">
                    HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
                  </a>
                </li>
                <li>
                  <a href="#data_rud" className="underline">
                    HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT
                    FROM YOU?
                  </a>
                </li>
              </ol>
            </div>

            {/* sections 1 */}

            <div
              id="info_collect"
              className="flex flex-col gap-3 mt-8 lg:scroll-m-24 scroll-m-16"
            >
              <h3 className="uppercase lg:text-4xl sm:text-3xl text-2xl font-[600] tracking-wide underline">
                {realData[2].title}
              </h3>
              <div>
                <h2 className="text-[#ffffff] font-[600] lg:text-2xl text-lg mt-3">
                  {realData[3].title}
                </h2>
                <h4 className="text-[#CFCFCF] lg:font-[400] font-[300] lg:text-lg text-base italic">
                  {realData[3].additional}
                </h4>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div
                dangerouslySetInnerHTML={createMarkup(realData[3].description)}
                className="flex flex-col gap-3"
              />
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <h4 className="text-[#ffffff] font-[600] lg:text-2xl text-lg">
                  {realData[4].title}
                </h4>
                <h4
                  className="text-[#CFCFCF] lg:font-[400] font-[300] lg:text-lg text-base"
                  dangerouslySetInnerHTML={createMarkup(
                    realData[4].description,
                  )}
                />
              </div>
            </div>

            {/* sections 2 */}
            <div
              id="info_process"
              className="flex flex-col gap-3 mt-8 lg:scroll-m-24 scroll-m-16"
            >
              <h3 className="uppercase lg:text-4xl sm:text-3xl text-2xl font-[600] tracking-wide underline">
                {realData[5].title}
              </h3>
              <div>
                <h4 className="text-[#CFCFCF] lg:font-[400] font-[300] lg:text-lg text-base italic">
                  {realData[5].additional}
                </h4>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div
                dangerouslySetInnerHTML={createMarkup(realData[5].description)}
                className="flex flex-col gap-3"
              />
            </div>

            {/* sections 3 */}
            <div
              id="personal_bases"
              className="flex flex-col gap-3 mt-8 lg:scroll-m-24 scroll-m-16"
            >
              <h3 className="uppercase lg:text-4xl sm:text-3xl text-2xl font-[600] tracking-wide underline">
                {realData[6].title}
              </h3>
              <div>
                <h4 className="text-[#CFCFCF] lg:font-[400] font-[300] lg:text-lg text-base italic">
                  {realData[6].additional}
                </h4>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div
                dangerouslySetInnerHTML={createMarkup(realData[6].description)}
                className="flex flex-col gap-3"
              />
            </div>

            {/* sections 4 */}
            <div
              id="personal_share"
              className="flex flex-col gap-3 mt-8 lg:scroll-m-24 scroll-m-16"
            >
              <h3 className="uppercase lg:text-4xl sm:text-3xl text-2xl font-[600] tracking-wide underline">
                {realData[7].title}
              </h3>
              <div>
                <h4 className="text-[#CFCFCF] lg:font-[400] font-[300] lg:text-lg text-base italic">
                  {realData[7].additional}
                </h4>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div
                dangerouslySetInnerHTML={createMarkup(realData[7].description)}
                className="flex flex-col gap-3"
              />
            </div>

            {/* sections 5 */}
            <div
              id="cookies"
              className="flex flex-col gap-3 mt-8 lg:scroll-m-24 scroll-m-16"
            >
              <h3 className="uppercase lg:text-4xl sm:text-3xl text-2xl font-[600] tracking-wide underline">
                {realData[8].title}
              </h3>
              <div>
                <h4 className="text-[#CFCFCF] lg:font-[400] font-[300] lg:text-lg text-base italic">
                  {realData[8].additional}
                </h4>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div
                dangerouslySetInnerHTML={createMarkup(realData[8].description)}
                className="flex flex-col gap-3"
              />
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-[#ffffff] font-[600] lg:text-2xl text-lg">
                {realData[9].title}
              </h4>
              <div
                dangerouslySetInnerHTML={createMarkup(realData[9].description)}
              />
            </div>

            {/* sections 6 */}
            <div
              id="logins"
              className="flex flex-col gap-3 mt-8 lg:scroll-m-24 scroll-m-16"
            >
              <h3 className="uppercase lg:text-4xl sm:text-3xl text-2xl font-[600] tracking-wide underline">
                {realData[10].title}
              </h3>
              <div>
                <h4 className="text-[#CFCFCF] lg:font-[400] font-[300] lg:text-lg text-base italic">
                  {realData[10].additional}
                </h4>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div
                dangerouslySetInnerHTML={createMarkup(realData[10].description)}
                className="flex flex-col gap-3"
              />
            </div>

            {/* sections 7 */}
            <div
              id="info_keep"
              className="flex flex-col gap-3 mt-8 lg:scroll-m-24 scroll-m-16"
            >
              <h3 className="uppercase lg:text-4xl sm:text-3xl text-2xl font-[600] tracking-wide underline">
                {realData[11].title}
              </h3>
              <div>
                <h4 className="text-[#CFCFCF] lg:font-[400] font-[300] lg:text-lg text-base italic">
                  {realData[11].additional}
                </h4>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div
                dangerouslySetInnerHTML={createMarkup(realData[11].description)}
                className="flex flex-col gap-3"
              />
            </div>

            {/* sections 8 */}
            <div
              id="info_safe"
              className="flex flex-col gap-3 mt-8 lg:scroll-m-24 scroll-m-16"
            >
              <h3 className="uppercase lg:text-4xl sm:text-3xl text-2xl font-[600] tracking-wide underline">
                {realData[12].title}
              </h3>
              <div>
                <h4 className="text-[#CFCFCF] lg:font-[400] font-[300] lg:text-lg text-base italic">
                  {realData[12].additional}
                </h4>
              </div>
            </div>

            <div
              dangerouslySetInnerHTML={createMarkup(realData[12].description)}
              className="flex flex-col gap-3"
            />

            {/* sections 9 */}
            <div
              id="info_minors"
              className="flex flex-col gap-3 mt-8 lg:scroll-m-24 scroll-m-16"
            >
              <h3 className="uppercase lg:text-4xl sm:text-3xl text-2xl font-[600] tracking-wide underline">
                {realData[13].title}
              </h3>
              <div>
                <h4 className="text-[#CFCFCF] lg:font-[400] font-[300] lg:text-lg text-base italic">
                  {realData[13].additional}
                </h4>
              </div>
            </div>

            <div
              dangerouslySetInnerHTML={createMarkup(realData[13].description)}
              className="flex flex-col gap-3"
            />

            {/* sections 10 */}
            <div
              id="privacy_rights"
              className="flex flex-col gap-3 mt-8 lg:scroll-m-24 scroll-m-16"
            >
              <h3 className="uppercase lg:text-4xl sm:text-3xl text-2xl font-[600] tracking-wide underline">
                {realData[14].title}
              </h3>
              <div>
                <h4 className="text-[#CFCFCF] lg:font-[400] font-[300] lg:text-lg text-base italic">
                  {realData[14].additional}
                </h4>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div
                dangerouslySetInnerHTML={createMarkup(realData[14].description)}
                className="flex flex-col gap-3"
              />
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-[#ffffff] font-[600] lg:text-2xl text-lg">
                {realData[15].title}
              </h4>

              <div
                dangerouslySetInnerHTML={createMarkup(realData[15].description)}
              />
            </div>

            {/* sections 11 */}
            <div
              id="controls"
              className="flex flex-col gap-3 mt-8 lg:scroll-m-24 scroll-m-16"
            >
              <h3 className="uppercase lg:text-4xl sm:text-3xl text-2xl font-[600] tracking-wide underline">
                {realData[16].title}
              </h3>
            </div>

            <div className="flex flex-col gap-3">
              <div
                dangerouslySetInnerHTML={createMarkup(realData[16].description)}
                className="flex flex-col gap-3"
              />
            </div>

            {/* sections 12 */}
            <div
              id="usa_rights"
              className="flex flex-col gap-3 mt-8 lg:scroll-m-24 scroll-m-16"
            >
              <h3 className="uppercase lg:text-4xl sm:text-3xl text-2xl font-[600] tracking-wide underline">
                {realData[17].title}
              </h3>
              <div>
                <h4 className="text-[#CFCFCF] lg:font-[400] font-[300] lg:text-lg text-base italic">
                  <div
                    dangerouslySetInnerHTML={createMarkup(
                      realData[17].description,
                    )}
                    className="flex flex-col gap-3"
                  />
                </h4>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-[#ffffff] font-[600] lg:text-2xl text-lg">
                {realData[18].title}
              </h4>

              <p className="lg:font-[400] font-[300] text-base">
                {realData[18].additional}
              </p>

              <Table columns={columns} data={dataTable} />

              <div
                dangerouslySetInnerHTML={createMarkup(realData[31].description)}
                className="flex flex-col gap-3"
              />
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-[#ffffff] font-[600] lg:text-2xl text-lg">
                {realData[32].title}
              </h4>

              <div
                dangerouslySetInnerHTML={createMarkup(realData[32].description)}
                className="flex flex-col gap-3"
              />
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-[#ffffff] font-[600] lg:text-2xl text-lg">
                {realData[33].title}
              </h4>

              <div
                dangerouslySetInnerHTML={createMarkup(realData[33].description)}
                className="flex flex-col gap-3"
              />
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-[#ffffff] font-[600] lg:text-2xl text-lg">
                {realData[34].title}
              </h4>

              <div
                dangerouslySetInnerHTML={createMarkup(realData[34].description)}
                className="flex flex-col gap-3"
              />
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-[#ffffff] font-[600] lg:text-2xl text-lg">
                {realData[35].title}
              </h4>

              <div
                dangerouslySetInnerHTML={createMarkup(realData[35].description)}
                className="flex flex-col gap-3"
              />
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-[#ffffff] font-[600] lg:text-2xl text-lg">
                {realData[36].title}
              </h4>

              <div
                dangerouslySetInnerHTML={createMarkup(realData[36].description)}
                className="flex flex-col gap-3"
              />
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-[#ffffff] font-[600] lg:text-2xl text-lg">
                {realData[37].title}
              </h4>

              <div
                dangerouslySetInnerHTML={createMarkup(realData[37].description)}
                className="flex flex-col gap-3"
              />
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-[#ffffff] font-[600] lg:text-2xl text-lg">
                {realData[38].title}
              </h4>

              <div
                dangerouslySetInnerHTML={createMarkup(realData[38].description)}
                className="flex flex-col gap-3"
              />
            </div>

            {/* sections 13 */}
            <div
              id="other_rights"
              className="flex flex-col gap-3 mt-8 lg:scroll-m-24 scroll-m-16"
            >
              <h3 className="uppercase lg:text-4xl sm:text-3xl text-2xl font-[600] tracking-wide underline">
                {realData[39].title}
              </h3>
              <div>
                <h4 className="text-[#CFCFCF] lg:font-[400] font-[300] lg:text-lg text-base italic">
                  {realData[39].additional}
                </h4>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-[#ffffff] font-[600] lg:text-2xl text-lg">
                {realData[40].title}
              </h4>

              <div
                dangerouslySetInnerHTML={createMarkup(realData[40].description)}
                className="flex flex-col gap-3"
              />
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-[#ffffff] font-[600] lg:text-2xl text-lg">
                {realData[41].title}
              </h4>

              <div
                dangerouslySetInnerHTML={createMarkup(realData[41].description)}
                className="flex flex-col gap-3"
              />
            </div>

            {/* sections 14 */}
            <div
              id="updates"
              className="flex flex-col gap-3 mt-8 lg:scroll-m-24 scroll-m-16"
            >
              <h3 className="uppercase lg:text-4xl sm:text-3xl text-2xl font-[600] tracking-wide underline">
                {realData[42].title}
              </h3>
              <div>
                <h4 className="text-[#CFCFCF] lg:font-[400] font-[300] lg:text-lg text-base italic">
                  {realData[42].additional}
                </h4>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-[#ffffff] font-[600] lg:text-2xl text-lg">
                {realData[43].title}
              </h4>

              <div
                dangerouslySetInnerHTML={createMarkup(realData[43].description)}
                className="flex flex-col gap-3"
              />
            </div>

            {/* sections 15 */}
            <div
              id="contact"
              className="flex flex-col gap-3 mt-8 lg:scroll-m-24 scroll-m-16"
            >
              <h3 className="uppercase lg:text-4xl sm:text-3xl text-2xl font-[600] tracking-wide underline">
                {realData[44].title}
              </h3>
            </div>

            <div className="flex flex-col gap-3">
              <div
                dangerouslySetInnerHTML={createMarkup(realData[44].description)}
                className="flex flex-col gap-3"
              />
            </div>

            {/* sections 16 */}
            <div
              id="data_rud"
              className="flex flex-col gap-3 mt-8 lg:scroll-m-24 scroll-m-16"
            >
              <h3 className="uppercase lg:text-4xl sm:text-3xl text-2xl font-[600] tracking-wide underline">
                {realData[45].title}
              </h3>
            </div>

            <div className="flex flex-col gap-3">
              <div
                dangerouslySetInnerHTML={createMarkup(realData[45].description)}
                className="flex flex-col gap-3"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Privacy;
