import { Metadata } from "next";
import VerifyEmail from "./VerifyEmail";
import AppLogo from "@/components/logo/AppLogo";

export const metadata: Metadata = {
	title: "Verify Email",
};

const page = ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
	const { token, id } = searchParams;
	return (
		<>
			<AppLogo />
			<VerifyEmail token={token as string} id={id as string} />
		</>
	);
};

export default page;
