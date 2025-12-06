"use client";

import { useEffect, useState } from "react";
import { useStompClient } from "@/utils/useStompClient";

type TradeEvent = {
    ticker: string;
    price: number;
    lot: number;
    change: number;
    percent: number;
    side: "BUY" | "SELL";
    timestamp: number;
};

export default function RunningTrade() {
    const [trades, setTrades] = useState<TradeEvent[]>([]);
    const { client, connected } = useStompClient();

    useEffect(() => {
        if (!client || !connected) return;

        const tradeSub = client.subscribe("/topic/trades", (message) => {
            const trade: TradeEvent = JSON.parse(message.body);
            setTrades((prev) => [trade, ...prev].slice(0, 100));
        });

        const snapshotSub = client.subscribe(
            "/topic/trades/snapshot",
            (message) => {
                const history: TradeEvent[] = JSON.parse(message.body);
                setTrades(history);
            }
        );

        client.publish({ destination: "/app/recent-trades" });

        return () => {
            tradeSub.unsubscribe();
            snapshotSub.unsubscribe();
        };
    }, [client, connected]);

    const formatTime = (ts: number) => {
        const d = new Date(ts);
        return d.toLocaleTimeString("en-GB", { hour12: false });
    };

    return (
        <div className="bg-gray-900 text-white rounded-lg shadow-lg w-full max-w-5xl mx-auto p-2 font-mono">
            <div className="flex justify-center font-bold text-m mb-2 border border-gray-700 bg-gray-800 rounded-sm">
                Running Trade
            </div>
            {/* Table */}
            <div className="overflow-y-auto h-[600px] max-h-[600px] border border-gray-700 rounded">
                <table className="w-full text-sm">
                    <thead className="bg-gray-800 text-gray-300 sticky top-0">
                        <tr>
                            <th className="px-2 py-1 text-left">Time</th>
                            <th className="px-2 py-1 text-left">Ticker</th>
                            <th className="px-2 py-1 text-right">Price</th>
                            <th className="px-2 py-1 text-right">Lot</th>
                            <th className="px-2 py-1 text-right">Change</th>
                            <th className="px-2 py-1 text-right">%</th>
                            <th className="px-2 py-1 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trades.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="text-center text-gray-500 py-4"
                                >
                                    No trades yet
                                </td>
                            </tr>
                        ) : (
                            trades.map((trade, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-gray-800"
                                >
                                    <td className="px-2 py-1">
                                        {formatTime(trade.timestamp)}
                                    </td>
                                    <td className="px-2 py-1">
                                        {trade.ticker}
                                    </td>
                                    <td className="px-2 py-1 text-right">
                                        {trade.price.toLocaleString()}
                                    </td>
                                    <td className="px-2 py-1 text-right">
                                        {trade.lot}
                                    </td>
                                    <td
                                        className={`px-2 py-1 text-right ${
                                            trade.change >= 0
                                                ? "text-green-400"
                                                : "text-red-400"
                                        }`}
                                    >
                                        {trade.change}
                                    </td>
                                    <td
                                        className={`px-2 py-1 text-right ${
                                            trade.percent >= 0
                                                ? "text-green-400"
                                                : "text-red-400"
                                        }`}
                                    >
                                        {trade.percent &&
                                            trade.percent.toFixed(2)}
                                        %
                                    </td>
                                    <td
                                        className={`px-2 py-1 text-center font-bold ${
                                            trade.side === "BUY"
                                                ? "text-green-400"
                                                : "text-red-400"
                                        }`}
                                    >
                                        {trade.side === "BUY" ? "Buy" : "Sell"}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
