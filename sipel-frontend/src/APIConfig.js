import axios from "axios";

const APIConfig= axios.create({
    baseURL: "http://localhost:2020/api/v1",
});

export default APIConfig;