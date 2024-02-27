export const NOOP = async (v?: any) => {
	// Does not do anything.
};

export const generateOptions = (options: string[]) => {
	return options.map((opt) => ({ value: opt, label: opt }));
};

