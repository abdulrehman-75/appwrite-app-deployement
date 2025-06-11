import React from "react";
import appWriteService from "../appwrite/configuration";
import { Link } from "react-router-dom";

function PostCard({ $id, title, featuredImage }) {
    return (
        <Link to={`/post/${$id}`}> 
            <div className="w-full p-4 transition bg-white border border-orange-500 shadow rounded-xl hover:shadow-md">
                <div className="mb-4">
                    {featuredImage ? (
                        <img
                            src={appWriteService.getFilePreview(featuredImage)}
                            alt={title}
                            className="object-cover w-full h-48 rounded-xl"
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-48 bg-gray-200 rounded-xl">
                            <span className="text-gray-500">No Image</span>
                        </div>
                    )}
                </div>
                <h2 className="text-xl font-bold text-black">{title}</h2>
            </div>
        </Link>
    );
}

export default PostCard;
