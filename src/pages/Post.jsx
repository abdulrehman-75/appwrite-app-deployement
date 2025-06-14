import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ConfApp from "../appwrite/configuration";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { optimizeExistingUrl } from "../config/cloudinaryConf";

export default function Post() {
    const [post, setPost] = useState(null);
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const { slug } = useParams();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    const isAuthor = post && userData ? post["user-id"] === userData.$id : false;

    const optimizedImageUrl = post?.image 
        ? optimizeExistingUrl(post.image, {
            width: 800,
            height: 600,
            crop: 'limit',
            quality: 'auto',
            format: 'auto'
        })
        : null;

    useEffect(() => {
        if (post) {
            console.log('Post Component Debug:', {
                post: post,
                image: post.image,
                optimizedImageUrl: optimizedImageUrl,
                hasImage: !!post.image
            });
        }
    }, [post, optimizedImageUrl]);

    useEffect(() => {
        if (slug) {
            ConfApp.getPost(slug)
                .then((post) => {
                    if (post) {
                        console.log('Post loaded:', post);
                        setPost(post);
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
                navigate("/");
            }
        });
    };

    const handleImageError = (e) => {
        console.log("Image failed to load:", {
            image: post.image,
            optimizedUrl: optimizedImageUrl,
            src: e.target.src,
            error: e,
        });
        setImageError(true);
    };

    const handleImageLoad = () => {
        console.log("Image loaded successfully:", optimizedImageUrl);
        setImageError(false);
        setImageLoaded(true);
    };

    const retryImage = () => {
        setImageError(false);
        setImageLoaded(false);
    };

    return post ? (
        <div className="min-h-screen py-8 text-black bg-gray-400">
            <Container>
                <div className="relative flex justify-center w-full p-2 mb-4 bg-black border border-black rounded-xl">
                    {(post.image && !imageError) ? (
                        <div className="relative w-full">
                            <img
                                src={optimizedImageUrl || post.image}
                                alt={post.title}
                                className="h-auto max-w-full mx-auto rounded-xl"
                                onLoad={handleImageLoad}
                                onError={handleImageError}
                            />
                            {!imageLoaded && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 animate-pulse rounded-xl">
                                    <span className="text-white">Loading image...</span>
                                </div>
                            )}
                        </div>
                    ) : imageError ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center text-white bg-black rounded-xl min-h-[300px]">
                            <div className="mb-2 text-red-500">⚠️ Image failed to load</div>
                            <div className="mb-2 text-sm text-gray-400">
                                Original URL: <span className="break-all">{post.image}</span>
                            </div>
                            <div className="mb-4 text-sm text-gray-400">
                                Optimized URL: <span className="break-all">{optimizedImageUrl}</span>
                            </div>
                            <div className="space-x-2">
                                <button
                                    onClick={retryImage}
                                    className="px-4 py-2 text-black bg-orange-400 rounded hover:bg-orange-500"
                                >
                                    Retry Optimized
                                </button>
                                <button
                                    onClick={() => {
                                        const img = document.createElement('img');
                                        img.src = post.image;
                                        img.onload = () => {
                                            window.open(post.image, '_blank');
                                        };
                                        img.onerror = () => {
                                            alert('Original image URL also failed to load');
                                        };
                                    }}
                                    className="px-4 py-2 text-black bg-blue-400 rounded hover:bg-blue-500"
                                >
                                    Try Original URL
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center p-8 text-gray-400 bg-black rounded-xl min-h-[300px]">
                            <div className="text-center">
                                <div className="mb-2">No image available</div>
                                <div className="text-sm">
                                    Image URL: {post.image || 'Not set'}
                                </div>
                            </div>
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
                    <p><strong>Image URL:</strong> <span className="break-all select-none blur-sm">{post.image}</span></p>
                    <p><strong>Optimized URL:</strong> <span className="break-all select-none blur-sm">{optimizedImageUrl}</span></p>
                    <p><strong>Image Status:</strong> {imageLoaded ? '✅ Loaded' : imageError ? '❌ Error' : '⏳ Loading'}</p>
                </div>
            </Container>
        </div>
    ) : null;
}
