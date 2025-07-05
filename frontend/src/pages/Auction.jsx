import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Breadcamp from "../components/Breadcrumb";
import Slider from "../components/Slider";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createMarkup, getPrice, inchesSize, runFireworks } from "../utils";
import Input from "../components/Input";
import BidCard from "../components/BidCard";
import Footer from "../components/Footer";
import SEO from "../utils/SEO";
import axios from "axios";
import Duration from "../utils/Duration";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import TransformOriginal from "../components/TransformOriginal";
import { UserContext } from "../main";
import { useForm } from "react-hook-form";
import Auth from "../components/Auth";
import api, { apiUrl } from "../http";
import { observer } from "mobx-react-lite";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const Auction = () => {
  const { userStore } = useContext(UserContext);
  const { hash } = useParams();
  const navigate = useNavigate();

  const [bids, setBids] = useState([]);
  const [visibleBids, setVisibleBids] = useState([]);
  const [data, setData] = useState({});
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [isFullyDisabled, setIsFullyDisabled] = useState(false);
  const [isOutbid, setIsOutbid] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isCurrentWinner, setIsCurrentWinner] = useState(false);
  const [originalOpen, setOriginalOpen] = useState({
    state: false,
    index: null,
  });

  const wsRef = useRef(null);
  const sliderRef = useRef();
  const sliderContainerRef = useRef(null);
  const textContainerRef = useRef(null);
  const errorShownRef = useRef(false);

  const increaseRateBid = 0.0001;

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm();

  const fetchAuctionData = useCallback(async () => {
    try {
      const [auctionResponse, bidsResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_DB_LINK}/api/auctions/${hash}`),
        axios.get(
          `${
            import.meta.env.VITE_DB_LINK
          }/api/auctions/${hash}/bids?page=1&limit=5`
        ),
      ]);

      setData(auctionResponse.data);
      setBids(bidsResponse.data);
      setVisibleBids(bidsResponse.data.slice(0, 5));
    } catch (error) {
      console.error("Error fetching auction data:", error);
    }
  }, [hash]);

  useEffect(() => {
    fetchAuctionData();
  }, [fetchAuctionData]);

  const handleOpenOriginal = (index) => {
    setOriginalOpen({
      state: true,
      index: index,
    });
  };

  const handleCloseOriginal = () => {
    setOriginalOpen({
      state: false,
      index: originalOpen.index,
    });
  };

  function popupAuthClose() {
    setIsOpen(false);
  }

  const loadMoreBids = async () => {
    try {
      const nextPage = page + 1;
      const response = await axios.get(
        `${
          import.meta.env.VITE_DB_LINK
        }/api/auctions/${hash}/bids?page=${nextPage}&limit=5`
      );
      setBids((prev) => [...prev, ...response.data]);
      setPage(nextPage);
    } catch (error) {
      console.error("Failed to load more bids:", error);
    }
  };

  const onSubmit = async (dataForm) => {
    if (!userStore.isAuth) return setIsOpen(true);

    const bidAmount = Number(dataForm.amount);
    if (
      !bidAmount ||
      bidAmount <= (data.minPrice || 0) ||
      bidAmount <= (data.currentPrice || 0) ||
      bidAmount > (data.maxPrice || Infinity)
    ) {
      return setError("amount", {
        message:
          "Bid must be greater than the current bid, and minimum price or smaller than maximum.",
      });
    }

    try {
      const response = await toast.promise(
        api.post(`/auctions/place-bet/${hash}`, {
          amount: bidAmount,
          userId: userStore.user._id || userStore.user.id,
          auctionId: data._id,
          name: dataForm.name,
        }),
        {
          pending: `Placing bid...`,
          success: `Bid Placed Successfully!`,
          error: `Failed to place a bid :/`,
        }
      );

      console.log("Bid placed successfully:", response.data);

      setData((prevData) => ({ ...prevData, currentPrice: bidAmount }));

      if (isFirstTime) setIsFirstTime(false);
      reset();
    } catch (error) {
      console.error("Failed to place bid:", error);
      setError("amount", {
        message: error.response?.data?.message || "Failed to place bid.",
      });
    }
  };

  const setupWebSocket = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) return;

    const ws = new WebSocket(`${apiUrl}/auctions/${hash}`);
    wsRef.current = ws;

    ws.onopen = () => console.log("WebSocket connected");

    ws.onmessage = (event) => {
      const { type, bid, status, winner } = JSON.parse(event.data);
      if (type === "newBid") {
        setBids((prev) => [bid, ...prev]);
        setData((prevData) => ({ ...prevData, currentPrice: bid.amount }));
      } else if (type === "auctionEnded") {
        setData((prevData) => ({ ...prevData, status }));
        setIsFullyDisabled(true);
        if (winner === userStore.user._id || winner === userStore.user.id) {
          setIsCurrentWinner(true);
          runFireworks();
        }
      }
    };

    ws.onclose = () => console.log("WebSocket disconnected");
    ws.onerror = (error) => console.error("WebSocket error:", error);

    return () => ws.close();
  }, [hash]);

  useEffect(() => {
    const wsCleanup = setupWebSocket();
    return wsCleanup;
  }, [setupWebSocket]);

  useEffect(() => {
    setVisibleBids(page === 1 ? bids.slice(0, 5) : bids);
  }, [bids, page]);

  const isTopBidder = useMemo(() => {
    if (bids.length === 0 || !userStore.user) return false;
    return (
      bids[0].user._id === userStore.user._id ||
      bids[0].user._id === userStore.user.id
    );
  }, [bids, userStore.user]);

  useEffect(() => {
    const currentUser = userStore.user;
    const highestBid = bids[0];
    const userBid = bids.find(
      (bid) =>
        bid.user._id === currentUser._id || bid.user._id === currentUser.id
    );

    if (!isFullyDisabled) {
      if (userBid && highestBid) {
        if (userBid.amount < highestBid.amount) setIsOutbid(true);
        else setIsOutbid(false);
      }
    }

    const isActivated = currentUser && currentUser.isActivated;
    setIsDisabled(isTopBidder || !isActivated);

    if (data.endTime && new Date(data.endTime) <= Date.now()) {
      setIsFullyDisabled(true);
      setIsCurrentWinner(isTopBidder);

      if (isTopBidder && data.status !== "waitingForConfirmation") {
        runFireworks();
      }
    }
  }, [bids, data.endTime, userStore.user]);

  useEffect(() => {
    if (userStore.isAuth && !userStore.user.name) setIsFirstTime(true);
    else if (userStore.isAuth && userStore.user.name) setIsFirstTime(false);
  }, [userStore.isAuth, userStore.user]);

  if (!data?.title) {
    if (data === null && !errorShownRef.current) {
      toast.error("Page not Found");
      errorShownRef.current = true;
      navigate("/shop");
    }
    return (
      <>
        <SEO
          title={`Bid on Auction - Exclusive Crypto Art Auction by 5KSANA`}
          description={`Own a piece of crypto-inspired art with Auction, an exclusive auction item by 5KSANA. This Bitcoin-themed design is a one-of-a-kind masterpiece, blending blockchain culture with artistic expression. Place your bid now and claim this unique creation!`}
          name={`Bid on Auction - Exclusive Crypto Art Auction by 5KSANA`}
          type="page"
          page={`auction/${hash}`}
        />
        <Loader />
        <div>Loading Auction...</div>
      </>
    );
  }

  const getAuctionStatusContent = () => {
    if (!isCurrentWinner || !isFullyDisabled) return null;

    const statusMessages = {
      waitingForPay: {
        button: (
          <Link
            to={`/payment/auction?${new URLSearchParams({ id: hash })}`}
            className="text-black font-semibold rounded-3xl py-2.5 flex justify-center items-center transition-[background-color, opacity] duration-300 bg-yellow-400 hover:bg-yellow-500"
          >
            Payment
          </Link>
        ),
        message:
          "You have 24 hours to complete the payment for your winning auction. Failure to do so will result in your account being blacklisted and permanently blocked from bidding on future auctions.",
      },
      waitingForConfirmation: {
        button: (
          <button className="text-black font-semibold rounded-3xl py-2.5 flex justify-center items-center transition-[background-color, opacity] pointer-events-none duration-300 bg-yellow-400 opacity-60">
            Payment Confirmation...
          </button>
        ),
        message:
          "We confirm payments every hour. If you paid but it’s not confirmed, wait one or two hours.",
      },
      completed: {
        button: (
          <button className="text-black font-semibold rounded-3xl py-2.5 flex justify-center items-center transition-[background-color, opacity] pointer-events-none duration-300 bg-yellow-400">
            Payment Confirmed!
          </button>
        ),
        message:
          "Your payment was confirmed! Be ready to receive your art soon! 🥳 Thank you for your trust.",
      },
    };

    return statusMessages[data.status] ? (
      <div className="flex flex-col gap-3">
        {statusMessages[data.status].button}
        <p className="text-sm text-gray-400">
          {statusMessages[data.status].message}
        </p>
      </div>
    ) : null;
  };

  return (
    <>
      <SEO
        title={`Bid on ${data.title} - Exclusive Crypto Art Auction by 5KSANA`}
        description={`Own a piece of crypto-inspired art with ${data.title}, an exclusive auction item by 5KSANA. This Bitcoin-themed design is a one-of-a-kind masterpiece, blending blockchain culture with artistic expression. Place your bid now and claim this unique creation!`}
        name={`Bid on ${data.title} - Exclusive Crypto Art Auction by 5KSANA`}
        type="page"
        page={`auction/${hash}`}
      />
      <div className="w-full h-full">
        <div className="relative mt-20 px-4 xl:px-[6.25rem] pb-14">
          <Breadcamp auction />
          <div className="flex flex-col-reverse xl:flex-row items-start gap-24 mt-8">
            {/* Left Section */}
            <div className="flex flex-col gap-14 w-full">
              <Slider
                data={data}
                sliderRef={sliderRef}
                sliderContainerRef={sliderContainerRef}
                handleOpenOriginal={handleOpenOriginal}
              />
              <div className="flex flex-col gap-5">
                <h4 className="text-white text-lg font-medium">
                  Lot Information:
                </h4>
                <div
                  className="text-gray-400 text-base"
                  dangerouslySetInnerHTML={createMarkup(data.description || "")}
                />
                <div className="flex gap-5">
                  <div className="flex flex-col text-sm">
                    <span className="text-gray-600">Dimension (cm):</span>
                    <span className="text-white">{data.dimensions}</span>
                  </div>
                  <div className="flex flex-col text-sm">
                    <span className="text-gray-600">Dimension (inches):</span>
                    <span className="text-white">
                      {inchesSize(data.dimensions)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div
              className="flex flex-col gap-8 w-full xl:max-w-[40%]"
              ref={textContainerRef}
            >
              <AnimatePresence>
                {isOutbid && !isFullyDisabled && (
                  <motion.div
                    className="h-[44px] w-full bg-[#FFFFFF30] p-[10px] rounded-xl flex gap-[10px] items-center justify-between"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "44px" }}
                    exit={{ opacity: 0, height: 0 }}
                    layout
                    transition={{
                      opacity: { duration: 0.3 },
                      height: { duration: 0.3 },
                    }}
                  >
                    <div className="w-auto h-auto flex items-center gap-1">
                      <img
                        src="/notifications.svg"
                        alt="notification"
                        className="pointer-events-none w-[24px] h-[24px] object-contain"
                      />
                      <p className="font-main font-[400] text-white text-base leading-[100%] tracking-wide">
                        Your bid has been outbid
                      </p>
                    </div>

                    <img
                      src="/close.svg"
                      alt="close"
                      onClick={() => setIsOutbid(false)}
                      className="w-[24px] h-[24px] object-contain opacity-70 cursor-pointer hover:rotate-90 hover:opacity-100 transition-[opacity,transform] duration-300"
                    />
                  </motion.div>
                )}
                {userStore?.isAuth && !userStore.user?.isActivated && (
                  <motion.div
                    className="h-[44px] w-full bg-[#FFFFFF30] p-[10px] rounded-xl flex gap-[10px] items-center justify-between"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "44px" }}
                    exit={{ opacity: 0, height: 0 }}
                    layout
                    transition={{
                      opacity: { duration: 0.3 },
                      height: { duration: 0.3 },
                    }}
                  >
                    <div className="w-auto h-auto flex items-center gap-1">
                      <img
                        src="/notifications.svg"
                        alt="notification"
                        className="pointer-events-none w-[24px] h-[24px] object-contain"
                      />
                      <p className="font-main font-[400] text-white text-base leading-[100%] tracking-wide">
                        Verify your email to bid. (Check spam if missing)
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <h2 className="uppercase text-3xl sm:text-5xl font-bold text-white">
                {data.title}
              </h2>
              <div className="flex flex-col gap-7">
                {/* Auction Info */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-400 text-sm">Current rate</p>
                    <span className="text-yellow-400 text-2xl sm:text-3xl font-bold">
                      {data.currentPrice != 0
                        ? getPrice(data.currentPrice, 4, "BTC")
                        : getPrice(data.minPrice, 4, "BTC")}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Remaining time:</p>
                    <span className="text-white text-sm">
                      <Duration endTime={data.endTime} />
                    </span>
                  </div>
                </div>

                {/* Bid Form */}
                {!isFullyDisabled && data.status === "active" && (
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-3"
                  >
                    {isFirstTime && (
                      <div className="flex flex-col gap-1.5 w-full h-auto relative">
                        <Input
                          label="Your Name / Nickname"
                          placeholder="Tyler Durden"
                          id="nameInput"
                          className="w-full h-[50px] font-[300] font-main py-[10px] px-3 bg-[#212121] rounded-xl outline-none border-[1px] border-[#ffffff05] transition-colors duration-[250ms] focus:placeholder-[#ffffff00] mb-2"
                          type="text"
                          {...register("name", {
                            required: "Name / Nickname is required",
                          })}
                        />
                        {errors.name && (
                          <p className="text-red-500 text-xs">
                            {errors.name.message}
                          </p>
                        )}
                      </div>
                    )}
                    <div className="flex flex-col gap-1.5 w-full h-auto relative">
                      <Input
                        label="Your Bid"
                        placeholder={
                          data.currentPrice !== 0
                            ? Number(
                                data.currentPrice + increaseRateBid
                              ).toFixed(4)
                            : Number(data.minPrice + increaseRateBid).toFixed(4)
                        }
                        id="bidInput"
                        className={`w-full h-[50px] font-[300] font-main py-[10px] px-3 transition-opacity duration-300 ${
                          isDisabled ? "pointer-events-none opacity-80" : ""
                        } bg-[#212121] rounded-xl outline-none border-[1px] border-[#ffffff05] transition-colors duration-[250ms] focus:placeholder-[#ffffff00] mb-2`}
                        min="0.0001"
                        step="0.0001"
                        type="number"
                        disabled={isDisabled}
                        {...register("amount")}
                      />
                      {errors.amount && (
                        <p className="text-red-500 text-xs">
                          {errors.amount.message}
                        </p>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={isDisabled}
                      className={`text-black font-semibold rounded-3xl py-2.5 transition-[background-color, opacity] duration-300 ${
                        isDisabled
                          ? "bg-yellow-500 pointer-events-none opacity-80"
                          : "bg-yellow-400 hover:bg-yellow-500"
                      }`}
                    >
                      Place a bid
                    </button>
                    {data.maxPrice && (
                      <p className="font-main text-sm tracking-wide opacity-75 mt-1 font-[300]">
                        Max. price for this auction is setted to{" "}
                        {getPrice(data.maxPrice, 4, "BTC")}
                      </p>
                    )}
                  </form>
                )}

                {getAuctionStatusContent()}

                {isFullyDisabled && data.status === "failed" && (
                  <div className="flex flex-col gap-3">
                    <button className="text-black font-semibold rounded-3xl py-2.5 flex justify-center items-center transition-[background-color, opacity] duration-300 bg-yellow-400 pointer-events-none">
                      Ended with no Bids
                    </button>
                    <p className="text-sm text-gray-400">
                      The auction ended with no bids.
                    </p>
                  </div>
                )}

                {/* bid History */}
                <div className="flex flex-col gap-2.5">
                  <h4 className="text-white text-base font-medium mb-2">
                    Bid History
                  </h4>
                  {visibleBids.length ? (
                    <>
                      {visibleBids.map((bid, index) => (
                        <BidCard
                          data={bid}
                          key={bid._id}
                          index={index}
                          username={userStore?.user?.name}
                          isFullyDisabled={isFullyDisabled}
                        />
                      ))}
                      <button
                        onClick={loadMoreBids}
                        disabled={data.bids.length <= visibleBids.length}
                        className={`text-yellow-400 mx-auto ${
                          data.bids.length <= visibleBids.length
                            ? "pointer-events-none opacity-60"
                            : "hover:text-yellow-500"
                        }`}
                      >
                        View more
                      </button>
                    </>
                  ) : (
                    <div className="relative h-[300px] flex flex-col w-full justify-center items-center gap-2 bg-[#ffffff10] rounded-xl border-[1px] border-[#FFFFFF05]">
                      <img
                        src="/empty-box.svg"
                        alt=""
                        className="w-full h-full max-h-[130px] sm:max-h-[130px] object-contain invert opacity-40"
                      />
                      <p className="font-main font-[300] opacity-40 tracking-wide">
                        No bids {!isFullyDisabled && "yet"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>

      <Modal isOpen={originalOpen.state} nopaddings>
        {data.images && originalOpen.state && (
          <TransformOriginal
            closeOriginal={handleCloseOriginal}
            src={data.images[originalOpen.index].original}
            alt={data.hash + "_" + originalOpen.index}
          />
        )}
      </Modal>

      <Modal isOpen={isOpen}>
        <Auth
          setIsAuthOpen={setIsOpen}
          isAuthOpen={isOpen}
          popupClose={popupAuthClose}
        />
      </Modal>
    </>
  );
};

export default observer(Auction);
