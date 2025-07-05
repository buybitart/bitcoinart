import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const BTCPayForm = () => {
  const formRef = useRef(null);

  const [price, setPrice] = useState(1);
  const [currency, setCurrency] = useState("USD");
  const minPrice = 1;
  const maxPrice = 20000;

  const handlePriceChange = (e) => {
    const val = parseInt(e.target.value) || minPrice;
    const clamped = Math.min(Math.max(val, minPrice), maxPrice);
    setPrice(clamped);
  };

  const handleSliderChange = (e) => {
    const val = parseInt(e.target.value);
    setPrice(val);
  };

  useEffect(() => {
    const form = formRef.current;
    const handleSubmit = (e) =>
      toast.loading("Redirecting to BTCPay...", { id: "btcpay-loading" });

    if (form) form.addEventListener("submit", handleSubmit);

    return () => {
      if (form) form.removeEventListener("submit", handleSubmit);
    };
  }, []);

  return (
    <form
      method="POST"
      action="https://btcpay.buybitart.com/api/v1/invoices"
      className="inline-flex flex-col items-center justify-center"
      ref={formRef}
    >
      <input
        type="hidden"
        name="storeId"
        value="6Yhyt7UctCkK8LvivtiYaQD5Fvt8jBJ6GPBVk1ptDDxQ"
      />
      <input
        type="hidden"
        name="browserRedirect"
        value={`${import.meta.env.VITE_CLIENT_URL}/thankyou`}
      />
      <input type="hidden" name="defaultPaymentMethod" value="USDT-TRON" />

      <div className="text-center btcpay-custom-container">
        <input
          className="shadow-none text-center text-[25px] rounded focus:placeholder-[#ffffff00] focus:outline-none font-main border-[1px] border-[#ffffff05] bg-[#212121] placeholder-[#707070] leading-[35px] w-[209px] appearance-none"
          type="number"
          name="price"
          min={minPrice}
          max={maxPrice}
          step="1"
          value={price}
          onChange={handlePriceChange}
        />
        <select
          name="currency"
          className="appearance-none text-current bg-[#212121] border-[1px] border-[#ffffff05] rounded block py-1 px-2 text-[11px] cursor-pointer hover:border-gray-300 my-2 mx-auto"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          <option value="USD">USD</option>
        </select>

        <input
          type="range"
          name="range"
          min={minPrice}
          max={maxPrice}
          step="1"
          value={price}
          onChange={handleSliderChange}
          style={{ width: "209px", marginBottom: "15px" }}
          className="btcpay-input-range"
        />
      </div>

      <input
        type="image"
        className="mt-2"
        name="submit"
        src="https://btcpay.buybitart.com/img/paybutton/pay.svg"
        alt="Pay with BTCPay Server, a Self-Hosted Bitcoin Payment Processor"
        style={{ width: "209px" }}
      />
    </form>
  );
};

export default BTCPayForm;
