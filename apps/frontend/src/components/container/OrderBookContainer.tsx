"use client";

import { useState } from "react";
import OrderBook from "../OrderBook";
import OrderForm from "../OrderForm";
import { Side } from "@/utils/types";
import GenerateOrderButton from "../GenerateOrderButton";
import OrderBookFormButton from "../OrderBookFormButton";
import { DndContext } from "@dnd-kit/core";
import ClientOnly from "../guards/ClientOnly";

export default function OrderBookContainer() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [side, setSide] = useState<Side>("BUY");
    const [price, setPrice] = useState<string>("");
    const [ticker, setTicker] = useState<string>("BBCA");
    const [lot, setLot] = useState<string>("");
    const [isFormVisible, setIsFormVisible] = useState<boolean>(false);

    return (
        <div className="flex gap-6">
            <div className="flex flex-col gap-4">
                <OrderBook
                    ticker={ticker}
                    setTicker={setTicker}
                    setPrice={setPrice}
                />
                <ClientOnly>
                    <DndContext
                        onDragEnd={(event) => {
                            const { delta } = event;
                            setPosition((pos) => ({
                                x: pos.x + delta.x,
                                y: pos.y + delta.y,
                            }));
                        }}
                    >
                        <OrderForm
                            position={position}
                            visible={isFormVisible}
                            ticker={ticker}
                            side={side}
                            setSide={setSide}
                            price={price}
                            setPrice={setPrice}
                            lot={lot}
                            setLot={setLot}
                        />
                    </DndContext>
                </ClientOnly>
            </div>

            <div className="flex flex-col gap-4">
                <GenerateOrderButton ticker={ticker} />
                <OrderBookFormButton
                    visible={isFormVisible}
                    setVisible={setIsFormVisible}
                />
            </div>
        </div>
    );
}
