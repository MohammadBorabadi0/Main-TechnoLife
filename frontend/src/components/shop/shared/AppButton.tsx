import React from "react";
import { ButtonVariant } from "@/utils/enums";

interface AppButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    outlined?: boolean;
    children: React.ReactNode;
    size?: "small" | "normal" | "large";
}

const AppButton: React.FC<AppButtonProps> = ({
    variant,
    outlined,
    size = "normal",
    children,
    className,
    ...props
}) => {
    // Function to get background color or border color based on the variant and outlined prop
    const getStyles = (
        variant: AppButtonProps["variant"],
        outlined: boolean
    ) => {
        switch (variant) {
            case "success":
                return outlined
                    ? "border-2 border-RGreen text-RGreen"
                    : "bg-RGreen text-white";
            case "warn":
                return outlined
                    ? "border-2 border-RYellow text-RYellow"
                    : "bg-RYellow text-white";
            case "danger":
                return outlined
                    ? "border-2 border-RRed text-RRed"
                    : "bg-RRed text-white";
            case "info":
                return outlined
                    ? "border-2 border-RBlue text-RBlue"
                    : "bg-RBlue text-white";
            case "secondary":
                return outlined
                    ? "border-2 border-RDarkBlue text-RDarkBlue"
                    : "bg-RDarkBlue text-white";
            case "primary":
                return outlined
                    ? "border border-primary shadow-md"
                    : "bg-primary-foreground";
            default:
                return outlined
                    ? "border-2 border-RSlate text-RSlate"
                    : "bg-RSlate text-white";
        }
    };

    // Function to get size styles
    const getSizeStyles = (size: AppButtonProps["size"]) => {
        switch (size) {
            case "small":
                return "p-2 text-xs";
            case "normal":
                return "px-4 py-2";
            case "large":
                return "px-4 py-4 text-base";
            default:
                return "px-4 py-2 text-base";
        }
    };

    return (
        <button
            className={`relative flex items-center justify-center font-semibold text-base rounded-lg transition duration-200 ease-in-out ${getSizeStyles(
                size
            )} ${getStyles(variant, outlined || false)} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default AppButton;
