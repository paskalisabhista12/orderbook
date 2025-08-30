"use client";

import { useEffect, useState } from "react";
import { IMessage } from "@stomp/stompjs";
import { getStompClient } from "@/utils/stompClient";

type OrderFormProps = {
    setPrice: (price: string) => void;
};

interface Order {
    price: number;
    totalLot: number;
    freq: number;
}

interface OrderBookResponse {
    bids: Order[];
    asks: Order[];
    lastPrice?: number;
}

export default function OrderBook({ setPrice }: OrderFormProps) {
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
                    console.log(JSON.parse(message.body));
                    const data: OrderBookResponse = JSON.parse(message.body);
                    setBids(data.bids || []);
                    setAsks(data.asks || []);
                    if (data.lastPrice) setLastPrice(data.lastPrice);
                }
            });

            // request snapshot
            stompClient.publish({
                destination: "/app/snapshot",
            });
        };

        return () => {
            stompClient.deactivate();
        };
    }, []);

    const nf = new Intl.NumberFormat("en-US");
    return (
        <div className="w-full max-w-5xl mx-auto bg-gray-900 text-white rounded-lg shadow overflow-hidden font-mono">
            {/* Header */}
            <div className="grid grid-cols-6 text-xs bg-gray-800 font-bold text-center">
                <div className="py-2">Freq</div>
                <div className="py-2">Lot</div>
                <div className="py-2">Bid</div>

                <div className="py-2 border-l border-gray-700">Offer</div>
                <div className="py-2">Lot</div>
                <div className="py-2">Freq</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-800">
                {Array.from({ length: Math.max(bids.length, asks.length) }).map(
                    (_, idx) => {
                        const bid = bids[idx];
                        const ask = asks[idx];
                        const isBestBid = idx === 0 && !!bid;
                        const isBestAsk = idx === 0 && !!ask;

                        return (
                            <div
                                key={idx}
                                className="grid grid-cols-6 text-sm text-center hover:bg-gray-800"
                            >
                                {/* Bid side */}
                                <div className="py-1 text-gray-400">
                                    {bid?.freq ?? "-"}
                                </div>
                                <div className="py-1">
                                    {bid ? nf.format(bid.totalLot) : "-"}
                                </div>
                                <div
                                    onClick={() =>
                                        bid && setPrice(String(bid.price))
                                    }
                                    className={`py-1 font-semibold cursor-pointer transition ${
                                        bid
                                            ? "text-green-400 hover:text-green-300"
                                            : "text-gray-500 cursor-default"
                                    } ${isBestBid ? "bg-green-900/20" : ""}`}
                                >
                                    {bid ? bid.price.toFixed(2) : "-"}
                                </div>

                                {/* Ask side */}
                                <div
                                    onClick={() =>
                                        ask && setPrice(String(ask.price))
                                    }
                                    className={`py-1 font-semibold border-l border-gray-700 cursor-pointer transition ${
                                        ask
                                            ? "text-red-400 hover:text-red-300"
                                            : "text-gray-500 cursor-default"
                                    } ${isBestAsk ? "bg-red-900/20" : ""}`}
                                >
                                    {ask ? ask.price.toFixed(2) : "-"}
                                </div>
                                <div className="py-1">
                                    {ask ? nf.format(ask.totalLot) : "-"}
                                </div>
                                <div className="py-1 text-gray-400">
                                    {ask?.freq ?? "-"}
                                </div>
                            </div>
                        );
                    }
                )}
            </div>
        </div>
    );
}
