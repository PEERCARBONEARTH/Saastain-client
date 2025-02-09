"use client";
import { FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthUtils from "@/hooks/useAuthUtils";
import toast from "react-hot-toast";
import { Spinner } from "@heroui/react";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";

interface IProps {
	token: string;
	id: string;
}

const VerifyEmail: FC<IProps> = ({ token, id }) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const router = useRouter();
	const { verifyEmail } = useAuthUtils();

	useEffect(() => {
		const verifyingEmail = async () => {
			setLoading(true);
			try {
				const response = await verifyEmail(token as string, id as string);
				if (response.status === "success") {
					toast.success("Email Verified successfully, You can now login.");
					router.push(AppEnumRoutes.AUTH_LOGIN);
				} else {
					setError(response.msg);
				}
				setLoading(false);
			} catch (error) {
				setError(error?.response?.data?.msg);
			} finally {
				setLoading(false);
			}
		};
		const timeoutRef = setTimeout(() => {
			verifyingEmail();
		}, 500);
		return () => clearTimeout(timeoutRef);
	}, [token, id]);

	return (
		<div className="flex items-center justify-center h-screen">
			<div className="text-center">
				{!error && (
					<div>
						{loading && <Spinner color="primary" />}
						<h1 className="text-3xl font-bold mb-4">Verifying Email...</h1>
						<p>Please wait while we verify your email</p>
					</div>
				)}
				{error && (
					<div>
						<h1 className="text-3xl font-bold mb-4">Error</h1>
						<p>{error}</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default VerifyEmail;
