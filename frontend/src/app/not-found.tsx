import { getCategories } from "@/actions/categories";
import { getUserProfile } from "@/actions/users";
import BackToHomeButton from "@/components/notFound/BackToHomeButton";
import Footer from "@/components/shop/footer/Footer";
import Header from "@/components/shop/header/Header";
import Image from "next/image";

const NotFound = async () => {
    const { data: user } = await getUserProfile();
    const { categories } = await getCategories();

    return (
        <main className="max-w-screen-2xl mx-auto">
            <Header user={user} categories={categories} />
            <div className="bg-RFooter mt-[150px] min-h-[720px] flex justify-center items-center mx-8 rounded-3xl">
                <div className="grid place-items-center relative">
                    <Image
                        src="/images/static_404.webp"
                        alt="404"
                        width={1400}
                        height={300}
                        className="w-full"
                    />
                    <BackToHomeButton />
                </div>
            </div>
            <Footer />
        </main>
    );
};

export default NotFound;
