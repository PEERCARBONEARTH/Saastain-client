import { Metadata } from "next";
import MyProfile from "./MyProfile";

export const metadata: Metadata = {
	title: "My Profile",
};

export default function page() {
	return <MyProfile />;
}
