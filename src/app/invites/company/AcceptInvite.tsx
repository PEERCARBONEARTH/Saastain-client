"use client";
import { FC } from "react";
import AcceptUserInviteModal from "@/components/modals/AcceptUserInviteModal";
import { useEffect, useState } from "react";
import useInviteUtils from "@/hooks/useInviteUtils";
import { IInvite, InviteStatus } from "@/types/Invite";
import { Button, Spacer, Spinner } from "@nextui-org/react";
import RejectUserInviteModal from "@/components/modals/RejectUserInviteModal";
import Link from "next/link";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";

interface IProps {
	code: string;
}

const AcceptInvite: FC<IProps> = ({ code }) => {
	const { getInviteInfo } = useInviteUtils();
	const [loading, setLoading] = useState<boolean>(false);
	const [inviteInfo, setInviteInfo] = useState<IInvite>(null);
	const [error, setError] = useState<string | null>(null);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [isRejectModalOpen, setIsRejectModalOpen] = useState<boolean>(false);

	useEffect(() => {
		const fetchInviteInfo = async () => {
			setLoading(true);
			try {
				const response = await getInviteInfo({ code: code as string });
				console.log(response, "response");
				if (response.status === "success") {
					const info = response.data;
					const createdAt = new Date(info.createdAt);
					const expiresAt = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);
					const now = new Date();
					console.log(now, expiresAt, now < expiresAt, "date");

					if (expiresAt < now) {
						setError("Invite has expired");
						return;
					}
					setInviteInfo(response.data);
				} else {
					setError(response.msg);
				}
			} catch (err) {
				setError(err?.response?.data?.msg || err.message || "An error occurred");
			} finally {
				setLoading(false);
			}
		};
		const timer = setTimeout(() => {
			fetchInviteInfo();
		}, 500);
		return () => clearTimeout(timer);
	}, [code]);

	const handleAcceptInviteClick = () => {
		setIsModalOpen(true);
	};
	const handleRejectInviteClick = () => {
		setIsRejectModalOpen(true);
	};

	return (
		<div className="container  w-full md:w-5/6   my-auto p-4 md:p-8 mt-12 md:mt-24">
			{error && (
				<div className="space-y-2">
					<h3 className="text-danger font-semibold">Error</h3>
					<p className="text-danger">{error}</p>
					<p>Please Contact your Admin for further assistance</p>
				</div>
			)}
			{loading && (
				<div className="flex items-center space-x-3">
					<Spinner size="lg" />
					<p>Loading...</p>
				</div>
			)}
			{inviteInfo && inviteInfo.status === InviteStatus.PENDING && (
				<>
					<h1 className="text-2xl font-bold">Accept Invite</h1>
					<p>
						You have been Invite to join <span className="font-bold ">{inviteInfo?.company?.companyName}</span> as <span className="font-bold">{inviteInfo?.userRole}</span>. Please Accept the Invite and set
						your password or reject the invite{" "}
					</p>
					<Spacer y={4} />
					<div className="flex items-center space-x-5">
						<Button color="danger" variant="bordered" onClick={handleRejectInviteClick}>
							Reject Invite
						</Button>
						<Button color="primary" onClick={handleAcceptInviteClick}>
							Accept Invite
						</Button>
						<AcceptUserInviteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} setIsOpen={setIsModalOpen} inviteInfo={inviteInfo} />

						<RejectUserInviteModal isOpen={isRejectModalOpen} onClose={() => setIsRejectModalOpen(false)} setIsOpen={setIsRejectModalOpen} inviteInfo={inviteInfo} />
					</div>
				</>
			)}
			{inviteInfo && inviteInfo.status === InviteStatus.ACCEPTED && (
				<>
					<h1 className="text-2xl font-bold">Invite already accepted</h1>
					<Spacer y={4} />
					<Button as={Link} href={AppEnumRoutes.AUTH_LOGIN}>
						Proceed to Login
					</Button>
				</>
			)}
			{inviteInfo && inviteInfo.status === InviteStatus.REVOKED && (
				<>
					<h1 className="text-2xl font-bold">Invite revoked</h1>
					<Spacer y={4} />
					<p>Please Contact your Admin for further assistance</p>
				</>
			)}
		</div>
	);
};

export default AcceptInvite;
