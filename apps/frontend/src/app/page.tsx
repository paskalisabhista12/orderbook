"use client";

import GenerateOrderButton from "@/components/GenerateOrderButton";
import OrderBook from "@/components/OrderBook";
import OrderForm from "@/components/OrderForm";
import { Side } from "@/utils/types";
import { useState } from "react";

export default function Home() {
    const [side, setSide] = useState<Side>("BUY");
    const [price, setPrice] = useState<string>("");
    const [lot, setLot] = useState<string>("");
    return (
        <main className="min-h-screen flex items-center justify-center gap-10 bg-gray-100">
            <div className="flex flex-col gap-10 w-fit">
                <GenerateOrderButton />
                <OrderBook setPrice={setPrice} />
            </div>
            <div className="flex flex-col gap-10 w-fit">
                <OrderForm
                    side={side}
                    setSide={setSide}
                    price={price}
                    setPrice={setPrice}
                    lot={lot}
                    setLot={setLot}
                />
            </div>
        </main>
    );
}
