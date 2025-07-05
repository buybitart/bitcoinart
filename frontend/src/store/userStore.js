import { makeAutoObservable } from "mobx";
import AuthService from "../services/AuthService";
import axios from "axios";
import api, { apiUrl } from "../http";
import { toast } from "react-toastify";

export default class userStore {
  user = {};
  settings = {};
  isAuth = false;
  isLoading = false;
  isSuccess = false;
  isLoaded = false;

  constructor() {
    makeAutoObservable(this);
  }

  setAuth(bool) {
    this.isAuth = bool;
  }

  setUser(user) {
    this.user = user;
  }

  setSettings(settings) {
    this.settings = settings;
  }

  setLoading(bool) {
    this.isLoading = bool;
  }

  setLoaded(bool) {
    this.isLoaded = bool;
  }

  setSuccess(bool) {
    this.isSuccess = bool;
  }

  async login(email, password) {
    try {
      const response = await AuthService.login(email, password);
      localStorage.setItem("token", response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
      return response;
    } catch (e) {
      return e.response?.data?.message;
    }
  }

  async googleAuth(accessToken) {
    try {
      const response = await api.post("/users/auth/google", {
        googleAccessToken: accessToken,
      });
      localStorage.setItem("token", response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
      return response;
    } catch (e) {
      return e.response?.data?.message;
    }
  }

  async register(email, password) {
    try {
      const response = await AuthService.register(email, password);
      localStorage.setItem("token", response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
      return response;
    } catch (e) {
      return e.response?.data?.message;
    }
  }

  async logout() {
    try {
      await AuthService.logout();
      localStorage.removeItem("token");
      this.setAuth(false);
      this.setUser({});
    } catch (e) {
      console.log(e);
    }
  }

  async checkAuth() {
    this.setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/users/refresh`, {
        withCredentials: true,
      });
      localStorage.setItem("token", response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (e) {
      console.log(e.response?.data?.message);
      localStorage.removeItem("token");
      return;
    } finally {
      this.setLoading(false);
      this.setLoaded(true);
    }
  }

  async publishProduct(data, type) {
    const abr = type === "usual"
    ? "product"
    : type === "gallery"
    ? "gallery product"
    : type === "auction"
    ? "auction"
    : "product"
    try {
      const response = await toast.promise(
        api.post(
          `/${
            type === "usual"
              ? "products"
              : type === "gallery"
              ? "gallery-products"
              : type === "auction"
              ? "auctions"
              : "products"
          }`,
          data
        ),
        {
          pending: `Publising ${abr}`,
          success: `${abr} published successfully 👌`,
          error: `Failed to publish ${abr} 🤯`,
        }
      );
      return response;
    } catch (e) {
      console.log(e);
    }
  }
}
