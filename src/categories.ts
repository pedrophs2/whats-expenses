const categories: string[] = [
  "Casa",
  "Alimentação",
  "Mercado",
  "Gastos Fixos",
  "Carro",
  "Transporte",
  "Educação",
  "Entretenimento",
  "Estética",
  "Roupas",
  "Eletrônicos",
  "Pagamentos",
  "Saúde",
  "Desconhecido",
];

const categoryMenu = categories.map((category, i) => `${i + 1}. ${category}`).join("\n");
const categoryMap: Record<string, string> = Object.fromEntries(
  categories.map((cat, i) => [String(i + 1), cat.replace(/^\d+\.\s*/, "")]),
);

export { categories, categoryMenu, categoryMap };
