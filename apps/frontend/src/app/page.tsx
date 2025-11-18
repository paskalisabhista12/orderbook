"use client";

import OrderBookContainer from "@/components/container/OrderBookContainer";
import GenerateOrderButton from "@/components/GenerateOrderButton";
import OrderBook from "@/components/OrderBook";
import OrderForm from "@/components/OrderForm";
import RunningTrade from "@/components/RunningTrade";
import { Side } from "@/utils/types";
import { useState } from "react";

export default function Home() {
    const [side, setSide] = useState<Side>("BUY");
    const [price, setPrice] = useState<string>("");
    const [lot, setLot] = useState<string>("");
    return (
        <main className="min-h-screen flex items-center justify-center gap-10 bg-gray-100 p-10">
            <div className="flex flex-col items-center gap-10 w-full">
                <GenerateOrderButton />
                <OrderBookContainer ticker={"BMRI"} />
            </div>
            <div className="flex flex-col gap-10 w-fit"></div>
            <RunningTrade />
        </main>
    );
}
