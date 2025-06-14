// src/config/cloudinaryConf.js
const cloudinaryConf = {
    CLOUDINARY_CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || undefined,
    CLOUDINARY_API_KEY: import.meta.env.VITE_CLOUDINARY_API_KEY || undefined,
    CLOUDINARY_API_SECRET: import.meta.env.VITE_CLOUDINARY_API_SECRET || undefined,
    CLOUDINARY_UPLOAD_PRESET: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || undefined,
};

export const cloudinaryConfig = {
    cloudName: cloudinaryConf.CLOUDINARY_CLOUD_NAME,
    apiKey: cloudinaryConf.CLOUDINARY_API_KEY,
    apiSecret: cloudinaryConf.CLOUDINARY_API_SECRET,
    uploadPreset: cloudinaryConf.CLOUDINARY_UPLOAD_PRESET,
    uploadUrl: cloudinaryConf.CLOUDINARY_CLOUD_NAME 
        ? `https://api.cloudinary.com/v1_1/${cloudinaryConf.CLOUDINARY_CLOUD_NAME}/image/upload`
        : null
};

export default cloudinaryConf;

// Utility function to generate optimized image URLs
export const getOptimizedImageUrl = (publicId, options = {}) => {
    if (!cloudinaryConfig.cloudName) {
        console.error('Cloudinary cloud name not configured');
        return null;
    }
    
    const {
        width = 'auto',
        height = 'auto',
        crop = 'fill',
        quality = 'auto',
        format = 'auto'
    } = options;
    
    return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/w_${width},h_${height},c_${crop},q_${quality},f_${format}/${publicId}`;
};

// FIXED: For direct URLs (already complete Cloudinary URLs)
export const optimizeExistingUrl = (url, options = {}) => {
    if (!url || !url.includes('cloudinary.com')) {
        console.log('Not a Cloudinary URL or empty URL:', url);
        return url;
    }
    
    const {
        width = 400,
        height = 300,
        crop = 'fill',
        quality = 'auto',
        format = 'auto'
    } = options;
    
    try {
        // Handle URLs with version numbers like: /upload/v1749914248/folder/image.jpg
        // Or without version numbers like: /upload/folder/image.jpg
        
        const uploadIndex = url.indexOf('/upload/');
        if (uploadIndex === -1) {
            console.log('No /upload/ found in URL:', url);
            return url;
        }
        
        const baseUrl = url.substring(0, uploadIndex + 8); // Include '/upload/'
        const afterUpload = url.substring(uploadIndex + 8); // Everything after '/upload/'
        
        // Build transformation string
        const transformations = `w_${width},h_${height},c_${crop},q_${quality},f_${format}`;
        
        // Construct the new URL with transformations
        const optimizedUrl = `${baseUrl}${transformations}/${afterUpload}`;
        
        console.log('URL Optimization:', {
            original: url,
            optimized: optimizedUrl,
            transformations
        });
        
        return optimizedUrl;
        
    } catch (error) {
        console.error('Error optimizing URL:', error);
        return url; // Return original URL if optimization fails
    }
};

// Alternative function that preserves version numbers properly
export const optimizeCloudinaryUrl = (url, options = {}) => {
    if (!url || !url.includes('cloudinary.com')) return url;
    
    const {
        width = 400,
        height = 300,
        crop = 'fill',
        quality = 'auto',
        format = 'auto'
    } = options;
    
    try {
        // Split URL into parts
        // Example: https://res.cloudinary.com/dtxmc142v/image/upload/v1749914248/blog-posts/post_1749914245274_pxzhse.png
        const parts = url.split('/');
        const uploadIndex = parts.findIndex(part => part === 'upload');
        
        if (uploadIndex === -1) return url;
        
        // Reconstruct URL with transformations
        const beforeUpload = parts.slice(0, uploadIndex + 1); // ['https:', '', 'res.cloudinary.com', 'dtxmc142v', 'image', 'upload']
        const afterUpload = parts.slice(uploadIndex + 1); // ['v1749914248', 'blog-posts', 'post_1749914245274_pxzhse.png']
        
        // Create transformation string
        const transformationString = `w_${width},h_${height},c_${crop},q_${quality},f_${format}`;
        
        // Rebuild URL: base + upload + transformations + rest
        const newUrl = [...beforeUpload, transformationString, ...afterUpload].join('/');
        
        console.log('Advanced URL Optimization:', {
            original: url,
            optimized: newUrl
        });
        
        return newUrl;
        
    } catch (error) {
        console.error('Error in advanced URL optimization:', error);
        return url;
    }
};