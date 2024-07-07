import { Metadata } from "next";
import NewProduct from "./NewProduct";

export const metadata: Metadata = {
	title: "New Product",
};

export default function Page() {
	return <NewProduct />;
}
