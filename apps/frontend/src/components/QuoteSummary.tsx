"use client";

type QuoteSummaryProps = {
    ticker: string;
    prev: number;
    change: number;
    percent: number;
    open: number;
    high: number;
    low: number;
    lastPrice: number;
    lot: string;
    val: string;
    freq: string;
};

export default function QuoteSummary({
    ticker,
    prev,
    change,
    percent,
    open,
    high,
    low,
    lastPrice,
    lot,
    val,
    freq,
}: QuoteSummaryProps) {
    // Color depending on change
    const changeColor =
        change > 0
            ? "text-green-500"
            : change < 0
            ? "text-red-500"
            : "text-gray-400";

    return (
        <div className="bg-black text-white font-mono text-sm rounded-lg shadow p-4 grid grid-cols-2 gap-y-2 gap-x-8 w-full">
            {/* Left Column */}
            <div className="flex justify-between">
                <span className="text-gray-400">Ticker</span>
                <span className="text-yellow-400 font-bold">{ticker}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-400">Prv</span>
                <span className="text-gray-200 font-bold">
                    {prev.toLocaleString()}
                </span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-400">Open</span>
                <span className={`${changeColor} font-bold`}>
                    {open.toLocaleString()}
                </span>
            </div>

            <div className="flex justify-between">
                <span className="text-gray-400">Ch</span>
                <span className={`${changeColor} font-bold`}>
                    {change > 0 ? `+${change}` : change}
                </span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-400">High</span>
                <span className={`${changeColor}`}>
                    {high.toLocaleString()}
                </span>
            </div>

            <div className="flex justify-between">
                <span className="text-gray-400">%</span>
                <span className={`${changeColor} font-bold`}>
                    {percent > 0
                        ? `+${percent.toFixed(2)}`
                        : percent.toFixed(2)}{" "}
                    %
                </span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-400">Low</span>
                <span className={`${changeColor}`}>{low.toLocaleString()}</span>
            </div>

            {/* Right Column */}
            <div className="flex justify-between">
                <span className="text-gray-400">Last</span>
                <span className={`${changeColor} font-extrabold`}>
                    {lastPrice.toLocaleString()}
                </span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-400">Lot</span>
                <span className="font-bold">{lot}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-400">Val</span>
                <span className="font-bold">{val}</span>
            </div>

            <div className="flex justify-between col-span-2">
                <span className="text-gray-400">Freq</span>
                <span className="font-bold">{freq}</span>
            </div>
        </div>
    );
}
