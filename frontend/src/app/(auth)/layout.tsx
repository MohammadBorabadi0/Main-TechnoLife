import React, { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";

interface AuthLayoutProps {
    children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        <>
            {children}
            <Toaster />
        </>
    );
};

export default AuthLayout;
