import React, { useState } from 'react';
import { Sparkles, ImageOff } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  onEditImage?: () => void;
  showEditHint?: boolean;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = 'Imagem',
  className = '',
  fallbackTitle,
  onEditImage,
  showEditHint = false,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative overflow-hidden bg-[#17050c] flex items-center justify-center ${className}`}>
      {/* Loading state shimmer */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-ruby-950 via-ruby-900 to-ruby-950 animate-pulse flex items-center justify-center z-10">
          <Sparkles className="w-5 h-5 text-gold-400/40 animate-spin" />
        </div>
      )}

      {/* Render actual image if no error */}
      {!hasError && src ? (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          loading="lazy"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          {...props}
        />
      ) : (
        /* Fallback aesthetic container */
        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-ruby-950 via-ruby-900/60 to-ruby-950 border border-ruby-800/40">
          <div className="w-10 h-10 rounded-full bg-gold-400/10 border border-gold-400/20 flex items-center justify-center text-gold-400 mb-2">
            <ImageOff className="w-5 h-5 opacity-70" />
          </div>
          <span className="text-xs font-serif font-medium text-ruby-200 line-clamp-1">
            {fallbackTitle || alt}
          </span>
          <span className="text-[10px] text-gray-400 mt-0.5">Studio VIP</span>
          {onEditImage && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditImage();
              }}
              className="mt-2 text-[10px] text-gold-400 underline hover:text-gold-300"
            >
              Configurar link direto
            </button>
          )}
        </div>
      )}

      {/* Edit Direct Link Overlay button on hover if permitted */}
      {onEditImage && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEditImage();
          }}
          title="Alterar link direto desta imagem"
          className={`absolute top-2 left-2 z-20 px-2 py-1 rounded-md text-[10px] font-medium bg-black/75 hover:bg-ruby-900 text-gold-300 border border-gold-400/30 backdrop-blur-sm transition-opacity shadow-lg ${
            showEditHint ? 'opacity-90' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          Trocar Link
        </button>
      )}
    </div>
  );
};
