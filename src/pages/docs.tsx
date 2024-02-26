import AuthRedirectComponent from "@/components/auth/AuthRedirectComponent";
import ComingSoon from "@/components/coming-soon";
import AppLayout from "@/layouts/AppLayout";
import { NextPageWithLayout } from "@/types/Layout";
import Head from "next/head";

const AppDocs: NextPageWithLayout = () => {
	return (
		<AuthRedirectComponent>
			<Head>
				<title>Docs - SaaStain</title>
			</Head>
			<ComingSoon />
		</AuthRedirectComponent>
	);
};

AppDocs.getLayout = (c) => <AppLayout>{c}</AppLayout>;

export default AppDocs;
