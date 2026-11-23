import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  Upload,
  Image as ImageIcon,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  Edit,
  Send,
  Tag,
  MapPin,
  Package,
  Plus,
} from 'lucide-react';
import { Product } from '../../types';
import { CATEGORIES } from '../../data/initialProducts';
import { formatCurrency } from '../../utils/formatters';
import { compressImageToDataUrl, recompressDataUrl } from '../../utils/mediaStorage';

interface ProductBotPanelProps {
  onCreateProduct: (product: Product) => Promise<void>;
  onOpenInEditor: (product: Product) => void;
  onGoToInventory: () => void;
  onNotifySuccess: (msg: string) => void;
}

interface BotConvertedEntry {
  id: string;
  botSummary: string;
  rawInput: string;
  product: Product;
  status: 'published' | 'draft';
  createdAt: string;
}

export const ProductBotPanel: React.FC<ProductBotPanelProps> = ({
  onCreateProduct,
  onOpenInEditor,
  onGoToInventory,
  onNotifySuccess,
}) => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [rawDescription, setRawDescription] = useState('');
  const [overridePrice, setOverridePrice] = useState('');
  const [preferredCategory, setPreferredCategory] = useState('Auto-Detect');
  const [locationHint, setLocationHint] = useState('');
  const [autoPublish, setAutoPublish] = useState(true);

  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [history, setHistory] = useState<BotConvertedEntry[]>([]);

  const handleFilesSelected = async (files: FileList | File[]) => {
    const fileArr = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (fileArr.length === 0) {
      setErrorMsg('Please select valid image files (JPG, PNG, WEBP).');
      return;
    }

    setErrorMsg(null);
    setIsProcessingImages(true);
    try {
      const compressedList: string[] = [];
      for (const file of fileArr.slice(0, 6)) {
        const dataUrl = await compressImageToDataUrl(file, 1100, 0.8);
        compressedList.push(dataUrl);
      }
      setUploadedImages((prev) => {
        const merged = [...prev, ...compressedList];
        return merged.filter((u, idx) => merged.indexOf(u) === idx).slice(0, 6);
      });
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to process uploaded image(s).');
    } finally {
      setIsProcessingImages(false);
    }
  };

  const handleAddImageUrl = () => {
    const trimmed = imageUrlInput.trim();
    if (!trimmed) return;
    if (!uploadedImages.includes(trimmed)) {
      setUploadedImages((prev) => [...prev, trimmed].slice(0, 6));
    }
    setImageUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const buildFirestoreSafeProduct = async (
    draft: any,
    fallbackImages: string[]
  ): Promise<Product> => {
    const now = new Date().toISOString();
    let finalImages: string[] =
      Array.isArray(draft.images) && draft.images.length > 0
        ? draft.images
        : fallbackImages.length > 0
        ? fallbackImages
        : ['/assets/images/hero_marketplace_banner.jpg'];

    const createPayload = (imgs: string[]): Product => ({
      id: `prod-${Date.now()}`,
      slug: draft.slug || undefined,
      title: String(draft.title || 'Unitworld Product').trim(),
      description: String(draft.description || rawDescription).trim(),
      price: Number(draft.price) || 0,
      originalPrice:
        draft.originalPrice && Number(draft.originalPrice) > Number(draft.price || 0)
          ? Number(draft.originalPrice)
          : undefined,
      category: String(draft.category || 'Official Store'),
      condition: String(draft.condition || 'Brand New'),
      images: imgs,
      stock: Math.max(1, Number(draft.stock) || 1),
      sku: String(draft.sku || `UW-BOT-${Math.floor(1000 + Math.random() * 9000)}`),
      seller: 'Unitworld Sarl',
      location: String(draft.location || 'Victoria Island, Lagos'),
      brand: String(draft.brand || 'Unitworld Direct'),
      warranty: String(
        draft.warranty || '100% Verified Quality Guarantee by Unitworld Sarl'
      ),
      rating: 5.0,
      reviewCount: 1,
      featured: true,
      tags: Array.isArray(draft.tags) ? draft.tags : ['Verified', 'Direct Sale'],
      specs:
        draft.specs && typeof draft.specs === 'object' ? draft.specs : undefined,
      createdAt: now,
      updatedAt: now,
    });

    let payload = createPayload(finalImages);
    const estimateBytes = (obj: unknown) =>
      new TextEncoder().encode(JSON.stringify(obj)).length;

    if (estimateBytes(payload) > 850_000) {
      finalImages = await Promise.all(
        finalImages.map((img) => recompressDataUrl(img, 850, 0.65))
      );
      payload = createPayload(finalImages);
    }
    if (estimateBytes(payload) > 900_000) {
      finalImages = await Promise.all(
        finalImages.map((img) => recompressDataUrl(img, 640, 0.5))
      );
      payload = createPayload(finalImages);
    }
    if (estimateBytes(payload) > 980_000) {
      throw new Error(
        'Uploaded photos exceed the 1MB product document limit. Please upload fewer photos.'
      );
    }

    return payload;
  };

  const handleConvertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isConverting || isProcessingImages) return;

    setErrorMsg(null);
    const trimmedDesc = rawDescription.trim();
    if (!trimmedDesc && uploadedImages.length === 0) {
      setErrorMsg('Please upload at least one product image or enter a description.');
      return;
    }

    setIsConverting(true);
    try {
      const response = await fetch('/api/bot/convert-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: trimmedDesc,
          images: uploadedImages.map((img) =>
            img.startsWith('data:') ? { dataUrl: img } : { url: img }
          ),
          overridePrice: overridePrice.trim() ? Number(overridePrice) : undefined,
          preferredCategory,
          locationHint: locationHint.trim() || undefined,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data?.productDraft) {
        throw new Error(
          data?.error || `Bot conversion failed with status ${response.status}.`
        );
      }

      const product = await buildFirestoreSafeProduct(
        data.productDraft,
        uploadedImages
      );

      let entryStatus: 'published' | 'draft' = 'draft';
      if (autoPublish) {
        await onCreateProduct(product);
        entryStatus = 'published';
        onNotifySuccess(
          `Product Bot converted & published "${product.title}" to Unitworld Sarl catalog!`
        );
      }

      const newEntry: BotConvertedEntry = {
        id: product.id,
        botSummary:
          data.productDraft.botSummary ||
          `Converted into "${product.title}" under ${product.category}.`,
        rawInput: trimmedDesc || '(Image-only upload)',
        product,
        status: entryStatus,
        createdAt: new Date().toISOString(),
      };

      setHistory((prev) => [newEntry, ...prev]);
      setUploadedImages([]);
      setImageUrlInput('');
      setRawDescription('');
      setOverridePrice('');
      setLocationHint('');
    } catch (err: any) {
      console.error('Product Bot conversion error:', err);
      setErrorMsg(err?.message || 'Failed to convert input into a product.');
    } finally {
      setIsConverting(false);
    }
  };

  const handlePublishDraft = async (entryId: string) => {
    const target = history.find((item) => item.id === entryId);
    if (!target || target.status === 'published') return;

    setPublishingId(entryId);
    setErrorMsg(null);
    try {
      await onCreateProduct(target.product);
      setHistory((prev) =>
        prev.map((item) =>
          item.id === entryId ? { ...item, status: 'published' } : item
        )
      );
      onNotifySuccess(
        `Published "${target.product.title}" to live Unitworld Sarl storefront!`
      );
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to publish draft product.');
    } finally {
      setPublishingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950 text-white rounded-2xl shadow-md border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center">
              <Bot className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h3 className="text-base font-black uppercase tracking-tight flex items-center gap-2">
                <span>Unitworld Smart Product Bot</span>
                <span className="text-[10px] bg-sky-500/20 text-sky-300 border border-sky-400/30 px-2 py-0.5 rounded font-bold tracking-wider">
                  IMAGE + TEXT TO PRODUCT
                </span>
              </h3>
              <p className="text-xs text-slate-300 max-w-2xl">
                Upload product photo(s) and drop your raw notes or description below. The bot inspects the images and automatically converts them into a complete, live-ready Unitworld Sarl listing with title, pricing, category, polished copy, specs, and SKU.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onGoToInventory}
          className="py-2 px-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/15 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          <Package className="w-4 h-4 text-sky-300" />
          <span>View Inventory</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Composer Card */}
      <form
        onSubmit={handleConvertSubmit}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5 text-xs"
      >
        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl flex items-start gap-2.5 font-semibold">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Multi-Image Uploader */}
          <div className="lg:col-span-5 space-y-3">
            <label className="block font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-[#0284C7]" />
              <span>1. Upload Product Photo(s)</span>
            </label>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files?.length) {
                  handleFilesSelected(e.dataTransfer.files);
                }
              }}
              className={`border-2 border-dashed rounded-xl p-5 text-center transition-colors ${
                isDragging
                  ? 'border-[#0284C7] bg-sky-50'
                  : 'border-slate-300 hover:border-sky-400 bg-slate-50/70'
              }`}
            >
              <Upload className="w-7 h-7 text-[#0284C7] mx-auto mb-2" />
              <p className="font-bold text-slate-800">
                Drag & drop product images here
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5 mb-3">
                Supports JPG, PNG, WEBP (up to 6 photos, auto-compressed)
              </p>
              <label className="inline-flex items-center gap-1.5 py-2 px-4 bg-[#0284C7] hover:bg-[#0369a1] text-white font-bold rounded-lg cursor-pointer shadow-xs transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>
                  {isProcessingImages ? 'Compressing Photos...' : 'Choose Photos'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={isProcessingImages || isConverting}
                  onChange={(e) => {
                    if (e.target.files?.length) {
                      handleFilesSelected(e.target.files);
                    }
                    e.target.value = '';
                  }}
                  className="hidden"
                />
              </label>
            </div>

            {/* Optional Paste Image URL */}
            <div className="flex gap-2">
              <input
                type="text"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="Or paste image URL (https://...)"
                className="flex-1 p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:border-sky-500"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                disabled={!imageUrlInput.trim()}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-300 text-white font-bold rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {/* Uploaded Thumbnails */}
            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2 pt-1">
                {uploadedImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-100 group"
                  >
                    <img
                      src={img}
                      alt={`Upload ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {idx === 0 && (
                      <span className="absolute top-1 left-1 bg-[#0284C7] text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                        COVER
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-rose-600/90 hover:bg-rose-700 text-white rounded shadow cursor-pointer"
                      title="Remove photo"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Description & Optional Hints */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>2. Raw Description / Product Notes *</span>
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setRawDescription(
                      'Clean foreign used 2020 Toyota Corolla SE, accident free, chilling AC, push to start, alloy rims, Lagos cleared customs papers, 19.5m Victoria Island'
                    )
                  }
                  className="text-[11px] text-[#0284C7] font-bold hover:underline cursor-pointer"
                >
                  Insert Sample Note
                </button>
              </div>

              <textarea
                rows={5}
                value={rawDescription}
                onChange={(e) => setRawDescription(e.target.value)}
                placeholder="Paste raw WhatsApp seller notes, item details, condition, price (e.g. 25k, 18.5m), size, or highlights. The bot combines your notes with the uploaded photos into a full store listing..."
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs leading-relaxed focus:outline-none focus:border-[#0284C7] focus:bg-white"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Override Price (₦ NGN)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={overridePrice}
                    onChange={(e) => setOverridePrice(e.target.value)}
                    placeholder="Auto-detect from notes"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Department Category
                  </label>
                  <select
                    value={preferredCategory}
                    onChange={(e) => setPreferredCategory(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-sky-500"
                  >
                    <option value="Auto-Detect">Auto-Detect Best Match</option>
                    {CATEGORIES.filter((c) => c.name !== 'All Departments').map(
                      (c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Location (Optional)
                  </label>
                  <input
                    type="text"
                    value={locationHint}
                    onChange={(e) => setLocationHint(e.target.value)}
                    placeholder="e.g. Victoria Island, Lagos"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>
            </div>

            {/* Footer Controls */}
            <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoPublish}
                  onChange={(e) => setAutoPublish(e.target.checked)}
                  className="w-4 h-4 accent-[#0284C7] rounded"
                />
                <span className="font-semibold text-slate-700">
                  Auto-publish directly to store catalog once converted
                </span>
              </label>

              <button
                type="submit"
                disabled={isConverting || isProcessingImages}
                className="py-2.5 px-5 bg-[#0284C7] hover:bg-[#0369a1] disabled:bg-slate-400 text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                {isConverting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Converting into Product...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>
                      {autoPublish
                        ? 'Convert & Publish Product'
                        : 'Convert to Product Preview'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Bot Conversion Output Feed */}
      {history.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <Bot className="w-4 h-4 text-[#0284C7]" />
            <span>Converted Products ({history.length})</span>
          </h4>

          {history.map((entry) => (
            <div
              key={entry.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
              {/* Bot status bar */}
              <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs">
                  <Bot className="w-4 h-4 text-[#0284C7]" />
                  <span className="font-bold text-slate-800">
                    {entry.botSummary}
                  </span>
                </div>

                {entry.status === 'published' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded font-black text-[10px] uppercase">
                    <CheckCircle2 className="w-3 h-3" />
                    Published Live to Storefront
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-100 text-amber-800 border border-amber-200 rounded font-black text-[10px] uppercase">
                    Draft Preview Ready
                  </span>
                )}
              </div>

              {/* Converted Product Card */}
              <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* Media Column */}
                <div className="md:col-span-4 space-y-2">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                    <img
                      src={entry.product.images[0]}
                      alt={entry.product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {entry.product.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-1.5">
                      {entry.product.images.slice(1, 5).map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={`Gallery ${i + 2}`}
                          className="aspect-square rounded-lg object-cover border border-slate-200"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Structured Details Column */}
                <div className="md:col-span-8 space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold">
                        <span className="bg-sky-100 text-sky-800 px-2 py-0.5 rounded uppercase">
                          {entry.product.category}
                        </span>
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {entry.product.condition}
                        </span>
                        <span className="font-mono text-slate-500">
                          SKU: {entry.product.sku}
                        </span>
                      </div>
                      <h5 className="text-base font-black text-slate-900 leading-snug">
                        {entry.product.title}
                      </h5>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-black text-[#0284C7] tabular-nums">
                        {formatCurrency(entry.product.price)}
                      </div>
                      {entry.product.originalPrice && (
                        <div className="text-xs text-slate-400 line-through tabular-nums">
                          {formatCurrency(entry.product.originalPrice)}
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {entry.product.description}
                  </p>

                  {/* Specifications */}
                  {entry.product.specs &&
                    Object.keys(entry.product.specs).length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                        {Object.entries(entry.product.specs).map(([k, v]) => (
                          <div
                            key={k}
                            className="flex items-center justify-between gap-2 px-2.5 py-1.5 bg-slate-50 rounded-lg border border-slate-200/70"
                          >
                            <span className="font-bold text-slate-600">{k}:</span>
                            <span className="text-slate-900 font-semibold text-right">
                              {v}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                  {/* Tags & Location */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px]">
                    <span className="inline-flex items-center gap-1 text-slate-600 font-semibold">
                      <MapPin className="w-3 h-3 text-sky-600" />
                      {entry.product.location}
                    </span>
                    <span className="text-slate-300">|</span>
                    <span className="font-semibold text-slate-600">
                      Stock: {entry.product.stock}
                    </span>
                    {entry.product.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold"
                      >
                        <Tag className="w-2.5 h-2.5 text-slate-500" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-slate-100">
                    {entry.status === 'draft' && (
                      <button
                        type="button"
                        disabled={publishingId === entry.id}
                        onClick={() => handlePublishDraft(entry.id)}
                        className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        {publishingId === entry.id ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                        <span>Publish to Catalog Now</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onOpenInEditor(entry.product)}
                      className="py-2 px-3.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Full Product Form</span>
                    </button>

                    <button
                      type="button"
                      onClick={onGoToInventory}
                      className="py-2 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Package className="w-3.5 h-3.5" />
                      <span>Open Inventory Table</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
