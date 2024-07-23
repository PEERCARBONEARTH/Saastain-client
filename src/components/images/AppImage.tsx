import { Image, ImageProps } from "@nextui-org/react";
import NextImage from "next/image";

export default function AppImage(props: ImageProps) {
	return <Image as={NextImage} {...props} />;
}
