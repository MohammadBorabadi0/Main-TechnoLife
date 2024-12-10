import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "@/styles/globals.css";
import "swiper/css";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";

const vazir = Vazirmatn({ subsets: ["arabic"] });

export const metadata: Metadata = {
    title: "تکنولایف - فروشگاه اینترنتی موبایل و تکنولوژی",
    description:
        "در فروشگاه آنلاین تکنولایف می توانید به مقایسه و خرید انواع گوشی، لپ تاپ، هدفون، تجهیزات شبکه، گیمینگ، لوازم خانگی و ابزارآلات با گارانتی و ارسال سریع بپردازید.",
};

interface AuthLayoutProps {
    children: ReactNode;
}

const RootLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        <html lang="fa" dir="rtl">
            <head>
                <meta charSet="UTF-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
            </head>
            <body
                className={`${vazir.className}`}
                suppressHydrationWarning={true}
            >
                <main>
                    {children}
                    <Toaster />
                </main>
            </body>
        </html>
    );
};

export default RootLayout;
