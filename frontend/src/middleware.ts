import { NextRequest, NextResponse } from "next/server";
import { getUserProfile } from "@/actions/users";

export async function middleware(request: NextRequest) {
    const url = request.nextUrl;
    const { data: user } = await getUserProfile();

    // Check if the user is authenticated and if they are an admin
    const isUserAuthenticated = Boolean(user);
    const isAdmin = isUserAuthenticated && user.isAdmin;

    // Redirect unauthenticated users from restricted pages
    if (
        !isUserAuthenticated &&
        (url.pathname === "/checkout" ||
            url.pathname === "/shipment" ||
            url.pathname === "/profile" ||
            url.pathname.startsWith("/admin"))
    ) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Redirect authenticated users without admin privileges from admin pages
    if (isUserAuthenticated && !isAdmin && url.pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Redirect authenticated users away from the login page
    if (isUserAuthenticated && url.pathname === "/login") {
        return NextResponse.redirect(new URL("/", request.url)); // Redirect to homepage or another page as preferred
    }

    return NextResponse.next(); // Allow access to the requested page
}

export const config = {
    matcher: [
        "/checkout",
        "/shipment",
        "/admin/:path*",
        "/login",
        "/profile/:path*",
    ],
};
