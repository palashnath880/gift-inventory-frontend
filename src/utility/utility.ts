import moment from "moment";
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

export const arrayToExcel = (header: any, rows: any, filename: string = "") => {
  filename = filename ? filename + ".xls" : "excel_data.xls";

  if (typeof header !== "object") {
    throw new Error(`Please provide valid object for the excel header`);
  }
  if (!Array.isArray(rows)) {
    throw new Error(`Please provide valid array of object for the excel body`);
  }

  const headerRow: any[] = [];
  for (const value of Object.values(header)) {
    headerRow.push(value);
  }

  const content: any[][] = [];
  for (const row of rows) {
    const rowData = [];
    const keys = Object.keys(header);
    for (const key of keys) {
      rowData.push(row[key]);
    }
    content.push(rowData);
  }

  const data = [headerRow, ...content];

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

export const verifyVoucherCode = (date: string, days: number) => {
  const currentDate = moment(new Date());
  const createdTime = moment(date);
  const isValid = createdTime.isValid();
  if (!isValid || days <= 0) {
    return false;
  }

  // add days
  const addDays = createdTime.add(days, "days");
  if (addDays.isAfter(currentDate)) {
    return true;
  } else {
    return false;
  }
};
