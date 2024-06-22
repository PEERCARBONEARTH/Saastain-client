import { Metadata } from "next";
import ResetPassword from "./ResetPassword";

export const metadata: Metadata = {
	title: "Reset Password",
}

export default function page({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
	const { token, id } = searchParams;
	return <ResetPassword token={token as string} id={id as string} />;
}
