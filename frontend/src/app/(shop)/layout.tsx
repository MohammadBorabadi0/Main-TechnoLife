import "@/styles/globals.css";
import "swiper/css";
import Header from "@/components/shop/header/Header";
import { getUserProfile } from "@/actions/users";
import { getCategories } from "@/actions/categories";
import SecondaryShopLayout from "@/components/layout/SecondaryShopLayout";
import Footer from "@/components/shop/footer/Footer";
import { ReactNode } from "react";

interface IProps {
    children: ReactNode;
}

const ShopLayout: React.FC<IProps> = async ({ children }) => {
    const { data: user } = await getUserProfile();
    const { categories } = await getCategories();

    return (
        <>
            <Header user={user} categories={categories} />
            <SecondaryShopLayout>{children}</SecondaryShopLayout>
            <Footer />
        </>
    );
};

export default ShopLayout;
