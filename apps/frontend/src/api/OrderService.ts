import { Order } from "@/utils/types";
import axios from "axios";

export const submitOrder = async (ticker: string = "", payload: Order) => {
    return await axios.post(
        `http://localhost:8080/api/orders?ticker=${ticker}`,
        payload
    );
};

export const generateRandomOrder = async (ticker: string = "") => {
    return await axios.post(
        `http://localhost:8080/api/orders/random-generate?ticker=${ticker}`
    );
};
