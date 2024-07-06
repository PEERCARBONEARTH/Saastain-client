import { Metadata } from "next";
import ProductDetails from "./ProductDetails";

export const metadata: Metadata = {
	title: "Product Details",
};

export default function Page({ params }: { params: { id: string } }) {
	return <ProductDetails id={params.id} />;
}
