import { Metadata } from "next";
import MyProjects from "./MyProjects";

export const metadata: Metadata = {
	title: "My Projects",
};

export default function Page() {
	return <MyProjects />;
}
