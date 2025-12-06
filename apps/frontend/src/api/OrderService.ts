import { Order } from "@/utils/types";
import { UrlConst } from "./constants/UrlConst";
import axios from "axios";

export const submitOrder = async (ticker: string = "", payload: Order) => {
    return await axios.post(
        `${UrlConst.ORDER_SERVICE}/api/orders?ticker=${ticker}`,
        payload
    );
};

export const generateRandomOrder = async (ticker: string = "") => {
    return await axios.post(
        `${UrlConst.ORDER_SERVICE}/api/orders/random-generate?ticker=${ticker}`
    );
};
