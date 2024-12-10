import { FC } from "react";
import Image from "next/image";
import Link from "next/link";

interface IProps {
    width?: number;
    height?: number;
}

const Logo: FC<IProps> = ({ width = 184, height = 50 }) => {
    return (
        <Link href="/">
            <Image
                src="/images/static_logo_techno.svg"
                alt="لگوگ"
                width={width}
                height={height}
            />
        </Link>
    );
};

export default Logo;
