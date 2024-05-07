export const useCurFormatedTime = () => {
	const curFormattedTime = () => {
		return new Intl.DateTimeFormat("ja-jp", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		})
			.formatToParts(new Date())
			.map((o) =>
				o.type === "literal" && o.value === "/"
					? "-"
					: o.type === "literal" && o.value === " "
						? "_"
						: o.type === "literal"
							? ""
							: o.value,
			)
			.join("");
	};
	return { curFormattedTime };
};
