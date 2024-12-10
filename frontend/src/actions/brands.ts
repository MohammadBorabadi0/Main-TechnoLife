"use server";

import { uploadFileToSupabase } from "@/utils/functions";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getBrands = async (
    page?: number,
    limit?: number,
    search?: string
) => {
    try {
        const currentPage = page ? page : 1;
        const currentLimit = limit ? limit : 10;
        const searchQuery = search
            ? `&search=${encodeURIComponent(search.trim())}`
            : "";

        const response = await fetch(
            `${url}/brands?page=${currentPage}&limit=${currentLimit}${searchQuery}`,
            { cache: "no-store" }
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const getBrand = async (id: string) => {
    try {
        const response = await fetch(`${url}/brands/${id}`, {
            cache: "no-store",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const createBrand = async (formData: FormData) => {
    const cookieStore = await cookies();
    const token = cookieStore.get(
        process.env.NEXT_PUBLIC_ACCESS_TOKEN ?? "access_token"
    );

    if (!token?.value) {
        throw new Error("توکن منقضی شده لطفا مجددا وارد سایت شوید");
    }

    const name = formData.get("name");

    const checkResponse = await fetch(`${url}/brands/exists`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.value}`,
        },
        body: JSON.stringify({ name }),
    });

    const checkData = await checkResponse.json();
    if (checkData.exists) {
        throw new Error("نام برند تکراری است.");
    }

    const uploadedFiles: {
        imageUrl: string | null;
        category: string;
        isBest: boolean;
    }[] = [];
    let index = 0;

    while (true) {
        const file = formData.get(`categories[${index}][file]`) as File | null;
        const category = formData.get(
            `categories[${index}][category]`
        ) as string;
        const isBest = formData.get(`categories[${index}][isBest]`) as string;

        if (!category) break;

        let imageUrl: string | null = null;
        if (file) {
            imageUrl = await uploadFileToSupabase(file, "brands");
            if (!imageUrl) {
                throw new Error("خطا در بارگذاری فایل");
            }
        }

        uploadedFiles.push({
            imageUrl,
            category,
            isBest: Boolean(isBest),
        });

        index++;
    }

    const response = await fetch(`${url}/brands`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.value}`,
        },
        body: JSON.stringify({ name, categories: uploadedFiles }),
    });

    if (!response.ok) {
        const errors = await response.json();
        throw new Error(errors.message);
    }

    const data = await response.json();
    return data;
};

// export const createBrand = async (formData: FormData) => {
//     const cookieStore = await cookies();
//     const token = cookieStore.get(
//         process.env.NEXT_PUBLIC_ACCESS_TOKEN ?? "access_token"
//     );

//     if (!token?.value) {
//         throw new Error("توکن منقضی شده لطفا مجددا وارد سایت شوید");
//     }

//     const brandData = [];

//     const name = formData.get("name");
//     const files = formData.getAll("file");
//     const bests = formData.getAll("isBest");
//     const categories = formData.getAll("category");

//     const checkResponse = await fetch(`${url}/brands/exists`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name }),
//     });

//     const checkData = await checkResponse.json();
//     if (checkData.exists) {
//         throw new Error("نام برند تکراری است.");
//     }

//     for (let i = 0; i < categories.length; i++) {
//         const file = files[i];
//         const isBest = bests[i] === "true";
//         const categoryId = categories[i];

//         if (isBest && !file) {
//             throw new Error(
//                 `برای برند در دسته‌بندی ${categoryId} که به عنوان بهترین انتخاب شده است، تصویر باید ارسال شود.`
//             );
//         }

//         const imageUrl: File | null = null;

//         // Upload File To Supabase And Get Url
//         if (file) await uploadFileToSupabase(file as File, "brands");

//         brandData.push({
//             imageUrl,
//             isBest,
//             categoryId,
//         });
//     }

//     const response = await fetch(`${url}/brands`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token.value}`,
//         },
//         body: JSON.stringify({ name, categories: brandData }),
//     });

//     if (!response.ok) {
//         const errors = await response.json();
//         throw new Error(errors.message);
//     }

//     const data = await response.json();
//     return data;
// };

export const deleteBrand = async (id: string) => {
    try {
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

        const response = await fetch(`${url}/brands/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token.value}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "An unknown error occurred");
        }

        const data = await response.json();
        revalidatePath("/admin/brands");
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
};

export const updateBrand = async (formData: FormData, id: string) => {
    try {
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

        const brandData = [];

        const name = formData.get("name");
        const files = formData.getAll("file");
        const bests = formData.getAll("isBest");
        const categories = formData.getAll("category");

        // Check name is exists
        const checkResponse = await fetch(`${url}/brands/exists`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, id }),
        });

        const checkData = await checkResponse.json();
        if (checkData.exists) {
            return { message: "نام دسته بندی تکراری است" };
        }

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const isBest = bests[i] === "true";
            const categoryId = categories[i];

            // Upload File To Supabase And Get Url
            const imageUrl = await uploadFileToSupabase(file as File, "brands");

            brandData.push({
                imageUrl,
                isBest,
                categoryId,
            });
        }

        const response = await fetch(`${url}/brands/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token.value}`,
            },
            body: JSON.stringify({ name, categories: brandData }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "An unknown error occurred");
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.log(error);
    }
};
