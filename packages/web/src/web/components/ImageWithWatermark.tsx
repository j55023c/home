import { forwardRef } from "react";

interface ImageWithWatermarkProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  watermarkSrc?: string;
  watermarkAlt?: string;
  watermarkOpacity?: number;
  watermarkPosition?: "bottom-right" | "bottom-left" | "top-right" | "top-left" | "center";
  watermarkSize?: number; // percentage of container width (default 15)
}

export const ImageWithWatermark = forwardRef<HTMLImageElement, ImageWithWatermarkProps>(
  (
    {
      src,
      alt = "",
      watermarkSrc = "/logo.jpg",
      watermarkAlt = "Marca d'água",
      watermarkOpacity = 0.12,
      watermarkPosition = "bottom-right",
      watermarkSize = 15,
      className = "",
      style,
      ...props
    },
    ref
  ) => {
    const positionStyles: Record<string, React.CSSProperties> = {
      "bottom-right": { bottom: "2%", right: "2%" },
      "bottom-left": { bottom: "2%", left: "2%" },
      "top-right": { top: "2%", right: "2%" },
      "top-left": { top: "2%", left: "2%" },
      center: { top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
    };

    return (
      <div
        className={`relative inline-block overflow-hidden ${className}`}
        style={{
          display: "inline-block",
          lineHeight: 0,
          ...style,
        }}
      >
        <img
          ref={ref}
          src={src}
          alt={alt}
          {...props}
          style={{
            display: "block",
            width: "100%",
            height: "auto",
            ...props.style,
          }}
        />
        <img
          src={watermarkSrc}
          alt={watermarkAlt}
          aria-hidden="true"
          style={{
            position: "absolute",
            ...positionStyles[watermarkPosition],
            width: `${watermarkSize}%`,
            maxWidth: "120px",
            height: "auto",
            opacity: watermarkOpacity,
            pointerEvents: "none",
            userSelect: "none",
            filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))",
          }}
        />
      </div>
    );
  }
);

ImageWithWatermark.displayName = "ImageWithWatermark";