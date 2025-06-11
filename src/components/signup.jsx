import React, { useState } from "react";
import AuthApp from "../appwrite/auth";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../store/authSlice";
import { Button, Input, Logo } from "./index";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

function Signup() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState("");
    const { register, handleSubmit } = useForm();

    const create = async (data) => {
        setError("");
        try {
            const userData = await AuthApp.createAccount(data.email, data.password, data.name);
            if (userData) {
                const currentUser = await AuthApp.getCurrentAccount();
                if (currentUser) dispatch(login(currentUser));
                navigate("/");
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-400">
            <div className="w-full max-w-lg p-10 mx-auto text-white bg-black border border-orange-500 shadow-xl rounded-xl">
                <div className="flex justify-center mb-4">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>
                <h2 className="text-2xl font-bold text-center text-orange-500">Sign up to create account</h2>
                <p className="mt-2 text-sm text-center text-gray-300">
                    Already have an account?&nbsp;
                    <Link to="/login" className="text-orange-400 hover:underline">
                        Sign In
                    </Link>
                </p>
                {error && <p className="mt-4 text-center text-red-500">{error}</p>}
                <form onSubmit={handleSubmit(create)} className="mt-6 space-y-5">
                    <Input
                        label="Full Name:"
                        placeholder="Enter your full name"
                        className="text-black"
                        {...register("name", { required: true })}
                    />
                    <Input
                        label="Email:"
                        placeholder="Enter your email"
                        type="email"
                        className="text-black"
                        {...register("email", { required: true })}
                    />
                    <Input
                        label="Password:"
                        type="password"
                        placeholder="Enter your password"
                        className="text-black"
                        {...register("password", { required: true })}
                    />
                    <Button type="submit" className="w-full text-white bg-orange-500 hover:bg-orange-600">
                        Create Account
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default Signup;
