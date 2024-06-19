import { utils, writeFile } from "xlsx";

export const downloadExcel = (tableId: string, filename: string = "") => {
  filename = filename ? filename + ".xls" : "excel_data.xls";

  const headerRow: string[] = [];
  let data: string[][] = [];

  const selectedTbl: any = document.getElementById(tableId);
  const tbHeader: any = selectedTbl.querySelectorAll("thead tr th");
  const tbBody: any = selectedTbl.querySelectorAll("tbody tr");

  // get the inner text of table header
  for (const item of tbHeader) {
    const content = item.textContent;
    headerRow.push(content);
  }

  for (const row of tbBody) {
    const columns = row.querySelectorAll("td");
    const columnData: string[] = [];
    for (const column of columns) {
      const content = column.textContent;
      columnData.push(content);
    }
    data.push(columnData);
  }
  data = [headerRow, ...data];

  const ws = utils.json_to_sheet(data, { skipHeader: true });
  const wb = utils.book_new();

  utils.sheet_add_aoa(ws, [headerRow], { origin: "A1" });
  utils.book_append_sheet(wb, ws, "Data");

  ws["!cols"] = [{ width: 10 }];

  /* export to XLSX */
  writeFile(wb, filename);
};

export const generateOTP = (length = 4) => {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    otp += digits[randomIndex];
  }
  return otp;
};
