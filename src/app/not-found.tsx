import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Not Found",
};

export default function NotFound() {
	return (
		<div className="max-w-screen-xl mx-auto px-4 flex items-center justify-start h-screen md:px-8">
			<div className="max-w-lg mx-auto text-center">
				<div className="pb-6">
					<Link href="/">
						<img src="/images/logo1.png" width={150} className="mx-auto" />
					</Link>
				</div>
				<h3 className="text-gray-800 text-4xl font-semibold sm:text-5xl">Page not found</h3>
				<p className="text-gray-600 mt-3">Sorry, the page you are looking for could not be found or has been removed.</p>
			</div>
		</div>
	);
}
