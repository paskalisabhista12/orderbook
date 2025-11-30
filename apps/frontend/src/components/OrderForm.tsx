"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Order, Side } from "@/utils/types";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { submitOrder } from "@/api/OrderService";
import toast from "react-hot-toast";
import { Geist, Geist_Mono } from "next/font/google";

type OrderFormProps = {
    ticker: string | undefined;
    side: Side;
    setSide: (side: Side) => void;
    price: string;
    setPrice: (price: string) => void;
    lot: string;
    setLot: (lot: string) => void;
};

export default function OrderForm({
    ticker,
    side,
    setSide,
    price,
    setPrice,
    lot,
    setLot,
}: OrderFormProps) {
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload: Order = {
            side,
            price: parseInt(price, 10),
            lot: parseInt(lot, 10),
        };

        try {
            await submitOrder(ticker, payload);
            setPrice("");
            setLot("");
        } catch (err: any) {
            if (err.response) {
                toast.error("❌ Failed: " + err.response.data.message);
            } else {
                toast.error("❌ Network error");
            }
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-gray-900 shadow-2xl rounded-xl p-6 space-y-6 max-w-md mx-auto border-4 border-gray-800"
        >
            {/* Title */}
            <h2 className="flex justify-center text-xl font-semibold text-gray-100 border-b border-gray-700 pb-3">
                New Order
            </h2>

            {/* Side selector */}
            <div className="grid grid-cols-2 rounded-xl overflow-hidden border border-gray-700">
                <button
                    type="button"
                    onClick={() => setSide("BUY")}
                    className={`flex items-center justify-center gap-2 py-3 font-semibold text-sm transition
                        ${
                            side === "BUY"
                                ? "bg-green-600 text-white"
                                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        }
                    `}
                >
                    <ArrowUpCircle
                        size={18}
                        className={
                            side === "BUY" ? "text-white" : "text-green-400"
                        }
                    />
                    Buy
                </button>

                <button
                    type="button"
                    onClick={() => setSide("SELL")}
                    className={`flex items-center justify-center gap-2 py-3 font-semibold text-sm transition
                        ${
                            side === "SELL"
                                ? "bg-red-600 text-white"
                                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        }
                    `}
                >
                    <ArrowDownCircle
                        size={18}
                        className={
                            side === "SELL" ? "text-white" : "text-red-400"
                        }
                    />
                    Sell
                </button>
            </div>

            {/* Price */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                    Price
                </label>
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    step="0.01"
                    min="0.01"
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="Enter price"
                    required
                />
            </div>

            {/* Lot */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                    Lot
                </label>
                <input
                    type="number"
                    value={lot}
                    onChange={(e) => setLot(e.target.value)}
                    step="1"
                    min="1"
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="Enter lot size"
                    required
                />
                <span className="inline-block mt-2 text-xs font-semibold bg-gray-800 text-gray-400 px-2 py-1 rounded-md border border-gray-700">
                    1 Lot = 100 Shares
                </span>
            </div>

            {/* Submit */}
            <button
                type="submit"
                className={`w-full py-3 rounded-xl font-bold text-white text-sm shadow-md transition transform hover:scale-[1.02]
                    ${
                        side === "BUY"
                            ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:ring-4 focus:ring-green-300/20"
                            : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:ring-4 focus:ring-red-300/20"
                    }
                `}
            >
                Place {side} Order
            </button>
        </form>
    );
}
