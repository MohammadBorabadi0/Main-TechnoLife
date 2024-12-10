"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { FC, useMemo } from "react";
import { Swiper as SwiperType } from "swiper/types";
import styles from "./SwiperButtons.module.css";

interface SwiperButtonsProps {
    swiperInstance: SwiperType | null;
    prevPosition?: {
        top?: string;
        right?: string;
        left?: string;
        bottom?: string;
    };
    nextPosition?: {
        top?: string;
        right?: string;
        left?: string;
        bottom?: string;
    };
    alwaysVisible?: boolean;
    size?: "small" | "medium" | "large";
    component?: "Billboard" | "Categories" | "ProductList";
    isBeginning?: boolean; // Added property
    isEnd?: boolean; // Added property
}

const SwiperButtons: FC<SwiperButtonsProps> = ({
    swiperInstance,
    prevPosition = {},
    nextPosition = {},
    alwaysVisible = false,
    size = "medium",
    component = "Billboard",
    isBeginning = true,
    isEnd = false,
}) => {
    const goPrev = () => {
        swiperInstance?.slidePrev();
    };

    const goNext = () => {
        swiperInstance?.slideNext();
    };

    const prevPositionStyle = useMemo(
        () => ({
            top: prevPosition.top ?? "auto",
            right: prevPosition.right ?? "auto",
            left: prevPosition.left ?? "auto",
            bottom: prevPosition.bottom ?? "auto",
        }),
        [prevPosition]
    );

    const nextPositionStyle = useMemo(
        () => ({
            top: nextPosition.top ?? "auto",
            right: nextPosition.right ?? "auto",
            left: nextPosition.left ?? "auto",
            bottom: nextPosition.bottom ?? "auto",
        }),
        [nextPosition]
    );

    const buttonSize = useMemo(() => {
        switch (size) {
            case "small":
                return "size-6";
            case "medium":
                return "size-8";
            default:
                return "size-10";
        }
    }, [size]);

    return (
        <div
            className={`hidden lg:flex gap-3 transition-opacity duration-300 ${
                !alwaysVisible ? "opacity-0 group-hover:opacity-100" : ""
            }`}
        >
            <button
                disabled={
                    isEnd &&
                    (component === "Categories" || component === "ProductList")
                }
                onClick={goNext}
                className={`${styles.swiperButton} ${buttonSize}`}
                style={nextPositionStyle}
            >
                <ChevronLeft />
            </button>
            <button
                disabled={
                    isBeginning &&
                    (component === "Categories" || component === "ProductList")
                }
                onClick={goPrev}
                className={`${styles.swiperButton} ${buttonSize}`}
                style={prevPositionStyle}
            >
                <ChevronRight />
            </button>
        </div>
    );
};

export default SwiperButtons;
