import { Metadata } from "next";
import WelcomeScreen from "./WelcomeScreen";

export const metadata: Metadata = {
	title: "Welcome",
};

export default function Page() {
	return <WelcomeScreen />;
}
