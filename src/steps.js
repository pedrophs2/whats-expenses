const { categoryMenu, categoryMap, categories } = require('./categories');
const { getSession, setSession, updateSession, clearSession } = require('./sessions');
const { appendExpense } = require('./sheets');

const PAYMENT_METHODS = { '1': 'Crédito', '2': 'Débito', '3': 'Carteira' };
const PAYMENT_PROCESSORS = { '1': 'Nubank', '2': 'Santander', '3': 'Inter', '4': 'Alelo' };

const processorMenu = Object.entries(PAYMENT_PROCESSORS)
    .map(([key, value]) => `${key}. ${value}`)
    .join('\n');

const steps = {
    1: async (msg, text, userId) => {
        const amount = parseFloat(text.replace(',', '.'));
        if (isNaN(amount)) {
            return msg.reply('❌ Valor inválido. Por favor, envie um número (ex: 50,00)');
        }
        updateSession(userId, { amount, step: 2 });
        msg.reply(`📂 Qual a categoria?\n\n${categoryMenu}`);
    },

    2: async (msg, text, userId) => {
        const selected = categoryMap[text];
        if (!selected) {
            return msg.reply(`❌ Opção inválida. Escolha um número entre 1 e ${categories.length}.`);
        }
        updateSession(userId, { category: selected, step: 3 });
        msg.reply('💳 Qual o método de pagamento?\n\n1. Crédito\n2. Débito\n3. Carteira');
    },

    3: async (msg, text, userId) => {
        const method = PAYMENT_METHODS[text];
        if (!method) {
            return msg.reply('❌ Opção inválida. Escolha entre 1, 2 ou 3.');
        }
        updateSession(userId, { paymentMethod: method, step: 4 });
        msg.reply(`🏦 Qual o processador de pagamento?\n\n${processorMenu}`);
    },

    4: async (msg, text, userId) => {
        const processor = PAYMENT_PROCESSORS[text];
        if (!processor) {
            return msg.reply(`❌ Opção inválida. Escolha um número entre 1 e ${Object.keys(PAYMENT_PROCESSORS).length}.`);
        }
        updateSession(userId, { paymentProcessor: processor, step: 5 });
        msg.reply('📝 Adicione uma descrição (ou envie "pular"):');
    },

    5: async (msg, text, userId) => {
        const { amount, category, paymentMethod, paymentProcessor } = getSession(userId);
        const description = text.toLowerCase() === 'pular' ? '—' : text;
        const expense = { amount, category, paymentMethod, paymentProcessor, description };

        try {
            await appendExpense(expense);
            await msg.reply(
                `✅ Despesa registrada!\n\n` +
                `💰 Valor: R$${amount.toFixed(2)}\n` +
                `📂 Categoria: ${category}\n` +
                `💳 Pagamento: ${paymentMethod}\n` +
                `🏦 Processador: ${paymentProcessor}\n` +
                `📝 Descrição: ${description}`
            );
        } catch (err) {
            console.error('❌ Erro ao salvar na planilha:', err);
            await msg.reply('❌ Ocorreu um erro ao salvar a despesa. Tente novamente.');
        }

        clearSession(userId);
    },
};

const handleMessage = async (msg) => {
    const userId = msg.from;
    const text = msg.body.trim();
    const session = getSession(userId);

    console.log(`User ID for this flow: ${userId}`)

    if (!session) {
        setSession(userId, { step: 1 });
        return msg.reply('💰 Nova despesa! Qual o valor gasto? (ex: 50,00)');
    }

    const stepHandler = steps[session.step];
    if (stepHandler) await stepHandler(msg, text, userId);
};

module.exports = { handleMessage };