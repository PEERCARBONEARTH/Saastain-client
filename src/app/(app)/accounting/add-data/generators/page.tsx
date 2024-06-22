import { Metadata } from "next";
import GeneratorsAddData from "./GeneratorsAddData";

export const metadata: Metadata = {
	title: "Generators Add Data",
};

export default function Page() {
	return <GeneratorsAddData />;
}
