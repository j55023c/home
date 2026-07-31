import { forwardRef } from "react";

interface ImageWithWatermarkProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  watermarkSrc?: string;
  watermarkOpacity?: number;
  watermarkSize?: number;
}

export const ImageWithWatermark = forwardRef<HTMLImageElement, ImageWithWatermarkProps>(
  (
    {
      src,
      alt = "",
      watermarkSrc = "/logo.jpg",
      watermarkOpacity = 0.07,
      watermarkSize = 120,
      className = "",
      style,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={`relative inline-block overflow-hidden ${className}`}
        style={{
          display: "inline-block",
          lineHeight: 0,
          ...style,
        }}
      >
        {/* Main image */}
        <img
          ref={ref}
          src={src}
          alt={alt}
          className={className}
          style={{
            display: "block",
            width: "100%",
            height: "auto",
            ...props.style,
          }}
          {...props}
        />

        {/* Visual watermark overlay (full-screen repeating pattern via CSS) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${watermarkSrc})`,
            backgroundRepeat: "repeat",
            backgroundSize: `${watermarkSize}px`,
            opacity: watermarkOpacity,
          }}
          aria-hidden="true"
        />
      </div>
    );
  }
);

ImageWithWatermark.displayName = "ImageWithWatermark";