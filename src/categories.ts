const categories: string[] = [
    '1. Casa', '2. Alimentação', '3. Carro', '4. Transporte',
    '5. Educação', '6. Entretenimento', '7. Estética', '8. Pagamentos',
    '9. Saúde', '10. Gastos Fixos', '11. Mercado', '12. Desconhecido',
];

const categoryMenu = categories.join('\n');
const categoryMap: Record<string, string> = Object.fromEntries(
    categories.map((cat, i) => [String(i + 1), cat.replace(/^\d+\.\s*/, '')])
);

export { categories, categoryMenu, categoryMap };