import { Metadata } from "next";
import FugitiveEmission from "./AddFugitiveEmissions";

export const metadata: Metadata = {
	title: "Fugitive Emissions",
};

const page = () => {
	return <FugitiveEmission />;
};

export default page;
