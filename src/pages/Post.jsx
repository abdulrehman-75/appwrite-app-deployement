import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ConfApp from "../appwrite/configuration";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
    const [post, setPost] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [imageError, setImageError] = useState(false);
    const [imageDebugInfo, setImageDebugInfo] = useState(null);

    const { slug } = useParams();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    const isAuthor = post && userData ? post["user-id"] === userData.$id : false;

    useEffect(() => {
        if (slug) {
            ConfApp.getPost(slug)
                .then((post) => {
                    if (post) {
                        setPost(post);
                        if (post.image) {
                            const url = ConfApp.getFilePreview(post.image)?.toString();
                            setImageUrl(url);
                            setImageDebugInfo({
                                imageId: post.image,
                                generatedUrl: url,
                                urlType: typeof url,
                            });
                        }
                    } else {
                        navigate("/");
                    }
                })
                .catch((err) => {
                    console.error("Error loading post:", err);
                    navigate("/");
                });
        } else {
            navigate("/");
        }
    }, [slug, navigate]);

    const deletePost = () => {
        if (!post) return;
        ConfApp.deletePost(post.$id).then((status) => {
            if (status) {
                if (post.image) {
                    ConfApp.deleteFile(post.image);
                }
                navigate("/");
            }
        });
    };

    const handleImageError = (e) => {
        console.log("Image failed to load:", {
            imageId: post.image,
            src: e.target.src,
            error: e,
            status: e.target.complete,
            naturalWidth: e.target.naturalWidth,
            naturalHeight: e.target.naturalHeight,
        });
        setImageError(true);
    };

    const handleImageLoad = () => {
        setImageError(false);
    };

    return post ? (
        <div className="min-h-screen py-8 text-black bg-gray-400">
            <Container>
                <div className="relative flex justify-center w-full p-2 mb-4 bg-black border border-black rounded-xl">
                    {post.image && typeof post.image === "string" && imageUrl && !imageError ? (
                        <img
                            src={imageUrl}
                            alt={post.title}
                            className="h-auto max-w-full mx-auto rounded-xl"
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                        />
                    ) : imageError ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center text-white bg-black rounded-xl">
                            <div className="mb-2 text-red-500">⚠️ Image failed to load</div>
                            <div className="mb-2 text-sm text-gray-400">Image ID: {post.image}</div>
                            <div className="max-w-full p-3 mb-4 overflow-x-auto text-xs text-left bg-gray-800 rounded">
                                <p><strong>Generated URL:</strong></p>
                                <p className="text-orange-500 break-all">{imageDebugInfo?.generatedUrl}</p>
                            </div>
                            <button
                                onClick={() => setImageError(false)}
                                className="px-4 py-2 text-black bg-orange-400 rounded hover:bg-orange-500"
                            >
                                Retry
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center p-8 text-gray-400 bg-black rounded-xl">
                            No image available
                        </div>
                    )}

                    {isAuthor && (
                        <div className="absolute right-6 top-6">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button bgColor="bg-orange-500" className="mr-3 hover:bg-orange-600">
                                    Edit
                                </Button>
                            </Link>
                            <Button bgColor="bg-red-600 hover:bg-red-700" onClick={deletePost}>
                                Delete
                            </Button>
                        </div>
                    )}
                </div>

                <div className="w-full mb-6">
                    <h1 className="text-3xl font-bold text-black">{post.title}</h1>
                </div>

                <div className="max-w-full prose text-black">
                    {typeof post.caption === "string" ? parse(post.caption) :
                        typeof post.content === "string" ? parse(post.content) :
                        "No content available"}
                </div>

                <div className="p-4 mt-8 text-sm text-white bg-black rounded">
    <h3 className="mb-2 font-bold">Debug Info:</h3>
    <p><strong>Post ID:</strong> <span className="select-none blur-sm">{post.$id}</span></p>
    <p><strong>User ID:</strong> <span className="select-none blur-sm">{userData?.$id}</span></p>
    <p><strong>Is Author:</strong> {isAuthor.toString()}</p>
    <p><strong>Image ID:</strong> <span className="select-none blur-sm">{post.image}</span></p>
    <p><strong>Image URL Type:</strong> <span className="select-none blur-sm">{imageDebugInfo?.urlType}</span></p>
    <p><strong>Generated URL:</strong> <span className="break-all select-none blur-sm">{imageDebugInfo?.generatedUrl}</span></p>
</div>

            </Container>
        </div>
    ) : null;
}
