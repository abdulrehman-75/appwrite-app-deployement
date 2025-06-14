import React, { useState } from "react";
import { Link } from "react-router-dom";
import { optimizeExistingUrl, optimizeCloudinaryUrl } from "../config/cloudinaryConf";

function PostCard({ $id, title, image }) {
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const optimizedImageUrl = image 
        ? optimizeExistingUrl(image, {
            width: 400,
            height: 300,
            crop: 'fill',
            quality: 'auto',
            format: 'auto'
        })
        : null;

    const fallbackImageUrl = image 
        ? optimizeCloudinaryUrl(image, {
            width: 400,
            height: 300,
            crop: 'fill',
            quality: 'auto',
            format: 'auto'
        })
        : null;

    console.log('PostCard Debug:', {
        postId: $id,
        title,
        originalUrl: image,
        optimizedUrl: optimizedImageUrl,
        fallbackUrl: fallbackImageUrl
    });

    const handleImageError = (e) => {
        console.error('Image failed to load:', {
            src: e.target.src,
            originalUrl: image,
            optimizedUrl: optimizedImageUrl,
            fallbackUrl: fallbackImageUrl
        });
        setImageError(true);
    };

    const handleImageLoad = () => {
        console.log('Image loaded successfully:', optimizedImageUrl);
        setImageLoaded(true);
        setImageError(false);
    };

    const tryFallbackImage = () => {
        setImageError(false);
        console.log('Trying fallback image URL');
    };

    return (
        <Link to={`/post/${$id}`}>
            <div className="w-full p-4 transition-shadow bg-gray-100 rounded-xl hover:shadow-lg">
                <div className="relative justify-center w-full mb-4">
                    {optimizedImageUrl && !imageError ? (
                        <div className="relative">
                            <img
                                src={optimizedImageUrl}
                                alt={title}
                                className="object-cover w-full h-48 rounded-xl"
                                onLoad={handleImageLoad}
                                onError={handleImageError}
                            />
                            {!imageLoaded && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-300 animate-pulse rounded-xl">
                                    <span className="text-gray-500">Loading...</span>
                                </div>
                            )}
                        </div>
                    ) : imageError && fallbackImageUrl && fallbackImageUrl !== optimizedImageUrl ? (
                        <div className="relative">
                            <img
                                src={fallbackImageUrl}
                                alt={title}
                                className="object-cover w-full h-48 rounded-xl"
                                onLoad={handleImageLoad}
                                onError={() => console.error('Fallback image also failed')}
                            />
                            <div className="absolute px-2 py-1 text-xs bg-yellow-500 rounded top-2 left-2">
                                Fallback
                            </div>
                        </div>
                    ) : imageError ? (
                        <div className="flex flex-col items-center justify-center w-full h-48 bg-gray-300 rounded-xl">
                            <div className="mb-2 text-red-500">⚠️ Image Error</div>
                            <button
                                onClick={tryFallbackImage}
                                className="px-3 py-1 text-xs text-white bg-blue-500 rounded hover:bg-blue-600"
                            >
                                Retry
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center w-full h-48 bg-gray-300 rounded-xl">
                            <span className="text-gray-500">No Image</span>
                        </div>
                    )}
                </div>
                
                <h2 className="text-xl font-bold text-gray-800 line-clamp-2">{title}</h2>
                
                {process.env.NODE_ENV === 'development' && (
                    <div className="p-2 mt-2 text-xs bg-gray-100 border rounded">
                        <details>
                            <summary className="text-blue-600 cursor-pointer">Debug Info</summary>
                            <div className="mt-1 space-y-1">
                                <div><strong>Original:</strong> <span className="break-all">{image}</span></div>
                                <div><strong>Optimized:</strong> <span className="break-all">{optimizedImageUrl}</span></div>
                                <div><strong>Fallback:</strong> <span className="break-all">{fallbackImageUrl}</span></div>
                                <div><strong>Status:</strong> {imageLoaded ? '✅ Loaded' : imageError ? '❌ Error' : '⏳ Loading'}</div>
                            </div>
                        </details>
                    </div>
                )}
            </div>
        </Link>
    );
}

export default PostCard;
