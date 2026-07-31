import { forwardRef } from "react";

interface ImageWithWatermarkProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  watermarkSrc?: string;
  watermarkOpacity?: number;
  watermarkSize?: number;
  disableContextMenu?: boolean;
}

export const ImageWithWatermark = forwardRef<HTMLImageElement, ImageWithWatermarkProps>(
  (
    {
      src,
      alt = "",
      watermarkSrc = "/logo.jpg",
      watermarkOpacity = 0.07,
      watermarkSize = 120,
      disableContextMenu = false,
      className = "",
      style,
      onContextMenu,
      ...props
    },
    ref
  ) => {
    const handleContextMenu = (e: React.MouseEvent<HTMLImageElement>) => {
      if (disableContextMenu) {
        e.preventDefault();
      }
      onContextMenu?.(e);
    };

    return (
      <>
        {/* Main image - fills container, no wrapper div */}
        <img
          ref={ref}
          src={src}
          alt={alt}
          className={className}
          onContextMenu={handleContextMenu}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            userSelect: "none",
            WebkitUserSelect: "none",
            pointerEvents: "none",
            transform: "none",
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
      </>
    );
  }
);

ImageWithWatermark.displayName = "ImageWithWatermark";