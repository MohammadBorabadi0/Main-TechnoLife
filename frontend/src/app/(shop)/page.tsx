import { getBanners } from "@/actions/banners";
import { getBrands } from "@/actions/brands";
import { getCategories } from "@/actions/categories";
import { getProducts } from "@/actions/products";
import HomeScreen from "@/screens/shop/HomeScreen";

const HomePage = async () => {
    const { data: products } = await getProducts();
    const { data: brands } = await getBrands();
    const { data: categories } = await getCategories();
    const { data: banners } = await getBanners();

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
