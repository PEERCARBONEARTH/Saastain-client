import axios from "axios";

const baseURL = "https://ygows8k.trial-saastain.vingitonga.xyz";

export async function POST(request: Request) {
	const body = await request.json();
	let data = JSON.stringify(body);
	// let data = JSON.stringify({
	// 	date: "2024-07-03",
	// 	county: "Kiambu",
	// 	address: "Juja",
	// });

	let config = {
		method: "post",
		maxBodyLength: Infinity,
		url: "https://ygows8k.trial-saastain.vingitonga.xyz/predict",
		headers: {
			"Content-Type": "application/json",
		},
		data: data,
	};

	try {
		const resp = await axios.request(config);

		return Response.json(resp.data);
	} catch (err) {
		console.log(err);
		return Response.json(err);
	}
}
