import { firebaseConfig } from "@/env";
import { FirebaseOptions, getApp, initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

function createFirebaseApp(config: FirebaseOptions) {
	try {
		return getApp();
	} catch (err) {
		return initializeApp(config);
	}
}

export const firebaseApp = createFirebaseApp(firebaseConfig);
export const firebaseStorage = getStorage(firebaseApp);
