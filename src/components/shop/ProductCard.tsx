import React, { useState } from 'react';
import { ShoppingCart, Eye, Star, MessageSquareQuote, CheckCircle2, ShieldCheck, MapPin, ChevronLeft, ChevronRight, Images, Play, Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { formatCurrency, formatShortPrice, generateProductSlug } from '../../utils/formatters';
import { MediaViewer } from '../common/MediaViewer';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onDirectDm: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart,
  onDirectDm,
}) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const isAutomobile = product.category === 'Automobiles & Cars';
  const isLowStock = product.stock !== undefined && product.stock <= 2 && product.stock > 0;
  const isOutOfStock = product.stock !== undefined && product.stock <= 0;

  const omittedSet = new Set(product.omittedFields || []);
  const isFieldOmitted = (field: string) => omittedSet.has(field);

  const imagesList = Array.isArray(product.images)
    ? product.images.filter((u): u is string => typeof u === 'string' && u.trim().length > 0)
    : [];

  const hasGallery = imagesList.length > 1;

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIdx((prev) => (prev > 0 ? prev - 1 : imagesList.length - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIdx((prev) => (prev < imagesList.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="group bg-white rounded-xl border border-slate-200 hover:border-sky-300 hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden relative">
      {/* Product Image Slot & Gallery Slider */}
      <div 
        onClick={() => onSelect(product)}
        className="relative w-full aspect-[4/3] bg-slate-900 overflow-hidden cursor-pointer"
      >
        {imagesList.length > 0 ? (
          <MediaViewer
            url={imagesList[activeImageIdx] || imagesList[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 flex flex-col items-center justify-center p-4 text-center text-white">
            <span className="p-2.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 mb-2">
              <Sparkles className="w-6 h-6" />
            </span>
            <span className="text-xs font-black text-white tracking-wide uppercase line-clamp-1 px-2">{product.title}</span>
            <span className="text-[10px] text-sky-200/80 mt-0.5">Click to view item details</span>
          </div>
        )}

        {/* Gallery Badge (if multiple photos exist) */}
        {hasGallery && (
          <div className="absolute top-2.5 right-2.5 z-10 bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1 border border-white/20">
            <Images className="w-3 h-3 text-sky-400" />
            <span>{activeImageIdx + 1}/{imagesList.length}</span>
          </div>
        )}

        {/* Video Demo Badge */}
        {product.videos && product.videos.length > 0 && (
          <div className="absolute top-2.5 left-2.5 z-10 bg-red-600/95 backdrop-blur-xs text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
            <Play className="w-2.5 h-2.5 fill-current" />
            <span>Video Demo</span>
          </div>
        )}

        {/* Gallery Interactive Arrows on Card Hover */}
        {hasGallery && (
          <div className="absolute inset-y-0 inset-x-1 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
            <button
              onClick={handlePrevImage}
              aria-label="Previous photo"
              className="pointer-events-auto p-1 rounded-full bg-black/60 hover:bg-black/85 text-white shadow-md transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextImage}
              aria-label="Next photo"
              className="pointer-events-auto p-1 rounded-full bg-black/60 hover:bg-black/85 text-white shadow-md transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Gallery Dots Indicator */}
        {hasGallery && (
          <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1 z-10 pointer-events-none">
            {imagesList.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  activeImageIdx === idx ? 'w-4 bg-sky-400' : 'w-1.5 bg-white/60'
                }`}
              />
            ))}
          </div>
        )}

        {/* Condition / Settlement Tag (Only if NOT omitted) */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
          {product.condition && !isFieldOmitted('condition') && (
            <span className="bg-slate-900/85 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs uppercase tracking-wide">
              {product.condition}
            </span>
          )}
          {product.settlementFee && !isFieldOmitted('settlementFee') && (
            <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-xs">
              {product.settlementFee}
            </span>
          )}
        </div>

        {/* Location badge if available & NOT omitted */}
        {product.location && !isFieldOmitted('location') && (
          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1 z-10">
            <MapPin className="w-3 h-3 text-sky-400" />
            <span>{product.location}</span>
          </div>
        )}

        {/* Quick View Overlay Button */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/95 text-slate-900 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-sky-600" />
            Quick Inspect
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Verified Seller / Brand */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span className="font-semibold text-sky-700 uppercase tracking-wider">{product.category}</span>
            {product.brand && !isFieldOmitted('brand') ? (
              <span className="font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[10px] truncate max-w-[120px]">
                {product.brand}
              </span>
            ) : !isFieldOmitted('seller') && product.seller ? (
              <span className="flex items-center gap-1 text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Unitworld Direct
              </span>
            ) : null}
          </div>

          {/* Title with SEO friendly slug link */}
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
            <a 
              href={`/product/${generateProductSlug(product)}`}
              onClick={(e) => {
                e.preventDefault();
                onSelect(product);
              }}
              className="hover:text-[#0284C7] cursor-pointer transition-colors"
            >
              {product.title}
            </a>
          </h3>

          {/* Specs Snippet / Key Highlights (Only if NOT omitted) */}
          {product.specs && !isFieldOmitted('specs') && Object.keys(product.specs).length > 0 && (
            <div className="mt-1.5 text-[11px] text-slate-600 space-y-0.5 border-t border-slate-100 pt-1.5">
              {Object.entries(product.specs).slice(0, 2).map(([key, val]) => (
                <p key={key} className="truncate">
                  <span className="font-medium text-slate-800">{key}:</span> {val}
                </p>
              ))}
            </div>
          )}

          {/* Rating (Only if NOT omitted) */}
          {!isFieldOmitted('rating') && typeof product.rating === 'number' && Number.isFinite(product.rating) && (
            <div className="flex items-center gap-1.5 mt-2">
              <div className="flex items-center text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span className="text-xs font-bold text-slate-800 ml-1">{product.rating.toFixed(1)}</span>
              </div>
              {!isFieldOmitted('reviewCount') && product.reviewCount !== undefined && (
                <span className="text-[11px] text-slate-400">({product.reviewCount} verified)</span>
              )}
            </div>
          )}
        </div>

        {/* Pricing & Stock Status */}
        <div className="mt-3 pt-2.5 border-t border-slate-100">
          <div className="flex items-baseline justify-between">
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-black text-slate-900 tabular-nums tracking-tight">
                {formatCurrency(product.price)}
              </span>
              {isAutomobile && (
                <span className="text-[11px] font-bold text-sky-600 -mt-0.5">
                  ({formatShortPrice(product.price)} full buyout)
                </span>
              )}
            </div>

            {/* Original Price / Slash Price (Only if NOT omitted) */}
            {product.originalPrice && !isFieldOmitted('originalPrice') && (
              <span className="text-xs text-slate-400 line-through tabular-nums">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Real-time Inventory Status (Only if NOT omitted) */}
          <div className="mt-1 flex items-center justify-between text-[11px]">
            {!isFieldOmitted('stock') && product.stock !== undefined ? (
              isOutOfStock ? (
                <span className="text-rose-600 font-bold">Sold Out</span>
              ) : isLowStock ? (
                <span className="text-amber-600 font-bold">Only {product.stock} available!</span>
              ) : (
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  In Stock ({product.stock} units)
                </span>
              )
            ) : (
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Available
              </span>
            )}
            {!isFieldOmitted('sku') && product.sku && (
              <span className="text-slate-400 font-mono text-[10px]">{product.sku}</span>
            )}
          </div>

          {/* Action CTAs */}
          <div className="mt-3 flex gap-2">
            {isAutomobile ? (
              <>
                <button
                  onClick={() => onSelect(product)}
                  className="flex-1 py-2 px-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Full Specs
                </button>
                <button
                  onClick={() => onDirectDm(product)}
                  className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                  title="Direct WhatsApp DM ASAP"
                >
                  <MessageSquareQuote className="w-4 h-4" />
                  <span>DM ASAP</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onAddToCart(product)}
                  disabled={isOutOfStock}
                  className="flex-1 py-2 px-3 bg-[#0284C7] hover:bg-[#0369a1] disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Add to Cart
                </button>
                <button
                  onClick={() => onSelect(product)}
                  className="p-2 border border-slate-200 hover:border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  title="View details"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
