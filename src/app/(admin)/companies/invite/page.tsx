import { Metadata } from "next";
import InviteCompanyScreen from "./InviteCompanyScreen";

export const metadata: Metadata = {
    title: "Invite Company"
}

const page = () => {
	return <InviteCompanyScreen />
};

export default page;
