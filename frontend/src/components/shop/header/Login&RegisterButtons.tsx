import CartDropdown from "@/components/shop/dropdowns/CartDropdown";
import Link from "next/link";
import { FC } from "react";
import { User } from "@/utils/types";
import { useRouter } from "next/navigation";
import {
    BoxIcon,
    ChevronLeft,
    Heart,
    LogOut,
    ShoppingCart,
    User2,
    UserPen,
} from "lucide-react";

interface IProps {
    user: User;
}

const LoginAndRegisterButtons: FC<IProps> = ({ user }) => {
    const router = useRouter();

    return (
        <div className="flex items-center gap-5">
            {/* Login and Register Buttons  */}
            {user ? (
                <div className="relative group">
                    <button
                        className="cursor-pointer rounded-lg border px-2 py-2"
                        onClick={() => router.push("/profile")}
                    >
                        <User2 size={20} />
                    </button>
                    {/* <div className="hidden group-hover:flex flex-col gap-2 absolute top-9 whitespace-nowrap -left-2 rounded-xl py-6 w-80 bg-white border shadow-md"> */}
                    <div className="invisible opacity-0 bg-white group-hover:opacity-100 group-hover:visible top-10 left-0 flex flex-col gap-2 absolute whitespace-nowrap rounded-xl py-6 w-80 border shadow-md transition-visible duration-200">
                        <div
                            onClick={() => router.push("/profile")}
                            className="flex justify-between items-center hover:bg-gray-100 transition-all duration-200 cursor-pointer p-4 my-2"
                        >
                            <span>حساب کاربری</span>
                            <span>
                                <ChevronLeft />
                            </span>
                        </div>
                        {user.isAdmin && (
                            <div
                                onClick={() => router.push("/admin")}
                                className="group/item flex justify-between items-center hover:bg-gray-100 transition-all duration-200 cursor-pointer p-4 mt-2"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="group-hover/item:text-RBlue border p-1 rounded-md">
                                        <UserPen />
                                    </span>
                                    <span>ورود به صفحه ادمین</span>
                                </div>
                                <span>
                                    <ChevronLeft />
                                </span>
                            </div>
                        )}
                        <hr />
                        <div className="group/item flex justify-between items-center hover:bg-gray-100 transition-all duration-200 cursor-pointer p-4 mt-2">
                            <div
                                onClick={() =>
                                    router.push(`/profile/my-favorites`)
                                }
                                className="flex items-center gap-2"
                            >
                                <span className="group-hover/item:text-red-600 border p-1 rounded-md">
                                    <Heart />
                                </span>
                                <span>لیست علاقه مندی</span>
                            </div>
                            <span>
                                <ChevronLeft />
                            </span>
                        </div>
                        <div className="group/item flex justify-between items-center hover:bg-gray-100 transition-all duration-200 cursor-pointer p-4">
                            <div
                                className="flex items-center gap-2"
                                onClick={() =>
                                    router.push(`/profile/my-orders`)
                                }
                            >
                                <span className="group-hover/item:text-yellow-600 border p-1 rounded-md">
                                    <BoxIcon />
                                </span>
                                <span>سفارش های من</span>
                            </div>
                            <span>
                                <ChevronLeft />
                            </span>
                        </div>
                        <div className="group/item flex justify-between items-center hover:bg-gray-100 transition-all duration-200 cursor-pointer p-4">
                            <div className="flex items-center gap-2">
                                <span className="group-hover/item:text-red-600 border p-1 rounded-md">
                                    <LogOut />
                                </span>
                                <span>خروج از حساب کاربری</span>
                            </div>
                            <span>
                                <ChevronLeft />
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex gap-4 border border-RYellow rounded-lg py-2 px-4">
                    <Link
                        href="/login"
                        className="border-l border-slate-700 pl-4"
                    >
                        ورود
                    </Link>
                    <Link href="/register">ثبت نام</Link>
                </div>
            )}

            {/* Cart Button  */}
            <div
                className="relative group"
                onClick={() => router.push("/cart")}
            >
                <div className="cursor-pointer rounded-lg border px-2 py-2 w-fit">
                    <ShoppingCart size={20} />
                </div>
                <CartDropdown user={user} />
            </div>
        </div>
    );
};

export default LoginAndRegisterButtons;
