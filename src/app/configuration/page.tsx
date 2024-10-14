import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Configuration"
}

const Page = () => {
	redirect("/configuration/account")
};

export default Page;
