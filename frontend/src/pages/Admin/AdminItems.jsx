import React, { useEffect, useState } from "react";
import PriceLabel from "../../components/PriceLabel";
import { MdEdit, MdInfo } from "react-icons/md";
import Footer from "../../components/Footer";
import useResponsive from "../../hooks/useResponsive";
import { Link, useSearchParams } from "react-router-dom";
import SlidingBullets from "../../components/SlidingBullets";
import Modal from "../../components/Modal";
import DeletePopup from "../../components/DeletePopup";
import Paginator from "../../components/Paginator";
import ImageLoader from "../../components/ImageLoader";
import { Helmet } from "react-helmet-async";
import api from "../../http";
import { getPrice } from "../../utils";
import { format } from "date-fns";
import InfoPopup from "../../components/InfoPopup";

const optiData = [
  {
    id: "Shop",
    url: "/products",
  },
  {
    id: "Gallery",
    url: "/gallery-products",
  },
  {
    id: "Auction",
    url: "/auctions",
  },
  {
    id: "Sold",
    url: "/orders",
  },
];

const OptiImage = ({ image, isMobile, customSize }) => (
  <div className={`relative ${customSize ? customSize : "h-full w-auto"}`}>
    {isMobile ? (
      <div className="absolute inset-0 z-[-1] w-full h-full pointer-events-none">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-tl from-[#00000000] to-black backdrop-blur-sm z-[1]" />
        <ImageLoader
          src={image}
          alt="product"
          containerStyles={`${
            customSize ? customSize : "w-auto h-full max-w-[100px]"
          }`}
          className="h-full w-full object-cover opacity-30 z-[0]"
          draggable="false"
        />
      </div>
    ) : (
      <ImageLoader
        src={image}
        alt="product"
        containerStyles={`${
          customSize ? customSize : "w-auto h-full max-w-[100px]"
        }`}
        className={`rounded-2xl object-cover ${
          customSize
            ? customSize
            : "h-full w-auto max-w-[80px] sm:max-w-[100px]"
        }`}
        draggable="false"
      />
    )}
  </div>
);

const ActionButtons = ({ setPopup, item }) => (
  <div className="flex w-max h-auto items-center gap-1 ml-auto">
    <Link
      to={`edit/${item.hash}${
        item.category === "Auction"
          ? "/?type=auction"
          : item.category === "Gallery"
          ? "/?type=gallery"
          : "?type=usual"
      }`}
      className="w-[30px] h-[30px] flex justify-center group items-center relative hover:bg-[#212121] transition-colors duration-[250ms] rounded-xl"
    >
      <MdEdit className="w-[23px] h-[23px] text-[#a0a0a0] group-hover:text-white transition-colors duration-[250ms]" />
    </Link>
    <button
      onClick={() => setPopup({ state: true, item })}
      className="w-[30px] h-[30px] flex justify-center group items-center relative hover:bg-[#212121] transition-colors duration-[250ms] rounded-xl"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6C4.71667 6 4.47917 5.90417 4.2875 5.7125C4.09583 5.52083 4 5.28333 4 5C4 4.71667 4.09583 4.47917 4.2875 4.2875C4.47917 4.09583 4.71667 4 5 4H9C9 3.71667 9.09583 3.47917 9.2875 3.2875C9.47917 3.09583 9.71667 3 10 3H14C14.2833 3 14.5208 3.09583 14.7125 3.2875C14.9042 3.47917 15 3.71667 15 4H19C19.2833 4 19.5208 4.09583 19.7125 4.2875C19.9042 4.47917 20 4.71667 20 5C20 5.28333 19.9042 5.52083 19.7125 5.7125C19.5208 5.90417 19.2833 6 19 6V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM10 17C10.2833 17 10.5208 16.9042 10.7125 16.7125C10.9042 16.5208 11 16.2833 11 16V9C11 8.71667 10.9042 8.47917 10.7125 8.2875C10.5208 8.09583 10.2833 8 10 8C9.71667 8 9.47917 8.09583 9.2875 8.2875C9.09583 8.47917 9 8.71667 9 9V16C9 16.2833 9.09583 16.5208 9.2875 16.7125C9.47917 16.9042 9.71667 17 10 17ZM14 17C14.2833 17 14.5208 16.9042 14.7125 16.7125C14.9042 16.5208 15 16.2833 15 16V9C15 8.71667 14.9042 8.47917 14.7125 8.2875C14.5208 8.09583 14.2833 8 14 8C13.7167 8 13.4792 8.09583 13.2875 8.2875C13.0958 8.47917 13 8.71667 13 9V16C13 16.2833 13.0958 16.5208 13.2875 16.7125C13.4792 16.9042 13.7167 17 14 17Z"
          className="fill-[#A3A3A3] transition-colors duration-[250ms] group-hover:fill-red-500"
        />
      </svg>
    </button>
  </div>
);

const ProductItem = ({ data, isMobile, currentCategory, setPopup }) => {
  const formattedDate = format(data.createdAt, "d.MM.yyyy");
  return (
    <div className="w-full sm:h-[130px] min-h-[100px] relative rounded-3xl border-[#ffffff10] bg-[#ffffff10] border-[1px] py-3 px-4 flex justify-between gap-5 overflow-hidden">
      <div className="flex gap-3 w-full h-full">
        <OptiImage image={data.images[0].optimized} isMobile={isMobile} />
        <div className="flex flex-col justify-between w-auto gap-3">
          <h4 className="font-main font-[500] text-base leading-[19.2px] text-white sm:tracking-wide">
            {data.title}
          </h4>
          <div className="flex items-center gap-2">
            {(currentCategory === "Shop" ||
              currentCategory === "Auction" ||
              currentCategory === "Sold") &&
              data.price && (
                <PriceLabel
                  price={getPrice(data.price, 4, "BTC")}
                  difColor="#FFFFFF26"
                  admRes
                />
              )}
            <div
              className={`flex w-max h-[32px] rounded-[20px] p-1 sm:pr-2.5 gap-1 items-center z-[1] relative`}
            >
              <img
                src="/status.svg"
                alt="status"
                className="w-5 h-5 sm:w-6 sm:h-6"
              />
              <span className="font-main font-[400] hidden sm:block">
                Placed
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end justify-between">
        {currentCategory !== "Sold" && (
          <ActionButtons
            setPopup={setPopup}
            item={{ ...data, category: currentCategory }}
          />
        )}
        <span className="text-xs flex items-center justify-end tracking-wider font-main py-1 mb-1 text-white/80">
          {formattedDate}
        </span>
      </div>
    </div>
  );
};

const SoldItem = ({ data, isMobile, currentCategory, setInfoPopup }) => {
  const formattedDate = format(data.createdAt, "d.MM.yyyy");
  return (
    <div className="w-full sm:h-[130px] min-h-[100px] relative rounded-3xl border-[#ffffff10] bg-[#ffffff10] border-[1px] py-3 px-4 flex justify-between gap-5 overflow-hidden">
      <div className="flex gap-3 w-full h-full">
        <div
          className={`${isMobile ? "hidden" : "w-[100px] h-[104px]"} relative`}
        >
          {data.items[data.items.length - 1].images[0]?.optimized && (
            <OptiImage
              image={data.items[data.items.length - 1].images[0].optimized}
              isMobile={isMobile}
            />
          )}
          {isMobile ? (
            <></>
          ) : (
            <div className="w-max h-[20px] bg-black absolute top-1 left-1/2 -translate-x-1/2 rounded-full flex justify-center items-center text-white font-main text-xs font-[500] px-2">
              {data.items.length} {data.items.length - 1 ? "items" : "item"}
            </div>
          )}
        </div>
        <div className="flex flex-col justify-between w-auto gap-3">
          <h4 className="font-main font-[500] text-base leading-[19.2px] text-white sm:tracking-wide">
            {data.orderId}
          </h4>
          <div className="flex items-center gap-2">
            {(currentCategory === "Shop" ||
              currentCategory === "Auction" ||
              currentCategory === "Sold") &&
              (data.price || data.totalPrice) && (
                <PriceLabel
                  price={getPrice(data.price || data.totalPrice, 4, "BTC")}
                  difColor="#FFFFFF26"
                  admRes
                />
              )}
            <div
              className={`flex w-max h-[32px] rounded-[20px] p-1 sm:pr-2.5 gap-1 items-center z-[1] relative`}
            >
              <img
                src="/status.svg"
                alt="status"
                className="w-5 h-5 sm:w-6 sm:h-6"
              />
              <span className="font-main capitalize font-[400] hidden sm:block">
                {data.status}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={() => setInfoPopup({ state: true, item: data })}
          className="w-full max-w-[30.5px] h-[30px] flex justify-center group items-center relative hover:bg-[#212121] transition-colors duration-[250ms] rounded-xl"
        >
          <MdInfo className="w-[23px] h-[23px] text-[#a0a0a0] group-hover:text-white transition-colors duration-[250ms]" />
        </button>
        <span className="text-xs flex items-center justify-end tracking-wider font-main py-1 mb-1 text-white/80">
          {formattedDate}
        </span>
      </div>
    </div>
  );
};

const CategoryTabs = ({ currentCategory }) => (
  <div className="w-full h-auto sticky sm:top-[65px] top-[52px] bg-black z-[5] flex gap-2 sm:gap-3 py-3 border-b-[1px] border-b-[#FFFFFF1A]">
    <SlidingBullets
      data={optiData.map((property) => property.id)}
      state={currentCategory}
      className="w-full h-auto flex items-center !mx-0"
    />
  </div>
);

const ProductList = ({
  currentCategory,
  setPopup,
  setInfoPopup,
  categoryData,
  setCategoryData,
}) => {
  const { isMobile } = useResponsive();
  const [filteredData, setFilteredData] = useState(categoryData);

  useEffect(() => {
    setFilteredData(categoryData);
  }, [categoryData]);

  useEffect(() => {
    const fetchData = async () => {
      const category = optiData.find((c) => c.id === currentCategory);
      if (category) {
        try {
          const response = await api.get(category.url);
          setCategoryData(response.data);
        } catch (error) {
          console.error("Ошибка при загрузке данных:", error);
          setCategoryData([]);
        }
      }
    };

    fetchData();
  }, [currentCategory]);

  const fadeXVariants = {
    hidden: { x: 20, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: -20, opacity: 0 },
  };

  return (
    <Paginator
      data={filteredData}
      animationVariants={fadeXVariants}
      autoKey={currentCategory}
      itemsPerPage={12}
      className={`${
        filteredData.length
          ? "grid 3xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 sm:gap-5 gap-3 h-full"
          : "flex flex-1 justify-center items-center"
      } w-full relative`}
    >
      {(paginatedData) =>
        paginatedData.length ? (
          paginatedData.map((product, index) =>
            currentCategory === "Sold" ? (
              <SoldItem
                key={`${currentCategory}-${index}`}
                data={product}
                currentCategory={currentCategory}
                isMobile={isMobile}
                setInfoPopup={setInfoPopup}
              />
            ) : (
              <ProductItem
                key={`${currentCategory}-${index}`}
                data={product}
                currentCategory={currentCategory}
                isMobile={isMobile}
                setPopup={setPopup}
              />
            )
          )
        ) : (
          <div className="relative h-full flex flex-col w-full justify-center items-center gap-2">
            <img
              src="/empty-box.svg"
              alt=""
              className="w-full h-full max-h-[170px] sm:max-h-[225px] object-contain invert opacity-40"
            />
            <p className="font-main sm:text-xl text-lg font-[300] opacity-40">
              No items there yet :\
            </p>
          </div>
        )
      }
    </Paginator>
  );
};

const AdminItems = () => {
  const [popup, setPopup] = useState({ state: false, item: null });
  const [infoPopup, setInfoPopup] = useState({ state: false, item: null });
  const [categoryData, setCategoryData] = useState([]);
  const [searchParams] = useSearchParams();

  const currentCategory = searchParams.get("currentCategory") || "Shop";

  return (
    <>
      <Helmet>
        <title>Admin page | Items</title>
      </Helmet>
      <div className="w-[100vw] h-full">
        <div className="w-full h-full relative mt-[calc(52px+40px)] xl:mt-[calc(65px+40px)] px-[16px] xl:px-[6.25rem] pb-14">
          <div className="flex flex-col gap-3 w-full h-auto relative">
            <div className="w-full h-auto flex justify-between items-center">
              <h2 className="font-main font-[600] text-4xl leading-[100%] tracking-wide">
                Items
              </h2>
              <Link
                to={`plus${
                  currentCategory === "Auction"
                    ? "/?type=auction"
                    : currentCategory === "Gallery"
                    ? "/?type=gallery"
                    : "?type=usual"
                }`}
                className="flex items-center gap-2 font-main text-lg text-[#FCCB00] hover:bg-[#fcca0017] py-1 px-3 rounded-3xl transition-colors duration-300 font-[600] tracking-wider relative"
              >
                Add new
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 21C11.7167 21 11.4792 20.9042 11.2875 20.7125C11.0958 20.5208 11 20.2833 11 20V13H4C3.71667 13 3.47917 12.9042 3.2875 12.7125C3.09583 12.5208 3 12.2833 3 12C3 11.7167 3.09583 11.4792 3.2875 11.2875C3.47917 11.0958 3.71667 11 4 11H11V4C11 3.71667 11.0958 3.47917 11.2875 3.2875C11.4792 3.09583 11.7167 3 12 3C12.2833 3 12.5208 3.09583 12.7125 3.2875C12.9042 3.47917 13 3.71667 13 4V11H20C20.2833 11 20.5208 11.0958 20.7125 11.2875C20.9042 11.4792 21 11.7167 21 12C21 12.2833 20.9042 12.5208 20.7125 12.7125C20.5208 12.9042 20.2833 13 20 13H13V20C13 20.2833 12.9042 20.5208 12.7125 20.7125C12.5208 20.9042 12.2833 21 12 21Z"
                    fill="#FCCB00"
                  />
                </svg>
              </Link>
            </div>

            <CategoryTabs currentCategory={currentCategory} />

            <div className="min-h-[580px] flex flex-col gap-12 w-full h-auto relative">
              <ProductList
                currentCategory={currentCategory}
                setPopup={setPopup}
                setInfoPopup={setInfoPopup}
                categoryData={categoryData}
                setCategoryData={setCategoryData}
              />
            </div>
          </div>
        </div>

        <Footer />
      </div>

      <Modal isOpen={popup.state}>
        <DeletePopup
          setPopup={setPopup}
          popup={popup}
          type={currentCategory}
          setCategoryData={setCategoryData}
          categoryData={categoryData}
        />
      </Modal>

      <Modal isOpen={infoPopup.state}>
        <InfoPopup setPopup={setInfoPopup} popup={infoPopup} />
      </Modal>
    </>
  );
};

export default AdminItems;
