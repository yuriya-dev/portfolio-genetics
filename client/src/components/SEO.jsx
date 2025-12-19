import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description }) {
  const appName = "Portfolio Genetics";
  
  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title ? `${title} | ${appName}` : appName}</title>
      <meta name="description" content={description || "Optimasi portfolio investasi Anda dengan AI dan data pasar realtime."} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title ? `${title} | ${appName}` : appName} />
      <meta property="og:description" content={description} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title ? `${title} | ${appName}` : appName} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}