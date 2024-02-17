import ComingSoon from "@/components/coming-soon";
import AppLayout from "@/layouts/AppLayout";
import { NextPageWithLayout } from "@/types/Layout";
import Head from "next/head";

const EmissionReports: NextPageWithLayout = () => {
	return (
		<>
			<Head>
				<title>Emission Reports - SaaStain</title>
			</Head>
			<ComingSoon />;
		</>
	);
};

EmissionReports.getLayout = (c) => <AppLayout>{c}</AppLayout>;

export default EmissionReports;
