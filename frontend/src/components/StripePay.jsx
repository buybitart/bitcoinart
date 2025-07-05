import React, { useCallback, useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
  Elements,
} from "@stripe/react-stripe-js";
import api from "../http";
import { loadStripe } from "@stripe/stripe-js";
import Loader from "./Loader";
import { toast } from "react-toastify";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC);

const StripePay = ({
  totalPrice,
  userId,
  email,
  setStripePayment,
  onPaymentSuccess,
}) => {
  const [clientSecret, setClientSecret] = useState("");

  async function createPaymentIntent() {
    try {
      const response = await api.post("/payment/create-payment-intent", {
        amount: Math.round(totalPrice * 100),
        userId,
      });

      if (response.data.clientSecret) {
        setClientSecret(response.data.clientSecret);
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if(totalPrice && userId) createPaymentIntent();
  }, [totalPrice, userId]);

  if (!clientSecret) return <Loader customSize="w-full h-[200px] relative" />;

  const appearance = {
    theme: "flat",
    variables: {
      colorPrimary: "#FCCB00",
      colorBackground: "#ffffff00",
      colorText: "#FFFFFF",
      colorDanger: "#FF5252",
      fontFamily: '"Bricolage Grotesque", sans-serif',
    },
    rules: {
      ".Input": {
        border: "1px solid #ffffff05",
        backgroundColor: "#212121",
        color: "#FFFFFF",
      },
      ".Input:focus": {
        border: "1px solid #ffffff05",
        boxShadow: "none",
      },
      ".Label": {
        color: "#ffffff",
        marginBottom: "6px",
        fontSize: "14px",
        lineHeight: "16.8px",
        letterSpacing: "0.025em",
        fontFamily: '"Bricolage Grotesque", sans-serif',
      },
      ".Tab": {
        backgroundColor: "#212121",
        color: "#FFFFFF",
      },
      ".Tab--selected": {
        backgroundColor: "#FCCB00",
        color: "#522700",
      },
      ".Block": {
        backgroundColor: "#212121",
      },
    },
  };

  return (
    <Elements
      stripe={stripePromise}
      options={{ clientSecret, appearance, locale: "en" }}
    >
      <Checkout
        onPaymentSuccess={onPaymentSuccess}
        email={email}
        setStripePayment={setStripePayment}
      />
    </Elements>
  );
};

const Checkout = ({ onPaymentSuccess, email, setStripePayment }) => {
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (!stripe || !elements) {
      console.log("Stripe.js is not loaded yet.");
      return;
    }
    console.log("Stripe.js is ready!");
  }, [stripe, elements]);

  const handlePayment = useCallback(async () => {
    console.log("Running handlePayment");
    if (!stripe || !elements) {
      console.log("Stripe or Elements not ready");
      return;
    }

    try {
      const { error, paymentIntent } = await toast.promise(
        stripe.confirmPayment({
          elements,
          confirmParams: {
            receipt_email: email,
          },
          redirect: "if_required",
        }),
        {
          pending: "Processing payment...",
          success: "Payment processed!",
          error: "Payment failed :/",
        }
      );

      if (error) {
        toast.error(error.message);
      } else if (paymentIntent) onPaymentSuccess(paymentIntent.id);
    } catch (e) {
      console.error("Payment failed:", e);
      toast.error("Payment failed :/");
    }
  }, [stripe, elements, onPaymentSuccess]);

  useEffect(() => {
    if (setStripePayment && stripe && elements) {
      console.log("Setting stripePayment handler");
      setStripePayment(() => handlePayment);
    }
  }, [stripe, elements]);

  if (!stripe || !elements) {
    return <div>Loading Stripe...</div>;
  }

  return <PaymentElement options={{ layout: "tabs" }} />;
};

export default StripePay;
