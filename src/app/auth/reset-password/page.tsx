import { Metadata } from "next";
import ResetPassword from "./ResetPassword";

export const metadata: Metadata = {
	title: "Reset Password",
}

export default async function page(
    props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }
) {
    const searchParams = await props.searchParams;
    const { token, id } = searchParams;
    return <ResetPassword token={token as string} id={id as string} />;
}
