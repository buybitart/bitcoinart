import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { UserContext } from "../main";
import api from "../http";
import { useForm } from "react-hook-form";
import axios from "axios";
import Footer from "../components/Footer";
import Checkbox from "../components/Checkbox";
import { motion, AnimatePresence } from "framer-motion";
import StripePay from "../components/StripePay";
import { getPrice, inputCSS } from "../utils";
import TextAreaLabel from "../components/TextAreaLabel";
import InputLabel from "../components/InputLabel";
import Input from "../components/Input";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";

const PayForAuction = () => {
  const { userStore } = useContext(UserContext);
  const [searchParams] = useSearchParams();

  const [auction, setAuction] = useState();
  const [totalPrice, setTotalPrice] = useState(0);
  const [btcPrice, setBtcPrice] = useState(0);
  const [cryptoType, setCryptoType] = useState({
    name: "Bitcoin",
    token: "BTC",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [stripePaymentHandler, setStripePaymentHandler] = useState(null);

  const auctionHash = searchParams.get("id");
  const typePay = searchParams.get("typePay") || "crypto";
  const navigate = useNavigate();

  const formDataRef = useRef(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const getUpdatedSearchParams = (newParams) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      params.set(key, value);
    });
    return `?${params.toString()}`;
  };

  const cryptoOptions = [
    {
      name: "Bitcoin",
      token: "BTC",
    },
    {
      name: "USDT",
      token: "TRC20",
    },
  ];

  useEffect(() => {
    async function fetchBTCPrice() {
      try {
        const response = await axios.get(import.meta.env.VITE_USDBTC_API);
        setBtcPrice(response.data.USD.sell);
      } catch (error) {
        console.error("Failed to fetch BTC price:", error);
      }
    }

    fetchBTCPrice();
  }, []);

  useEffect(() => {
    if (auction && btcPrice) {
      if (typePay === "card") setTotalPrice(btcPrice * auction.currentPrice);
      else if (typePay === "crypto") setTotalPrice(auction.currentPrice);
    }
  }, [auction, btcPrice, typePay]);

  async function fetchAuction() {
    try {
      const response = await api.get(`/auctions/${auctionHash}`);
      setAuction(response.data);
      setTotalPrice(response.data.currentPrice);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    fetchAuction();
  }, [auctionHash]);

  async function PayBTC(data) {
    setIsLoading(true);
    try {
      const response = await toast.promise(
        api.post("/payment/create-invoice-btc-auction", data),
        {
          pending: `Loading...`,
          success: `Redirecting...`,
          error: `Failed to pay :/`,
        },
      );

      if (response.data.checkoutLink)
        window.location.href = response.data.checkoutLink;
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }

  async function PayUSDT(data, btcPrice) {
    setIsLoading(true);
    try {
      const response = await toast.promise(
        api.post("/payment/create-invoice-usdt-auction", { ...data, btcPrice }),
        {
          pending: `Loading...`,
          success: `Redirecting...`,
          error: `Failed to pay :/`,
        },
      );

      if (response.data.checkoutLink)
        window.location.href = response.data.checkoutLink;
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }

  async function PayCard(paymentIntentId, userId, itemsPurchased) {
    setIsLoading(true);
    try {
      const response = await toast.promise(
        api.post("/payment/confirm-payment-auction", {
          paymentIntentId: paymentIntentId,
          userId: userId,
          itemsPurchased: itemsPurchased,
          ...formDataRef.current,
        }),
        {
          pending: "Confirming payment...",
          success: "Payment confirmed!",
          error: "Failed to confirm payment :/",
        },
      );

      if (response.data.message === "Payment confirmed!")
        navigate(`/success?orderId=${response.data.orderId}`);
    } catch (e) {
      console.log(e);
      toast.error("Payment failed :/");
    } finally {
      setIsLoading(false);
    }
  }

  const onSubmit = async (data) => {
    const fullData = {
      itemsPurchased: auction,
      userId: userStore.user.id || userStore.user._id,
      ...data,
    };

    formDataRef.current = data;

    if (typePay === "crypto") await PayBTC(fullData);
    else if (typePay === "crypto" && cryptoType.token === "TRC20")
      await PayUSDT(fullData, btcPrice);
    else if (typePay === "card" && stripePaymentHandler) {
      await stripePaymentHandler();
    } else {
      toast.error("Stripe payment handler is not available.");
      console.error("Stripe payment handler is not available.");
    }

    reset();
  };

  if (!auction) return;
  const lastBidUser =
    auction.bids.length > 0 ? auction.bids[auction.bids.length - 1].user : null;

  if (
    userStore.isAuth &&
    lastBidUser &&
    lastBidUser !== userStore.user._id &&
    lastBidUser !== userStore.user.id
  ) {
    navigate("/404");
  }

  return (
    <>
      <Helmet>
        <title>Auction Payment | 5KSANA</title>
      </Helmet>
      <section className="w-[100vw] h-full">
        <div className="w-full h-full relative mt-[calc(52px+40px)] xl:mt-[calc(65px+40px)] px-[16px] xl:px-[6.25rem] pb-14">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex xl:flex-row flex-col w-full h-auto 2xl:gap-[150px] lg:gap-[100px] gap-[45px] justify-between"
          >
            {/* left side */}
            <div className="w-full h-auto flex flex-col gap-8">
              <div className="flex w-full h-auto gap-6 flex-col">
                <div className="flex sm:flex-row flex-col gap-5 h-auto w-full">
                  <div className="flex flex-col gap-3 w-full h-auto relative">
                    <InputLabel
                      id="Fname"
                      placeholder="Tyler"
                      label="First name *"
                      type="text"
                      autocomplete="given-name"
                      {...register("firstname", {
                        required: "Name is required",
                      })}
                    />
                    {errors.firstname && (
                      <p className="text-red-500 text-xs">
                        {errors.firstname.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-3 w-full h-auto relative">
                    <InputLabel
                      id="Lname"
                      placeholder="Durden"
                      label="Last name *"
                      type="text"
                      autocomplete="family-name"
                      {...register("lastname", {
                        required: "Last name is required",
                      })}
                    />
                    {errors.lastname && (
                      <p className="text-red-500 text-xs">
                        {errors.lastname.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-3 w-full h-auto relative">
                  <InputLabel
                    id="countryInp"
                    placeholder="Italy"
                    label="Country / Region *"
                    type="country"
                    autocomplete="country"
                    {...register("country", {
                      required: "Country is required",
                    })}
                  />
                  {errors.country && (
                    <p className="text-red-500 text-xs">
                      {errors.country.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5 w-full h-auto">
                  <InputLabel
                    id="streetInp"
                    placeholder="Street name / (apartment, suite)"
                    label="Street address *"
                    type="country"
                    autocomplete="address-line1"
                    {...register("street", {
                      required: "Street is required",
                    })}
                  />
                  <div className="flex flex-col gap-3 w-full h-auto relative">
                    <Input
                      className={`${inputCSS} mt-[18px]`}
                      placeholder="Town / City"
                      id="apartmentInp"
                      type="country"
                      autocomplete="address-level2"
                      {...register("city", {
                        required: "City is required",
                      })}
                    />
                    {(errors.city || errors.street) && (
                      <p className="text-red-500 text-xs">
                        Address is required
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-3 w-full h-auto relative">
                  <InputLabel
                    id="zipInp"
                    placeholder="ZIP Code"
                    label="ZIP Code *"
                    type="text"
                    autocomplete="postal-code"
                    {...register("zip", {
                      required: "Zip Code is required",
                    })}
                  />
                  {errors.zip && (
                    <p className="text-red-500 text-xs">{errors.zip.message}</p>
                  )}
                </div>
                <div className="flex flex-col gap-3 w-full h-auto relative">
                  <InputLabel
                    id="phoneInp"
                    placeholder="Phone"
                    label="Phone *"
                    type="tel"
                    autocomplete="tel"
                    {...register("phone", {
                      required: "Phone Number is required",
                    })}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-3 w-full h-auto relative">
                  <InputLabel
                    id="emailInp"
                    placeholder="Email address"
                    label="Email address *"
                    type="email"
                    autocomplete="email username"
                    {...register("email", {
                      required: "Email is required",
                    })}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <TextAreaLabel
                  id="notesInp"
                  placeholder="Order notes"
                  label="Order notes (optional)"
                  autocomplete="postal-code"
                  {...register("notes")}
                />
              </div>
            </div>
            {/* right side */}
            <div className="xl:w-[calc(100%-25cqw)] w-full h-auto flex flex-col gap-8 items-center">
              {/* type */}
              <div className="flex xl:sticky relative shadow-xl xl:top-[81px] justify-between gap-1 bg-[#FFFFFF1A] backdrop-blur-md z-[2] p-2 w-full max-w-[336px] mx-auto rounded-xl h-[47px] font-main text-white text-base items-center">
                <Link
                  to={getUpdatedSearchParams({ typePay: "crypto" })}
                  className="w-full h-auto text-center"
                >
                  Crypto pay
                </Link>
                <Link
                  to={getUpdatedSearchParams({ typePay: "card" })}
                  className="w-full h-auto text-center"
                >
                  Card pay
                </Link>

                <div
                  className={`bg-[#A2A2A24D] h-[31px] rounded-[7px] w-[164px] absolute transition-[left] duration-300 top-2 ${
                    typePay === "crypto"
                      ? "left-2"
                      : "left-[calc(100%-0.5rem-164px)]"
                  } z-[1]`}
                />
              </div>

              {/* product */}
              <div className="flex flex-col w-full h-auto gap-2 relative">
                <div className="w-full h-auto flex justify-between font-main sm:text-base text-sm font-[300]">
                  <div className="flex gap-4 w-auto h-auto">
                    <span className="w-auto sm:max-w-[350px] max-w-[180px] inline-block whitespace-nowrap overflow-hidden text-ellipsis">
                      {auction.title} (Auction)
                    </span>
                    <span className="tracking-widest opacity-70">x1</span>
                  </div>
                  <span className="text-[#FCCB00]">
                    {typePay === "crypto"
                      ? cryptoType.token === "BTC"
                        ? getPrice(auction.currentPrice, 4, "BTC")
                        : getPrice(btcPrice * auction.currentPrice, 2, "USD")
                      : typePay === "card"
                      ? getPrice(btcPrice * auction.currentPrice, 2, "USD")
                      : null}
                  </span>
                </div>
              </div>

              {/* shipping */}
              <div className="flex flex-col w-full h-auto gap-6">
                <div className="flex flex-col gap-4 w-full h-auto">
                  <h3 className="font-main font-[600] sm:text-2xl text-lg tracking-wide">
                    Shiping method
                  </h3>
                  <div className="flex flex-col gap-3 w-full h-auto">
                    <div className="bg-[#FFFFFF1A] w-full sm:h-[72px] h-[62px] rounded-xl p-6 gap-4 flex items-center font-main">
                      <div className="w-[14px] h-[14px] outline outline-1 outline-offset-4 outline-white bg-white rounded-full opacity-90" />
                      <span className="sm:text-lg text-base font-[400] tracking-wide opacity-90">
                        International - Free
                      </span>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {typePay === "card" ? (
                    <motion.div
                      className="flex flex-col gap-4 my-1 w-full h-auto relative"
                      initial={{ opacity: 0, x: -24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -24 }}
                      layout
                    >
                      <h3 className="font-main font-[600] sm:text-2xl text-lg tracking-wide">
                        Card Information
                      </h3>
                      <StripePay
                        totalPrice={totalPrice}
                        email={userStore.user.email}
                        userId={userStore.user.id || userStore.user._id}
                        setStripePayment={setStripePaymentHandler}
                        onPaymentSuccess={(paymentIntentId) =>
                          PayCard(
                            paymentIntentId,
                            userStore.user.id || userStore.user._id,
                            auction,
                          )
                        }
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, x: -24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -24 }}
                      layout
                      className="flex flex-col gap-4 w-full h-auto"
                    >
                      <h3 className="font-main font-[600] sm:text-2xl text-lg tracking-wide">
                        Currency
                      </h3>
                      {cryptoOptions.map((option, index) => (
                        <div
                          className="flex flex-col gap-3 w-full h-auto cursor-pointer"
                          key={index}
                        >
                          <label className="bg-[#FFFFFF1A] w-full sm:h-[72px] h-[62px] rounded-xl p-6 gap-4 flex items-center font-main cursor-pointer">
                            <input
                              checked={cryptoType.name === option.name}
                              onChange={() => setCryptoType(option)}
                              className="sr-only peer"
                              name="futuristic-radio"
                              type="radio"
                            />
                            <div className="w-[14px] h-[14px] bg-transparent outline outline-1 outline-offset-4 outline-white rounded-full peer-checked:bg-white transition duration-300 ease-in-out" />
                            <span className="sm:text-lg text-base font-[400] tracking-wide opacity-90">
                              {option.name}
                            </span>
                            <span className="sm:text-lg text-base font-[300] tracking-wide relative opacity-50 -ml-2">{`(${option.token})`}</span>
                          </label>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* total */}
                <div className="w-full h-auto flex flex-col gap-1">
                  <div className="font-main text-base font-[300] tracking-wide w-full flex justify-between items-center">
                    <span className="text-[#CFCFCF]">Total</span>
                    <span className="text-white font-[500]">
                      {typePay === "crypto"
                        ? cryptoType.token === "BTC"
                          ? totalPrice.toFixed(4) + "BTC"
                          : (btcPrice * totalPrice).toFixed(2) + "USD"
                        : typePay === "card"
                        ? totalPrice.toFixed(2) + "USD"
                        : null}
                    </span>
                  </div>
                  <div className="font-main text-base font-[300] tracking-wide w-full flex justify-between items-center">
                    <span className="text-[#CFCFCF]">To pay</span>
                    <span className="text-[#FCCB00] font-[500]">
                      {typePay === "crypto"
                        ? cryptoType.token === "BTC"
                          ? totalPrice.toFixed(4) + "BTC"
                          : (btcPrice * totalPrice).toFixed(2) + "USD"
                        : typePay === "card"
                        ? totalPrice.toFixed(2) + "USD"
                        : null}
                    </span>
                  </div>
                </div>

                {/* privacy */}
                <label
                  htmlFor="checkPrivacy"
                  className="w-auto h-auto flex items-center gap-1.5"
                >
                  <Checkbox
                    onChange={() => setIsAgreed(!isAgreed)}
                    defaultChecked={isAgreed}
                  />
                  <p className="text-xs font-main text-[#CFCFCF]/90 tracking-wide">
                    * I have read and agree to the{" "}
                    <Link to="/privacy" className="underline">
                      Privacy Policy
                    </Link>{" "}
                    and{" "}
                    <Link to="/policies" className="underline">
                      Policies
                    </Link>
                    .
                  </p>
                </label>

                {/* pay */}
                <button
                  className={`flex font-main text-lg rounded-[1.25rem] w-full h-[43px] bg-[#FCCB00] text-[#522700] font-[600] items-center justify-center ${
                    isLoading || !isAgreed
                      ? "opacity-60 pointer-events-none"
                      : "hover:bg-[#D4A900] hover:text-[#1C1600]"
                  } transition-colors duration-[250ms]`}
                >
                  Pay
                </button>
              </div>
            </div>
          </form>
        </div>

        <Footer />
      </section>
    </>
  );
};

export default PayForAuction;
