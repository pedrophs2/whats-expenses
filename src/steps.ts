import { Session } from "./types/session";
import { categoryMenu, categoryMap, categories } from "./categories";
import { Sessions } from "./sessions";
import { Sheets } from "./sheets";
import { Expense } from "./types/expense";

const PAYMENT_METHODS: Record<string, string> = {
  "1": "Crédito",
  "2": "Débito",
  "3": "Pix",
};
const PAYMENT_PROCESSORS: Record<string, string> = {
  "1": "Nubank",
  "2": "Santander",
  "3": "Inter",
  "4": "Alelo",
};

const CREDIT_SANTANDER_SHEET_NAME = "Crédito (Santander)";
const CREDIT_NUBANK_SHEET_NAME = "Crédito (Nubank)";

const processorMenu = Object.entries(PAYMENT_PROCESSORS)
  .map(([key, value]) => `${key}. ${value}`)
  .join("\n");

export class Steps {
  sessions: Sessions = new Sessions();
  sheets: Sheets = new Sheets();
  
  stepMap: Record<number, Function> = {
    1: this.handleExpenseValueStep.bind(this),
    2: this.handleCategoryStep.bind(this),
    3: this.handlePaymentMethodStep.bind(this),
    4: this.handlePaymentProcessorStep.bind(this),
    5: this.handlePersistenceStep.bind(this),
  };

  async handleMessage(msg: any) {
    const userId = msg.from;
    const text = msg.body.trim();
    const session = this.sessions.getSession(userId);

    console.log(`User ID for this flow: ${userId}`);

    if (!session) {
      this.sessions.setSession(userId, { step: 1 });
      return msg.reply("💰 Nova despesa! Qual o valor gasto? (ex: 50,00)");
    }

    const stepHandler = this.stepMap[session.step];
    if (stepHandler) await stepHandler(msg, text, userId);
  }

  handleExpenseValueStep(msg: any, text: string, userId: string) {
    const amount = parseFloat(text.replace(",", "."));

    if (isNaN(amount)) {
      return msg.reply(
        "❌ Valor inválido. Por favor, envie um número (ex: 50,00)",
      );
    }

    this.sessions.updateSession(userId, { amount, step: 2 });
    msg.reply(`📂 Qual a categoria?\n\n${categoryMenu}`);
  }

  handleCategoryStep(msg: any, text: string, userId: string) {
    const selected = categoryMap[text];
    if (!selected) {
      return msg.reply(
        `❌ Opção inválida. Escolha um número entre 1 e ${categories.length}.`,
      );
    }

    this.sessions.updateSession(userId, { category: selected, step: 3 });

    msg.reply(
      "💳 Qual o método de pagamento?\n\n1. Crédito\n2. Débito\n3. Pix",
    );
  }

  handlePaymentMethodStep(msg: any, text: string, userId: string) {
    const method = PAYMENT_METHODS[text];

    if (!method) {
      return msg.reply("❌ Opção inválida. Escolha entre 1, 2 ou 3.");
    }

    this.sessions.updateSession(userId, { paymentMethod: method, step: 4 });
    msg.reply(`🏦 Qual o processador de pagamento?\n\n${processorMenu}`);
  }

  handlePaymentProcessorStep(msg: any, text: string, userId: string) {
    const processor = PAYMENT_PROCESSORS[text];
    if (!processor) {
      return msg.reply(
        `❌ Opção inválida. Escolha um número entre 1 e ${Object.keys(PAYMENT_PROCESSORS).length}.`,
      );
    }

    this.sessions.updateSession(userId, {
      paymentProcessor: processor,
      step: 5,
    });

    msg.reply('📝 Adicione uma descrição (ou envie "pular"):');
  }

  async handlePersistenceStep(msg: any, text: string, userId: string) {
    const session: Session = this.sessions.getSession(userId);

    const userName = this.sessions.getUserName(userId);
    const description = text.toLowerCase() === "pular" ? "—" : text;
    const expense: Expense = {
      amount: session.amount!,
      category: session.category!,
      paymentMethod: session.paymentMethod!,
      paymentProcessor: session.paymentProcessor!,
      description,
      userName,
    };

    try {
      await this.appendExpenseToSheet(expense);
      await msg.reply(
        `✅ Despesa registrada !\n\n` +
          `💰 Valor: R$ ${expense.amount.toFixed(2)}\n` +
          `📂 Categoria: ${expense.category}\n` +
          `💳 Pagamento: ${expense.paymentMethod}\n` +
          `🏦 Processador: ${expense.paymentProcessor}\n` +
          `📝 Descrição: ${description}\n` +
          `👤 Usuário: ${userName}`,
      );
    } catch (err) {
      console.error("❌ Erro ao salvar na planilha:", err);
      await msg.reply(
        "❌ Ocorreu um erro ao salvar a despesa. Tente novamente.",
      );
    }

    this.sessions.clearSession(userId);
  }

  private async appendExpenseToSheet(expense: Expense) {
    if(expense.paymentMethod === "Crédito") {
      if(expense.paymentProcessor === "Santander") {
        await this.sheets.appendExpense(expense, CREDIT_SANTANDER_SHEET_NAME);
      } else if(expense.paymentProcessor === "Nubank") {
        await this.sheets.appendExpense(expense, CREDIT_NUBANK_SHEET_NAME);
      } else {
        throw new Error(`Processador de crédito não mapeado: ${expense.paymentProcessor}`);
      }
    } else {
      await this.sheets.appendExpense
    }
  }
}
