import React, { useEffect, useState } from "react";
import Input from "./Input";
import TextArea from "./TextArea";
import Checkbox from "./Checkbox";
import { createMarkup, getSettings } from "../utils";
import axios from "axios";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";

const ContactForm = ({ decor }) => {
  const [settings, setSettings] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    getSettings("elements", setSettings);
  }, []);

  if (!settings) return <></>;

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_DB_LINK}/api/contact`,
        data,
      );
      if (response.status === 200) {
        alert("Message sent successfully!");
        reset();
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <section
      className={`w-full h-auto min-h-[464px] ${
        decor ? "my-14 md:my-0" : "my-5 md:my-0"
      } relative flex justify-center items-center px-[16px] xl:px-[6.25rem]`}
    >
      <div className="w-full z-[1] h-auto rounded-[20px] p-4 sm:p-8 bg-[#FFFFFF1A] border-[1px] border-[#212121] backdrop-blur-xl xl:flex-row flex-col flex justify-between">
        <div className="flex flex-col gap-6 sm:gap-[40px] w-full h-auto xl:mb-0 mb-8">
          <div className="flex flex-col gap-4 w-full xl:w-fit h-auto relative">
            <h4
              dangerouslySetInnerHTML={createMarkup(settings.sections[0].title)}
              className="font-main uppercase 2xl:text-5xl text-4xl font-[600] w-max tracking-wider"
            />
            <p
              dangerouslySetInnerHTML={createMarkup(
                settings.sections[0].description,
              )}
              className="font-main font-[300] opacity-50 xl:max-w-[450px] w-auto text-lg sm:text-xl sm:tracking-wide"
            />
          </div>
          <a
            href={`mailto:info@buybitart.com`}
            target="_blank"
            className="relative w-auto h-auto flex gap-1"
          >
            <img
              src="/email.svg"
              alt="email"
              className="w-[24px] h-[24px] object-contain"
            />
            <span className="font-main font-[300] underline underline-offset-1">
              info@buybitart.com
            </span>
          </a>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 relative w-full 2xl:max-w-[750px] xl:max-w-[588px] h-auto"
        >
          <div className="flex flex-col gap-6 relative w-full h-auto">
            <div className="flex xl:flex-row flex-col w-full justify-between gap-6 h-auto">
              <div className="flex flex-col gap-6 w-full h-auto">
                <div className="flex flex-col gap-1.5 w-full h-auto relative">
                  <Input
                    type="text"
                    placeholder="Name"
                    {...register("name", { required: "Name is required" })}
                    className={`border-0 outline-0 w-full h-[44px] rounded-[20px] py-[10px] px-[12px] bg-[#212121] font-main font-[300] text-base placeholder-[#707070]`}
                  />
                  {errors.name && (
                    <p className="text-red-500 font-main text-sm">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5 w-full h-auto relative">
                  <Input
                    type="email"
                    placeholder="Email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                        message: "Invalid email address",
                      },
                    })}
                    className={`border-0 outline-0 w-full h-[44px] rounded-[20px] py-[10px] px-[12px] bg-[#212121] font-main font-[300] text-base placeholder-[#707070]`}
                  />
                  {errors.email && (
                    <p className="text-red-500 font-main text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="w-full h-full flex relative">
                <div className="flex flex-col gap-1.5 w-full h-auto relative">
                  <TextArea
                    placeholder="Message"
                    {...register("message", {
                      required: "Message is required",
                    })}
                    className={`border-0 outline-0 w-full h-full flex-1 flex rounded-[20px] py-[10px] px-[12px] resize-none bg-[#212121] font-main font-[300] text-base placeholder-[#707070]`}
                  />
                  {errors.message && (
                    <p className="text-red-500 font-main text-sm">
                      {errors.message.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 w-full h-auto relative">
              <label
                htmlFor="checkPrivacy"
                className="w-auto h-auto relative flex items-center gap-2"
              >
                <Checkbox
                  {...register("privacy", {
                    required: "You must agree to the privacy policy",
                  })}
                />
                <span className="font-main font-[300] sm:text-base text-sm">
                  I have read and agree with the privacy policy
                </span>
              </label>
              {errors.privacy && (
                <p className="text-red-500 font-main text-sm">
                  {errors.privacy.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="ml-auto w-full sm:w-[108px] h-[40px] rounded-[20px] py-[10px] px-3 gap-3 flex items-center justify-center bg-[#FCCB00] text-[#522700] font-main font-[600] hover:bg-white hover:text-black transition-colors duration-[250ms]"
          >
            {isSubmitting ? (
              <span className="w-[72px] text-center">Sending...</span>
            ) : (
              <>
                <span className="w-[72px] text-center">Send</span>
                <motion.img
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "32px" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.3 }}
                  layout
                  src="/send.svg"
                  alt="send"
                  className="w-[32px] h-[32px] object-contain"
                />
              </>
            )}
          </button>
        </form>
      </div>

      {decor && (
        <>
          <img
            src="/btc1.png"
            alt="btc1"
            className="absolute -top-7 xl:top-10 right-[16px] sm:right-5 xl:right-10 w-[80px] xl:w-[120px] h-[80px] xl:h-[120px] object-contain z-[2] pointer-events-none"
          />
          <img
            src="/btc2.png"
            alt="btc2"
            className="absolute -bottom-20 sm:-bottom-7 xl:bottom-10 left-[16px] sm:left-5 xl:left-10 w-[80px] xl:w-[120px] h-[80px] xl:h-[120px] object-contain z-[2] pointer-events-none"
          />

          <div className="w-[405px] xl:w-[505px] h-[300px] xl:h-[400px] absolute bottom-[-150px] right-[-300px] bg-[#FCCB002E] rounded-full blur-[150px] rotate-[22deg] pointer-events-none"></div>
          <div className="w-[300px] xl:w-[400px] h-[300px] xl:h-[400px] absolute top-[-156px] left-[-183px] bg-[#FCCB002E] rounded-full blur-[150px] rotate-[22deg] pointer-events-none"></div>
        </>
      )}
    </section>
  );
};

export default ContactForm;
