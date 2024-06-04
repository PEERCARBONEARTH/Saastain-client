import { Metadata } from "next";
import ForgotPassword from "./ForgotPassword";

export const metadata: Metadata = {
	title: "Forgot Password",
};

export default function page() {
	return <ForgotPassword />;
}
