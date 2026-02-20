import { useState } from "react";

export default function UnsplashImage({
    src,
    alt,
    className = "",
    fallbackColor = "#f0f0f0"
}) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    const optimizedSrc = src.includes('unsplash.com')
        ? `${src.split('?')[0]}?auto=format&fit=crop&q=80`
        : src;

    return (
        <div
            className={`relative overflow-hidden ${className}`}
            style={{ backgroundColor: fallbackColor }}
        >
            {!hasError ? (
                <img
                    src={optimizedSrc}
                    alt={alt}
                    loading="lazy"
                    decoding="async"
                    crossOrigin="anonymous"
                    onLoad={() => setIsLoaded(true)}
                    onError={() => setHasError(true)}
                    className={`block w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"
                        }`}
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-black/20 font-bold text-xs uppercase tracking-widest text-center p-4">
                    Image Unavailable
                </div>
            )}
        </div>
    );
}
