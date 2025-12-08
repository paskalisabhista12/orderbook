"use client";

import { useState } from "react";
import { ChevronsRight } from "lucide-react";

type OrderBookFormButtonProps = {
    visible: boolean;
    setVisible: (bool: boolean) => void;
};

export default function OrderBookFormButton({
    visible,
    setVisible,
}: OrderBookFormButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        try {
            setLoading(true);
            setVisible(!visible);
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
                <ChevronsRight size={22} />
            ) : (
                <ChevronsRight size={22} />
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
                {visible ? "Close" : "Open"} Order Form
            </span>
        </button>
    );
}
