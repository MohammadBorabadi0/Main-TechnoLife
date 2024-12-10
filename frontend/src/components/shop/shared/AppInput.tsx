import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { En_To_Fa } from "@/utils/functions";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    id: string;
    errorMessage?: string;
}

const AppInput: React.FC<InputFieldProps> = ({
    label,
    id,
    type,
    errorMessage,
    className,
    ...rest
}) => {
    const [inputType, setInputType] = useState(type);

    // Toggles the password visibility
    const togglePasswordVisibility = () => {
        setInputType((prevType) =>
            prevType === "password" ? "text" : "password"
        );
    };

    // Set dir attribute based on input type (email or number is LTR, others are RTL)
    const inputDir = type === "email" || type === "number" ? "ltr" : "rtl";

    return (
        <div className={`flex flex-col ${className}`}>
            <label htmlFor={id} className="mb-1 text-sm font-medium">
                {label}
            </label>
            <div className="relative">
                <input
                    id={id}
                    type={inputType}
                    dir={inputDir} // Conditionally setting the text direction
                    className={`border px-3 py-4 rounded-lg w-full focus:outline-RYellow ${
                        errorMessage && "border-red-500"
                    }`}
                    {...rest}
                />
                {type === "password" && (
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                        {inputType === "password" ? <Eye /> : <EyeOff />}
                    </button>
                )}
            </div>
            {errorMessage && (
                <p className="text-red-500 text-xs mt-1">
                    {En_To_Fa(errorMessage)}
                </p>
            )}
        </div>
    );
};

export default AppInput;
