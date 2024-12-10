import { FC } from "react";

interface SwiperBulletsProps {
    totalSlides: number;
    activeIndex: number;
    goToSlide: (index: number) => void;
    positionStyle: React.CSSProperties;
}

const SwiperBullets: FC<SwiperBulletsProps> = ({
    totalSlides,
    activeIndex,
    goToSlide,
    positionStyle,
}) => {
    return (
        <div
            className="flex items-center gap-1 lg:gap-3 absolute"
            style={positionStyle}
        >
            {Array.from({ length: totalSlides }, (_, index) => (
                <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`size-1 lg:size-1.5 z-10 block rounded-full ${
                        index === activeIndex
                            ? "bg-white shadow-3xl h-3 lg:h-4 transition-all duration-200"
                            : "bg-slate-500"
                    }`}
                ></button>
            ))}
        </div>
    );
};

export default SwiperBullets;
