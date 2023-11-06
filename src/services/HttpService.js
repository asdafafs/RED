import axios from "axios";

export default class HttpService {
    basePath = 'api'
    backendUrl = 'https://red.mlsat.ru'

    constructor(controller) {
        this.basePath = `${this.backendUrl}/${this.basePath}/${controller}`
    }

    baseRequest(path, methodType, body) {
        const url = `${this.basePath}/${path}`
        const requestConfig = {
            withCredentials: false,
            baseURL: this.backendUrl
        }

        switch (methodType) {
            case "GET":
                return axios.get(url, requestConfig)
            case "POST":
                return axios.post(url, body, requestConfig)
            case "PUT":
                return axios.put(url, body, requestConfig)
            case "DELETE":
                return axios.delete(url, requestConfig)
        }
    }

    get(path) {
        return this.baseRequest(path, "GET")
    }

    post(path, body) {
        return this.baseRequest(path, "POST", body)
    }

    put(path, body) {
        return this.baseRequest(path, "PUT", body)
    }

    delete(path) {
        return this.baseRequest(path, "DELETE");
    }
}