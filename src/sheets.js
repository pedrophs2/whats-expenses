const { google } = require('googleapis');
const path = require('path');

const SPREADSHEET_ID = '1eHLbm9l2li4PLqaZhO-51VXNAgto2bO1rTM-VCSamHc'; // from the URL: /spreadsheets/d/{ID}/edit
const SHEET_NAME = 'Despesas'; // your sheet tab name

const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, '../resources/g-cred.json'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const getSheet = async () => {
    const client = await auth.getClient();
    return google.sheets({ version: 'v4', auth: client });
};

const appendExpense = async (expense) => {
    const sheets = await getSheet();
    const { amount, category, paymentMethod, paymentProcessor, description } = expense;
    const date = new Date().toLocaleDateString('pt-BR');

    await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A:F`,
        valueInputOption: 'USER_ENTERED',
        resource: {
            values: [[date, amount, category, paymentMethod, paymentProcessor, description]],
        },
    });

    console.log('📊 Despesa salva na planilha!');
};

module.exports = { appendExpense };