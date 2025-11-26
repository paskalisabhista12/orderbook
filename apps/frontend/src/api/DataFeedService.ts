import axios from "axios";

export const getTicker = async (search: string = "") => {
    return await axios.get(
        `http://localhost:8000/api/core/get-ticker?search=${search}&size=9999`
    );
};
