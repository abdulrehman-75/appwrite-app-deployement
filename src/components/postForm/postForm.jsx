import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "../index";
import appwriteService from "../../appwrite/configuration";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { uploadImageToCloudinary } from "../../appwrite/claudinaryUpload";

export default function PostForm({ post }) {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        control,
        getValues,
        formState: { errors }
    } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.caption || "",
            status: post?.status || "active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    const slugTransform = useCallback((value) => {
        return value?.trim().toLowerCase()
            .replace(/[^a-zA-Z\d\s]+/g, "-")
            .replace(/\s+/g, "-") || "";
    }, []);

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });
        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    const showError = (message) => alert(message);

    const validateFields = (data) => {
        if (!data.title || !data.slug || !data.content) {
            showError("Please fill in all required fields");
            return false;
        }
        if (!post && (!data.image || !data.image[0])) {
            showError("Please select an image");
            return false;
        }
        if (!userData?.$id) {
            showError("User not authenticated");
            return false;
        }
        return true;
    };

    const submit = async (data) => {
        if (!validateFields(data)) return;

        try {
            let imageUrl = post?.featuredImage;

            if (data.image?.[0]) {
                imageUrl = await uploadImageToCloudinary(data.image[0]);
            }

            if (post) {
                const updatedPost = await appwriteService.updatePost(post.$id, {
                    title: data.title,
                    content: data.content,
                    status: data.status,
                    featuredImage: imageUrl,
                });

                if (updatedPost) navigate(`/post/${updatedPost.$id}`);
            } else {
                const newPost = await appwriteService.createPost({
                    title: data.title,
                    slug: data.slug,
                    content: data.content,
                    status: data.status,
                    featuredImage: imageUrl,
                    userId: userData.$id,
                });

                if (newPost) navigate(`/post/${newPost.$id}`);
            }
        } catch (error) {
            showError("Error: " + error.message);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit(submit)} className="flex flex-wrap p-6 bg-black shadow-lg rounded-xl">
                <div className="w-full px-2 mb-6 md:w-2/3 md:mb-0">
                    <Input
                        label="Title"
                        placeholder="Enter the post title"
                        className="mb-4 text-black bg-black border border-orange-500 focus:ring-orange-500"
                        {...register("title", { required: "Title is required" })}
                    />
                    {errors.title && <p className="mb-2 text-sm text-orange-500">{errors.title.message}</p>}

                    <Input
                        label="Slug"
                        placeholder="Auto-generated slug"
                        className="mb-4 text-black bg-black border border-orange-500 focus:ring-orange-500"
                        {...register("slug", { required: "Slug is required" })}
                        onInput={(e) =>
                            setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true })
                        }
                    />
                    {errors.slug && <p className="mb-2 text-sm text-orange-500">{errors.slug.message}</p>}

                    <RTE
                        label="Content"
                        name="content"
                        control={control}
                        defaultValue={getValues("content")}
                        className="mb-4"
                    />
                    {errors.content && <p className="mb-2 text-sm text-orange-500">{errors.content.message}</p>}
                </div>

                <div className="w-full px-2 md:w-1/3">
                    <Input
                        label="Featured Image"
                        type="file"
                        accept="image/png, image/jpg, image/jpeg, image/gif"
                        className="mb-4 text-black bg-black border border-orange-500 focus:ring-orange-500"
                        {...register("image", { required: !post ? "Image is required" : false })}
                    />
                    {errors.image && <p className="mb-2 text-sm text-orange-500">{errors.image.message}</p>}

                    {post?.featuredImage && (
                        <div className="w-full mb-4">
                            <img
                                src={post.featuredImage}
                                alt={post.title}
                                className="border border-orange-500 shadow rounded-xl"
                            />
                        </div>
                    )}

                    <Select
                        options={["active", "inactive"]}
                        label="Status"
                        className="mb-4 text-black bg-black border border-orange-500 focus:ring-orange-500"
                        {...register("status", { required: "Status is required" })}
                    />
                    {errors.status && <p className="mb-2 text-sm text-orange-500">{errors.status.message}</p>}

                    <Button
                        type="submit"
                        className={`w-full py-2 rounded-xl text-white ${
                            post ? "bg-orange-600 hover:bg-orange-700" : "bg-orange-500 hover:bg-orange-600"
                        }`}
                    >
                        {post ? "Update" : "Submit"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
