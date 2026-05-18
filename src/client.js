const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        executablePath:
            process.env.PUPPETEER_EXECUTABLE_PATH ||
            "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
        ],
    },
});

client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
    console.log("📱 Escaneie o QR code acima com o seu WhatsApp.");
});

client.on("ready", () => console.log("✅ WhatsApp conectado!"));
client.on("auth_failure", () => console.error("❌ Falha na autenticação."));
client.on("disconnected", (reason) => console.warn("⚠️ Desconectado:", reason));

module.exports = client;
