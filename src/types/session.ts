export interface Session {
    step: number;
    amount?: number;
    category?: string;
    paymentMethod?: string;
    paymentProcessor?: string;
}