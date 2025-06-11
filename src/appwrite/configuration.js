import { Client, Databases, ID, Storage, Query } from "appwrite";
import conf from "../config/conf";

class confApp {
    client = new Client();
    databases;
    storage;

    constructor() {
        this.client.setEndpoint(conf.APPWRITE_PROJECT_URL).setProject(conf.APPWRITE_PROJECT_ID);
        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client);
        
        // Debug: Check if configuration is loaded properly
        console.log("🔧 Service initialized with config:", {
            DATABASE_ID: conf.APPWRITE_DATABASE_ID,
            COLLECTIONS_ID: conf.APPWRITE_COLLECTIONS_ID,
            BUCKET_ID: conf.APPWRITE_BUCKET_ID
        });
        
        // Validate configuration
        this.validateConfig();
    }
    
    validateConfig() {
        const requiredFields = {
            'APPWRITE_DATABASE_ID': conf.APPWRITE_DATABASE_ID,
            'APPWRITE_COLLECTIONS_ID': conf.APPWRITE_COLLECTIONS_ID,
            'APPWRITE_BUCKET_ID': conf.APPWRITE_BUCKET_ID,
            'APPWRITE_PROJECT_ID': conf.APPWRITE_PROJECT_ID,
            'APPWRITE_PROJECT_URL': conf.APPWRITE_PROJECT_URL
        };
        
        Object.entries(requiredFields).forEach(([key, value]) => {
            if (!value || value === 'undefined' || value === undefined) {
                console.error(`❌ Missing or invalid configuration: ${key} = ${value}`);
                throw new Error(`Configuration error: ${key} is not properly set`);
            }
        });
    }

    //methods for documents
    async createPost({title, slug, content, featuredImage, status, userId, caption}) {
        try {
            if (!slug) {
                throw new Error("Slug is required for createPost");
            }
            
            console.log("Creating post with featuredImage:", featuredImage); // Debug log
            
            return await this.databases.createDocument(
                conf.APPWRITE_DATABASE_ID,
                conf.APPWRITE_COLLECTIONS_ID,
                slug, // documentId
                {
                    title,
                    caption: content || caption || title, // Use content as caption, fallback to caption or title
                    image: featuredImage,
                    status,
                    "user-id": userId
                }
            );
        } catch(err) {
            console.error("Error creating document:", err.message);
            throw err;
        }
    }

    async listPosts(queries = [Query.equal("status", ["active"])]) {
        try {
            return await this.databases.listDocuments(
                conf.APPWRITE_DATABASE_ID,
                conf.APPWRITE_COLLECTIONS_ID,
                queries
            );
        } catch(err) {
            console.error("Error listing documents:", err.message);
            throw err;
        }
    }

    async getPost(slug) {
        try {
            if (!slug) {
                throw new Error("Slug is required for getPost");
            }
            
            return await this.databases.getDocument(
                conf.APPWRITE_DATABASE_ID,
                conf.APPWRITE_COLLECTIONS_ID,
                slug
            );
        } catch(err) {
            console.error("Error getting document:", err.message);
            throw err;
        }
    }

    async updatePost(slug, {title, content, featuredImage, status, caption}) {
        try {
            if (!slug) {
                throw new Error("Slug is required for updatePost");
            }
            
            console.log("Updating post with featuredImage:", featuredImage); // Debug log
            
            return await this.databases.updateDocument(
                conf.APPWRITE_DATABASE_ID,
                conf.APPWRITE_COLLECTIONS_ID,
                slug,
                {
                    title,
                    caption: content || caption || title, // Use content as caption, fallback to caption or title
                    image: featuredImage,
                    status
                }
            );
        } catch(err) {
            console.error("Error updating document:", err.message);
            throw err;
        }
    }

    async deletePost(slug) {
        try {
            if (!slug) {
                throw new Error("Slug is required for deletePost");
            }
            
            await this.databases.deleteDocument(
                conf.APPWRITE_DATABASE_ID,
                conf.APPWRITE_COLLECTIONS_ID,
                slug
            );
            return true;
        } catch(err) {
            console.error("Error deleting document:", err.message);
            throw err;
        }
    }

    //methods for files/storage/bucket
    async uploadFile(file) {
        try {
            if (!file) {
                throw new Error("File is required for uploadFile");
            }
            
            return await this.storage.createFile(
                conf.APPWRITE_BUCKET_ID,
                ID.unique(),
                file
            );
        } catch(err) {
            console.error("Error uploading file:", err);
            throw err;
        }
    }

    async deleteFile(fileId) {
        try {
            if (!fileId) {
                throw new Error("FileId is required for deleteFile");
            }
            
            await this.storage.deleteFile(
                conf.APPWRITE_BUCKET_ID,
                fileId
            );
            return true;
        } catch(err) {
            console.error("Error deleting file:", err);
            throw err;
        }
    }

    getFilePreview(fileId) {
        if (!fileId) {
            console.error("FileId is required for getFilePreview");
            return null;
        }
        
        return this.storage.getFilePreview(
            conf.APPWRITE_BUCKET_ID,
            fileId
        );
    }
}

const ConfApp = new confApp();
export default ConfApp;