import { useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, Download } from "lucide-react";
import { ImageWithWatermark } from "./ImageWithWatermark";

interface LightboxProps {
  images: string[];
  activeIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  title: string;
  reference: string;
  watermarkSrc?: string;
  watermarkOpacity?: number;
  watermarkSize?: number;
}

export function Lightbox({
  images,
  activeIndex,
  onClose,
  onNavigate,
  title,
  reference,
  watermarkSrc = "/logo.jpg",
  watermarkOpacity = 0.08,
  watermarkSize = 150,
}: LightboxProps) {
  const currentImage = images[activeIndex];

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          onNavigate((activeIndex - 1 + images.length) % images.length);
          break;
        case "ArrowRight":
          onNavigate((activeIndex + 1) % images.length);
          break;
      }
    },
    [activeIndex, images.length, onClose, onNavigate]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  // Prevent clicks on image from closing
  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Download with watermark (compose via canvas)
  const handleDownload = async () => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = currentImage;

    const wm = new Image();
    wm.crossOrigin = "anonymous";
    wm.src = watermarkSrc;

    await Promise.all([
      new Promise((resolve) => (img.onload = resolve)),
      new Promise((resolve) => (wm.onload = resolve)),
    ]);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    ctx.drawImage(img, 0, 0);

    const pattern = ctx.createPattern(wm, "repeat");
    if (pattern) {
      ctx.globalAlpha = watermarkOpacity;
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
    }

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/jpeg", 0.92);
    link.download = `${reference}-${title}-${activeIndex + 1}.jpg`;
    link.click();
  };

  if (!currentImage) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/98 flex items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Imagem ${activeIndex + 1} de ${images.length}`}
    >
      {/* Close button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-6 right-6 z-10 w-12 h-12 bg-black/50 border border-white/15 text-foreground flex items-center justify-center hover:bg-gold hover:text-black transition-colors rounded-full"
        aria-label="Fechar"
      >
        <X size={24} />
      </button>

      {/* Prev button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate((activeIndex - 1 + images.length) % images.length);
          }}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-10 w-14 h-14 bg-black/50 border border-white/15 text-foreground flex items-center justify-center hover:bg-gold hover:text-black transition-colors rounded-full"
          aria-label="Anterior"
        >
          <ChevronLeft size={28} />
        </button>
      )}

      {/* Next button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate((activeIndex + 1) % images.length);
          }}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-10 w-14 h-14 bg-black/50 border border-white/15 text-foreground flex items-center justify-center hover:bg-gold hover:text-black transition-colors rounded-full"
          aria-label="Próxima"
        >
          <ChevronRight size={28} />
        </button>
      )}

      {/* Image container */}
      <div
        className="relative max-w-[90vw] max-h-[85vh] w-auto h-auto"
        onClick={handleImageClick}
      >
        <div className="relative" style={{ width: "auto", height: "auto" }}>
          <ImageWithWatermark
            src={currentImage}
            alt={`${title} - Imagem ${activeIndex + 1}`}
            className="max-w-[90vw] max-h-[85vh] object-contain"
            watermarkSrc={watermarkSrc}
            watermarkOpacity={watermarkOpacity}
            watermarkSize={watermarkSize}
            disableContextMenu
          />
        </div>

        {/* Counter + Download */}
        <div className="flex items-center justify-between mt-4 px-2">
          <span className="text-xs text-white/70 uppercase tracking-[0.1em]">
            {activeIndex + 1} / {images.length}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownload();
            }}
            className="flex items-center gap-2 bg-gold text-black px-4 py-2 text-xs uppercase tracking-[0.1em] hover:bg-gold-soft transition-colors rounded"
            aria-label="Baixar imagem com marca d'água"
          >
            <Download size={14} />
            Baixar
          </button>
        </div>
      </div>
    </div>
  );
}