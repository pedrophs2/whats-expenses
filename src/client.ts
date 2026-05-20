import { Client, LocalAuth } from "whatsapp-web.js";
import QRCode from "qrcode";
import { promisify } from "util";

const toBuffer = promisify(QRCode.toBuffer);

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    executablePath:
      process.env.PUPPETEER_EXECUTABLE_PATH ||
      "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
  },
});

client.on('qr', async (qr: string) => {
    try {
        const buffer = await QRCode.toBuffer(qr);
        const base64 = `data:image/png;base64,${buffer.toString('base64')}`;

        console.log(`QR_CODE:${base64}`);

    } catch (err) {
        console.error('❌ Erro ao gerar QR Code:', err);
    }
});

client.on("ready", () => console.log("✅ WhatsApp conectado!"));
client.on("auth_failure", () => console.error("❌ Falha na autenticação."));
client.on("disconnected", (reason) => console.warn("⚠️ Desconectado:", reason));

export default client;
