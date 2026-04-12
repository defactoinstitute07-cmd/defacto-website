import Image from "next/image";

interface BrandLogoProps {
  className?: string;
  variant?: "light" | "dark";
  showText?: boolean;
}

const BrandLogo = ({ className = "", variant = "dark", showText = true }: BrandLogoProps) => {
  const logoImageUrl = "https://res.cloudinary.com/dmswb6fya/image/upload/v1775635083/erp_uploads/fwp2aeerokjfljm2aw2a.png";

  if (logoImageUrl) {
    return (
      <Image
        src={logoImageUrl}
        alt="Defacto Institute Logo"
        width={500}
        height={116}
        sizes="(max-width: 640px) 128px, 200px"
        className={`h-10 w-auto ${className}`}
        priority
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
