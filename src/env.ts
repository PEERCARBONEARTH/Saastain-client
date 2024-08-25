export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL ?? "https://api-saastain.vingitonga.xyz/api";
export const AUTH_SECRET = process.env.NEXTAUTH_SECRET;
export const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
export const CLIMATE_RISK_AI_MODEL_BASE_URL = "https://ygows8k.trial-saastain.vingitonga.xyz"
