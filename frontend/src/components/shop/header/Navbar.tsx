import { Menu, Percent } from "lucide-react";
import React, { FC, ReactElement } from "react";
import { useUIStore } from "@/stores/useUIStore";

const navItems: {
    id: number;
    label: string;
    icon: ReactElement;
}[] = [
    { id: 1, label: "دسته بندی محصولات", icon: <Menu /> },
    { id: 2, label: "تکنوآف", icon: <Percent /> },
];

const Navbar: FC = () => {
    const { isNavOpen, isMenuOpen, toggleMenu } = useUIStore();

    return (
        <div
            className={`hidden lg:flex items-center fixed top-[86px] h-12 w-full bg-white z-30 transition duration-100 ${
                isNavOpen ? "border-b" : "-translate-y-full"
            }`}
        >
            <nav className="h-full px-5">
                <ul className="flex items-center gap-10">
                    {navItems.map((item) => (
                        <li
                            key={item.id}
                            className={`flex items-center gap-2 text-RMain cursor-pointer first:hover:text-primary first:hover:bg-blue-50 px-3 py-2 rounded select-none ${
                                item.id === 1 &&
                                isMenuOpen &&
                                "text-primary bg-blue-50"
                            }`}
                            onClick={() => item.id === 1 && toggleMenu()}
                        >
                            <span className="icon">{item.icon}</span>
                            <span className="label">{item.label}</span>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default Navbar;
