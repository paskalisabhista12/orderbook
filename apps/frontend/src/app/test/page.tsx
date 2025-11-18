"use client";

import { getTicker } from "@/api/DataFeedService";
import { useEffect, useState } from "react";

interface TickerOption {
    ticker: string;
    name: string;
}

export default function Test() {
    const [tickers, setTickers] = useState<TickerOption[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTickers = async () => {
            try {
                const res = await getTicker();
                setTickers(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTickers();
    }, []);

    return (
        <div className="p-4">
            <label className="block mb-2 font-medium">Choose a ticker:</label>

            <select
                disabled={loading}
                className="border p-2 rounded w-full disabled:bg-gray-100 disabled:text-gray-400"
            >
                {loading ? (
                    <option>Loading...</option>
                ) : (
                    <>
                        <option value="">Select...</option>
                        {tickers.map((item) => (
                            <option key={item.ticker} value={item.ticker}>
                                {item.ticker}
                            </option>
                        ))}
                    </>
                )}
            </select>
        </div>
    );
}
