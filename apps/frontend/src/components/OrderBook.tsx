"use client";

import { useEffect, useState } from "react";
import { IMessage } from "@stomp/stompjs";
import { getStompClient } from "@/utils/stompClient";

interface Order {
    price: number;
    lot: number;
}

interface OrderBookResponse {
    bids: Order[];
    asks: Order[];
    lastPrice?: number;
}

export default function OrderBook() {
    const [bids, setBids] = useState<Order[]>([]);
    const [asks, setAsks] = useState<Order[]>([]);
    const [lastPrice, setLastPrice] = useState<number | null>(null);

    useEffect(() => {
        const stompClient = getStompClient();

        stompClient.onConnect = () => {
            console.log("✅ Connected to backend");

            // subscribe to updates
            stompClient.subscribe("/topic/orderbook", (message: IMessage) => {
                if (message.body) {
                    const data: OrderBookResponse = JSON.parse(message.body);
                    setBids(data.bids || []);
                    setAsks(data.asks || []);
                    if (data.lastPrice) setLastPrice(data.lastPrice);
                }
            });;

            // request snapshot
            stompClient.publish({
                destination: "/app/snapshot",
            });
        };

        return () => {
            stompClient.deactivate();
        };
    }, []);
    return (
        <div className="grid grid-cols-3 gap-4 p-4 w-full max-w-4xl mx-auto">
            {/* Bids (Buy orders) */}
            <div className="bg-green-50 rounded-2xl shadow p-4">
                <h2 className="text-lg font-bold text-green-700 mb-2">Bids</h2>
                <div className="space-y-1">
                    {bids.map((order, idx) => (
                        <div
                            key={idx}
                            className="flex justify-between text-sm font-mono text-green-900"
                        >
                            <span>{order.price.toFixed(2)}</span>
                            <span>{order.lot}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Middle: Last Price */}
            <div className="flex flex-col justify-center items-center bg-gray-50 rounded-2xl shadow p-4">
                <h2 className="text-lg font-bold text-gray-600">Last Price</h2>
                <span className="text-2xl font-bold text-gray-900">
                    {lastPrice ? lastPrice.toFixed(2) : "--"}
                </span>
            </div>

            {/* Asks (Sell orders) */}
            <div className="bg-red-50 rounded-2xl shadow p-4">
                <h2 className="text-lg font-bold text-red-700 mb-2">Asks</h2>
                <div className="space-y-1">
                    {asks.map((order, idx) => (
                        <div
                            key={idx}
                            className="flex justify-between text-sm font-mono text-red-900"
                        >
                            <span>{order.price.toFixed(2)}</span>
                            <span>{order.lot}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
