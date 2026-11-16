import React, { useState, useEffect } from 'react';
import { Play, Image as ImageIcon, Film } from 'lucide-react';
import { resolveMediaUrl } from '../../utils/mediaStorage';

interface MediaViewerProps {
  url: string;
  isVideo?: boolean;
  alt?: string;
  className?: string;
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  fallbackSrc?: string;
  onClick?: () => void;
}

export const MediaViewer: React.FC<MediaViewerProps> = ({
  url,
  isVideo = false,
  alt = 'Product media',
  className = 'w-full h-full object-cover',
  controls = true,
  autoPlay = false,
  muted = true,
  loop = true,
  fallbackSrc = 'https://res.cloudinary.com/dgc6ootad/image/upload/v1790464730/Unitworld_Trustworthy_Ecommerce_Marketplace_rmlqq8.png',
  onClick,
}) => {
  const cleanUrl = React.useMemo(() => {
    if (!url) return '';
    if (url.startsWith('/src/assets/images/')) {
      return url.replace('/src/assets/images/', '/assets/images/');
    }
    if (url.startsWith('src/assets/images/')) {
      return url.replace('src/assets/images/', '/assets/images/');
    }
    return url;
  }, [url]);

  const [resolvedSrc, setResolvedSrc] = useState<string>(cleanUrl.startsWith('idb:') ? '' : cleanUrl);
  const [hasError, setHasError] = useState(false);
  const [fallbackFailed, setFallbackFailed] = useState(false);
  const [loading, setLoading] = useState(cleanUrl.startsWith('idb:'));

  useEffect(() => {
    let isMounted = true;

    if (cleanUrl.startsWith('idb:')) {
      setLoading(true);
      resolveMediaUrl(cleanUrl).then((res) => {
        if (isMounted) {
          if (res) {
            setResolvedSrc(res);
          } else {
            setHasError(true);
          }
          setLoading(false);
        }
      });
    } else {
      setResolvedSrc(cleanUrl);
      setLoading(false);
      setHasError(false);
    }

    return () => {
      isMounted = false;
    };
  }, [cleanUrl]);

  const actualIsVideo = isVideo || 
    url.includes('video') || 
    url.endsWith('.mp4') || 
    url.endsWith('.webm') || 
    url.endsWith('.mov') || 
    url.startsWith('idb:video:') ||
    url.startsWith('data:video/');

  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-slate-900 text-slate-400 ${className}`}>
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs">Loading media...</span>
        </div>
      </div>
    );
  }

  if (actualIsVideo) {
    return (
      <div className={`relative bg-black flex items-center justify-center overflow-hidden ${className}`}>
        {resolvedSrc ? (
          <video
            src={resolvedSrc}
            controls={controls}
            autoPlay={autoPlay}
            muted={muted}
            loop={loop}
            playsInline
            className="w-full h-full object-contain"
            onError={() => setHasError(true)}
          />
        ) : (
          <div className="flex flex-col items-center text-slate-400 gap-2 p-4 text-center">
            <Film className="w-8 h-8 text-rose-400" />
            <span className="text-xs font-medium">Video preview</span>
          </div>
        )}
      </div>
    );
  }

  if (fallbackFailed) {
    return (
      <div 
        onClick={onClick}
        className={`flex flex-col items-center justify-center bg-slate-900 text-slate-400 p-4 select-none ${className}`}
      >
        <ImageIcon className="w-8 h-8 text-sky-400 mb-1" />
        <span className="text-[11px] font-bold text-slate-300 text-center tracking-wide">{alt || 'Unitworld Sarl Direct Store'}</span>
      </div>
    );
  }

  const effectiveSrc = hasError || !resolvedSrc ? fallbackSrc : resolvedSrc;

  return (
    <img
      src={effectiveSrc}
      alt={alt}
      referrerPolicy="no-referrer"
      className={className}
      onClick={onClick}
      onError={() => {
        if (!hasError) {
          setHasError(true);
        } else {
          setFallbackFailed(true);
        }
      }}
    />
  );
};
