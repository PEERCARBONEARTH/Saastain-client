import AuthRedirectComponent from "@/components/auth/AuthRedirectComponent";
import ComingSoon from "@/components/coming-soon";
import AppLayout from "@/layouts/AppLayout";
import { NextPageWithLayout } from "@/types/Layout";
import Head from "next/head";

const notifications: NextPageWithLayout = () => {
	return (
		<AuthRedirectComponent>
			<Head>
				<title>Notifications - SaaStain</title>
			</Head>
			<ComingSoon />;
		</AuthRedirectComponent>
	);
};

notifications.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default notifications;
