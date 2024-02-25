import { DateTime } from "luxon";

export function getInitials(name: string) {
	const splitName = name.trim().split(" ");

	if (splitName.length === 1) {
		return splitName[0][0].toUpperCase();
	} else {
		return (splitName[0][0] + splitName[splitName.length - 1][0]).toUpperCase();
	}
}

const colors = ["success", "warning", "default", "primary", "secondary", "danger"];

export function getColorFromUserId(userId: string): string {
	let sum = 0;
	for (let i = 0; i < userId.length; i++) {
		sum += userId.charCodeAt(i);
	}
	return colors[sum % colors.length] as "success" | "warning" | "default" | "primary" | "secondary" | "danger";
}

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const formatDateTime = (dateString: string) => {
	const date = new Date(dateString);
	const newDate = DateTime.fromJSDate(date).setZone("Africa/Nairobi", { keepLocalTime: true }).toFormat("dd LLL yyyy 'at' HH:mm");

	return newDate;
};


export const generateOptions = (options: string[]) => {
	return options.map((option) => {
		return { label: option, value: option };
	});
};


export const getMinDate = () => {
	return new Date(2015, 1, 1);
};

export const getMaxDate = () => {
	// make sure the date is today and the 00:00:00 time
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	return today;
};