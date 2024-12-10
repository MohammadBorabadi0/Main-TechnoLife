"use client";

import { useUIStore } from "@/stores/useUIStore";
import { FC, ReactNode } from "react";

interface IProps {
    children: ReactNode;
}

const SecondaryShopLayout: FC<IProps> = ({ children }) => {
    const { isNavOpen } = useUIStore();

    return (
        <main
            className={`${
                isNavOpen ? "mt-[134px]" : "mt-85px"
            } transition-all duration-100`}
        >
            {children}
        </main>
    );
};

export default SecondaryShopLayout;
