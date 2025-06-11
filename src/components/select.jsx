import React, { useId } from "react";

const Select = React.forwardRef(({ options, label, className = "", ...props }, ref) => {
    const id = useId();

    return (
        <div>
            {label && <label htmlFor={id} className="block mb-1 font-medium text-black">{label}</label>}
            <select
                {...props}
                id={id}
                ref={ref}
                className={`px-3 py-2 rounded-lg bg-white text-black border border-orange-400 focus:ring-2 focus:ring-orange-600 focus:outline-none w-full ${className}`}
            >
                {options?.map((option) => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
        </div>
    );
});

export default Select;
