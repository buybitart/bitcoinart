import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>404 Not Found | 5KSANA</title>
      </Helmet>
      <div className="w-[100vw] h-full">
        <div className="w-full h-[100svh] relative px-[16px] xl:px-[6.25rem] flex items-center justify-center">
          <div className="flex flex-col gap-4 w-auto h-auto justify-center items-center font-main z-[1] relative">
            <h2 className="text-8xl font-[800]">404</h2>
            <span className="text-2xl font-[300] tracking-wide text-[#ffffff]/85">
              Page not found{" "}
              <Link to={"/shop"} className="underline text-white">
                Go back
              </Link>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
