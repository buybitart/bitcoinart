import React, { useContext, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollToPlugin from "gsap/ScrollToPlugin";
import { Navigate, useLocation, useRoutes } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { observer } from "mobx-react-lite";
import { ReactLenis } from "lenis/react";
import useLocalStorage from "use-local-storage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";

import Nav from "./components/Nav";
import useResponsive from "./hooks/useResponsive";
import { UserContext } from "./main";
import Loader from "./components/Loader";
import * as Pages from "./pages";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const App = () => {
  const { userStore } = useContext(UserContext);
  const lenisRef = useRef();
  const [cart, setCart] = useLocalStorage("cart", []);
  const { isMobile } = useResponsive();
  const [loaded, setLoaded] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      userStore.checkAuth().finally(() => setLoaded(true));
    } else {
      setLoaded(true);
    }
  }, []);

  const adminRoutes =
    loaded && userStore?.user?.isAdmin
      ? [
          {
            path: `${import.meta.env.VITE_ADMIN_ROUTE}/items`,
            element: <Pages.AdminItems />,
          },
          {
            path: `${import.meta.env.VITE_ADMIN_ROUTE}/items/plus`,
            element: <Pages.AdminAddItems />,
          },
          {
            path: `${import.meta.env.VITE_ADMIN_ROUTE}/items/edit/:hash`,
            element: <Pages.AdminEditItem />,
          },
          {
            path: `${import.meta.env.VITE_ADMIN_ROUTE}/content`,
            element: <Pages.AdminContent />,
          },
          {
            path: `${import.meta.env.VITE_ADMIN_ROUTE}/notifications`,
            element: <Pages.AdminNotifications />,
          },
        ]
      : [];

  const authedRoutes =
    loaded && userStore.isAuth
      ? [
          { path: "/payment", element: <Pages.Payment cart={cart} /> },
          {
            path: "/payment/auction",
            element: <Pages.PayForAuction cart={cart} />,
          },
        ]
      : [];

  const router = useRoutes([
    { path: "/", element: <Pages.Home setCart={setCart} cart={cart} /> },
    { path: "/shop", element: <Pages.Shop setCart={setCart} cart={cart} /> },
    {
      path: "/shop/:hash",
      element: <Pages.Product setCart={setCart} cart={cart} />,
    },
    { path: "/auction/:hash", element: <Pages.Auction /> },
    { path: "/about", element: <Pages.About /> },
    { path: "/gallery", element: <Pages.Gallery /> },
    { path: "/gallery/:hash", element: <Pages.GalleryProduct /> },
    { path: "/search", element: <Pages.Search /> },
    { path: "/privacy", element: <Pages.Privacy /> },
    { path: "/policies", element: <Pages.Policies /> },
    { path: "/faq", element: <Pages.FAQ /> },
    { path: "/support", element: <Pages.SupportMe /> },
    { path: "/proof", element: <Pages.ProofOfWork /> },
    { path: "/exhibitions", element: <Pages.Exhibitions /> },
    ...authedRoutes,
    ...adminRoutes,
    { path: "/pending", element: <Pages.Pending /> },
    { path: "/success", element: <Pages.SuccessPayment setCart={setCart} /> },
    { path: "/thankyou", element: <Pages.Thankyou setCart={setCart} /> },
    { path: "/error", element: <Pages.ErrorPayment /> },
    { path: "/404", element: <Pages.NotFound /> },
    { path: "*", element: <Navigate to="/404" /> },
  ]);

  useEffect(() => {
    if (!isMobile) {
      const update = (time) => lenisRef.current?.lenis?.raf(time * 1000);
      gsap.ticker.add(update);
      return () => gsap.ticker.remove(update);
    }
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile) {
      ScrollTrigger.clearScrollMemory("manual");
      ScrollTrigger.config({ ignoreMobileResize: true });
      return () => ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    } else history.scrollRestoration = "manual";
  }, [isMobile]);

  if (!loaded) return <Loader />;

  const handleAnimationComplete = () => {
    setTimeout(() => {
      if (!isMobile) lenisRef.current?.lenis?.scrollTo(0, { immediate: true });
      else window.scrollTo(0, 0);
    }, 50);
  };

  return (
    <>
      {!isMobile ? (
        <ReactLenis
          root
          ref={lenisRef}
          options={{
            duration: 2,
            easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
            direction: "vertical",
            gestureDirection: "vertical",
            smooth: true,
            smoothTouch: true,
            touchMultiplier: 2,
            autoRaf: false,
            prevent: (node) => node.id === "modal",
          }}
        >
          <Nav cart={cart} setCart={setCart} />
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              onAnimationComplete={handleAnimationComplete}
            >
              {router}
            </motion.div>
          </AnimatePresence>
        </ReactLenis>
      ) : (
        <>
          <Nav cart={cart} setCart={setCart} />
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              onAnimationComplete={handleAnimationComplete}
            >
              {router}
            </motion.div>
          </AnimatePresence>
        </>
      )}

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        newestOnTop={false}
        closeOnClick
        hideProgressBar
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
};

export default observer(App);
