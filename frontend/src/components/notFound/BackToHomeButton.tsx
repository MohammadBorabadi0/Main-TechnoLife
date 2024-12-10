"use client";

import { useRouter } from "next/navigation";
import AppButton from "../shop/shared/AppButton";

const BackToHomeButton = () => {
    const router = useRouter();

    return (
        <div className="absolute top-[350px]">
            <AppButton
                variant="primary"
                size="large"
                className="w-[356px] h-14"
                onClick={() => router.replace("/")}
            >
                بازگشت به صفحه اصلی
            </AppButton>
        </div>
    );
};

export default BackToHomeButton;
