import { Metadata } from "next";
import TimezonesPage from "./TimezonesPage";

export const metadata: Metadata = {
	title: "Timezones",
};

const page = () => {
	return <TimezonesPage />;
};

export default page;
