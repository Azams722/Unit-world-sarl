import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ShoppingCart, 
  ShieldCheck, 
  Check, 
  Star, 
  MapPin, 
  MessageSquareQuote, 
  Car, 
  FileText, 
  Share2, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Images, 
  Award, 
  Play, 
  Upload, 
  Video, 
  Plus,
  ExternalLink
} from 'lucide-react';
import { Product } from '../../types';
import { formatCurrency, generateProductSlug } from '../../utils/formatters';
import { MediaViewer } from '../common/MediaViewer';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onInstantBuy: (product: Product) => void;
  onUpdateProduct?: (product: Product) => void;
  onOpenProductPage?: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onInstantBuy,
  onOpenProductPage,
}) => {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const isVideoUrl = (url: string) => {
    if (!url || typeof url !== 'string') return false;
    return (
      url.endsWith('.mp4') ||
      url.endsWith('.webm') ||
      url.endsWith('.mov') ||
      url.includes('gtv-videos-bucket') ||
      url.startsWith('data:video/') ||
      url.startsWith('idb:video:') ||
      url.startsWith('fs:video:') ||
      url.includes('youtube.com') ||
      url.includes('youtu.be')
    );
  };

  // Reset index when product changes
  useEffect(() => {
    setSelectedImageIdx(0);
    setQuantity(1);
    setIsLightboxOpen(false);
  }, [product?.id]);

  if (!product) return null;

  const rawImages = product.images || [];
  const rawVideos = product.videos || [];

  const mediaList: { url: string; isVideo: boolean }[] = [
    ...rawImages.map((u) => ({ url: u, isVideo: isVideoUrl(u) })),
    ...rawVideos.map((u) => ({ url: u, isVideo: true })),
  ];

  if (mediaList.length === 0) {
    mediaList.push({
      url: '/assets/images/hero_marketplace_banner.jpg',
      isVideo: false,
    });
  }

  const currentMedia = mediaList[selectedImageIdx] || mediaList[0];
  const hasGallery = mediaList.length > 1;

  // Keyboard navigation for gallery
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const count = mediaList.length;
      if (e.key === 'ArrowLeft') {
        setSelectedImageIdx((prev) => (prev > 0 ? prev - 1 : count - 1));
      } else if (e.key === 'ArrowRight') {
        setSelectedImageIdx((prev) => (prev < count - 1 ? prev + 1 : 0));
      } else if (e.key === 'Escape') {
        if (isLightboxOpen) {
          setIsLightboxOpen(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mediaList.length, isLightboxOpen, onClose]);

  const isAutomobile = product.category === 'Automobiles & Cars';
  const isOutOfStock = product.stock !== undefined && product.stock <= 0;

  const omittedSet = new Set(product.omittedFields || []);
  const isFieldOmitted = (field: string) => omittedSet.has(field);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleWhatsAppDm = () => {
    const text = encodeURIComponent(
      `Hello Unitworld Sarl (07070554285), I am interested in: ${product.title}\nPrice: ${formatCurrency(product.price)}\nSKU: ${product.sku || 'N/A'}\nPlease let me know inspection and acquisition details.`
    );
    const link = document.createElement('a');
    link.href = `https://wa.me/2347070554285?text=${text}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedImageIdx((prev) => (prev > 0 ? prev - 1 : mediaList.length - 1));
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedImageIdx((prev) => (prev < mediaList.length - 1 ? prev + 1 : 0));
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden border border-slate-200 my-4 max-h-[92vh] flex flex-col">
          {/* Modal Top Bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center gap-2 text-xs text-slate-500 truncate">
              <span>Storefront</span>
              <span>/</span>
              <span className="font-semibold text-sky-700">{product.category}</span>
              {!isFieldOmitted('sku') && product.sku && (
                <>
                  <span>/</span>
                  <span className="text-slate-700 font-mono text-[11px]">{product.sku}</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`/product/${generateProductSlug(product)}`}
                onClick={(e) => {
                  e.preventDefault();
                  onClose();
                  if (onOpenProductPage) onOpenProductPage(product);
                }}
                className="py-1 px-2.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                title="Open full dedicated SEO page with custom URL slug"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">SEO Page</span>
              </a>
              <button
                onClick={handleShare}
                className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200/60 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                title="Share item link"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">{copiedLink ? 'Copied!' : 'Share'}</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {/* Product Gallery Column */}
              <div>
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-inner group">
                  <MediaViewer
                    url={currentMedia.url}
                    isVideo={currentMedia.isVideo}
                    alt={product.title}
                    className="w-full h-full object-cover cursor-zoom-in"
                    onClick={() => !currentMedia.isVideo && setIsLightboxOpen(true)}
                  />

                  {/* Left / Right Nav Arrows on Gallery */}
                  {hasGallery && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        aria-label="Previous image"
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white shadow-lg transition-transform hover:scale-105 cursor-pointer z-10"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        aria-label="Next image"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white shadow-lg transition-transform hover:scale-105 cursor-pointer z-10"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {/* Top Badges (Only if NOT omitted) */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
                    {product.condition && !isFieldOmitted('condition') && (
                      <span className="bg-slate-900/90 backdrop-blur-xs text-white text-xs font-bold px-2.5 py-1 rounded shadow-sm">
                        {product.condition}
                      </span>
                    )}
                    {product.settlementFee && !isFieldOmitted('settlementFee') && (
                      <span className="bg-amber-500 text-slate-950 text-xs font-extrabold px-2.5 py-0.5 rounded shadow-sm">
                        {product.settlementFee}
                      </span>
                    )}
                  </div>

                  {/* Expand / Lightbox Action & Image Counter */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-2 z-10">
                    {hasGallery && (
                      <span className="bg-black/70 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-1 rounded-md flex items-center gap-1 border border-white/20">
                        <Images className="w-3.5 h-3.5 text-sky-400" />
                        {selectedImageIdx + 1} / {mediaList.length}
                      </span>
                    )}
                    <button
                      onClick={() => setIsLightboxOpen(true)}
                      className="p-1.5 rounded-md bg-black/70 hover:bg-black/90 text-white transition-colors cursor-pointer border border-white/20"
                      title="View Fullscreen"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Thumbnails Strip & Exact Video/Picture Upload */}
                <div className="mt-3 space-y-2">
                  <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin items-center">
                    {mediaList.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIdx(idx)}
                        className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                          selectedImageIdx === idx 
                            ? 'border-[#0284C7] ring-2 ring-sky-300 scale-102 shadow-sm' 
                            : 'border-slate-200 opacity-60 hover:opacity-100'
                        }`}
                      >
                        {item.isVideo ? (
                          <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center text-white relative">
                            <Play className="w-5 h-5 text-sky-400 fill-sky-400 mb-0.5" />
                            <span className="text-[8px] font-black tracking-wider text-sky-300 uppercase">Video</span>
                          </div>
                        ) : (
                          <MediaViewer url={item.url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                        )}
                        <span className="absolute bottom-0.5 right-0.5 bg-black/75 text-white text-[9px] px-1 rounded font-bold">
                          {idx + 1}
                        </span>
                      </button>
                    ))}
                  </div>

                  {hasGallery && (
                    <div className="flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="flex items-center gap-1 font-medium">
                        <Video className="w-3.5 h-3.5 text-sky-600" />
                        Authentic product media gallery ({mediaList.length} items)
                      </span>
                      <span className="font-semibold text-emerald-700 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Verified
                      </span>
                    </div>
                  )}
                </div>

                {/* Direct Sale Guarantee */}
                <div className="mt-4 p-3.5 bg-sky-50/70 border border-sky-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-sky-900 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4 text-[#0284C7]" />
                    <span>Unitworld Sarl Direct Sale &amp; Payment</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Every item is owned, stocked, and sold directly by Unitworld Sarl — no third-party sellers and no escrow. All payments go directly to Unitworld Sarl.
                  </p>
                  {product.location && !isFieldOmitted('location') && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium pt-1 border-t border-sky-100">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span>Inspection Hub: <strong className="text-slate-900">{product.location}</strong></span>
                    </div>
                  )}
                </div>
              </div>

              {/* Purchase & Details Column */}
              <div className="flex flex-col justify-between space-y-4">
                <div>
                  {/* Seller / Rating Header (Only if NOT omitted) */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1">
                    {!isFieldOmitted('seller') && product.seller && (
                      <span className="font-bold text-[#0284C7]">Sold directly by Unitworld Sarl</span>
                    )}

                    {!isFieldOmitted('brand') && product.brand && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        <Award className="w-3 h-3 text-sky-600" />
                        Brand: {product.brand}
                      </span>
                    )}

                    {!isFieldOmitted('rating') && typeof product.rating === 'number' && Number.isFinite(product.rating) && (
                      <div className="flex items-center text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="font-bold text-slate-900 ml-1">{product.rating.toFixed(1)}</span>
                        {!isFieldOmitted('reviewCount') && product.reviewCount !== undefined && (
                          <span className="text-slate-400 ml-1">({product.reviewCount} reviews)</span>
                        )}
                      </div>
                    )}
                  </div>

                  <h1 className="font-playfair text-lg sm:text-2xl font-bold text-slate-900 leading-snug">
                    {product.title}
                  </h1>

                  {/* Tags (Only if NOT omitted) */}
                  {product.tags && !isFieldOmitted('tags') && product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {product.tags.map((t) => (
                        <span key={t} className="text-[11px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Price Display */}
                  <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Purchase Price</p>
                    <div className="flex items-baseline gap-3 mt-0.5">
                      <span className="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums">
                        {formatCurrency(product.price)}
                      </span>
                      {product.originalPrice && !isFieldOmitted('originalPrice') && (
                        <span className="text-sm text-slate-400 line-through tabular-nums">
                          {formatCurrency(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    {product.warranty && !isFieldOmitted('warranty') && (
                      <p className="text-xs text-emerald-700 font-semibold mt-1">
                        ✓ {product.warranty}
                      </p>
                    )}
                  </div>

                  {/* Stock Info (Only if NOT omitted) */}
                  {!isFieldOmitted('stock') && product.stock !== undefined && (
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">Inventory Status:</span>
                      {isOutOfStock ? (
                        <span className="text-rose-600 font-bold">Currently Out of Stock</span>
                      ) : (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <Check className="w-4 h-4" />
                          In Stock ({product.stock} units available)
                        </span>
                      )}
                    </div>
                  )}

                  {/* Description (Only if NOT omitted) */}
                  {product.description && !isFieldOmitted('description') && (
                    <div className="mt-4">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-sky-600" />
                        Overview & Details
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 p-3 rounded-lg border border-slate-100">
                        {product.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-slate-200 space-y-2.5">
                  {/* Quantity selector */}
                  {!isAutomobile && !isOutOfStock && (
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-slate-700">Quantity:</span>
                      <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-3 py-1 text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-xs font-bold text-slate-900">{quantity}</span>
                        <button
                          onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                          className="px-3 py-1 text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => {
                        onAddToCart(product, quantity);
                        onClose();
                      }}
                      disabled={isOutOfStock}
                      className="flex-1 py-3 px-4 bg-[#0284C7] hover:bg-[#0369a1] disabled:bg-slate-200 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>

                    <button
                      onClick={() => {
                        onInstantBuy(product);
                        onClose();
                      }}
                      disabled={isOutOfStock}
                      className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 text-slate-950 rounded-xl text-xs sm:text-sm font-black transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                    >
                      Buy Now
                    </button>
                  </div>

                  {/* Direct WhatsApp DM */}
                  <button
                    onClick={handleWhatsAppDm}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <MessageSquareQuote className="w-4 h-4" />
                    <span>WhatsApp DM ASAP — Talk Directly to Unitworld Sales Team</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Technical Specifications Table (Only if NOT omitted) */}
            {product.specs && !isFieldOmitted('specs') && Object.keys(product.specs).length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Car className="w-4 h-4 text-[#0284C7]" />
                  Technical & Verified Inspection Specifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {Object.entries(product.specs).map(([specKey, specVal]) => (
                    <div key={specKey} className="flex justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="font-semibold text-slate-600">{specKey}</span>
                      <span className="font-bold text-slate-900 text-right">{specVal}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Photo & Video Lightbox Modal */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-between p-4 animate-in fade-in duration-200 select-none"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Lightbox Header */}
          <div className="w-full max-w-5xl flex items-center justify-between text-white py-2" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-sky-400">Unitworld Media Gallery</span>
              <span className="text-xs text-slate-400 font-mono">
                {selectedImageIdx + 1} of {mediaList.length}
              </span>
            </div>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Lightbox Main Media (Image or Video) & Arrows */}
          <div className="relative w-full max-w-5xl flex-1 flex items-center justify-center py-4" onClick={(e) => e.stopPropagation()}>
            {hasGallery && (
              <button
                onClick={handlePrevImage}
                aria-label="Previous media"
                className="absolute left-2 sm:left-4 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white transition-all hover:scale-110 cursor-pointer z-20 border border-white/20"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {currentMedia.isVideo ? (
              <div className="max-h-[75vh] max-w-full flex items-center justify-center">
                <video
                  key={currentMedia.url}
                  src={currentMedia.url}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[75vh] max-w-full rounded-lg shadow-2xl"
                />
              </div>
            ) : (
              <img
                src={currentMedia.url}
                alt={product.title}
                className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl"
              />
            )}

            {hasGallery && (
              <button
                onClick={handleNextImage}
                aria-label="Next media"
                className="absolute right-2 sm:right-4 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white transition-all hover:scale-110 cursor-pointer z-20 border border-white/20"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Lightbox Thumbnails Strip */}
          {hasGallery && (
            <div className="w-full max-w-2xl flex justify-center gap-2 overflow-x-auto py-2" onClick={(e) => e.stopPropagation()}>
              {mediaList.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer relative ${
                    selectedImageIdx === idx ? 'border-sky-400 scale-105' : 'border-white/20 opacity-50 hover:opacity-100'
                  }`}
                >
                  {item.isVideo ? (
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white">
                      <Play className="w-4 h-4 text-sky-400 fill-sky-400" />
                    </div>
                  ) : (
                    <img src={item.url} alt="thumbnail" className="w-full h-full object-cover" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};
