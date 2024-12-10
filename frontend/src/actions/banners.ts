"use server";

import { revalidatePath } from "next/cache";
import { uploadFileToSupabase } from "@/utils/functions";
import { cookies } from "next/headers";

const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/banners`;

export const getBanners = async (
    page?: number,
    limit?: number,
    search?: string
) => {
    const currentPage = page ? page : 1;
    const currentLimit = limit ? limit : 10;
    const searchQuery = search
        ? `&search=${encodeURIComponent(search.trim())}`
        : "";

    const response = await fetch(
        `${backendUrl}?page=${currentPage}&limit=${currentLimit}${searchQuery}`,
        {
            cache: "no-store",
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(
            error.message ||
                "هنگام ارتباط با سرور مشکلی به وجود آمد لطفا دوباره امتحان کنید"
        );
    }

    const data = await response.json();
    return data;
};

export const getBanner = async (id: string) => {
    const cookieStore = await cookies();
    const token = cookieStore.get(
        process.env.NEXT_PUBLIC_ACCESS_TOKEN ?? "access_token"
    );

    if (!token?.value) {
        return {
            success: false,
            message: "توکن منقضی شده لطفا مجددا وارد سایت شوید",
        };
    }

    const response = await fetch(`${backendUrl}/${id}`, {
        cache: "no-store",
        headers: {
            Authorization: `Bearer ${token.value}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(
            error.message ||
                "هنگام ارتباط با سرور مشکلی به وجود آمد لطفا دوباره امتحان کنید"
        );
    }

    const data = await response.json();
    return data;
};

export const createBanner = async (formData: FormData) => {
    const cookieStore = await cookies();
    const token = cookieStore.get(
        process.env.NEXT_PUBLIC_ACCESS_TOKEN ?? "access_token"
    );

    if (!token?.value) {
        return {
            success: false,
            message: "توکن منقضی شده لطفا مجددا وارد سایت شوید",
        };
    }

    const name = formData.get("name") as string;
    const url = formData.get("url") as string;
    const selectedLocationBanner = formData.get(
        "selectedLocationBanner"
    ) as string;
    const imageFile = formData.get("imageFile") as File | null;
    const mobileImageFile = formData.get("mobileImageFile") as File | null;

    if (!name) {
        return { success: false, message: "نام بنر الزامی است" };
    }

    if (!url) {
        return { success: false, message: "لینک بنر الزامی است" };
    }

    if (!selectedLocationBanner) {
        return { success: false, message: "محل نمایش بنر الزامی است" };
    }

    if (!imageFile) {
        return { success: false, message: "تصویر بنر الزامی است" };
    }

    let imageUrl = null;
    let mobileImageUrl = null;

    if (imageFile) {
        imageUrl = await uploadFileToSupabase(imageFile, "banners");
    }

    if (mobileImageFile) {
        mobileImageUrl = await uploadFileToSupabase(mobileImageFile, "banners");
    }

    // Construct the data object with the uploaded URLs and other form data
    const bannerData = {
        name,
        url,
        selectedLocationBanner,
        imageUrl,
        mobileImageUrl,
    };

    const response = await fetch(`${backendUrl}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.value}`,
        },
        body: JSON.stringify(bannerData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(
            error.message ||
                "هنگام ارتباط با سرور مشکلی به وجود آمد لطفا دوباره امتحان کنید"
        );
    }

    const data = await response.json();
    return data;
};

export const updateBannerStatus = async (id: string, value: boolean) => {
    const cookieStore = await cookies();
    const token = cookieStore.get(
        process.env.NEXT_PUBLIC_ACCESS_TOKEN ?? "access_token"
    );

    if (!token?.value) {
        return {
            success: false,
            message: "توکن منقضی شده لطفا مجددا وارد سایت شوید",
        };
    }

    const response = await fetch(`${backendUrl}/${id}/status`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.value}`,
        },
        body: JSON.stringify({ isActive: value }),
        credentials: "include",
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(
            error.message ||
                "هنگام ارتباط با سرور مشکلی به وجود آمد لطفا دوباره امتحان کنید"
        );
    }

    const data = await response.json();
    revalidatePath("/admin/banners");
    return data;
};

export const updateBanner = async (id: string, formData: FormData) => {
    const cookieStore = await cookies();
    const token = cookieStore.get(
        process.env.NEXT_PUBLIC_ACCESS_TOKEN ?? "access_token"
    );

    if (!token?.value) {
        return {
            success: false,
            message: "توکن منقضی شده لطفا مجددا وارد سایت شوید",
        };
    }

    const name = formData.get("name") as string;
    const url = formData.get("url") as string;
    const selectedLocationBanner = formData.get(
        "selectedLocationBanner"
    ) as string;
    const imageFile = formData.get("imageFile") as File | null;
    const mobileImageFile = formData.get("mobileImageFile") as File | null;

    if (!url) {
        return { success: false, message: "لینک بنر الزامی است" };
    }

    if (!selectedLocationBanner) {
        throw new Error("محل نمایش بنر الزامی است.");
    }

    if (!imageFile) {
        throw new Error("تصویر بنر الزامی است");
    }

    let imageUrl = null;
    let mobileImageUrl = null;

    if (imageFile) {
        imageUrl = await uploadFileToSupabase(imageFile, "banners");
    }

    if (mobileImageFile) {
        mobileImageUrl = await uploadFileToSupabase(mobileImageFile, "banners");
    }

    const bannerData = {
        name,
        url,
        selectedLocationBanner,
        imageUrl,
        mobileImageUrl,
    };

    const response = await fetch(`${backendUrl}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.value}`,
        },
        body: JSON.stringify(bannerData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(
            error.message ||
                "هنگام ارتباط با سرور مشکلی به وجود آمد لطفا دوباره امتحان کنید"
        );
    }

    const data = await response.json();
    return data;
};

export const deleteBanner = async (id: string) => {
    const cookieStore = await cookies();
    const token = cookieStore.get(
        process.env.NEXT_PUBLIC_ACCESS_TOKEN ?? "access_token"
    );

    if (!token?.value) {
        return {
            success: false,
            message: "توکن منقضی شده لطفا مجددا وارد سایت شوید",
        };
    }

    const response = await fetch(`${backendUrl}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token.value}` },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(
            error.message ||
                "هنگام ارتباط با سرور مشکلی به وجود آمد لطفا دوباره امتحان کنید"
        );
    }

    const data = await response.json();
    revalidatePath("/admin/banners");
    return data;
};
