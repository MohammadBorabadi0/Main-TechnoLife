import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Category } from "@/utils/types";

interface IProps {
    selectedCategory: Category | null;
    categories: Category[];
    onHoverCategory: (category: string | null) => void;
}

const FirstMenu: FC<IProps> = ({
    selectedCategory,
    categories,
    onHoverCategory,
}) => {
    const handleLiMouseEnter = (categoryId: string) => {
        onHoverCategory(categoryId);
    };

    return (
        <section
            className="flex items-center z-20 w-[280px] shadow-3xl bg-white"
            style={{
                height: `calc(100vh - 135px)`,
            }}
        >
            <div
                className="overflow-auto h-[95%] ml-3 pl-3"
                style={{ width: "280px" }}
            >
                <ul className="flex flex-col">
                    {categories?.map((category) => (
                        <li
                            key={category.id}
                            onMouseEnter={() =>
                                handleLiMouseEnter(category.name)
                            }
                            style={{ position: "relative" }}
                        >
                            <Link
                                href="/"
                                className={`relative flex items-center gap-4 px-4 py-3 rounded-l-lg ${
                                    category.id === selectedCategory?.id &&
                                    "bg-blue-50"
                                }`}
                            >
                                <span className="size-9 rounded-full shadow-3xl flex items-center justify-center">
                                    <Image
                                        src={category.iconUrl}
                                        alt={category.name}
                                        width={24}
                                        height={24}
                                        className="w-6 h-6 object-cover"
                                    />
                                </span>
                                <span>{category.name}</span>
                                {category.id === selectedCategory?.id && (
                                    <ChevronLeft
                                        size={18}
                                        className={`absolute left-1 text-RBlue`}
                                    />
                                )}
                            </Link>
                            <hr className="my-1" />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default FirstMenu;
