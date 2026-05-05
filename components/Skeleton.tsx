import React from "react";

type SkeletonProps = {
  className?: string;
  variant?: "rect" | "circle" | "text";
  width?: string | number;
  height?: string | number;
};

export default function Skeleton({
  className = "",
  variant = "rect",
  width,
  height,
}: SkeletonProps) {
  const baseStyles = "bg-slate-200 animate-pulse";
  const variantStyles = {
    rect: "rounded-md",
    circle: "rounded-full",
    text: "rounded-md h-4 w-full",
  };

  const style: React.CSSProperties = {
    width: width,
    height: height,
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={style}
    />
  );
}
