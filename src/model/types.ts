export default interface Person {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    region: string;
    zip: string;
    phone: string;
};

export type CartItem = {
    name: string;
    size: string;
    color: string;
    price: number;
    subtotal: number;
    quantity?: number;
};