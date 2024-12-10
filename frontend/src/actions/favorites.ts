"use server";

import { cookies } from "next/headers";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getFavorites = async () => {
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

        const response = await fetch(`${url}/favorites`, {
            cache: "no-store",
            credentials: "include",
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

export const addProductToFavorites = async (productId: string) => {
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

        const response = await fetch(`${url}/favorites`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token.value}`,
            },
            body: JSON.stringify({ productId }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "An unknown error occurred");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const removeProductFromFavorites = async (productId: string) => {
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

        const response = await fetch(`${url}/favorites/${productId}`, {
            method: "DELETE",
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
