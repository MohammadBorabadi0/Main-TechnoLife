import { FC, useState, useEffect } from "react";
import { Category, SubCategory } from "@/utils/types";
import { useUIStore } from "@/stores/useUIStore";
import FirstMenu from "./FirstMenu";
import SecondMenu from "./SecondMenu";
import ThirdMenu from "./ThirdMenu";
import { X } from "lucide-react";

interface IProps {
    categories: Category[];
}

const Menu: FC<IProps> = ({ categories }) => {
    const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(
        null
    );
    const [hoveredSubCategory, setHoveredSubCategory] =
        useState<SubCategory | null>(null);
    const { isMenuOpen, toggleMenu } = useUIStore();

    const hoveredCategory =
        categories?.find((category) => category.name === hoveredCategoryId) ||
        null;

    useEffect(() => {
        setHoveredSubCategory(null);
    }, [hoveredCategoryId]);

    return (
        <div
            className={`fixed inset-0 bg-black bg-opacity-60 w-full h-screen z-20 ${
                isMenuOpen ? "block" : "hidden"
            }`}
            onClick={() => toggleMenu()}
        >
            <section
                className={`${
                    isMenuOpen ? "flex" : "hidden"
                } fixed top-0 right-0 mt-[134px] h-screen z-30`}
                onClick={(e) => e.stopPropagation()}
            >
                <FirstMenu
                    selectedCategory={hoveredCategory}
                    categories={categories}
                    onHoverCategory={setHoveredCategoryId}
                />
                <SecondMenu
                    category={hoveredCategory}
                    onHoverSubCategory={setHoveredSubCategory}
                />
                <ThirdMenu subCategory={hoveredSubCategory} />
                <button
                    onClick={toggleMenu}
                    className="absolute -left-10 top-5 z-30 text-white"
                >
                    <X />
                </button>
            </section>
        </div>
    );
};

export default Menu;
