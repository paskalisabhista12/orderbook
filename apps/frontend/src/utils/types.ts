// types.ts
export type Side = "BUY" | "SELL";

export interface Order {
    side: Side;
    price: number;
    lot: number;
}

export interface OrderBookResponse {
    bids: Order[];
    asks: Order[];
    lastPrice?: number;
}
