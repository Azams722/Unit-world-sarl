import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Film, 
  Image as ImageIcon, 
  Trash2, 
  Check, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  FileCheck, 
  Plus,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { Product } from '../../types';
import { processMediaFile, ProcessedMediaItem } from '../../utils/mediaStorage';
import { MediaViewer } from '../common/MediaViewer';

interface MediaUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateProduct: (product: Product) => Promise<void>;
  initialProductId?: string;
}

export const MediaUploaderModal: React.FC<MediaUploaderModalProps> = ({
  isOpen,
  onClose,
  products,
  onUpdateProduct,
  initialProductId
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(
    initialProductId || (products.length > 0 ? products[0].id : '')
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const currentProduct = products.find((p) => p.id === selectedProductId) || products[0];

  const handleFilesSelect = async (files: FileList | null) => {
    if (!files || files.length === 0 || !currentProduct) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setStatusMessage(`Preparing to process ${files.length} file(s)...`);
    setUploadProgress({ current: 0, total: files.length });

    const newImages = [...(currentProduct.images || [])];
    const newVideos = [...(currentProduct.videos || [])];

    let processedCount = 0;

    try {
      for (const file of Array.from(files)) {
        setStatusMessage(`Processing "${file.name}" (${file.type || 'media'})...`);
        const item = await processMediaFile(file);

        if (item.isVideo) {
          if (!newVideos.includes(item.url)) {
            newVideos.unshift(item.url); // place new video first
          }
        } else {
          if (!newImages.includes(item.url)) {
            newImages.unshift(item.url); // place new image first
          }
        }

        processedCount++;
        setUploadProgress({ current: processedCount, total: files.length });
      }

      const updatedProduct: Product = {
        ...currentProduct,
        images: newImages,
        videos: newVideos,
        updatedAt: new Date().toISOString()
      };

      setStatusMessage('Saving gallery to Firestore & device media vault...');
      await onUpdateProduct(updatedProduct);

      setStatusMessage(`Successfully added ${processedCount} authentic media item(s) to ${currentProduct.title}!`);
      setTimeout(() => {
        setStatusMessage(null);
        setUploadProgress(null);
      }, 4000);
    } catch (err: any) {
      console.error('Batch upload error:', err);
      setErrorMessage(`Upload error: ${err?.message || 'Failed to save media'}`);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = async (imgUrl: string) => {
    if (!currentProduct) return;
    const updatedImages = (currentProduct.images || []).filter((u) => u !== imgUrl);
    const updatedProduct: Product = {
      ...currentProduct,
      images: updatedImages,
      updatedAt: new Date().toISOString()
    };
    await onUpdateProduct(updatedProduct);
  };

  const handleRemoveVideo = async (videoUrl: string) => {
    if (!currentProduct) return;
    const updatedVideos = (currentProduct.videos || []).filter((u) => u !== videoUrl);
    const updatedProduct: Product = {
      ...currentProduct,
      videos: updatedVideos,
      updatedAt: new Date().toISOString()
    };
    await onUpdateProduct(updatedProduct);
  };

  const handleClearPlaceholders = async () => {
    if (!currentProduct) return;
    // Filters out AI generated assets from /src/assets/images or stock unsplash/mixkit
    const strictlyUserImages = (currentProduct.images || []).filter((u) => 
      u.startsWith('data:image/') || u.startsWith('idb:') || u.includes('cloudinary.com/dgc6ootad/image/upload/v')
    );
    const strictlyUserVideos = (currentProduct.videos || []).filter((u) =>
      u.startsWith('data:video/') || u.startsWith('idb:video:') || u.startsWith('fs:video:') || u.includes('cloudinary.com/dgc6ootad/video/upload/v')
    );

    if (strictlyUserImages.length === 0 && strictlyUserVideos.length === 0) {
      setErrorMessage('Please upload at least 1 image or video first before clearing placeholders.');
      return;
    }

    const updatedProduct: Product = {
      ...currentProduct,
      images: strictlyUserImages,
      videos: strictlyUserVideos,
      updatedAt: new Date().toISOString()
    };

    await onUpdateProduct(updatedProduct);
    setStatusMessage('Cleared all stock/AI placeholders! Strictly using your uploaded media now.');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Media & Gallery Manager</h3>
              <p className="text-xs text-sky-200/80">
                Upload your exact WhatsApp photos & videos directly into product galleries
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {/* Target Product Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Select Product to Add Media To:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              >
                <optgroup label="Luxury Wigs & Hair">
                  {products
                    .filter((p) => p.category === 'Hair & Luxury Wigs' || p.tags?.includes('Human Hair Wig'))
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({(p.images || []).length} imgs, {(p.videos || []).length} vids)
                      </option>
                    ))}
                </optgroup>
                <optgroup label="Automobiles & Cars">
                  {products
                    .filter((p) => p.category === 'Automobiles & Cars')
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({(p.images || []).length} imgs, {(p.videos || []).length} vids)
                      </option>
                    ))}
                </optgroup>
                <optgroup label="Other Categories">
                  {products
                    .filter(
                      (p) =>
                        p.category !== 'Hair & Luxury Wigs' &&
                        p.category !== 'Automobiles & Cars' &&
                        !p.tags?.includes('Human Hair Wig')
                    )
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({(p.images || []).length} imgs)
                      </option>
                    ))}
                </optgroup>
              </select>

              {currentProduct && (
                <div className="bg-sky-50 border border-sky-100 rounded-xl px-3 py-2 flex items-center justify-between text-xs text-sky-900">
                  <span>
                    Current Gallery: <strong>{(currentProduct.images || []).length}</strong> photos,{' '}
                    <strong>{(currentProduct.videos || []).length}</strong> videos
                  </span>
                  <button
                    onClick={handleClearPlaceholders}
                    className="text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-white px-2 py-1 rounded-lg border border-rose-200 hover:bg-rose-50 transition-colors"
                  >
                    Clear AI Placeholders
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bulk Drag & Drop Box */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFilesSelect(e.dataTransfer.files);
            }}
            className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
              isProcessing
                ? 'border-sky-400 bg-sky-50/50'
                : 'border-slate-300 hover:border-sky-500 bg-slate-50/80 hover:bg-sky-50/20'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) => handleFilesSelect(e.target.files)}
            />

            <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <FolderOpen className="w-7 h-7" />
            </div>

            <h4 className="text-sm sm:text-base font-bold text-slate-800">
              Drag & Drop Your Uploaded Photos & Videos (2MB Max) Here
            </h4>
            <p className="text-xs text-slate-500 max-w-md mt-1">
              Upload multiple product photos and short showcase videos (MP4, WebM, MOV — 2MB max per video). Photos are compressed in-browser and videos sync to Firestore for all visitors.
            </p>

            <button
              type="button"
              className="mt-4 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              Browse Media Files from Device
            </button>
          </div>

          {/* Progress / Status Indicators */}
          {uploadProgress && (
            <div className="bg-slate-900 text-white rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-sky-300 flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Processing files: {uploadProgress.current} / {uploadProgress.total}
                </span>
                <span className="text-slate-400 font-mono">
                  {Math.round((uploadProgress.current / uploadProgress.total) * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-sky-500 h-full transition-all duration-200"
                  style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                />
              </div>
            </div>
          )}

          {statusMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Current Gallery Preview for Selected Product */}
          {currentProduct && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Active Gallery for &ldquo;{currentProduct.title}&rdquo;
                </h4>
                <span className="text-xs text-slate-500">
                  {(currentProduct.images || []).length + (currentProduct.videos || []).length} Total Assets
                </span>
              </div>

              {/* Videos Grid */}
              {(currentProduct.videos || []).length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-sky-700 flex items-center gap-1">
                    <Film className="w-3.5 h-3.5" /> Videos ({(currentProduct.videos || []).length})
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {(currentProduct.videos || []).map((videoUrl, idx) => (
                      <div
                        key={idx}
                        className="relative rounded-xl overflow-hidden bg-black aspect-video border border-slate-200 group"
                      >
                        <MediaViewer url={videoUrl} isVideo={true} controls={false} />
                        <button
                          onClick={() => handleRemoveVideo(videoUrl)}
                          className="absolute top-1.5 right-1.5 p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg opacity-80 group-hover:opacity-100 transition-opacity"
                          title="Delete Video"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Images Grid */}
              {(currentProduct.images || []).length > 0 ? (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5" /> Photos ({(currentProduct.images || []).length})
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 max-h-60 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
                    {(currentProduct.images || []).map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="relative rounded-lg overflow-hidden bg-white aspect-square border border-slate-200 group shadow-2xs"
                      >
                        <MediaViewer url={imgUrl} className="w-full h-full object-cover" />
                        <button
                          onClick={() => handleRemoveImage(imgUrl)}
                          className="absolute top-1 right-1 p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Delete Image"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 bg-sky-600 text-white text-[9px] font-bold px-1 py-0.5 rounded">
                            Cover
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center text-xs text-slate-400">
                  No images uploaded yet for this product. Use the uploader above to add photos!
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            All files are saved permanently in Firestore and your device media vault.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
