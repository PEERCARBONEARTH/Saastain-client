import { Metadata } from "next";
import AppSubscriptions from "./AppSubscriptions";

export const metadata: Metadata = {
	title: "Subscriptions",
};

export default function page() {
	return <AppSubscriptions />;
}
