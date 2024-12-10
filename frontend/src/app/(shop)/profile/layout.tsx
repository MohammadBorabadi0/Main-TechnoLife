import { getUserProfile } from "@/actions/users";
import Sidebar from "@/components/shop/profile/Sidebar";

export default async function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: user } = await getUserProfile();

    return (
        <div className="py-5 bg-RGray">
            <main className="flex p-5">
                <Sidebar user={user} />
                <div className="bg-white w-full lg:border lg:p-7 overflow-hidden">
                    {children}
                </div>
            </main>
        </div>
    );
}
