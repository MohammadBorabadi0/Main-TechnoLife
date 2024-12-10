"use client";

import LatestOrders from "@/components/shop/profile/my-orders/LatestOrders";
// import LatestOrders from '@/components/Profile/LatestOrders'
import { En_To_Fa } from "@/utils/functions";
import { Order, Product, User as UserType } from "@/utils/types";
import { User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC } from "react";

interface IProps {
    user: UserType;
    products: Product[];
}

const ProfileScreen: FC<IProps> = ({ user, products }) => {
    const router = useRouter();

    const myOrders: Order[] = [];

    return (
        <div className="hidden lg:flex flex-col gap-5 text-slate-500 xl:p-10 z-0">
            <div className="flex items-center gap-3">
                <User className="text-RYellow" />
                <h4 className="text-lg text-black font-semibold">
                    مشخصات فردی
                </h4>
            </div>
            <div className="flex items-center gap-10">
                <div className="grid place-items-center relative border shadow-xl min-h-[80px] min-w-[80px] rounded-full text-yellow-custom opacity-80">
                    <User />
                    <span className="h-1 w-10 absolute -left-10 bg-[#f6f6f6]"></span>
                </div>

                <div className="relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 w-full rounded-lg shadow-3xl bg-[#f6f6f6] p-10">
                    <div className="flex flex-col items-center gap-2">
                        <p>نام و نام خانوادگی</p>
                        <p className="text-black font-semibold">
                            {user?.firstName} {user?.lastName}
                        </p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <p>پست الکترونیکی</p>
                        <p className="text-black font-semibold">
                            {user?.email}
                        </p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <p>شماره موبایل</p>
                        <p className="text-black font-semibold">
                            {En_To_Fa(`${user?.mobile || ""}`)}
                        </p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <p>کد ملی</p>
                        <p className="text-black font-semibold">
                            {En_To_Fa(`${user?.nationalCode || ""}`)}
                        </p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <p>دریافت خبرنامه</p>
                        <p className="text-black font-semibold">خیر</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <p>شماره کارت</p>
                        <p className="text-black font-semibold">
                            {En_To_Fa(`${user?.cardNumber || ""}`)
                                .match(/.{1,4}/g)
                                ?.join("-") || ""}
                        </p>
                    </div>
                    <button
                        className="bg-slate-700 text-white text-sm px-4 py-2 rounded absolute left-10 -bottom-5"
                        onClick={() => router.push("/profile/account-info")}
                    >
                        ویرایش اطلاعات
                    </button>
                </div>
            </div>

            <LatestOrders myOrders={myOrders} products={products} />

            {/* Button For Show All Orders  */}
            <div className="flex items-center gap-5">
                <div className="grid place-items-center bg-[#f6f6f6] relative border shadow-xl min-h-[80px] min-w-[80px] rounded-full text-xl font-semibold opacity-80">
                    <span className="text-3xl pb-1 text-black">...</span>
                </div>
                <Link
                    href="/profile/my-orders"
                    className="text-blue-600 text-lg font-semibold"
                >
                    دیدن همه سفارش های من
                </Link>
            </div>
        </div>
    );
};

export default ProfileScreen;
