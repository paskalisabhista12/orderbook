import { useState } from "react";
import OrderBook from "../OrderBook";
import OrderForm from "../OrderForm";
import { Side } from "@/utils/types";

export default function OrderBookContainer({ ticker }: { ticker: string }) {
    const [side, setSide] = useState<Side>("BUY");
    const [price, setPrice] = useState<string>("");
    const [lot, setLot] = useState<string>("");
    return (
        <>
            <OrderBook ticker={ticker} setPrice={setPrice} />
            <OrderForm
                ticker={ticker}
                side={side}
                setSide={setSide}
                price={price}
                setPrice={setPrice}
                lot={lot}
                setLot={setLot}
            />
        </>
    );
}
