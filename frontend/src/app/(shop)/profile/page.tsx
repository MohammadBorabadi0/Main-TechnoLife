// import ProfileScreen from '@/screens/Profile/ProfileScreen'
// import ProfileMobileScreen from '@/screens/Profile/ProfileMobileScreen'

import { getProducts } from "@/actions/products";
import { getUserProfile } from "@/actions/users";
import ProfileScreen from "@/screens/shop/profile/ProfileScreen";

const ProfilePage = async () => {
    // const { myOrders } = await getMyOrders();
    const { products } = await getProducts();
    const { data: user } = await getUserProfile();

    return (
        <>
            <ProfileScreen user={user} products={products} />
            {/* // <ProfileMobileScreen userProfile={user} /> */}
        </>
    );
};

export default ProfilePage;
