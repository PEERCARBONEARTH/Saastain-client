import { Metadata } from "next";
import ClimateRiskAssessment from "./ClimateRiskAssessment";

export const metadata: Metadata = {
	title: "Climate Risk Assessment",
};

const page = () => {
	return <ClimateRiskAssessment />;
};

export default page;
