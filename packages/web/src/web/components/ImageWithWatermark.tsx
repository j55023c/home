import { forwardRef } from "react";
import { useCallback, useRef } from "react";

interface ImageWithWatermarkProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  watermarkSrc?: string;
  watermarkAlt?: string;
  watermarkOpacity?: number;
  watermarkSize?: number; // tile size percentage
  enableDownload?: boolean;
  downloadFilename?: string;
}

export const ImageWithWatermark = forwardRef<HTMLImageElement, ImageWithWatermarkProps>(
  (
    {
      src,
      alt = "",
      watermarkSrc = "/logo.jpg",
      watermarkAlt = "Marca d'água",
      watermarkOpacity = 0.1,
      watermarkSize = 120,
      enableDownload = false,
      downloadFilename = "imagem",
      className = "",
      style,
      onLoad,
      onError,
      ...props
    },
    ref
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const watermarkImgRef = useRef<HTMLImageElement>(null);
    const composedDataUrlRef = useRef<string | null>(null);

    // Preload watermark
    if (watermarkImgRef.current === null && typeof window !== "undefined") {
      const w = new Image();
      w.crossOrigin = "anonymous";
      w.src = watermarkSrc;
      watermarkImgRef.current = w;
    }

    const compose = useCallback(async () => {
      const img = imgRef.current;
      const wm = watermarkImgRef.current;
      const canvas = canvasRef.current;
      if (!img || !wm || !canvas) return;

      // Wait for both to load
      if (!img.complete || !wm.complete) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Set canvas to image natural size
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      // Draw base image
      ctx.drawImage(img, 0, 0);

      // Draw watermark as repeating pattern (full screen)
      const tileSize = Math.min(canvas.width, canvas.height) * 0.15; // 15% of smaller dimension
      const pattern = ctx.createPattern(wm, "repeat");
      if (pattern) {
        ctx.globalAlpha = watermarkOpacity;
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1.0;
      }

      composedDataUrlRef.current = canvas.toDataURL("image/jpeg", 0.92);
    }, [watermarkOpacity]);

    // Compose when both images load
    const handleLoad = () => {
      compose();
      onLoad?.();
    };

    const handleWatermarkLoad = () => {
      if (imgRef.current?.complete) compose();
    };

    const downloadWithWatermark = useCallback(() => {
      if (composedDataUrlRef.current) {
        const link = document.createElement("a");
        link.href = composedDataUrlRef.current;
        link.download = `${downloadFilename}.jpg`;
        link.click();
      } else {
        // Fallback: compose on demand
        compose();
        setTimeout(() => {
          if (composedDataUrlRef.current) {
            const link = document.createElement("a");
            link.href = composedDataUrlRef.current;
            link.download = `${downloadFilename}.jpg`;
            link.click();
          }
        }, 100);
      }
    }, [compose, downloadFilename]);

    return (
      <div
        className={`relative inline-block overflow-hidden ${className}`}
        style={{
          display: "inline-block",
          lineHeight: 0,
          ...style,
        }}
      >
        {/* Canvas for composition (hidden) */}
        <canvas
          ref={canvasRef}
          style={{ display: "none" }}
          aria-hidden="true"
        />

        {/* Watermark image (hidden, for pattern) */}
        <img
          ref={watermarkImgRef}
          src={watermarkSrc}
          alt=""
          crossOrigin="anonymous"
          style={{ display: "none" }}
          onLoad={handleWatermarkLoad}
          aria-hidden="true"
        />

        {/* Main image */}
        <img
          ref={(el) => {
            imgRef.current = el;
            if (ref) {
              if (typeof ref === "function") ref(el);
              else ref.current = el;
            }
          }}
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={onError}
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
            filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))",
          }}
          aria-hidden="true"
        />

        {/* Download button (appears on hover) */}
        {enableDownload && (
          <button
            type="button"
            onClick={downloadWithWatermark}
            className="absolute bottom-3 right-3 z-10 bg-black/70 hover:bg-black/90 text-white px-3 py-1.5 rounded text-xs uppercase tracking-[0.1em] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1.5"
            aria-label="Baixar imagem com marca d'água"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Baixar
          </button>
        )}
      </div>
    );
  }
);

ImageWithWatermark.displayName = "ImageWithWatermark";