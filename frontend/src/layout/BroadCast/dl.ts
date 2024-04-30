import type { FormatedChatMessageData } from "@/types/types";
import saveAs from "file-saver";
import Excel from "exceljs";

export const download = async (data: FormatedChatMessageData[]) => {
	const workbook = new Excel.Workbook();
	workbook.created = new Date();
	const worksheet = workbook.addWorksheet("result");

	worksheet.columns = [
		{ header: "name", key: "target" },
		{ header: "id", key: "chatId" },
		{ header: "content", key: "content" },
		{ header: "status", key: "result" },
	];
	worksheet.addRows(
		data.map((row) => {
			return {
				target: row.name,
				chatId: row.chatId,
				content: row.content,
				result: row.status,
			};
		}),
	);
	// statusごとにスタイルを変える
	const successedStyle: Excel.Fill = {
		type: "pattern",
		pattern: "solid",
		fgColor: { argb: "FF68FF95" },
	};
	const failedStyle: Excel.Fill = {
		type: "pattern",
		pattern: "solid",
		fgColor: { argb: "FFDF5D6E" },
	};

	worksheet.eachRow({ includeEmpty: true }, (row, _rowNumber) => {
		const resultCell = row.getCell(4);
		const value = resultCell.value;
		if (value === "Success") {
			resultCell.fill = successedStyle;
		}
		if (value === "Failed") {
			resultCell.fill = failedStyle;
		}
	});
	const buffer = await workbook.xlsx.writeBuffer();
	saveAs(
		new Blob([buffer]),
		`surume-result_${new Intl.DateTimeFormat("ja-JP")
			.format(new Date())
			.replace("/", "_")}.xlsx`,
	);
};
