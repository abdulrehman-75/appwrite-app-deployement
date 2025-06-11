const conf = {
    APPWRITE_PROJECT_ID : String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    APPWRITE_PROJECT_URL: String(import.meta.env.VITE_APPWRITE_PROJECT_URL),
    APPWRITE_DATABASE_ID: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    APPWRITE_COLLECTIONS_ID: String(import.meta.env.VITE_APPWRITE_COLLECTIONS_ID),
    APPWRITE_BUCKET_ID: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
};

export default conf;