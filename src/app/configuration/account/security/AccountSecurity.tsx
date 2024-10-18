"use client";

import AuthRedirectComponent from "@/components/auth/AuthRedirectComponent";
import ComingSoon from "@/components/coming-soon";

const AccountSecurity = () => {
	return (
		<AuthRedirectComponent>
			<ComingSoon />
		</AuthRedirectComponent>
	);
};

export default AccountSecurity;
