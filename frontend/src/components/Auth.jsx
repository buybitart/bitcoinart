import React, { useContext, useState } from "react";
import SocialButton from "./SocialButton";
import InputLabel from "./InputLabel";
import { useForm } from "react-hook-form";
import { UserContext } from "../main";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";

const Auth = ({ popupClose }) => {
  const [type, setType] = useState("login");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();
  const { userStore } = useContext(UserContext);

  function setLogin() {
    setType("login");
  }

  function setRegister() {
    setType("register");
  }

  const onSubmitLogin = async (data) => {
    setLoading(true);
    try {
      await userStore.login(data.emailL, data.passwordL).then((response) => {
        if (typeof response.data !== "string") {
          setLoading(false);
          popupClose();
          toast.success("Logged In!")
        } else setError("passwordL", { message: response.data });
      });
    } catch (e) {
      setLoading(false);
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitRegister = async (data) => {
    if (data.passwordR !== data.confirmPassword) {
      setError("confirmPassword", { message: "Passwords do not match" });
      return;
    }
    setLoading(true);
    try {
      await userStore.register(data.emailR, data.passwordR).then((response) => {
        if (typeof response.data !== "string") {
          setLoading(false);
          popupClose();
          toast.success("Account Created! We send an email for activation.")
        } else setError("emailR", { message: response.data });
      });
    } catch (e) {
      setLoading(false);
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  async function handleGoogleLoginSuccess(tokenResponse) {
    const accessToken = tokenResponse.access_token;
    try {
      await userStore.googleAuth(accessToken).then((response) => {
        if (typeof response !== "string") {
          setLoading(false);
          popupClose();
        } else setError("emailR", { message: response.data });
      });
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  }

  const google = useGoogleLogin({ onSuccess: handleGoogleLoginSuccess });

  return (
    <>
      {type === "login" ? (
        <div className="w-full max-w-[444px] h-auto min-h-[596px] gap-11 p-4 sm:p-8 rounded-3xl bg-[#171717] backdrop-blur-xl border-[1px] border-[#ffffff05] flex flex-col">
          <div className="flex flex-col gap-4 w-full h-auto">
            <button
              onClick={popupClose}
              className="w-[24px] h-[24px] flex items-center justify-center ml-auto opacity-70"
            >
              <img
                src="/close.svg"
                alt="close"
                className="w-[24px] h-[24px] object-contain"
                draggable="false"
              />
            </button>
            <h3 className="font-main text-[32px] leading-[42.2px] font-[500] text-center uppercase tracking-wider">
              Sign In
            </h3>
          </div>

          <form
            className="w-full h-auto flex flex-col gap-6 relative"
            onSubmit={handleSubmit(onSubmitLogin)}
          >
            <div className="w-full h-auto flex flex-col gap-8">
              <div className="w-full h-auto flex flex-col gap-5">
                <div className="flex flex-col gap-3 w-full h-auto relative">
                  <InputLabel
                    id="emailL"
                    placeholder="Email"
                    label="Email *"
                    type="email"
                    {...register("emailL", {
                      required: "email is required",
                    })}
                  />
                  {errors.emailL && (
                    <p className="text-red-500 text-xs">
                      {errors.emailL.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-3 w-full h-auto relative">
                  <InputLabel
                    id="passwordL"
                    placeholder="Password"
                    label="Password *"
                    type="password"
                    {...register("passwordL", {
                      required: "password is required",
                    })}
                  />
                  {errors.passwordL && (
                    <p className="text-red-500 text-xs">
                      {errors.passwordL.message}
                    </p>
                  )}
                </div>
              </div>
              <button className="flex font-main rounded-[1.25rem] w-full h-[40px] bg-[#FCCB00] text-[#522700] font-[600] items-center justify-center hover:bg-[#D4A900] hover:text-[#1C1600] transition-colors duration-[250ms]">
                Sign In
              </button>

              <div className="w-full h-[17px] flex justify-center items-center relative">
                <div className="w-full h-[1px] bg-[#383737]" />
                <span className="font-main absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[1] bg-[#171717] text-sm leading-[16.8px] font-[500] tracking-wider text-[#858585] w-[45px] flex justify-center items-center">
                  Or
                </span>
              </div>

              <div className="w-full h-auto flex flex-col gap-3">
                <SocialButton type="google" onClick={google} />
                {/* <SocialButton type="facebook" /> */}
              </div>
            </div>

            <div className="w-full h-auto flex gap-1.5 items-center text-base justify-center font-main leading-[19.2px]">
              <span className="font-[300] text-[#D8D8D8]">
                Dont’t have an account?
              </span>
              <button
                onClick={setRegister}
                type="button"
                className="font-[400] text-[#FCCB00]"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      ) : type === "register" ? (
        <div className="w-full max-w-[444px] h-auto min-h-[683px] gap-11 p-4 sm:p-8 rounded-3xl bg-[#171717] backdrop-blur-xl border-[1px] border-[#ffffff05] flex flex-col">
          <div className="flex flex-col gap-4 w-full h-auto">
            <button
              onClick={popupClose}
              className="w-[24px] h-[24px] flex items-center justify-center ml-auto opacity-70"
            >
              <img
                src="/close.svg"
                alt="close"
                className="w-[24px] h-[24px] object-contain"
                draggable="false"
              />
            </button>
            <h3 className="font-main text-[32px] leading-[42.2px] font-[500] text-center uppercase tracking-wider">
              Sign Up
            </h3>
          </div>

          <form
            className="w-full h-auto flex flex-col gap-6 relative"
            onSubmit={handleSubmit(onSubmitRegister)}
          >
            <div className="w-full h-auto flex flex-col gap-8">
              <div className="w-full h-auto flex flex-col gap-5">
                <div className="flex flex-col gap-3 w-full h-auto relative">
                  <InputLabel
                    id="emailR"
                    placeholder="Email"
                    label="Email *"
                    type="email"
                    {...register("emailR", {
                      required: "email is required",
                    })}
                  />
                  {errors.emailR && (
                    <p className="text-red-500 text-xs">
                      {errors.emailR.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-3 w-full h-auto relative">
                  <InputLabel
                    id="passwordR"
                    placeholder="Password"
                    label="Password *"
                    type="password"
                    {...register("passwordR", {
                      required: "password is required",
                    })}
                  />
                  {errors.passwordR && (
                    <p className="text-red-500 text-xs">
                      {errors.passwordR.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-3 w-full h-auto relative">
                  <InputLabel
                    id="passwordRC"
                    placeholder="Confirm Password"
                    label="Confirm Password *"
                    type="password"
                    {...register("confirmPassword", {
                      required: "password is not confirmed",
                    })}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
              <button className="flex font-main rounded-[1.25rem] w-full h-[40px] bg-[#FCCB00] text-[#522700] font-[600] items-center justify-center hover:bg-[#D4A900] hover:text-[#1C1600] transition-colors duration-[250ms]">
                Sign Up
              </button>

              <div className="w-full h-[17px] flex justify-center items-center relative">
                <div className="w-full h-[1px] bg-[#383737]" />
                <span className="font-main absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[1] bg-[#171717] text-sm leading-[16.8px] font-[500] tracking-wider text-[#858585] w-[45px] flex justify-center items-center">
                  Or
                </span>
              </div>

              <div className="w-full h-auto flex flex-col gap-3">
                <SocialButton
                  type="google"
                  typeForm="register"
                  onClick={google}
                />
                {/* <SocialButton type="facebook" typeForm="register" /> */}
              </div>
            </div>

            <div className="w-full h-auto flex gap-1.5 items-center text-base justify-center font-main leading-[19.2px]">
              <span className="font-[300] text-[#D8D8D8]">
                Already have an account?
              </span>
              <button
                onClick={setLogin}
                type="button"
                className="font-[400] text-[#FCCB00]"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Auth;
