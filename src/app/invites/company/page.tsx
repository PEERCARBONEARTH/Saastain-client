import AcceptInvite from "./AcceptInvite";
import AcceptInviteCompanyUserWrapper from "./AcceptInviteCompanyUserWrapper";

export default async function page(
    props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }
) {
    const searchParams = await props.searchParams;
    return (
		<AcceptInviteCompanyUserWrapper>
			<AcceptInvite code={searchParams?.code as string} />
		</AcceptInviteCompanyUserWrapper>
	);
}
