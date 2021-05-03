import axios from "axios";

const APIConfig= axios.create({
    baseURL: "http://localhost:8080/api/",
});

export default APIConfig;