import { Metadata } from "next";
import VerifyEmail from "./VerifyEmail";

export const metadata: Metadata = {
	title: "Verify Email",
};

const page = ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
	const { token, id } = searchParams;
	return <VerifyEmail token={token as string} id={id as string} />;
};

export default page;
