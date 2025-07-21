import { SitemapStream, streamToPromise } from "sitemap";
import { createWriteStream } from "fs";
import gallery from "./gallery.js";
import shop from "./shop.js";

const domain = "https://buybitart.com";

async function generateSitemap() {
  const sitemap = new SitemapStream({ hostname: domain });
  const writeStream = createWriteStream("./public/sitemap.xml");

  sitemap.pipe(writeStream);

  const staticRoutes = [
    "/",
    "/shop",
    "/about",
    "/gallery",
    "/search",
    "/privacy",
    "/policies",
    "/faq",
    "/support",
    "/proof",
    "/exhibitions",
  ];

  staticRoutes.forEach((route) => sitemap.write({ url: route }));

  gallery.forEach((slug) => sitemap.write({ url: `/gallery/${slug}/` }));
  shop.forEach((slug) => sitemap.write({ url: `/shop/${slug}/` }));

  sitemap.end();

  await streamToPromise(sitemap);
}

generateSitemap().catch(console.error);
