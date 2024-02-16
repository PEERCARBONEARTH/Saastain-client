import ComingSoon from "@/components/coming-soon";
import AppLayout from "@/layouts/AppLayout";
import { NextPageWithLayout } from "@/types/Layout";
import Head from "next/head";

const GHGReports: NextPageWithLayout = () => {
	return (
		<>
			<Head>
				<title>GHG Reports - SaaStain</title>
			</Head>
			<ComingSoon />;
		</>
	);
};

GHGReports.getLayout = (c) => <AppLayout>{c}</AppLayout>;

export default GHGReports;
