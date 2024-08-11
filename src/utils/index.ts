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

export const capitalizeWords = (str: string) => str.replace(/\b\w/g, (l) => l.toUpperCase());

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

export const mapMonthToNumber = (month: string) => {
	// should return the current month for the default value


	switch (month) {
		case "January":
			return 1;
		case "February":
			return 2;
		case "March":
			return 3;
		case "April":
			return 4;
		case "May":
			return 5;
		case "June":
			return 6;
		case "July":
			return 7;
		case "August":
			return 8;
		case "September":
			return 9;
		case "October":
			return 10;
		case "November":
			return 11;
		case "December":
			return 12;
		default:
			return ""
	}
};

export const formatCurrency = (amount: number) => {
	return `Ksh ${new Intl.NumberFormat("en-KE").format(amount)}`;
};
