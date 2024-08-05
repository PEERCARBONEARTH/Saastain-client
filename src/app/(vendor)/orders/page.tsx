import { Metadata } from "next";
import MyOrders from "./MyOrders";

export const metadata: Metadata = {
	title: "MyOrders",
};

export default function page() {
	return <MyOrders />
}
