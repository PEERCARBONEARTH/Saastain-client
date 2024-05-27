"use client";

import AuthRedirectComponent from "@/components/auth/AuthRedirectComponent";
import ComingSoon from "@/components/coming-soon";

const NotificationsPage = () => {
	return (
		<AuthRedirectComponent>
			<ComingSoon />
		</AuthRedirectComponent>
	);
};

export default NotificationsPage;
