import cloudinaryConf from '../config/cloudinaryConf';

export async function uploadImageToCloudinary(file) {
    const cloudName = cloudinaryConf.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = cloudinaryConf.CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || cloudName === 'undefined') {
        throw new Error('Cloudinary cloud name is not configured. Please check your environment variables.');
    }

    if (!uploadPreset || uploadPreset === 'undefined') {
        throw new Error('Cloudinary upload preset is not configured. Please check your environment variables.');
    }

    if (!file) {
        throw new Error('No file provided for upload');
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "blog-posts");

    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    formData.append("public_id", `post_${timestamp}_${randomString}`);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    try {
        const response = await fetch(uploadUrl, {
            method: "POST",
            body: formData,
        });

        const responseData = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Unauthorized: Check your upload preset configuration in Cloudinary dashboard');
            } else if (response.status === 400 && responseData.error?.message?.includes('cloud_name is disabled')) {
                throw new Error('Cloudinary account is disabled. Please check your account status in Cloudinary dashboard');
            } else {
                throw new Error(`Upload failed: ${responseData.error?.message || responseData.message || `HTTP ${response.status}`}`);
            }
        }

        if (!responseData.secure_url) {
            throw new Error('Upload succeeded but no URL was returned');
        }

        return responseData.secure_url;

    } catch (error) {
        if (error.message.includes('fetch')) {
            throw new Error(`Network error during upload: ${error.message}`);
        } else {
            throw new Error(`Failed to upload image: ${error.message}`);
        }
    }
}
