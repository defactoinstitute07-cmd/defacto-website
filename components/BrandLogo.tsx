import React from "react";
import { getCloudinarySrcSet, getOptimizedImageUrl } from "../lib/image-utils";

interface BrandLogoProps {
  className?: string;
  variant?: "light" | "dark";
  showText?: boolean;
}

const BrandLogo = ({ className = "", variant = "dark", showText = true }: BrandLogoProps) => {
  // Once the image link is provided, replace null with the URL string
  const logoImageUrl = "https://res.cloudinary.com/dmswb6fya/image/upload/v1775635083/erp_uploads/fwp2aeerokjfljm2aw2a.png";

  if (logoImageUrl) {
    return (
      <img
        src={getOptimizedImageUrl(logoImageUrl, { width: 240 })}
        srcSet={getCloudinarySrcSet(logoImageUrl, [120, 180, 240, 320])}
        sizes="160px"
        alt="Defacto Institute Logo"
        className={`h-10 w-auto ${className}`}
        decoding="async"
        fetchPriority="high"
      />
    );
  }

  // Fallback to text logo with premium styling
  return (
    <div className={`font-extrabold tracking-tight flex items-baseline gap-1 ${className} ${variant === "light" ? "text-white" : "text-slate-900"}`}>
      <span className="text-2xl italic">Defacto</span>
      {showText && <span className="text-sm font-bold opacity-70 uppercase tracking-widest">Institute</span>}
    </div>
  );
};

export default BrandLogo;
