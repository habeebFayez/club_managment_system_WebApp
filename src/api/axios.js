import axios from "axios";

export default axios.create({
    baseURL: 'http://192.168.55.55:8080/api'
})