const url = process.env.NEXT_PUBLIC_BACKEND_URL;

export const login = async (formData: FormData) => {
    const email = formData.get("email");
    const password = formData.get("password");

    try {
        const response = await fetch(`${url}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: "include",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};
