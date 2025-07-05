import React from "react";
import ImageLoader from "./ImageLoader";
import { Link } from "react-router-dom";
import { getPrice } from "../utils";
import { format } from "date-fns";

const OrderCard = ({ data }) => {
  return (
    <Link
      to={`/${data.productType === 'Auction' ? 'auction' : 'shop'}/${data.hash}`}
      className="w-full max-h-[210px] h-full bg-[#212121] rounded-lg p-1.5 border-[1px] flex flex-col gap-1 border-[#ffffff08]"
    >
      {data.images[0]?.optimized && <ImageLoader
        src={data.images[0].optimized}
        alt={data.title}
        className="rounded-md w-full h-auto"
        containerStyles="w-full h-auto"
      />}
      <h4 className="font-main text-sm text-white tracking-wide font-[600] line-clamp-2">
        {data.title}
      </h4>
      <div className="flex font-main justify-between items-end gap-2 w-auto h-auto text-xs mt-2 flex-1">
        <span>{getPrice(data.price, 4, "BTC")}</span>
        <span className="tracking-wide text-[#fccb00]">x{data.quantity}</span>
      </div>
    </Link>
  );
};

const InfoPopup = ({ setPopup, popup }) => {
  const readableDate = format(popup.item.createdAt, "MMMM d, HH:mm");
  return (
    <div
      id="modal"
      className="w-full max-w-[540px] h-full sm:max-h-[700px] max-h-[575px] rounded-[32px] p-8 flex flex-col gap-6 bg-[#171717]"
    >
      <div className="flex justify-between items-center">
        <h3 className="font-main text-2xl leading-[28.8px] text-white tracking-wide font-[600]">
          Order Info
        </h3>

        <button
          className="w-[24px] h-[24px] flex items-center justify-center group"
          onClick={() => setPopup({ state: false, item: null })}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="group-hover:rotate-45 transition-transform duration-300"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.9998 13.4L7.0998 18.3C6.91647 18.4834 6.68314 18.575 6.3998 18.575C6.11647 18.575 5.88314 18.4834 5.6998 18.3C5.51647 18.1167 5.4248 17.8834 5.4248 17.6C5.4248 17.3167 5.51647 17.0834 5.6998 16.9L10.5998 12L5.6998 7.10005C5.51647 6.91672 5.4248 6.68338 5.4248 6.40005C5.4248 6.11672 5.51647 5.88338 5.6998 5.70005C5.88314 5.51672 6.11647 5.42505 6.3998 5.42505C6.68314 5.42505 6.91647 5.51672 7.0998 5.70005L11.9998 10.6L16.8998 5.70005C17.0831 5.51672 17.3165 5.42505 17.5998 5.42505C17.8831 5.42505 18.1165 5.51672 18.2998 5.70005C18.4831 5.88338 18.5748 6.11672 18.5748 6.40005C18.5748 6.68338 18.4831 6.91672 18.2998 7.10005L13.3998 12L18.2998 16.9C18.4831 17.0834 18.5748 17.3167 18.5748 17.6C18.5748 17.8834 18.4831 18.1167 18.2998 18.3C18.1165 18.4834 17.8831 18.575 17.5998 18.575C17.3165 18.575 17.0831 18.4834 16.8998 18.3L11.9998 13.4Z"
              className="fill-[#858585] group-hover:fill-white transition-colors duration-300"
            />
          </svg>
        </button>
      </div>

      <div
        className="flex flex-col gap-6 w-full max-h-[650px] overflow-y-auto rounded-xl"
        id="scrollItemsCart"
        style={{
          overflowY: "auto",
          maxHeight: "650px",
        }}
      >
        <div
          className={`grid 2xl:grid-cols-3 xl:grid-cols-3 sm:grid-cols-3 grid-cols-2 gap-2`}
        >
          {popup.item.items.map((item, index) => (
            <OrderCard data={item} key={index} />
          ))}
        </div>

        {/* Total Price */}
        <div className="w-full h-auto flex flex-col gap-2 font-main">
          <h4 className="text-base text-white tracking-wide font-[600]">
            Total Price
          </h4>
          <div className="flex flex-wrap items-center gap-0.5 text-sm sm:text-base bg-[#212121] p-1 px-3 rounded-xl border-[1px] border-[#ffffff08]">
            {popup.item.items.map((item, index) => (
              <span className="font-main opacity-75 font-[300]" key={index}>
                {getPrice(item.price, 4, "BTC")} * {item.quantity}{" "}
                {index !== popup.item.items.length - 1 && "+"}
              </span>
            ))}{" "}
            ={" "}
            <span className="font-[600]">
              {getPrice(popup.item.totalPrice, 4, "BTC")}
            </span>
          </div>
        </div>

        {/* order Id */}
        <div className="w-full h-auto flex flex-col gap-2 font-main">
          <h4 className="text-base text-white tracking-wide font-[600]">
            Order ID
          </h4>
          <span className="gap-0.5 text-sm sm:text-base bg-[#212121] p-1 px-3 rounded-xl border-[1px] border-[#ffffff08]">
            {popup.item.orderId}
          </span>
        </div>

        {/* invoice Id */}
        {popup.item.invoiceId && (
          <div className="w-full h-auto flex flex-col gap-2 font-main">
            <h4 className="text-base text-white tracking-wide font-[600]">
              Invoice ID
            </h4>
            <span className="gap-0.5 text-sm sm:text-base bg-[#212121] p-1 px-3 rounded-xl border-[1px] border-[#ffffff08]">
              {popup.item.invoiceId}
            </span>
          </div>
        )}

        {/* Payer */}
        <div className="w-full h-auto flex flex-col gap-2 font-main">
          <h4 className="text-base text-white tracking-wide font-[600]">
            Payer
          </h4>
          <div className="text-sm sm:text-base bg-[#212121] flex flex-col p-1 px-3 rounded-xl border-[1px] border-[#ffffff08]">
            <div>
              email:{" "}
              <a
                href={`mailto:${popup.item.payer.email}`}
                className="text-[#fccb00]"
              >
                {popup.item.payer.email}
              </a>
            </div>
            {popup.item.payer.name && (
              <span>name: {popup.item.payer.name}</span>
            )}
            <span>id: {popup.item.payer._id}</span>
          </div>
        </div>

        {/* Other */}
        <div className="w-full h-auto flex flex-col gap-2 font-main">
          <h4 className="text-base text-white tracking-wide font-[600]">
            Other
          </h4>
          <span className="text-sm sm:text-base bg-[#212121] p-1 px-3 rounded-xl flex flex-col border-[1px] border-[#ffffff08]">
            <span>created at {readableDate}</span>
            <span>
              status:{" "}
              <span
                className={`capitalize ${
                  popup.item.status === "completed" ? "text-[#5cd940]" : ""
                }`}
              >
                {popup.item.status}
              </span>
            </span>
              {popup.item.items[0].productType === 'Auction' && <span>type: {popup.item.items[0].productType}</span>}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InfoPopup;
