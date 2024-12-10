"use server";

import { revalidatePath } from "next/cache";
import { uploadFileToSupabase } from "@/utils/functions";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getCategories = async (
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
        `${url}/categories?page=${currentPage}&limit=${currentLimit}${searchQuery}`,
        {
            cache: "no-store",
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(
            error.message ||
                "هنگام ارتباط با سرور مشکلی به وجود آمد لطفا دوباره امتحان کنید."
        );
    }

    const data = await response.json();
    return data;
};

export const getCategory = async (id: string) => {
    const response = await fetch(`${url}/categories/${id}`, {
        cache: "no-store",
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(
            error.message ||
                "هنگام ارتباط با سرور مشکلی به وجود آمد لطفا دوباره امتحان کنید."
        );
    }

    const data = await response.json();
    return data;
};

export const updateCategoryStatus = async (id: string, value: boolean) => {
    const response = await fetch(`${url}/categories/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: value }),
        credentials: "include",
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(
            error.message ||
                "هنگام ارتباط با سرور مشکلی به وجود آمد لطفا دوباره امتحان کنید."
        );
    }
    const data = await response.json();
    revalidatePath("/admin/categories");
    return data;
};

export const createCategory = async (formData: FormData) => {
    const name = formData.get("name");
    const file = formData.get("file");
    const icon = formData.get("icon");

    // Check name is exists
    const checkResponse = await fetch(`${url}/categories/exists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
    });

    const checkData = await checkResponse.json();
    if (checkData.exists) {
        return { message: "نام دسته بندی تکراری است" };
    }

    const imageUrl = await uploadFileToSupabase(file as File, "categories");
    const iconUrl = await uploadFileToSupabase(icon as File, "categories");

    const response = await fetch(`${url}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, imageUrl, iconUrl }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(
            error.message ||
                "هنگام ارتباط با سرور مشکلی به وجود آمد لطفا دوباره امتحان کنید."
        );
    }

    const data = await response.json();
    return data;
};

export const updateCategory = async (formData: FormData, id: string) => {
    const name = formData.get("name");
    const file = formData.get("file");
    const icon = formData.get("icon");

    // Check name is exists
    const checkResponse = await fetch(`${url}/categories/exists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, id }),
    });

    const checkData = await checkResponse.json();
    if (checkData.exists) {
        return { message: "نام دسته بندی تکراری است" };
    }

    const imageUrl = await uploadFileToSupabase(file as File, "categories");
    const iconUrl = await uploadFileToSupabase(icon as File, "categories");

    const response = await fetch(`${url}/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, imageUrl, iconUrl }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(
            error.message ||
                "هنگام ارتباط با سرور مشکلی به وجود آمد لطفا دوباره امتحان کنید."
        );
    }

    const data = await response.json();
    return data;
};

export const deleteCategory = async (id: string) => {
    const response = await fetch(`${url}/categories/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(
            error.message ||
                "هنگام ارتباط با سرور مشکلی به وجود آمد لطفا دوباره امتحان کنید."
        );
    }

    const data = await response.json();
    revalidatePath("/admin/categories");
    return data;
};
