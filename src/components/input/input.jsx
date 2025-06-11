import React, { useId } from "react";

const Input = React.forwardRef(function Input(
    {
        label,
        type = "text",
        className = "",
        ...props
    },
    ref
) {
    const id = useId();

    return (
        <div className="mb-4">
            {label && (
                <label
                    htmlFor={id}
                    className="block pl-1 mb-1 text-sm font-medium text-white"
                >
                    {label}
                </label>
            )}
            <input
                type={type}
                id={id}
                ref={ref}
                {...props}
                className={`px-4 py-2 rounded-lg bg-white text-black border border-gray-300 
                focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 w-full ${className}`}
            />
        </div>
    );
});

export default Input;
