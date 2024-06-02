import AcceptInvite from "./AcceptInvite";
import AcceptInviteCompanyUserWrapper from "./AcceptInviteCompanyUserWrapper";

export default function page({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
	return (
		<AcceptInviteCompanyUserWrapper>
			<AcceptInvite code={searchParams?.code as string} />
		</AcceptInviteCompanyUserWrapper>
	);
}
