import { Metadata } from "next";
import OrderDetails from "./OrderDetails";

export const metadata: Metadata = {
	title: "Order Details",
};

export default function Page({ params }: { params: { id: string } }) {
	return <OrderDetails id={params.id} />;
}
