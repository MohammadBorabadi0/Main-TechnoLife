"use server";

import { DiscountFormValues } from "@/schemas/admin/discountSchema";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/discounts`;

export const getDiscounts = async (
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
        `${url}?page=${currentPage}&limit=${currentLimit}${searchQuery}`,
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

export const getDiscountById = async (id: string) => {
    const response = await fetch(`${url}/${id}`, {
        cache: "no-store",
    });
    const data = await response.json();
    return data;
};

export const createDiscount = async (formData: DiscountFormValues) => {
    const cookieStore = await cookies();
    const token = cookieStore.get(
        process.env.NEXT_PUBLIC_ACCESS_TOKEN ?? "access_token"
    );

    if (!token?.value) {
        throw new Error("توکن منقضی شده لطفا مجددا وارد سایت شوید");
    }

    // Check name is exists
    const checkResponse = await fetch(`${url}/exists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name }),
    });

    const checkData = await checkResponse.json();

    if (checkData.exists) {
        throw new Error("نام تخفیف تکراری است");
    }

    const response = await fetch(`${url}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.value}`,
        },
        body: JSON.stringify(formData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(
            error.message ||
                "هنگام ارتباط با سرور مشکلی به وجود آمد لطفا دوباره امتحان کنید."
        );
    }

    const data = await response.json();
    console.log(data);
    return data;
};

export const updateDiscount = async (
    formData: DiscountFormValues,
    id: string
) => {
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

    // Check name is exists
    const checkResponse = await fetch(`${url}/exists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, id }),
    });

    const checkData = await checkResponse.json();
    if (checkData.exists) {
        return { message: "نام تخفیف تکراری است" };
    }

    const response = await fetch(`${url}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.value}`,
        },
        credentials: "include",
        body: JSON.stringify(formData),
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

export const applyDiscount = async (
    discountId: string,
    productId: string,
    imageId: string
) => {
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

    const response = await fetch(`${url}/apply`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.value}`,
        },
        body: JSON.stringify({ productId, imageId, discountId }),
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

export const deleteDiscount = async (id: string) => {
    const cookieStore = await cookies();
    const token = cookieStore.get(
        process.env.NEXT_PUBLIC_ACCESS_TOKEN ?? "access_token"
    );

    if (!token?.value) {
        throw new Error("توکن منقضی شده لطفا مجددا وارد سایت شوید");
    }

    const response = await fetch(`${url}/${id}`, {
        method: "DELETE",
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
};

export const updateDiscountStatus = async (id: string, value: boolean) => {
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
    const response = await fetch(`${url}/${id}/status`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.value}`,
        },
        body: JSON.stringify({ isActive: value }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(
            error.message ||
                "هنگام ارتباط با سرور مشکلی به وجود آمد لطفا دوباره امتحان کنید"
        );
    }

    const data = await response.json();
    revalidatePath("/admin/discounts");
    return data;
};
