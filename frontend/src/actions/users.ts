"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { uploadFileToSupabase } from "@/utils/functions";

const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth`;

export async function getUsers(page?: number, limit?: number, search?: string) {
    const currentPage = page || 1;
    const currentLimit = limit || 10;
    const searchQuery = search
        ? `&search=${encodeURIComponent(search.trim())}`
        : "";

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

    try {
        const res = await fetch(
            `${url}/users?page=${currentPage}&limit=${currentLimit}${searchQuery}`,
            {
                headers: { Authorization: `Bearer ${token.value}` },
                cache: "no-store",
            }
        );

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
}

export const getUserProfile = async () => {
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

    const response = await fetch(`${url}/users/profile`, {
        headers: {
            Authorization: `Bearer ${token.value}`,
        },
    });
    const data = await response.json();
    return data;
};

export const getUser = async (id: string) => {
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

        const response = await fetch(`${url}/users/${id}`, {
            cache: "no-store",
            headers: {
                Authorization: `Bearer ${token.value}`,
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const deleteUser = async (id: string) => {
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

        const response = await fetch(`${url}/user/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token.value}` },
        });
        const data = await response.json();
        revalidatePath("/users");
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const updateUser = async (formData: FormData, id: string) => {
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email");
    const isAdmin = formData.get("isAdmin");
    const avatar = formData.get("avatar");

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

    let avatarUrl = null;

    if (avatar instanceof File) {
        const folder = "users";
        avatarUrl = await uploadFileToSupabase(avatar, folder);
    }

    const userData = {
        firstName,
        lastName,
        email,
        isAdmin: Boolean(isAdmin) ?? false,
        avatar: avatarUrl ?? "",
    };

    const response = await fetch(`${url}/users/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.value}`,
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "An unknown error occurred");
    }

    const data = await response.json();
    revalidatePath("/admin/users");
    return data;
};
