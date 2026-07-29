import { Link } from "wouter";
import { BedDouble, Bath, Car, Maximize } from "lucide-react";
import type { Property } from "../../api/database/schema";
import { formatPrice, PURPOSE_LABELS, TYPE_LABELS } from "../lib/format";

export function PropertyCard({ property }: { property: Property }) {
  return (
    <Link
      to={`/imoveis/${property.id}`}
      className="group block bg-card border border-border overflow-hidden hover:border-gold/50 transition-colors duration-500"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.images?.[0]}
          alt={property.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <span className="absolute top-4 left-4 bg-gold text-black text-[0.65rem] uppercase tracking-[0.14em] px-3 py-1 font-medium">
          {PURPOSE_LABELS[property.purpose]}
        </span>
        <span className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-foreground/90 text-[0.65rem] uppercase tracking-[0.14em] px-3 py-1 border border-white/10">
          {TYPE_LABELS[property.type]}
        </span>
      </div>

      <div className="p-6">
        <p className="text-[0.65rem] uppercase tracking-luxe text-muted-foreground mb-2">
          {property.neighborhood} · {property.city}
        </p>
        <h3 className="font-display text-xl text-foreground leading-snug mb-4 min-h-[3.5rem] group-hover:text-gold transition-colors">
          {property.title}
        </h3>

        <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground mb-5">
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1.5">
              <BedDouble size={15} className="text-gold" /> {property.bedrooms}
            </span>
          )}
          {property.bathrooms > 0 && (
            <span className="flex items-center gap-1.5">
              <Bath size={15} className="text-gold" /> {property.bathrooms}
            </span>
          )}
          {property.parking > 0 && (
            <span className="flex items-center gap-1.5">
              <Car size={15} className="text-gold" /> {property.parking}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Maximize size={15} className="text-gold" /> {property.area} m²
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <span className="font-display text-lg text-gradient-gold">
            {formatPrice(property.price, property.purpose)}
          </span>
          <span className="text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground group-hover:text-gold transition-colors">
            Ver detalhes →
          </span>
        </div>
      </div>
    </Link>
  );
}
