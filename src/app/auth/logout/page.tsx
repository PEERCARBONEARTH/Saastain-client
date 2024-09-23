import { Metadata } from "next";
import LogoutPage from "./Logout";

export const metadata: Metadata = {
    title: "Logout"
}

const page = () => {
	return <LogoutPage />
};

export default page;
