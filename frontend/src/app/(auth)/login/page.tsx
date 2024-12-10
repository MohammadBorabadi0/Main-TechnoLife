"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@/actions/auth";
import React, { useEffect, useState } from "react";
import { LoginFormValues, loginSchema } from "@/schemas/shop/auth/loginSchema";
import { useToast } from "@/hooks/use-toast";
import AppInput from "@/components/shop/shared/AppInput";
import Image from "next/image";
import AppButton from "@/components/shop/shared/AppButton";
import { useRouter } from "next/navigation";
import Logo from "@/components/shop/shared/Logo";

const images = [
    "/images/auth/static_loginBg1.webp",
    "/images/auth/static_loginBg2.webp",
    "/images/auth/static_loginBg3.webp",
];

const LoginPage = () => {
    const { toast } = useToast();
    const router = useRouter();

    const [image, setImage] = useState<string>("");

    // Enable validation on change by setting the mode to "onChange"
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        mode: "onChange",
    });

    const onSubmit = async (data: LoginFormValues) => {
        const formData = new FormData();
        formData.append("email", data.email);
        formData.append("password", data.password);

        try {
            const { success, message } = await login(formData);

            if (success) {
                toast({
                    title: "موفقیت",
                    description: message,
                });
                router.replace("/");
                return;
            }
            toast({
                title: "خطا",
                description: message,
                variant: "destructive",
            });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * images.length);
        setImage(images[randomIndex]);
    }, []);

    return (
        <div className="flex flex-col xl:flex-row h-screen overflow-x-hidden">
            <div className="flex flex-col items-center gap-8 xl:min-w-[450px] xl:w-[452px] h-screen p-10">
                <Logo />

                <div className="flex flex-col items-center gap-8 font-medium">
                    <p className="flex items-center gap-3 xl:gap-4 text-xl">
                        <span>ورود</span>
                        <span className="h-5 w-[1px] bg-gray-700 block"></span>
                        <span>ثبت نام</span>
                    </p>
                    <span>خوش اومدی :)</span>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full space-y-8"
                >
                    {/* Email */}
                    <AppInput
                        label="ایمیل"
                        id="email"
                        type="email"
                        {...register("email")}
                        errorMessage={errors.email?.message}
                    />

                    {/* Password  */}
                    <AppInput
                        label="رمز عبور"
                        id="password"
                        type="password"
                        {...register("password")}
                        errorMessage={errors.password?.message}
                    />

                    <AppButton className="w-full" variant="info" size="large">
                        ورود
                    </AppButton>
                </form>
                <p className="text-xs font-semibold">
                    ثبت نام شما به معنای پذیرش{" "}
                    <span className="text-RBlue">قوانین و مقررات</span> تکنولایف
                    است.
                </p>
            </div>
            {image && (
                <Image
                    src={image}
                    alt="login-image"
                    width={2000}
                    height={2000}
                    className="object-cover h-screen w-full"
                />
            )}
        </div>
    );
};

export default LoginPage;
