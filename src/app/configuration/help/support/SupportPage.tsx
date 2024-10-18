"use client";

import AuthRedirectComponent from "@/components/auth/AuthRedirectComponent";
import ComingSoon from "@/components/coming-soon";

const SupportPage = () => {
	return (
		<AuthRedirectComponent>
			<ComingSoon />
		</AuthRedirectComponent>
	);
};

export default SupportPage;
