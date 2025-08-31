"use client";

import { Order, Side } from "@/utils/types";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { submitOrder } from "@/api/orderApi";
import toast from "react-hot-toast";

type OrderFormProps = {
    side: Side;
    setSide: (side: Side) => void;
    price: string;
    setPrice: (price: string) => void;
    lot: string;
    setLot: (lot: string) => void;
};
export default function OrderForm({
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
            await submitOrder(payload);
            setPrice("");
            setLot("");
        } catch (err: any) {
            if (err.response) {
                toast.error("❌ Failed: " + err.response.data.message);
            } else {
                toast.error("❌ Network error");
            }
            console.error("Order submission error:", err);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white shadow-2xl rounded-2xl p-6 space-y-6 max-w-md mx-auto border border-gray-200"
        >
            {/* Title */}
            <h2 className="text-xl font-bold text-gray-800 border-b pb-3">
                Create New Order
            </h2>

            {/* Side selector */}
            <div className="grid grid-cols-2 rounded-xl overflow-hidden border border-gray-200">
                <button
                    type="button"
                    onClick={() => setSide("BUY")}
                    className={`flex items-center justify-center gap-2 py-3 font-bold text-sm transition ${
                        side === "BUY"
                            ? "bg-green-500 text-white"
                            : "bg-gray-50 text-gray-700 hover:bg-green-50"
                    }`}
                >
                    <ArrowUpCircle
                        size={18}
                        className={
                            side === "BUY" ? "text-white" : "text-green-500"
                        }
                    />
                    Buy
                </button>
                <button
                    type="button"
                    onClick={() => setSide("SELL")}
                    className={`flex items-center justify-center gap-2 py-3 font-bold text-sm transition ${
                        side === "SELL"
                            ? "bg-red-500 text-white"
                            : "bg-gray-50 text-gray-700 hover:bg-red-50"
                    }`}
                >
                    <ArrowDownCircle
                        size={18}
                        className={
                            side === "SELL" ? "text-white" : "text-red-500"
                        }
                    />
                    Sell
                </button>
            </div>

            {/* Price */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                </label>
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    step="0.01"
                    min="0.01"
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    placeholder="Enter price"
                    required
                />
            </div>

            {/* Lot */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lot
                </label>
                <input
                    type="number"
                    value={lot}
                    onChange={(e) => setLot(e.target.value)}
                    step="1"
                    min="1"
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    placeholder="Enter lot size"
                    required
                />
                <span className="inline-block mt-2 text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                    1 lot = 100 shares
                </span>
            </div>

            {/* Submit */}
            <button
                type="submit"
                className={`w-full py-3 rounded-xl font-bold text-white text-sm shadow-md transition transform hover:scale-[1.02] ${
                    side === "BUY"
                        ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:ring-4 focus:ring-green-300"
                        : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:ring-4 focus:ring-red-300"
                }`}
            >
                Place {side} Order
            </button>
        </form>
    );
}
