import { Metadata } from "next";
import UserProfile from "./UserProfile";

export const metadata: Metadata = {
	title: "User Profile",
};

export default async function page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    return <UserProfile id={params.id} />;
}
