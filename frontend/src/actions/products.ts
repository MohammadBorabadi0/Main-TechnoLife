"use server";

import { uploadFileToSupabase } from "@/utils/functions";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { ProductFormValues } from "@/schemas/admin/productSchema2";

interface ProductImage {
    color: string;
    imageUrl: string | null;
    price: number;
    stock: number;
}

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getProducts(
    page?: number,
    limit?: number,
    search?: string
) {
    const currentPage = page ? page : 1;
    const currentLimit = limit ? limit : 10;
    const searchQuery = search
        ? `&search=${encodeURIComponent(search.trim())}`
        : "";

    const response = await fetch(
        `${url}/products?page=${currentPage}&limit=${currentLimit}${searchQuery}`,
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
}

export const getProductById = async (id: string) => {
    const response = await fetch(`${url}/products/${id}`, {
        cache: "no-store",
    });
    const data = await response.json();
    return data;
};

export const getProductBySlug = async (slug: string) => {
    const response = await fetch(`${url}/products/slug/${slug}`, {
        cache: "no-store",
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

export const createProduct = async (formData: ProductFormValues) => {
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
    const checkResponse = await fetch(`${url}/products/exists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name }),
    });

    const checkData = await checkResponse.json();
    if (checkData.exists) {
        throw new Error("نام محصول تکراری است");
    }

    let productImages: ProductImage[] = [];

    if (formData.images.length > 0) {
        productImages = await Promise.all(
            formData.images.map(async (item) => {
                if (item.file) {
                    const url = await uploadFileToSupabase(
                        item.file as File,
                        "products"
                    );
                    return {
                        color: item.color,
                        imageUrl: url,
                        price: parseFloat(item.price),
                        stock: parseFloat(item.stock),
                    };
                }
                return {
                    color: item.color,
                    imageUrl: null,
                    price: parseFloat(item.price),
                    stock: parseFloat(item.stock),
                };
            })
        );
    }

    const response = await fetch(`${url}/products`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token.value}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...formData,
            stock: +formData.stock,
            basePrice: +formData.basePrice,
            images: productImages,
        }),
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

export const updateProduct = async (
    formData: ProductFormValues,
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
    const checkResponse = await fetch(`${url}/products/exists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, id }),
    });

    const checkData = await checkResponse.json();
    if (checkData.exists) {
        return { message: "نام محصول تکراری است" };
    }

    let productsWithUrls: ProductImage[] = [];

    if (formData.images.length > 0) {
        productsWithUrls = await Promise.all(
            formData.images.map(async (item) => {
                if (item.file) {
                    const url = await uploadFileToSupabase(
                        item.file,
                        "products"
                    );
                    return {
                        color: item.color,
                        imageUrl: url,
                        price: parseFloat(item.price),
                        stock: parseFloat(item.stock),
                    };
                }
                return {
                    color: item.color,
                    imageUrl: null,
                    price: parseFloat(item.price),
                    stock: parseFloat(item.stock),
                };
            })
        );
    }

    const response = await fetch(`${url}/products/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.value}`,
        },
        credentials: "include",
        body: JSON.stringify({
            ...formData,
            basePrice: +formData.basePrice,
            stock: +formData.stock,
            images: productsWithUrls,
        }),
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

export const deleteProduct = async (id: string) => {
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

    const response = await fetch(`${url}/products/${id}`, {
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

    const data = await response.json();
    revalidatePath("/admin/products");
    return data;
};

// Product Status
export const updateProductStatus = async (id: string, value: boolean) => {
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
    const response = await fetch(`${url}/products/${id}/status`, {
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
    revalidatePath("/admin/products");
    return data;
};

// Product Reviews
export const createProductReview = async (formData: FormData, id: string) => {
    const rating = formData.get("rating");
    const comment = formData.get("comment");
    const positivePoints = formData.get("positivePointsString");
    const negativePoints = formData.get("negativePointsString");

    const sendData = {
        rating,
        comment,
        positivePoints,
        negativePoints,
    };

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

    const response = await fetch(`${url}/products/${id}/reviews`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token.value}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(sendData),
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
