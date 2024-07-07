import { Metadata } from "next";
import NewUser from "./NewUser";

export const metadata: Metadata = {
	title: "New User",
};

export default function page() {
	return <NewUser />;
}
