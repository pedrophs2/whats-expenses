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

client.on("qr", async (qr: string) => {
  console.log(
    "===================================================================",
  );
  QRCode.toBuffer(qr, (err: Error | null | undefined, buffer: Buffer) => {
    if (err) return console.error("❌ Erro ao gerar QR:", err);

    const base64 = `data:image/png;base64,${buffer.toString("base64")}`;
    const chunks = base64.match(/.{1,200}/g) || [];

    console.log(`📱 QR Code (${chunks.length} lines):`);
    chunks.forEach((chunk, i) => {
      console.log(
        `QR[${String(i + 1).padStart(4, "0")}/${chunks.length}] ${chunk}`,
      );
    });
    console.log(
      "📋 Copy all QR[...] lines, strip the prefixes, and decode the base64 image.",
    );
  });
  console.log(
    "===================================================================",
  );
});

client.on("ready", () => console.log("✅ WhatsApp conectado!"));
client.on("auth_failure", () => console.error("❌ Falha na autenticação."));
client.on("disconnected", (reason) => console.warn("⚠️ Desconectado:", reason));

export default client;
