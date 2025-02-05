"use server";
import { signIn } from "@/lib/auth";
import { AuthErrorMap } from "@/lib/auth-errors";

export async function authenticate(email: string, password: string) {
	try {
		const resp = await signIn("credentials", {
			email: email,
			password: password,
			callbackUrl: "/",
			redirect: false,
		});

		return { ok: true, error: null, data: resp };
	} catch (err) {
		if (err?.type === "AuthError") {
			const errorData = AuthErrorMap[err?.code] ?? AuthErrorMap["invalid_credentials"];
			return { ok: false, error: errorData };
		} else {
			return { ok: false, error: "Failed to authenticate" };
		}
	}
}
