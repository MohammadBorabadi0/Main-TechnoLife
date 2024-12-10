"use server";

import { revalidatePath } from "next/cache";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getColors = async (
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
            `${url}/colors?page=${currentPage}&limit=${currentLimit}${searchQuery}`,
            { cache: "no-store" }
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const getColor = async (id: string) => {
    try {
        const response = await fetch(`${url}/colors/${id}`, {
            cache: "no-store",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const createColor = async (formData: FormData) => {
    const name = formData.get("name") as string;
    const code = formData.get("code") as string;

    // Check name is exists
    const checkNameResponse = await fetch(`${url}/colors/exists-name`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
    });

    const { exists: existsName } = await checkNameResponse.json();
    if (existsName) {
        throw new Error("نام رنگ تکراری است");
    }

    // Check code is exists
    const checkCodeResponse = await fetch(`${url}/colors/exists-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
    });

    const { exists: existsCode } = await checkCodeResponse.json();
    if (existsCode) {
        throw new Error("کد رنگ تکراری است");
    }

    const response = await fetch(`${url}/colors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, code }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(
            error.message || "مشکلی به وجود آمد لطفا دوباره امتحان کنید"
        );
    }

    const data = await response.json();
    return data;
};

export const updateColorStatus = async (id: string, value: boolean) => {
    const response = await fetch(`${url}/colors/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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
    revalidatePath("/admin/colors");
    return data;
};

export const updateColor = async (id: string, formData: FormData) => {
    const name = formData.get("name") as string;
    const code = formData.get("code") as string;

    // Check name is exists
    const checkNameResponse = await fetch(`${url}/colors/exists-name`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, id }),
    });

    const { exists: existsName } = await checkNameResponse.json();

    if (existsName) {
        throw new Error("نام رنگ تکراری است");
    }

    // Check code is exists
    const checkCodeResponse = await fetch(`${url}/colors/exists-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, id }),
    });

    const { exists: existsCode } = await checkCodeResponse.json();
    if (existsCode) {
        throw new Error("کد رنگ تکراری است");
    }

    const response = await fetch(`${url}/colors/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, code }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(
            error.message ||
                "مشکلی در ارتباط با سرور به وجود آمد لطفا دوباره امتحان کنید"
        );
    }

    const data = await response.json();
    revalidatePath("/admin/colors");
    return data;
};

export const deleteColor = async (id: string) => {
    try {
        const response = await fetch(`${url}/colors/${id}`, {
            method: "DELETE",
        });
        await response.json();
        revalidatePath("/admin/colors");
    } catch (error) {
        console.log(error);
    }
};
