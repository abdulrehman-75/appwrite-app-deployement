import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login as authLogin } from "../store/authSlice";
import { Button, Input, Logo } from "./index";
import AuthApp from "../appwrite/auth";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit } = useForm();
    const [error, setError] = useState("");

    const log = async (data) => {
        setError("");
        try {
            const session = await AuthApp.login(data.email, data.password);
            if (session) {
                const userData = await AuthApp.getCurrentAccount();
                if (userData) dispatch(authLogin(userData));
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
                <h2 className="text-2xl font-bold text-center text-orange-500">Sign in to your account</h2>
                <p className="mt-2 text-sm text-center text-gray-300">
                    Don&apos;t have an account?&nbsp;
                    <Link to="/signup" className="text-orange-400 hover:underline">
                        Sign Up
                    </Link>
                </p>
                {error && <p className="mt-4 text-center text-red-500">{error}</p>}
                <form onSubmit={handleSubmit(log)} className="mt-6 space-y-5">
                    <Input
                        label="Email:"
                        placeholder="Enter your email"
                        type="email"
                        className="text-black"
                        {...register("email", {
                            required: true,
                            validate: (value) =>
                                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                "Invalid email address",
                        })}
                    />
                    <Input
                        label="Password:"
                        placeholder="Enter your password"
                        type="password"
                        className="text-black"
                        {...register("password", { required: true })}
                    />
                    <Button type="submit" className="w-full text-white bg-orange-500 hover:bg-orange-600">
                        Sign In
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default Login;
