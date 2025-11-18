import axios from "axios";

export const getTicker = async () => {
    return await axios.get("http://localhost:8000/api/core/get-ticker");
}