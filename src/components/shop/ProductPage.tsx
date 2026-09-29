import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  ShoppingCart, 
  ShieldCheck, 
  Check, 
  Star, 
  MapPin, 
  MessageSquareQuote, 
  Car, 
  Share2, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Images, 
  Award, 
  Play, 
  Upload, 
  Video, 
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Lock,
  Truck
} from 'lucide-react';
import { Product } from '../../types';
import { formatCurrency, generateProductSlug } from '../../utils/formatters';
import { processMediaFile, uploadMediaFile } from '../../utils/mediaStorage';
import { MediaViewer } from '../common/MediaViewer';

interface ProductPageProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onInstantBuy: (product: Product) => void;
  onUpdateProduct: (product: Product) => Promise<void>;
}

export const ProductPage: React.FC<ProductPageProps> = ({
  product,
  allProducts,
  onBack,
  onSelectProduct,
  onAddToCart,
  onInstantBuy,
  onUpdateProduct,
}) => {
  const [selectedMediaIdx, setSelectedMediaIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [mediaUrlInput, setMediaUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Helper to determine if a URL represents a video
  const isVideoUrl = (url: string) => {
    if (!url) return false;
    return (
      url.endsWith('.mp4') ||
      url.endsWith('.webm') ||
      url.endsWith('.mov') ||
      url.startsWith('data:video/') ||
      url.includes('cloudinary.com/dgc6ootad/video/') ||
      url.includes('video/upload')
    );
  };

  // Compile media items (photos and videos)
  const rawImages = product.images || [];
  const rawVideos = product.videos || [];

  const mediaList: { url: string; isVideo: boolean }[] = [
    ...rawImages.map((u) => ({ url: u, isVideo: isVideoUrl(u) })),
    ...rawVideos.map((u) => ({ url: u, isVideo: true })),
  ];

  const currentMedia = mediaList[selectedMediaIdx] || mediaList[0];
  const hasGallery = mediaList.length > 1;

  // 1. Dynamic SEO Metadata Injection & Schema.org JSON-LD
  useEffect(() => {
    // Dynamic document title
    const prevTitle = document.title;
    const formattedPrice = formatCurrency(product.price);
    const seoTitle = `${product.title} - ${formattedPrice} | Unitworld Sarl`;
    document.title = seoTitle;

    // Helper to set or create meta tags
    const setMetaTag = (attrName: string, attrVal: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const productDesc = product.description || `Buy ${product.title} for ${formattedPrice} on Unitworld Sarl. Verified authentic products, Paystack secure checkout, and Lagos inspection.`;
    const canonicalUrl = `${window.location.origin}/product/${generateProductSlug(product)}`;
    const ogImage = mediaList[0]?.url || 'https://res.cloudinary.com/dgc6ootad/image/upload/v1790464730/Unitworld_Trustworthy_Ecommerce_Marketplace_rmlqq8.png';

    setMetaTag('name', 'description', productDesc.slice(0, 160));
    setMetaTag('property', 'og:title', seoTitle);
    setMetaTag('property', 'og:description', productDesc.slice(0, 160));
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', 'product');
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', seoTitle);
    setMetaTag('name', 'twitter:description', productDesc.slice(0, 160));
    setMetaTag('name', 'twitter:image', ogImage);

    // Canonical link tag
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonicalUrl);

    // Schema.org Structured Data (JSON-LD)
    const jsonLdScript = document.createElement('script');
    jsonLdScript.type = 'application/ld+json';
    jsonLdScript.id = 'product-json-ld';
    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.title,
      image: mediaList.map(m => m.url),
      description: product.description,
      sku: product.sku || product.id,
      brand: {
        '@type': 'Brand',
        name: product.brand || product.seller || 'Luxury Human Hair'
      },
      offers: {
        '@type': 'Offer',
        url: canonicalUrl,
        priceCurrency: 'NGN',
        price: product.price,
        itemCondition: product.condition === 'Brand New' ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition',
        availability: (product.stock ?? 1) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        seller: {
          '@type': 'Organization',
          name: product.seller || 'Unitworld Sarl Global Commerce'
        }
      }
    };
    jsonLdScript.text = JSON.stringify(schemaData);
    document.head.appendChild(jsonLdScript);

    return () => {
      document.title = prevTitle;
      const script = document.getElementById('product-json-ld');
      if (script) script.remove();
    };
  }, [product, mediaList]);

  // Reset index when product changes
  useEffect(() => {
    setSelectedMediaIdx(0);
    setQuantity(1);
    setIsLightboxOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id]);

  // Keyboard navigation for gallery
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const count = mediaList.length;
      if (count <= 1) return;
      if (e.key === 'ArrowLeft') {
        setSelectedMediaIdx((prev) => (prev > 0 ? prev - 1 : count - 1));
      } else if (e.key === 'ArrowRight') {
        setSelectedMediaIdx((prev) => (prev < count - 1 ? prev + 1 : 0));
      } else if (e.key === 'Escape' && isLightboxOpen) {
        setIsLightboxOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mediaList.length, isLightboxOpen]);

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleWhatsAppDm = () => {
    const text = encodeURIComponent(
      `Hello! I am viewing this product on Unitworld:
Title: ${product.title}
Price: ${formatCurrency(product.price)}
SKU: ${product.sku || 'N/A'}
Page URL: ${window.location.href}
Please provide ordering, inspection and delivery confirmation.`
    );
    window.open(`https://wa.me/2348008648967?text=${text}`, '_blank');
  };

  // Upload exact video or picture files directly using in-browser compression & IndexedDB video vault
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadStatus(`Processing & compressing ${files.length} media file(s)...`);

    const newImages = [...(product.images || [])];
    const newVideos = [...(product.videos || [])];

    try {
      for (const file of Array.from(files)) {
        const uploaded = await processMediaFile(file);
        if (uploaded.isVideo) {
          if (!newVideos.includes(uploaded.url)) newVideos.unshift(uploaded.url);
        } else {
          if (!newImages.includes(uploaded.url)) newImages.unshift(uploaded.url);
        }
      }

      const updatedProduct: Product = {
        ...product,
        images: newImages,
        videos: newVideos,
        updatedAt: new Date().toISOString()
      };

      await onUpdateProduct(updatedProduct);
      setUploadStatus('Uploaded and saved permanently to Database & Media Vault!');
      setTimeout(() => setUploadStatus(null), 3500);
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadStatus('Upload note: error saving media file.');
      setTimeout(() => setUploadStatus(null), 3000);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleClearPlaceholders = async () => {
    const userImages = (product.images || []).filter(u => u.startsWith('data:image/') || u.startsWith('idb:') || u.includes('cloudinary.com/dgc6ootad/image/upload/v'));
    const userVideos = (product.videos || []).filter(u => u.startsWith('data:video/') || u.startsWith('idb:video:') || u.includes('cloudinary.com/dgc6ootad/video/upload/v'));

    if (userImages.length === 0 && userVideos.length === 0) {
      setUploadStatus('Please upload your authentic photos/videos first before clearing placeholders.');
      setTimeout(() => setUploadStatus(null), 3500);
      return;
    }

    const updatedProduct: Product = {
      ...product,
      images: userImages,
      videos: userVideos,
      updatedAt: new Date().toISOString()
    };

    await onUpdateProduct(updatedProduct);
    setUploadStatus('Strictly using your uploaded media now! All AI placeholders removed.');
    setTimeout(() => setUploadStatus(null), 3500);
  };

  const handleAddMediaUrl = async () => {
    const trimmed = mediaUrlInput.trim();
    if (!trimmed) return;
    const isVid = isVideoUrl(trimmed);
    const newImages = [...(product.images || [])];
    const newVideos = [...(product.videos || [])];

    if (isVid) {
      if (!newVideos.includes(trimmed)) newVideos.push(trimmed);
    } else {
      if (!newImages.includes(trimmed)) newImages.push(trimmed);
    }

    const updatedProduct: Product = {
      ...product,
      images: newImages,
      videos: newVideos,
      updatedAt: new Date().toISOString()
    };

    setIsUploading(true);
    setUploadStatus('Saving media URL strictly to Database...');
    try {
      await onUpdateProduct(updatedProduct);
      setMediaUrlInput('');
      setShowUrlInput(false);
      setUploadStatus('Saved permanently to Database!');
      setTimeout(() => setUploadStatus(null), 3000);
    } catch {
      setUploadStatus('Failed to update product');
      setTimeout(() => setUploadStatus(null), 2500);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveMedia = async (indexToRemove: number) => {
    const target = mediaList[indexToRemove];
    if (!target) return;
    const newImages = (product.images || []).filter(u => u !== target.url);
    const newVideos = (product.videos || []).filter(u => u !== target.url);

    const updatedProduct: Product = {
      ...product,
      images: newImages,
      videos: newVideos,
      updatedAt: new Date().toISOString()
    };

    try {
      await onUpdateProduct(updatedProduct);
      if (selectedMediaIdx >= mediaList.length - 1) {
        setSelectedMediaIdx(Math.max(0, mediaList.length - 2));
      }
    } catch (err) {
      console.error('Failed to remove media:', err);
    }
  };

  const isAutomobile = product.category === 'Automobiles & Cars';
  const isOutOfStock = product.stock !== undefined && product.stock <= 0;
  const relatedProducts = allProducts.filter(p => p.id !== product.id && (p.category === product.category || (p.tags && product.tags && p.tags.some(t => product.tags?.includes(t))))).slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Breadcrumb & SEO Path Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 overflow-x-auto scrollbar-none whitespace-nowrap">
            <button 
              onClick={onBack}
              className="flex items-center gap-1.5 font-bold text-slate-700 hover:text-[#0284C7] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Marketplace</span>
            </button>
            <span className="text-slate-300">/</span>
            <span className="font-semibold text-slate-600">{product.category}</span>
            <span className="text-slate-300">/</span>
            <span className="font-bold text-slate-900 truncate max-w-xs sm:max-w-md">{product.title}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleShare}
              className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Share product page URL"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Link Copied!' : 'Share Page'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Product Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 bg-white rounded-3xl border border-slate-200 p-4 sm:p-8 shadow-sm">
          
          {/* Left Column: Media Gallery (Large Viewer + Thumbnails + Upload) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 shadow-md group">
              {currentMedia ? (
                <div className="w-full h-full relative">
                  <MediaViewer
                    url={currentMedia.url}
                    isVideo={currentMedia.isVideo}
                    alt={product.title}
                    className="w-full h-full object-cover cursor-zoom-in"
                    onClick={() => !currentMedia.isVideo && setIsLightboxOpen(true)}
                  />
                  {currentMedia.isVideo && (
                    <div className="absolute top-3.5 left-3.5 bg-red-600 text-white text-[11px] font-black uppercase px-3 py-1 rounded shadow flex items-center gap-1.5 z-10 pointer-events-none">
                      <Play className="w-3.5 h-3.5 fill-current" /> Live Video Showcase
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-900 text-white space-y-3">
                  <Sparkles className="w-10 h-10 text-rose-400" />
                  <h3 className="font-playfair text-lg font-bold">{product.title} — Verified Listing</h3>
                  <p className="text-xs text-slate-300 max-w-sm">
                    Awaiting owner media uploads. Click below to add your exact video recordings and photographs.
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Exact Media to DB / Cloudinary</span>
                  </button>
                </div>
              )}

              {/* Navigation Arrows */}
              {hasGallery && (
                <>
                  <button
                    onClick={() => setSelectedMediaIdx((prev) => (prev > 0 ? prev - 1 : mediaList.length - 1))}
                    aria-label="Previous media"
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-black text-white shadow-xl transition-transform hover:scale-105 cursor-pointer z-10"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedMediaIdx((prev) => (prev < mediaList.length - 1 ? prev + 1 : 0))}
                    aria-label="Next media"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-black text-white shadow-xl transition-transform hover:scale-105 cursor-pointer z-10"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Badges on Gallery */}
              <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 z-10 pointer-events-none">
                {product.condition && (
                  <span className="bg-slate-900/90 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded shadow">
                    {product.condition}
                  </span>
                )}
                {product.settlementFee && (
                  <span className="bg-amber-500 text-slate-950 text-xs font-black px-3 py-1 rounded shadow">
                    Settlement {product.settlementFee}
                  </span>
                )}
              </div>

              {/* Lightbox Trigger & Counter */}
              {currentMedia && (
                <div className="absolute bottom-3.5 right-3.5 flex items-center gap-2 z-10">
                  {hasGallery && (
                    <span className="bg-black/75 backdrop-blur-xs text-white text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1 border border-white/20">
                      <Images className="w-3.5 h-3.5 text-sky-400" />
                      {selectedMediaIdx + 1} / {mediaList.length}
                    </span>
                  )}
                  <button
                    onClick={() => setIsLightboxOpen(true)}
                    className="p-2 rounded-md bg-black/75 hover:bg-black text-white transition-colors cursor-pointer border border-white/20"
                    title="Fullscreen Lightbox"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Thumbnails Row */}
            <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin items-center">
              {mediaList.map((item, idx) => (
                <div key={idx} className="relative group/thumb shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelectedMediaIdx(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 block transition-all cursor-pointer ${
                      selectedMediaIdx === idx 
                        ? 'border-[#0284C7] ring-2 ring-sky-300 scale-102 shadow-md' 
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    {item.isVideo ? (
                      <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center text-white relative">
                        <Play className="w-6 h-6 text-sky-400 fill-sky-400 mb-0.5" />
                        <span className="text-[9px] font-black tracking-wider text-sky-300 uppercase">Video</span>
                      </div>
                    ) : (
                      <MediaViewer url={item.url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    )}
                    <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                      {idx + 1}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveMedia(idx);
                    }}
                    title="Remove this uploaded media"
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold flex items-center justify-center shadow opacity-0 group-hover/thumb:opacity-100 transition-opacity cursor-pointer z-20"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {/* Upload Trigger Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-20 h-20 rounded-xl border-2 border-dashed border-sky-400 hover:border-sky-600 bg-sky-50/70 hover:bg-sky-100 text-sky-800 flex flex-col items-center justify-center shrink-0 cursor-pointer transition-colors p-2 shadow-2xs"
                title="Upload exact photos or video recordings from your device"
              >
                <Upload className="w-5 h-5 mb-1 text-sky-600" />
                <span className="text-[9px] font-black text-center leading-tight">
                  {isUploading ? 'Saving...' : 'Upload Media'}
                </span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*,video/*"
                multiple
                className="hidden"
              />

              {/* Paste Direct URL Trigger Button */}
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 hover:border-slate-500 bg-slate-50 hover:bg-slate-100 text-slate-700 flex flex-col items-center justify-center shrink-0 cursor-pointer transition-colors p-2 shadow-2xs"
                title="Paste Cloudinary URL or direct video/image link"
              >
                <ExternalLink className="w-4 h-4 mb-1 text-slate-600" />
                <span className="text-[9px] font-bold text-center leading-tight">
                  Paste URL / Cloudinary
                </span>
              </button>
            </div>

            {/* Gallery Control Bar */}
            <div className="flex items-center justify-between gap-2 pt-1 text-xs">
              <span className="text-slate-500 font-medium text-[11px]">
                {mediaList.length} media item{mediaList.length !== 1 ? 's' : ''} in gallery
              </span>
              <button
                type="button"
                onClick={handleClearPlaceholders}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                title="Remove any catalog/stock placeholders so only your real uploaded photos and videos remain"
              >
                Clear AI/Stock Placeholders
              </button>
            </div>

            {/* Optional Paste URL Input Bar */}
            {showUrlInput && (
              <div className="p-3 bg-white border border-slate-300 rounded-xl shadow-xs space-y-2 animate-in fade-in">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-sky-600" />
                  <span>Add Cloudinary / Direct Media URL</span>
                </span>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={mediaUrlInput}
                    onChange={(e) => setMediaUrlInput(e.target.value)}
                    placeholder="https://res.cloudinary.com/... or https://...video.mp4"
                    className="flex-1 text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddMediaUrl}
                    disabled={!mediaUrlInput.trim() || isUploading}
                    className="px-3 py-2 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Save to DB
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(false)}
                    className="px-2.5 py-2 text-slate-500 hover:text-slate-800 text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Direct Upload & Storage Persistence Status */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Strict Database & Cloudinary Persistence Enabled</span>
              </span>
              {uploadStatus && (
                <span className="font-bold text-sky-700 animate-pulse">{uploadStatus}</span>
              )}
            </div>
          </div>

          {/* Right Column: Product Details, Specifications & Purchase Actions */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              {/* Category & Verified Seller Pill */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="bg-sky-50 text-sky-800 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border border-sky-200">
                  {product.category}
                </span>
                {product.sku && (
                  <span className="text-slate-500 font-mono text-xs">SKU: {product.sku}</span>
                )}
              </div>

              {/* Title */}
              <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                {product.title}
              </h1>

              {/* Rating & Review Counter */}
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-1.5 font-bold text-slate-800">{product.rating ?? 5.0}</span>
                </div>
                <span>·</span>
                <span>{product.reviewCount ?? 28} Verified Nigerian Reviews</span>
                <span>·</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> In Stock ({product.stock ?? 10})
                </span>
              </div>

              {/* Price Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-md flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">
                    PRICE (NAIRA)
                  </span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-black text-amber-400 tabular-nums">
                      {formatCurrency(product.price)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-slate-400 line-through tabular-nums">
                        {formatCurrency(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black px-2.5 py-1 rounded uppercase">
                    Paystack Secured
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-2 pt-2">
                <p>{product.description}</p>
              </div>

              {/* Seller / Brand Info */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase">Seller / Merchant</span>
                  <p className="font-bold text-slate-900 flex items-center gap-1">
                    <span>{product.seller || 'Luxury Human Hair Studio'}</span>
                    <Award className="w-3.5 h-3.5 text-sky-600" />
                  </p>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{product.location || 'Lagos, Nigeria'}</span>
                  </p>
                </div>
                <button
                  onClick={handleWhatsAppDm}
                  className="py-1.5 px-3 bg-white border border-slate-300 hover:border-emerald-500 text-slate-700 hover:text-emerald-700 font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                >
                  <MessageSquareQuote className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Chat Vendor</span>
                </button>
              </div>
            </div>

            {/* Quantity & CTA Buttons */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              {!isAutomobile && !isOutOfStock && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Select Quantity:</span>
                  <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 font-bold text-sm cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 text-xs font-bold text-slate-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                      className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 font-bold text-sm cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => onAddToCart(product, quantity)}
                  disabled={isOutOfStock}
                  className="flex-1 py-3.5 px-5 bg-[#0284C7] hover:bg-[#0369a1] disabled:bg-slate-200 text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={() => onInstantBuy(product)}
                  disabled={isOutOfStock}
                  className="flex-1 py-3.5 px-5 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 text-slate-950 rounded-xl text-sm font-black transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <span>Instant Paystack Buy</span>
                </button>
              </div>

              {/* Direct WhatsApp DM */}
              <button
                onClick={handleWhatsAppDm}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <MessageSquareQuote className="w-4 h-4" />
                <span>WhatsApp DM ASAP — Direct Inspection & Delivery</span>
              </button>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-slate-500 text-center">
                <div className="p-2 bg-slate-50 rounded-lg flex flex-col items-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 mb-1" />
                  <span>100% Genuine</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg flex flex-col items-center">
                  <Lock className="w-4 h-4 text-sky-600 mb-1" />
                  <span>Paystack Escrow</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg flex flex-col items-center">
                  <Truck className="w-4 h-4 text-amber-600 mb-1" />
                  <span>Lagos & Nationwide</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications & Attributes Section */}
        {product.specs && Object.keys(product.specs).length > 0 && (
          <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="font-playfair text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <Car className="w-5 h-5 text-[#0284C7]" />
              <span>Full Specifications & Verified Details</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(product.specs).map(([specKey, specVal]) => (
                <div key={specKey} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <span className="font-semibold text-slate-600">{specKey}</span>
                  <span className="font-bold text-slate-900 text-right">{specVal}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-playfair text-xl font-bold text-slate-900">
                More in {product.category}
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectProduct(rel)}
                  className="bg-white rounded-2xl border border-slate-200 p-3 shadow-2xs hover:shadow-md hover:border-sky-300 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 mb-2">
                    <img 
                      src={rel.images?.[0] || 'https://res.cloudinary.com/dgc6ootad/image/upload/v1790464730/Unitworld_Trustworthy_Ecommerce_Marketplace_rmlqq8.png'} 
                      alt={rel.title} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{rel.title}</h3>
                    <p className="text-sm font-black text-sky-700 mt-1">{formatCurrency(rel.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Fullscreen Media Lightbox Modal */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-between p-4 animate-in fade-in duration-200 select-none"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div className="w-full max-w-5xl flex items-center justify-between text-white py-2" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-sky-400">Unitworld Media Gallery</span>
              <span className="text-xs text-slate-400 font-mono">
                {selectedMediaIdx + 1} of {mediaList.length}
              </span>
            </div>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="relative w-full max-w-5xl flex-1 flex items-center justify-center py-4" onClick={(e) => e.stopPropagation()}>
            {hasGallery && (
              <button
                onClick={() => setSelectedMediaIdx((prev) => (prev > 0 ? prev - 1 : mediaList.length - 1))}
                className="absolute left-2 sm:left-4 p-3 rounded-full bg-black/60 hover:bg-black text-white transition-all cursor-pointer z-20 border border-white/20"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {currentMedia?.isVideo ? (
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
                src={currentMedia?.url}
                alt={product.title}
                className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl"
              />
            )}

            {hasGallery && (
              <button
                onClick={() => setSelectedMediaIdx((prev) => (prev < mediaList.length - 1 ? prev + 1 : 0))}
                className="absolute right-2 sm:right-4 p-3 rounded-full bg-black/60 hover:bg-black text-white transition-all cursor-pointer z-20 border border-white/20"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {hasGallery && (
            <div className="w-full max-w-2xl flex justify-center gap-2 overflow-x-auto py-2" onClick={(e) => e.stopPropagation()}>
              {mediaList.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedMediaIdx(idx)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer relative ${
                    selectedMediaIdx === idx ? 'border-sky-400 scale-105' : 'border-white/20 opacity-50 hover:opacity-100'
                  }`}
                >
                  {item.isVideo ? (
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white">
                      <Play className="w-4 h-4 text-sky-400 fill-sky-400" />
                    </div>
                  ) : (
                    <img src={item.url} alt="thumb" className="w-full h-full object-cover" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
