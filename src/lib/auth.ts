import NextAuth from "next-auth";
import { nextAuthOptions } from "./next-auth-options";

export const {
	handlers: { GET, POST },
	signIn,
	signOut,
	auth,
} = NextAuth(nextAuthOptions);
