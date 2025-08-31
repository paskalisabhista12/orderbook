import { Order } from "@/utils/types";
import axios from "axios";

export const submitOrder = async (payload: Order) => {
    return await axios.post("http://localhost:8080/api/orders", payload);
};

export const generateRandomOrder = async () => {
    return await axios.post("http://localhost:8080/api/orders/random-generate");
}