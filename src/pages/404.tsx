import Head from "next/head";

const NotFound = () => {
	return (
		<div className="max-w-screen-xl mx-auto px-4 flex items-center justify-start h-screen md:px-8">
            <Head>
                <title>Not Found - SaaStain</title>
            </Head>
			<div className="max-w-lg mx-auto text-center">
				<div className="pb-6">
					<a href="/">
						<img src="/images/logo1.png" width={150} className="mx-auto" />
					</a>
				</div>
				<h3 className="text-gray-800 text-4xl font-semibold sm:text-5xl">Page not found</h3>
				<p className="text-gray-600 mt-3">Sorry, the page you are looking for could not be found or has been removed.</p>
			</div>
		</div>
	);
};

export default NotFound;
