import { Metadata } from "next";
import InitAddData from "./InitAddData";

export const metadata: Metadata = {
	title: "Add Data",
};
const page = () => {
	return <InitAddData />;
};

export default page;
