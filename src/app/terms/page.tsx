import MainLayout from "@/layouts/MainLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Terms of Service",
};

const page = () => {
	return (
		<MainLayout>
			<h1 className="text-5xl font-bold text-center pt-3">Terms of Service</h1>
			<div className="mt-5 text-gray-800 p-10 md:p-24 xl:p-16">
				<p>
					The website located at{" "}
					<a className="text-primary underline" href="https://carbon.saastain.app">
						https://carbon.saastain.app
					</a>{" "}
					(the “Site”) is a copyrighted work belonging to Peercarbon Earth, Inc. (“Company”, “us”, “our”, and “we”). Certain features of the Site may be subject to additional guidelines, terms, or rules, which
					will be posted on the Site in connection with such features. All such additional terms, guidelines, and rules are incorporated by reference into these Terms.
				</p>
				<br />
				<p>
					THESE TERMS OF USE (THESE “TERMS”) SET FORTH THE LEGALLY BINDING TERMS AND CONDITIONS THAT GOVERN YOUR USE OF THE SITE. BY ACCESSING OR USING THE SITE, YOU ARE ACCEPTING THESE TERMS (ON BEHALF OF
					YOURSELF OR THE ENTITY THAT YOU REPRESENT), AND YOU REPRESENT AND WARRANT THAT YOU HAVE THE RIGHT, AUTHORITY, AND CAPACITY TO ENTER INTO THESE TERMS (ON BEHALF OF YOURSELF OR THE ENTITY THAT YOU
					REPRESENT). YOU MAY NOT ACCESS OR USE THE SITE OR ACCEPT THE TERMS IF YOU ARE NOT AT LEAST 18 YEARS OLD. IF YOU DO NOT AGREE WITH ALL OF THE PROVISIONS OF THESE TERMS, DO NOT ACCESS AND/OR USE THE
					SITE.
				</p>
				<br />
				<p>
					PLEASE BE AWARE THAT SECTION 10.2 CONTAINS PROVISIONS GOVERNING HOW TO RESOLVE DISPUTES BETWEEN YOU AND COMPANY. AMONG OTHER THINGS, SECTION 10.2 INCLUDES AN AGREEMENT TO ARBITRATE WHICH REQUIRES,
					WITH LIMITED EXCEPTIONS, THAT ALL DISPUTES BETWEEN YOU AND US SHALL BE RESOLVED BY BINDING AND FINAL ARBITRATION. SECTION 10.2 ALSO CONTAINS A CLASS ACTION AND JURY TRIAL WAIVER. PLEASE READ SECTION
					10.2 CAREFULLY.
				</p>
				<br />
				<p>
					UNLESS YOU OPT OUT OF THE AGREEMENT TO ARBITRATE WITHIN 30 DAYS: (1) YOU WILL ONLY BE PERMITTED TO PURSUE DISPUTES OR CLAIMS AND SEEK RELIEF AGAINST US ON AN INDIVIDUAL BASIS, NOT AS A PLAINTIFF OR
					CLASS MEMBER IN ANY CLASS OR REPRESENTATIVE ACTION OR PROCEEDING AND YOU WAIVE YOUR RIGHT TO PARTICIPATE IN A CLASS ACTION LAWSUIT OR CLASS-WIDE ARBITRATION; AND (2) YOU ARE WAIVING YOUR RIGHT TO
					PURSUE DISPUTES OR CLAIMS AND SEEK RELIEF IN A COURT OF LAW AND TO HAVE A JURY TRIAL.
				</p>
				<br />
				<h1 className="text-xl font-semibold">1. Accounts</h1>
				<div className="pl-5">
					<div className="mt-5">
						<h1 className="text-lg font-semibold">
							1.1 Account Creation:{" "}
							<span className="font-normal text-base">
								<p>
									In order to use certain features of the Site, you must register for an account (“<span className="font-semibold">“Account”</span>) and provide certain information about yourself as
									prompted by the account registration form. You represent and warrant that: (a) all required registration information you submit is truthful and accurate; (b) you will maintain the
									accuracy of such information. You may delete your Account at any time, for any reason, by following the instructions on the Site. Company may suspend or terminate your Account in
									accordance with Section 8.
								</p>
							</span>
						</h1>
					</div>
					<div className="mt-5">
						<h1 className="text-lg font-semibold">
							1.1 Account Creation:{" "}
							<span className="font-normal text-base">
								<p>
									In order to use certain features of the Site, you must register for an account (“<span className="font-semibold">“Account”</span>) and provide certain information about yourself as
									prompted by the account registration form. You represent and warrant that: (a) all required registration information you submit is truthful and accurate; (b) you will maintain the
									accuracy of such information. You may delete your Account at any time, for any reason, by following the instructions on the Site. Company may suspend or terminate your Account in
									accordance with Section 8.
								</p>
							</span>
						</h1>
					</div>
				</div>
			</div>
		</MainLayout>
	);
};

export default page;
