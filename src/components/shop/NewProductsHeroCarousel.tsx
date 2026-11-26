import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Product } from '../../types';
import { MediaViewer } from '../common/MediaViewer';
import { formatCurrency } from '../../utils/formatters';

interface NewProductsHeroCarouselProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onBrowseCategory: (category: string) => void;
  onOpenServices: () => void;
}

export const NewProductsHeroCarousel: React.FC<NewProductsHeroCarouselProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onBrowseCategory,
  onOpenServices,
}) => {
  // Prioritize newest products added to catalog (createdAt desc, then featured)
  const slides = React.useMemo(() => {
    const valid = products.filter(
      (p) =>
        p &&
        !p.isArchived &&
        typeof p.title === 'string' &&
        p.title.trim().length > 0 &&
        ((Array.isArray(p.images) && p.images.length > 0) ||
          (Array.isArray(p.videos) && p.videos.length > 0))
    );

    const sorted = [...valid].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      if (dateB !== dateA) return dateB - dateA;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });

    return sorted.slice(0, 7);
  }, [products]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (activeIndex >= slides.length && slides.length > 0) {
      setActiveIndex(0);
    }
  }, [slides.length, activeIndex]);

  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5500);

    return () => window.clearInterval(timer);
  }, [slides.length, isPaused]);

  if (slides.length === 0) {
    return (
      <div className="relative rounded-2xl overflow-hidden min-h-[340px] sm:min-h-[380px] bg-slate-900 border border-slate-800 shadow-md flex flex-col justify-end p-6 sm:p-8">
        <img
          src="/assets/images/hero_marketplace_banner.jpg"
          alt="Unitworld Sarl Official Direct Store"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        <div className="relative z-10 space-y-3">
          <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-white leading-tight text-balance">
            Luxury Vehicles, Fashion Wear, Tech & Pro Services
          </h1>
          <div className="flex flex-wrap gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => onBrowseCategory('Automobiles & Cars')}
              className="py-2.5 px-4 bg-[#0284C7] hover:bg-[#0369a1] text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Browse Showroom
            </button>
            <button
              type="button"
              onClick={onOpenServices}
              className="py-2.5 px-4 bg-white text-slate-900 rounded-xl text-xs font-bold cursor-pointer"
            >
              Book Services
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentProduct = slides[activeIndex] || slides[0];
  const primaryMedia =
    (currentProduct.images && currentProduct.images[0]) ||
    (currentProduct.videos && currentProduct.videos[0]) ||
    '/assets/images/hero_marketplace_banner.jpg';

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden min-h-[340px] sm:min-h-[400px] bg-slate-950 border border-slate-800 shadow-md flex flex-col justify-between group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Media Layer */}
      <div className="absolute inset-0">
        <MediaViewer
          key={currentProduct.id}
          url={primaryMedia}
          alt={currentProduct.title}
          controls={false}
          autoPlay={true}
          muted={true}
          loop={true}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-slate-950/25" />
      </div>

      {/* Top Carousel Header Bar */}
      <div className="relative z-10 p-4 sm:p-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>New Arrival Spotlight</span>
          <span aria-hidden="true" className="text-slate-400">·</span>
          <span className="text-sky-300 font-semibold truncate max-w-[160px] sm:max-w-xs">
            {currentProduct.category}
          </span>
        </div>

        {/* Slide Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-mono text-slate-300 tabular-nums mr-1">
            {String(activeIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
          </span>
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous new product"
            className="w-8 h-8 rounded-full bg-black/45 hover:bg-black/75 border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next new product"
            className="w-8 h-8 rounded-full bg-black/45 hover:bg-black/75 border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Product Details + Actions */}
      <div className="relative z-10 p-5 sm:p-7 space-y-4">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
            {currentProduct.condition && <span>{currentProduct.condition}</span>}
            {currentProduct.location && (
              <>
                <span aria-hidden="true">·</span>
                <span>{currentProduct.location}</span>
              </>
            )}
          </div>

          <h1
            onClick={() => onSelectProduct(currentProduct)}
            className="font-playfair text-xl sm:text-3xl font-bold text-white leading-tight text-balance cursor-pointer hover:text-sky-300 transition-colors"
          >
            {currentProduct.title}
          </h1>

          {currentProduct.description && (
            <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
              {currentProduct.description}
            </p>
          )}
        </div>

        {/* Price + Action Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          <div className="flex items-baseline gap-2.5">
            <span className="text-xl sm:text-2xl font-black text-white tabular-nums tracking-tight">
              {formatCurrency(currentProduct.price)}
            </span>
            {currentProduct.originalPrice &&
              currentProduct.originalPrice > currentProduct.price && (
                <span className="text-xs text-slate-400 line-through tabular-nums">
                  {formatCurrency(currentProduct.originalPrice)}
                </span>
              )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onSelectProduct(currentProduct)}
              className="py-2.5 px-4 bg-[#0284C7] hover:bg-[#0369a1] text-white rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <span>Inspect Item</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onAddToCart(currentProduct)}
              className="py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-900 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>

        {/* Minimal Slide Selector Track */}
        {slides.length > 1 && (
          <div className="flex items-center gap-1.5 pt-2">
            {slides.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`View slide ${idx + 1}: ${item.title}`}
                className="flex-1 py-1.5 group/dot cursor-pointer"
              >
                <div
                  className={`h-1 rounded-full transition-all duration-300 ${
                    idx === activeIndex
                      ? 'bg-sky-400'
                      : 'bg-white/25 group-hover/dot:bg-white/50'
                  }`}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
