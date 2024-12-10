"use client";

import { En_To_Fa, calculateCartSummary } from "@/utils/functions";
import Link from "next/link";
import CartItemDropdown from "@/components/shop/dropdowns/CartItemDropdown";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { Cart, User } from "@/utils/types";
import { ChevronLeft } from "lucide-react";

interface IProps {
    user: User;
}

const CartDropdown: FC<IProps> = ({ user }) => {
    const cartItems: Cart[] = [];
    const router = useRouter();

    // Local state to ensure rendering happens on the client side
    const [isClient, setIsClient] = useState(false);

    // Ensure this runs only on the client
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Utils
    const { totalPricesAfterDiscount } = calculateCartSummary(cartItems);

    if (!isClient) {
        return null; // Avoid rendering until on client
    }

    // If Cart Items is empty
    if (cartItems.length === 0) {
        return (
            <section className="invisible opacity-0 z-50 text-xs group-hover:opacity-100 group-hover:visible top-12 left-0 flex flex-col gap-2 absolute rounded-full px-3 py-2 w-fit bg-white border shadow-md transition-visible duration-200">
                <p className="flex items-center gap-2 whitespace-nowrap">
                    <span>سبد خرید</span>
                    <span className="text-gray-400">( خالی )</span>
                </p>
            </section>
        );
    }

    // If Cart Items is not empty
    return (
        <section className="invisible opacity-0 z-50 text-xs group-hover:opacity-100 group-hover:visible top-10 left-0 flex flex-col gap-2 absolute rounded-xl px-5 py-3 w-[408px] bg-white border shadow-md transition-visible duration-200">
            <div className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-md">
                <div className="flex items-center gap-2">
                    <span>سبد خرید شما</span>
                    <span className="text-gray-500">
                        {En_To_Fa(`${cartItems.length}`)} عدد کالا
                    </span>
                </div>
                <Link
                    href="/cart"
                    className="flex items-center gap-1 text-blue-600"
                >
                    مشاهده سبد خرید
                    <ChevronLeft />
                </Link>
            </div>
            <div className="flex flex-col gap-5 max-h-96 overflow-y-auto">
                {cartItems.map((cartItem) => (
                    <CartItemDropdown
                        key={cartItem.productId}
                        cartItem={cartItem}
                    />
                ))}
            </div>
            <div className="border-t">
                <button
                    onClick={() => router.push("/cart")}
                    className="flex justify-between w-full text-base rounded-xl py-4 px-10 mt-3 shadow bg-green-custom text-white"
                >
                    {user ? (
                        <span>ثبت سفارش</span>
                    ) : (
                        <span>ورود و ثبت سفارش</span>
                    )}
                    <span>|</span>
                    <span>
                        {En_To_Fa(
                            `${totalPricesAfterDiscount.toLocaleString(
                                "fa-IR"
                            )}`
                        )}{" "}
                        تومان
                    </span>
                </button>
            </div>
        </section>
    );
};

export default CartDropdown;
