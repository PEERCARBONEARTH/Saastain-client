import { Metadata } from "next";
import AppDataList from "./_components/AppDataList";

export const metadata: Metadata = {
	title: "Data List",
};

const page = () => {
	return <AppDataList />;
};

export default page;
