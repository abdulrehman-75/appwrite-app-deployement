import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "../index";
import appwriteService from "../../appwrite/configuration";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

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
            if (post) {
                const file = data.image?.[0] ? await appwriteService.uploadFile(data.image[0]) : null;
                if (file) await appwriteService.deleteFile(post.image);

                const updatedPost = await appwriteService.updatePost(post.$id, {
                    title: data.title,
                    content: data.content,
                    status: data.status,
                    featuredImage: file ? file.$id : post.image
                });

                if (updatedPost) navigate(`/post/${updatedPost.$id}`);
            } else {
                const file = await appwriteService.uploadFile(data.image[0]);
                const newPost = await appwriteService.createPost({
                    title: data.title,
                    slug: data.slug,
                    content: data.content,
                    status: data.status,
                    featuredImage: file.$id,
                    userId: userData.$id,
                });

                if (newPost) navigate(`/post/${newPost.$id}`);
            }
        } catch (error) {
            console.error("Error:", error);
            if (error.message.includes("Unknown attribute")) {
                showError("Database schema error. Please check your Appwrite collection.");
            } else if (error.message.includes("Document with the requested ID")) {
                showError("Slug already exists. Try a different title.");
            } else {
                showError("Error: " + error.message);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap p-6 bg-black shadow-lg rounded-xl">
            <div className="w-2/3 px-2">
                <Input
                    label="Title"
                    placeholder="Enter the post title"
                    className="mb-4 text-white bg-black border border-orange-500 focus:ring-orange-500"
                    {...register("title", { required: "Title is required" })}
                />
                {errors.title && <p className="mb-2 text-sm text-orange-500">{errors.title.message}</p>}

                <Input
                    label="Slug"
                    placeholder="Auto-generated slug"
                    className="mb-4 text-white bg-black border border-orange-500 focus:ring-orange-500"
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

            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image"
                    type="file"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    className="mb-4 text-white bg-black border border-orange-500 focus:ring-orange-500"
                    {...register("image", { required: !post ? "Image is required" : false })}
                />
                {errors.image && <p className="mb-2 text-sm text-orange-500">{errors.image.message}</p>}

                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={appwriteService.getFilePreview(post.image)}
                            alt={post.title}
                            className="border border-orange-500 shadow rounded-xl"
                        />
                    </div>
                )}

                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4 text-white bg-black border border-orange-500 focus:ring-orange-500"
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
    );
}
