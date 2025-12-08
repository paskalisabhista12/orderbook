"use client";

import OrderBookContainer from "@/components/container/OrderBookContainer";
import RunningTrade from "@/components/RunningTrade";
import { useEffect, useState } from "react";

export default function Home() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const mobileViewPopUp = () => {
        if (isMobile)
            return (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="bg-gray-900 text-white px-8 py-6 rounded-2xl shadow-xl text-center">
                        <h2 className="text-xl font-bold mb-2">
                            Not available in mobile view
                        </h2>
                        <p className="text-sm text-gray-400">
                            Please use a desktop device.
                        </p>
                    </div>
                </div>
            );
    };

    return (
        <main
            className="
            min-h-screen flex items-center justify-center gap-10 
            bg-gradient-to-br from-gray-900 via-gray-950 to-black
            p-10
            "
        >
            {mobileViewPopUp()}
            <div className="flex flex-col items-center gap-10 w-full">
                <OrderBookContainer />
            </div>

            <div className="flex flex-col gap-10 w-fit"></div>

            <RunningTrade />
        </main>
    );
}
