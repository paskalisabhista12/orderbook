"use client";
import { useState } from "react";

export default function SearchableSelect({
    loading,
    items,
    value,
    onChange,
}: {
    loading: boolean;
    items: { ticker: string; name: string }[];
    value: string;
    onChange: (val: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const filtered = items.filter((item) =>
        item.ticker.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="relative w-40">
            {/* Selected box */}
            <div
                onClick={() => !loading && setOpen(!open)}
                className={`border rounded p-2 cursor-pointer bg-black text-yellow-400 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
                {loading ? "Loading..." : value || "Select..."}
            </div>

            {/* Dropdown */}
            {open && !loading && (
                <div className="absolute mt-1 w-full bg-black border border-gray-700 rounded shadow-lg z-50">
                    {/* Search box */}
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full p-2 border-b bg-black text-white outline-none"
                    />

                    {/* List */}
                    <div className="max-h-40 overflow-y-auto">
                        {filtered.length === 0 ? (
                            <div className="p-2 text-gray-500">No results</div>
                        ) : (
                            filtered.map((item) => (
                                <div
                                    key={item.ticker}
                                    onClick={() => {
                                        onChange(item.ticker);
                                        setOpen(false);
                                        setSearch(item.ticker);
                                    }}
                                    className={`p-2 cursor-pointer hover:bg-gray-800 ${
                                        value === item.ticker
                                            ? "bg-gray-800"
                                            : ""
                                    }`}
                                >
                                    {item.ticker}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
