import React from "react";

export default function Button({
    children,
    type = "button",
    bgColor = "bg-orange-600",
    textColor = "text-white",
    className = "",
    ...props
}) {
    return (
        <button className={`px-4 py-2 rounded-2xl shadow-md ${bgColor} ${textColor} hover:brightness-110 transition duration-200 ${className}`} type={type} {...props}>
            {children}
        </button>
    );
}