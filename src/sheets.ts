import { google } from "googleapis";
import { Expense } from "./types/expense";

const SPREADSHEET_ID = "1eHLbm9l2li4PLqaZhO-51VXNAgto2bO1rTM-VCSamHc";
const EXPENSES_SHEET_NAME = "Despesas";
const INCOME_SHEET_NAME = "Receitas";
const SHEET_API_VERSION = 'v4';

export class Sheets {
  async getSheet() {   
    return google.sheets({ version: SHEET_API_VERSION, auth: this.getCredentials() });
  }

  async appendExpense(expense: Expense, sheetName: string = EXPENSES_SHEET_NAME) {
    const sheets = await this.getSheet();
    const {
      amount,
      category,
      paymentMethod,
      paymentProcessor,
      description,
      userName,
    } = expense;
    const date = new Date().toLocaleDateString("pt-BR");

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:G`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            date,
            amount,
            category,
            paymentMethod,
            paymentProcessor,
            description,
            userName,
          ],
        ],
      },
    });

    console.log("📊 Despesa salva na planilha!");
  }

  private getCredentials() {
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS||"{}")

    const googleAuth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    return googleAuth
  }

}
