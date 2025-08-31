"use client";

import { useState } from "react";
import axios from "axios";
import { generateRandomOrder } from "@/api/orderApi";

export default function GenerateOrderButton() {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        try {
            setLoading(true);
            // Example lastPrice input
            const lastPrice = 1520;

            const response = await generateRandomOrder();

            console.log("✅ Random orderbook:", response.data);
            // You can store it in state and render in UI
        } catch (err) {
            console.error("❌ Failed to generate random orderbook", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 w-[200px] text-white font-bold rounded-lg shadow disabled:opacity-50"
        >
            {loading ? "Generating..." : "Generate Random OrderBook"}
        </button>
    );
}
