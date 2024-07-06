import { Metadata } from "next";
import UserWaitlist from "./UserWaitlist";

export const metadata: Metadata = {
	title: "User Waitlist",
};

export default function page() {
	return <UserWaitlist />;
}
