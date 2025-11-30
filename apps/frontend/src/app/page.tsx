"use client";

import OrderBookContainer from "@/components/container/OrderBookContainer";
import RunningTrade from "@/components/RunningTrade";

export default function Home() {
    return (
        <main
            className="
            min-h-screen flex items-center justify-center gap-10 
            bg-gradient-to-br from-gray-900 via-gray-950 to-black
            p-10
            "
        >
            <div className="flex flex-col items-center gap-10 w-full">
                <OrderBookContainer />
            </div>

            <div className="flex flex-col gap-10 w-fit"></div>

            <RunningTrade />
        </main>
    );
}
