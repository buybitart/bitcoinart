import { createRoot } from "react-dom/client";
import "./index.css";
import "lenis/dist/lenis.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Store from "./store/userStore.js";
import { createContext } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

const helmetContext = {};

const userStore = new Store();
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export const UserContext = createContext({
  userStore,
});

createRoot(document.getElementById("root")).render(
  <UserContext.Provider value={{ userStore }}>
      <BrowserRouter>
        <HelmetProvider context={helmetContext}>
          <GoogleOAuthProvider clientId={googleClientId}>
            <App />
          </GoogleOAuthProvider>
        </HelmetProvider>
      </BrowserRouter>
  </UserContext.Provider>
);
