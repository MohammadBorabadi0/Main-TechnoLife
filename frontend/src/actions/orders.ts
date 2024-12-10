"use server";

import { cookies } from "next/headers";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getOrders = async (
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

        const response = await fetch(
            `${url}/orders?page=${currentPage}&limit=${currentLimit}	${searchQuery}`,
            {
                cache: "no-store",
                headers: { Authorization: `Bearer ${token.value}` },
            }
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const getMyOrders = async () => {
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

        const response = await fetch(`${url}/orders/my`, {
            headers: {
                Authorization: `Bearer ${token.value}`,
            },
        });
        const data = await response.json();
        console.log(data);

        return data;
    } catch (error) {
        console.log(error);
    }
};

export const getOrderById = async (id: string) => {
    try {
        const response = await fetch(`${url}/orders/${id}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const getOrderByOrderCode = async (orderCode: string) => {
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

        const response = await fetch(
            `${url}/orders/order-detail?orderCode=${orderCode}`,
            { headers: { Authorization: `Bearer ${token.value}` } }
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const updateOrderStatus = async (id: string, status: string) => {
    try {
        const response = await fetch(`${url}/orders/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
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

export const deleteOrder = async (id: string) => {
    try {
        const response = await fetch(`${url}/orders/${id}`, {
            method: "DELETE",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};
