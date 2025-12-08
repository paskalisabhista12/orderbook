"use client";

import { useState } from "react";
import { generateRandomOrder } from "@/api/OrderService";
import { RefreshCcw } from "lucide-react";

export default function GenerateOrderButton({ ticker }: { ticker: string }) {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        try {
            setLoading(true);
            await generateRandomOrder(ticker);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className="
        group relative
        w-[50px] h-[50px] flex items-center justify-center
        rounded-xl
        bg-gray-900 
        text-yellow-300
        border border-yellow-500/40
        hover:bg-gray-800 
        transition-all
        disabled:opacity-40 disabled:cursor-not-allowed
        cursor-pointer
    "
        >
            {/* Icon */}
            {loading ? (
                <RefreshCcw className="animate-spin" size={22} />
            ) : (
                <RefreshCcw size={22} />
            )}

            {/* Tooltip */}
            <span
                className="
            absolute -top-10 left-1/2 -translate-x-1/2
            opacity-0 group-hover:opacity-100
            pointer-events-none
            px-2 py-1 rounded-md
            text-xs font-medium
            bg-black text-yellow-300
            border border-yellow-500/30
            shadow-lg
            transition-all
            whitespace-nowrap
        "
            >
                Generate Dummy Order
            </span>
        </button>
    );
}
