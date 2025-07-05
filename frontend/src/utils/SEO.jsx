import React from "react";
import { Helmet } from "react-helmet-async";

const SEO = ({ title, description, type, name, page }) => {
  return (
    <Helmet>
      <meta name="author" content="5KSANA" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />

      <title>{title}</title>

      <meta name="description" content={description} />

      <meta property="og:locale" content="en_US" />

      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <meta http-equiv="x-dns-prefetch-control" content="on" />

      <meta
        property="og:url"
        content={`${import.meta.env.VITE_CLIENT_URL}/${page}`}
      />
      <link
        rel="canonical"
        href={`${import.meta.env.VITE_CLIENT_URL}/${page}`}
      />
      <meta
        property="og:site_name"
        content={`${import.meta.env.VITE_CLIENT_URL}/${page}`}
      />
      <meta property="og:type" content="website" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />

      <meta property="og:image" content="/banner.jpg" />
      <meta property="og:image:width" content="1600" />
      <meta property="og:image:height" content="800" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:alt" content="BuyBitArt.com" />
      <meta property="og:site_name" content="BuyBitArt.com" />

      {/* End Facebook tags */}

      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content={type} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="/banner.jpg" />
      <meta name="twitter:image:width" content="1600" />
      <meta name="twitter:image:height" content="800" />
      <meta name="twitter:site" content="@5Ksana" />
      <meta name="twitter:image:alt" content="BuyBitArt.com" />
    </Helmet>
  );
};

export default SEO;
