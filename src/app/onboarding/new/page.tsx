import { Metadata } from "next";
import LoginPage from "./Login";

export const metadata: Metadata = {
	title: "New Onboarding",
};

const page = () => {
	return <div>
		<LoginPage/>
	</div>;
};

export default page;
