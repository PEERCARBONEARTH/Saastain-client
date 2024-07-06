import { Metadata } from "next";
import UsersOverview from "./UsersOverview";

export const metadata: Metadata = {
	title: "Users",
};

export default function page() {
	return <UsersOverview />;
}
