import { Metadata } from "next";
import MyProducts from "./MyProducts";

export const metadata: Metadata = {
	title: "My Products",
};

export default function Page() {
	return <MyProducts />
}
