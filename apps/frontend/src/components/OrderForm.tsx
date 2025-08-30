"use client";

import { useState } from "react";
import { getStompClient } from "@/utils/stompClient";
import { Order, Side } from "@/utils/types";

export default function OrderForm() {
    const [side, setSide] = useState<Side>("BUY");
    const [price, setPrice] = useState<number>(0);
    const [lot, setLot] = useState<number>(0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const order: Order = {
            side,
            price,
            lot: lot,
        };

        const client = getStompClient();

        if (client && client.connected) {
            client.publish({
                destination: "/app/order",
                body: JSON.stringify(order),
            });
            console.log("📤 Sent order:", order);
            setPrice(0);
            setLot(0);
        } else {
            alert("❌ Not connected to server");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white shadow rounded-2xl p-4 space-y-4 max-w-md mx-auto"
        >
            <h2 className="text-lg font-bold">Create New Order</h2>

            {/* Side */}
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => setSide("BUY")}
                    className={`flex-1 p-2 rounded-xl font-bold ${
                        side === "BUY"
                            ? "bg-green-500 text-white"
                            : "bg-gray-100"
                    }`}
                >
                    Buy
                </button>
                <button
                    type="button"
                    onClick={() => setSide("SELL")}
                    className={`flex-1 p-2 rounded-xl font-bold ${
                        side === "SELL"
                            ? "bg-red-500 text-white"
                            : "bg-gray-100"
                    }`}
                >
                    Sell
                </button>
            </div>

            {/* Price */}
            <div>
                <label className="block text-sm font-medium">Price</label>
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    step="0.01"
                    className="w-full p-2 border rounded-lg"
                    required
                />
            </div>

            {/* Lot */}
            <div>
                <label className="block text-sm font-medium">Lot</label>
                <input
                    type="number"
                    value={lot}
                    onChange={(e) => setLot(Number(e.target.value))}
                    step="1"
                    className="w-full p-2 border rounded-lg"
                    required
                />
                <p className="text-xs text-gray-500 mt-1">
                    1 lot = 100 shares
                </p>
            </div>

            {/* Submit */}
            <button
                type="submit"
                className={`w-full p-2 rounded-xl font-bold text-white ${
                    side === "BUY"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                }`}
            >
                Place {side} Order
            </button>
        </form>
    );
}
