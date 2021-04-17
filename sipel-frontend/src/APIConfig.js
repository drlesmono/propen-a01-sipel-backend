import axios from "axios";

const APIConfig= axios.create({
    baseURL: "http://localhost:3306/api/v1",
});

export default APIConfig;
