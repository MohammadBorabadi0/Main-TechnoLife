"use client";

import React, { FC, useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import LoginAndRegisterButtons from "./Login&RegisterButtons";
import { Category, User } from "@/utils/types";
import { Search } from "lucide-react";
import Logo from "@/components/shop/logo/Logo";
import Menu from "./menu-wrappers/Menu";
import { useUIStore } from "@/stores/useUIStore";

interface IProps {
    user: User;
    categories: Category[];
}

const Header: FC<IProps> = ({ user, categories }) => {
    const { isNavOpen, setNavOpen, isMenuOpen } = useUIStore();
    const pathname = usePathname();
    const [prevScrollPos, setPrevScrollPos] = React.useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.scrollY;
            if (!isMenuOpen) {
                if (prevScrollPos > currentScrollPos) {
                    setNavOpen(true);
                } else {
                    setNavOpen(false);
                }
            }
            setPrevScrollPos(currentScrollPos);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [prevScrollPos, setNavOpen, isMenuOpen]);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }, [isMenuOpen]);

    return (
        <>
            <header
                className={`hidden ${
                    pathname === "/shipment" || pathname === "/payment"
                        ? "hidden"
                        : "lg:flex"
                } flex-col gap-5 bg-white`}
            >
                <div
                    className={`flex justify-between items-center fixed max-w-screen-3xl px-4 h-[87px] top-0 w-full z-40 bg-white ${
                        !isNavOpen && "border-b"
                    }`}
                >
                    <div className="flex items-center flex-1 gap-8">
                        {/* Logo */}
                        <Logo width={150} height={100} />

                        {/* Search Bar */}
                        <div className="bg-gray-200 text-sm flex items-center gap-5 w-[500px] rounded-lg px-4 py-3">
                            <Search />
                            <input
                                type="search"
                                placeholder="محصول، برند یا دسته موردنظرتان را جستجو کنید"
                                className="bg-transparent placeholder:text-slate-600 text-primary w-full py-1 outline-none"
                            />
                        </div>
                    </div>
                    {/* Login And Register Buttons */}
                    <LoginAndRegisterButtons user={user} />
                </div>
                <Navbar />
            </header>
            <Menu categories={categories} />
        </>
    );
};

export default Header;
