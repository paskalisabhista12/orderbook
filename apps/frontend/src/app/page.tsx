import OrderBook from "@/components/OrderBook";
import OrderForm from "@/components/OrderForm";

export default function Home() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-100">
            <OrderBook />
            <OrderForm />
        </main>
    );
}
