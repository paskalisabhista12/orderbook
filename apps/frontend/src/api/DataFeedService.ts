import { UrlConst } from "./constants/UrlConst";
import axios from "axios";

export const getTicker = async (search: string = "") => {
    return await axios.get(
        `${UrlConst.DATAFEED_SERVICE}/api/core/get-ticker?search=${search}&size=9999`
    );
};
