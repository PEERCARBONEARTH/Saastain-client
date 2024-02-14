import "@/styles/globals.css";
import AppProviders from "@/providers/AppProviders";
import AppServices from "@/providers/AppServices";
import { AppPropsWithLayout } from "@/types/Layout";
import { Head } from "next/document";
import { Nunito } from "next/font/google";

const nunito = Nunito({
	subsets: ["latin"],
	weight: ["200", "300", "400", "600", "700", "800", "900"],
	variable: "--font-nunito",
});

export default function App({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout) {
	const getLayout = Component.getLayout ?? ((page) => page);

	return (
		<main>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
				<style jsx global>
					{`
						:root {
							--font-nunito: ${nunito.style.fontFamily}, "Nunito", sans-serif;
						}
						body: {
							font-family: ${nunito.style.fontFamily};
						}
					`}
				</style>
				<title>SaaStain</title>
			</Head>
			<AppProviders session={session}>
				{getLayout(<Component {...pageProps} />)}
				<AppServices />
			</AppProviders>
		</main>
	);
}
