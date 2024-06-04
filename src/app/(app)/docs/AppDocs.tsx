"use client";

import AuthRedirectComponent from "@/components/auth/AuthRedirectComponent";
import ComingSoon from "@/components/coming-soon";

const AppDocs = () => {
	return (
		<AuthRedirectComponent>
			<ComingSoon />
		</AuthRedirectComponent>
	);
};

export default AppDocs;
