import { sanitize } from "isomorphic-dompurify";
import convert from "convert-length";
import axios from "axios";
import confetti from "canvas-confetti";
import { formatDistanceToNow } from 'date-fns';

export function createMarkup(data) {
  return { __html: sanitize(data) };
}

export const inputCSS = `w-full h-[44px] placeholder-[#707070] rounded-xl py-[10px] px-3 bg-[#212121] tracking-wide font-main border-[1px] border-[#ffffff05] transition-colors duration-[250ms] focus:placeholder-[#ffffff00] focus:outline-none font-[300]`;

export const videoURL = `${import.meta.env.VITE_DB_LINK}/uploads`;

export const getPrice = (price, toFix, priceType) => {
  if (!price) return "";
  return `${price.toFixed(toFix)}${priceType}`;
};

export const removeHtmlTags = (str) => {
  if (typeof str === "string") {
    return str
      .replace(/<[^>]*>/g, "")
      .replace(/\s{2,}/g, " ")
      .trim();
  } else return str;
};

export const imagesOnly = {
  "image/jpeg": [".jpeg", ".png", ".jpg"],
  "image/webp": [".webp"],
  "image/avif": [".avif"],
  "image/jfif": [".jfif"],
};

export const videosOnly = {
  "video/mp4": [".mp4"],
  "video/quicktime": [".mov"],
  "video/x-msvideo": [".avi"],
};

export function smoothScrollTo(top, duration = 1000) {
  const start = window.scrollY;
  const change = top - start;
  const startTime = performance.now();

  function animateScroll(currentTime) {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);
    const easeInOutCubic =
      progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    window.scrollTo(0, start + change * easeInOutCubic);

    if (elapsedTime < duration) {
      requestAnimationFrame(animateScroll);
    }
  }

  requestAnimationFrame(animateScroll);
}

export const inchesSize = (dimensions) => {
  if (!dimensions) return "";
  return dimensions
    .split("x")
    .map((n) => Number(convert(Number(n), "cm", "in").toFixed(1)))
    .join("x");
};


export async function getSettings(name, setData) {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_DB_LINK}/api/settings/${name}`
    );
    setData(response.data);
  } catch (error) {
    console.error("Failed to fetch website settings: ", error);
  }
}

export const runFireworks = () => {
    var duration = 15 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    
    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }
    
    var interval = setInterval(function() {
      var timeLeft = animationEnd - Date.now();
    
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
    
      var particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}

export const formatInstagramDate = (createdAt) => formatDistanceToNow(new Date(createdAt), { addSuffix: true });