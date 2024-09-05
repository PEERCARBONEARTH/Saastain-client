"use client";

import MyDocusealBuilder from "@/components/my-docuseal/MyDocusealBuilder";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { useRouter } from "next/navigation";
import { FC } from "react";

interface IProps {
	token: string;
}

const SLADocument: FC<IProps> = ({ token }) => {
	const router = useRouter();

	const onSend = () => {
		router.push(`/${AppEnumRoutes.APP_LOAN_PROJECTS}`);
	};

	return token && <MyDocusealBuilder token={token} onSend={onSend} />;
};

export default SLADocument;
