import { Metadata } from "next";
import UserProfile from "./UserProfile";

export const metadata: Metadata = {
	title: "User Profile",
};

export default function page({ params }: { params: { id: string } }) {
	return <UserProfile id={params.id} />;
}
