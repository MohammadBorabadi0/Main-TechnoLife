import About from "@/components/shop/footer/About";
import AfterBuying from "@/components/shop/footer/AfterBuying";
import BeforeBuying from "@/components/shop/footer/BeforeBuying";
import BestSellingProducts from "@/components/shop/footer/BestSellingProducts";
import Contact from "@/components/shop/footer/Contact";
import CopyRight from "@/components/shop/footer/CopyRight";
import ENamad from "@/components/shop/footer/ENamad";
import QuickAccess from "@/components/shop/footer/QuickAccess";
import Regulations from "@/components/shop/footer/Regulations";
import SocialNetworks from "@/components/shop/footer/SocialNetworks";
import TechnoLogo from "@/components/shop/footer/TechnoLogo";
import TechnoPay from "@/components/shop/footer/TechnoPay";
import ScrollToTop from "@/components/shop/footer/ScrollToTop";

const Footer = () => {
    return (
        <footer className="bg-RFooter text-white text-sm m-4 mt-20 overflow-hidden rounded-[30px]">
            <div className="flex flex-col gap-10 py-10 px-8 mx-auto">
                {/* First Section  */}
                <div className="flex justify-between items-center py-10 border-b">
                    <TechnoLogo />
                    <ScrollToTop />
                </div>

                {/* Second Section  */}
                <div className="flex justify-between items-center py-10">
                    <Contact />
                    <SocialNetworks />
                    <TechnoPay />
                </div>

                {/* Third Section  */}
                <div className="grid grid-cols-3 xl:grid-cols-6 gap-x-6 gap-y-20 xl:gap-6">
                    <QuickAccess />
                    <BestSellingProducts />
                    <About />
                    <BeforeBuying />
                    <AfterBuying />
                    <Regulations />
                </div>

                {/* Forth Section  */}
                <ENamad />
            </div>
            <CopyRight />
        </footer>
    );
};

export default Footer;
