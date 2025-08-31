"use client";

import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getStompClient } from "@/utils/stompClient";

type TradeEvent = {
    price: number;
    lot: number;
    side: "BUY" | "SELL";
    timestamp: number;
};

export default function RunningTrade() {
    const [trades, setTrades] = useState<TradeEvent[]>([]);

    useEffect(() => {
        const stompClient = getStompClient();

        stompClient.onConnect = () => {
            console.log("Connected to /ws ✅");
            stompClient.subscribe("/topic/trades", (message) => {
                const trade: TradeEvent = JSON.parse(message.body);

                setTrades((prev) => [trade, ...prev]);
            });
        };

        stompClient.activate();

        return () => {
            if (stompClient.active) {
                stompClient.deactivate();
            }
        };
    }, []);

    return (
        <div className="bg-gray-900 text-white p-4 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-2">Running Trades</h2>
            <div className="space-y-1 max-h-64 overflow-y-auto">
                {trades.length === 0 ? (
                    <p className="text-gray-500">No trades yet</p>
                ) : (
                    trades.map((trade, index) => (
                        <div
                            key={index}
                            className={`flex justify-between p-2 rounded ${
                                trade.side === "BUY"
                                    ? "bg-green-700"
                                    : "bg-red-700"
                            }`}
                        >
                            <span>{trade.side}</span>
                            <span>
                                {trade.lot} @ {trade.price.toLocaleString()}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
