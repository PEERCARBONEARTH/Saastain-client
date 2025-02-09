import { Metadata } from "next";
import OrderDetails from "./OrderDetails";

export const metadata: Metadata = {
	title: "Order Details",
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    return <OrderDetails id={params.id} />;
}
