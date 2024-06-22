import { Metadata } from "next";
import BoilersAndFurnaces from "./BoilersAndFurnaces";

export const metadata: Metadata = {
	title: "Boilers and Furnaces",
};

export default function Page() {
	return <BoilersAndFurnaces />;
}
