"use client";

import { useEffect, useState } from "react";
import { IMessage } from "@stomp/stompjs";
import { getStompClient } from "@/utils/stompClient";
import QuoteSummary from "./QuoteSummary";
import { useStompClient } from "@/utils/useStompClient";

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
    ticker: string;
    lastPrice?: number;
    prev?: number;
    change?: number;
    percent?: number;
    open?: number;
    high?: number;
    low?: number;
    lot?: string;
    value?: string;
    freq?: string;
}

export default function OrderBook({ setPrice }: OrderFormProps) {
    const [bids, setBids] = useState<Order[]>([]);
    const [asks, setAsks] = useState<Order[]>([]);
    const [summary, setSummary] = useState<OrderBookResponse | null>(null);

    const { client, connected } = useStompClient();

    useEffect(() => {
        if (!client || !connected) return;

        const sub = client.subscribe("/topic/orderbook", (msg: IMessage) => {
            const data = JSON.parse(msg.body);
            setBids(data.bids || []);
            setAsks(data.asks || []);
            setSummary(data);
        });

        client.publish({
            destination: "/app/snapshot",
        });

        return () => sub.unsubscribe();
    }, [client, connected]);

    const nf = new Intl.NumberFormat("en-US");
    return (
        <div className="w-full max-w-5xl mx-auto bg-gray-900 text-white rounded-lg shadow overflow-hidden font-mono">
            {/* Header */}
            {summary && (
                <QuoteSummary
                    ticker={summary.ticker ?? ""}
                    prev={summary.open ?? 0}
                    change={summary.change ?? 0}
                    percent={summary.percent ?? 0}
                    open={summary.open ?? 0}
                    high={summary.high ?? 0}
                    low={summary.low ?? 0}
                    lot={summary.lot ?? "-"}
                    val={summary.value ?? "-"}
                    freq={summary.freq ?? "-"}
                    lastPrice={summary.lastPrice ?? 0}
                />
            )}

            {/* Table Header */}
            <div className="grid grid-cols-6 text-xs font-bold text-gray-300 bg-gray-800 border-b border-gray-700">
                <div className="py-2 text-right pr-2">Freq</div>
                <div className="py-2 text-right pr-2">Lot</div>
                <div className="py-2 text-right pr-2">Bid</div>

                <div className="py-2 pl-2 border-l border-gray-700 text-left">
                    Offer
                </div>
                <div className="py-2 text-right pr-2">Lot</div>
                <div className="py-2 text-right pr-2">Freq</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-800">
                {Array.from({
                    length: Math.max(10, bids.length, asks.length),
                }).map((_, idx) => {
                    const bid = bids[idx];
                    const ask = asks[idx];
                    const isBestBid = idx === 0 && !!bid;
                    const isBestAsk = idx === 0 && !!ask;

                    return (
                        <div
                            key={idx}
                            className="grid grid-cols-6 text-sm hover:bg-gray-800/70 transition"
                        >
                            {/* Bid side */}
                            <div className="py-1 pr-2 text-right text-gray-400">
                                {bid?.freq ?? "-"}
                            </div>
                            <div className="py-1 pr-2 text-right">
                                {bid ? nf.format(bid.totalLot) : "-"}
                            </div>
                            <div
                                onClick={() =>
                                    bid && setPrice(String(bid.price))
                                }
                                className={`py-1 pr-2 text-right font-semibold cursor-pointer ${
                                    bid
                                        ? "text-green-400 hover:text-green-300"
                                        : "text-gray-500 cursor-default"
                                } ${isBestBid ? "bg-green-900/30" : ""}`}
                            >
                                {bid ? bid.price.toFixed(2) : "-"}
                            </div>

                            {/* Ask side */}
                            <div
                                onClick={() =>
                                    ask && setPrice(String(ask.price))
                                }
                                className={`py-1 pl-2 font-semibold cursor-pointer ${
                                    ask
                                        ? "text-red-400 hover:text-red-300 text-left"
                                        : "text-gray-500 cursor-default"
                                } ${isBestAsk ? "bg-red-900/30" : ""}`}
                            >
                                {ask ? ask.price.toFixed(2) : "-"}
                            </div>
                            <div className="py-1 pr-2 text-right">
                                {ask ? nf.format(ask.totalLot) : "-"}
                            </div>
                            <div className="py-1 pr-2 text-right text-gray-400">
                                {ask?.freq ?? "-"}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
