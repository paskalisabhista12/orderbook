import { useState } from "react";
import OrderBook from "../OrderBook";
import OrderForm from "../OrderForm";
import { Side } from "@/utils/types";
import GenerateOrderButton from "../GenerateOrderButton";
import OrderBookFormButton from "../OrderBookFormButton";

export default function OrderBookContainer() {
    const [side, setSide] = useState<Side>("BUY");
    const [price, setPrice] = useState<string>("");
    const [ticker, setTicker] = useState<string>("BBCA");
    const [lot, setLot] = useState<string>("");
    const [isFormVisible, setIsFormVisible] = useState<boolean>(true);

    return (
        <div className="flex gap-6">
            {/* LEFT SECTION: OrderBook + OrderForm */}
            <div className="flex flex-col gap-4">
                <OrderBook
                    ticker={ticker}
                    setTicker={setTicker}
                    setPrice={setPrice}
                />

                <OrderForm
                    visible={isFormVisible}
                    ticker={ticker}
                    side={side}
                    setSide={setSide}
                    price={price}
                    setPrice={setPrice}
                    lot={lot}
                    setLot={setLot}
                />
            </div>

            {/* RIGHT SECTION: Action buttons */}
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
