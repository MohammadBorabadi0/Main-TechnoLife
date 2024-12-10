import { getBanners } from "@/actions/banners";
import { getBrands } from "@/actions/brands";
import { getCategories } from "@/actions/categories";
import { getProducts } from "@/actions/products";
import HomeScreen from "@/screens/shop/HomeScreen";

const HomePage = async () => {
    const { products } = await getProducts();
    const { brands } = await getBrands();
    const { categories } = await getCategories();
    const { banners } = await getBanners();

    return (
        <HomeScreen
            products={products}
            categories={categories}
            brands={brands}
            banners={banners}
        />
    );
};

export default HomePage;
