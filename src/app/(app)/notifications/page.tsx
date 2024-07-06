import { Metadata } from "next";
import AppNotifications from "./AppNotifications";

export const metadata: Metadata = {
	title: "Notifications",
};

export default function page() {
	return <AppNotifications />;
}
